/// <reference lib="webworker" />
// The playground engine worker — loads @kotoshu/wasm from a version-
// pinned CDN and keeps every engine call off the main thread.
//
// Why raw jsDelivr npm files rather than esm.sh / esm.run: the package
// is a wasm-bindgen *bundler-target* build whose entry imports the
// .wasm binary directly. esm.run fails to bundle it outright, and
// esm.sh's transform replaces the wasm import with uninstantiated
// bytes — the class exists but every call throws. Loading the two
// published files and instantiating them here is the delivery both
// transforms were trying to produce. Pinned to the exact 0.2.0 -
// 0.1.0 plus the loadModel/rerank pair the semantic layer below uses;
// a strict superset, the dictionary surface is unchanged.
const WASM_VERSION = '0.2.0'
const WASM_BASE = `https://cdn.jsdelivr.net/npm/@kotoshu/wasm@${WASM_VERSION}`
const GLUE_URL = `${WASM_BASE}/kotoshu_wasm_bg.js`

// jsDelivr /gh serves tags and commit SHAs — branch pins 404. This
// commit is the head of the dictionaries repo's v1 branch, the same
// pin the gem resolves at runtime.
const DICT_PIN = '1829a3e2e67dc7ffb38f8dcd2d3d2294b6a8580d'
const DICT_BASE = `https://cdn.jsdelivr.net/gh/kotoshu/dictionaries@${DICT_PIN}`
// The models registry, tag-pinned (TODO.impl/92): raw.githubusercontent
// serves the registry JSON with ACAO:* - it is a plain git file, never
// an LFS pointer - and entry.urls.mirror points at the media host, the
// only source that serves the tier bytes themselves with ACAO:* to
// browsers (release assets and jsDelivr /gh do not). v1.2.1 was the
// first tag with every mini/fluency tier mirrored; v1.3.0 keeps that
// and adds nb.
const MODELS_TAG = 'v1.3.0'
const REGISTRY_URL = `https://raw.githubusercontent.com/kotoshu/models-fasttext-onnx/${MODELS_TAG}/registry.json`

/** An opaque loaded embedding tier - freed by GC or an explicit free(). */
interface KotoshuModelHandle {
  free(): void
}
/** The wasm-bindgen bundler-target glue surface this playground uses. */
interface GlueModule {
  KotoshuWasm: new (aff: string, dic: string) => {
    correct(word: string): boolean
    suggest(word: string, limit?: number): Suggestion[]
  } & { VERSION?: string }
  // The model pair added in @kotoshu/wasm 0.2.0. Optional members, so an
  // engine build without them degrades to dictionary-only instead of
  // throwing at the call site.
  loadModel?: (modelBytes: Uint8Array, vocabBytes: Uint8Array) => KotoshuModelHandle
  rerank?: (model: KotoshuModelHandle, word: string, context: string) => number
  __wbg_set_wasm(exports: unknown): void
}

interface Suggestion {
  word: string
  distance: number
  confidence: number
  source: string
}
/** The registry fields the semantic layer reads (registry.json schema). */
interface RegistryEntry {
  urls?: { mirror?: string }
  size_bytes?: number
}
interface Registry {
  resources?: Record<string, RegistryEntry>
}

interface LoadedLang {
  dictionary: InstanceType<GlueModule['KotoshuWasm']>
  sizeBytes: number
  loadMs: number
}

// Module-scope caches: one dictionary instance alive at a time (the
// indexed dictionary dominates wasm memory; pt is 4.4 MB of source),
// sources cached per language so switching back is reconstruct-only.
const sourceCache = new Map<string, { aff: string; dic: string; sizeBytes: number }>()
const suggestCache = new Map<string, Suggestion[]>()
let active: LoadedLang | null = null
let activeLang: string | null = null
let glue: GlueModule | null = null
let engineBytes = 0

// - semantic layer --------------------------------------------------
// Opt-in per language: the main thread sends semantic-enable, the
// worker resolves the language's mini tier through the pinned registry
// and loads it into wasm memory (~3 MB model + ~0.25 MB vocab). One
// model is alive at a time; a language switch frees it with .free().
//
// The gem's context-boost weight (Kotoshu::Analyzers::SemanticAnalyzer
// #context_boost: `sim * 0.02` per surrounding word; wasm twin:
// kotoshu::rerank::CONTEXT_BOOST_WEIGHT).
const CONTEXT_BOOST_WEIGHT = 0.02
type SemanticState = 'off' | 'loading' | 'ready' | 'unavailable'
let semanticState: SemanticState = 'off'
let model: { handle: KotoshuModelHandle; lang: string; sizeBytes: number } | null = null
let registryPromise: Promise<Registry> | null = null

function postSemantic(lang: string | null, detail?: string) {
  post('semantic-status', { lang, state: semanticState, detail, modelBytes: model?.sizeBytes ?? 0, modelCached })
}

function dropModel() {
  if (!model) return
  // Deterministic release, ahead of GC - the mini tier holds ~3 MB of
  // wasm linear memory for as long as the handle lives.
  model.handle.free()
  model = null
}

async function ensureRegistry(): Promise<Registry> {
  registryPromise ??= cachedFetch(REGISTRY_URL).then(({ res }) => {
    if (!res.ok) throw new Error(`registry download failed: HTTP ${res.status}`)
    return res.json() as Promise<Registry>
  })
  // A failed attempt must not poison the cache - clear for the next opt-in.
  registryPromise.catch(() => {
    registryPromise = null
  })
  return registryPromise
}

async function enableSemantic(lang: string) {
  if (model && model.lang === lang && semanticState === 'ready') {
    postSemantic(lang)
    return
  }
  dropModel()
  semanticState = 'loading'
  postSemantic(lang)
  try {
    await ensureEngine()
    const { loadModel, rerank: rerankFn } = glue!
    if (typeof loadModel !== 'function' || typeof rerankFn !== 'function') {
      throw new Error(`engine ${WASM_VERSION} exposes no model API`)
    }
    const entry = (await ensureRegistry()).resources?.[`kotoshu://models/${lang}/mini`]
    const mirror = entry?.urls?.mirror
    if (!mirror) throw new Error(`no mini tier for ${lang} in registry ${MODELS_TAG}`)
    // The registry's vocab_url points at a release asset, which sends no
    // CORS headers - the mirror sibling is the browser-usable vocab.
    const [modelPair, vocabPair] = await Promise.all([
      cachedFetch(mirror),
      cachedFetch(mirror.replace(/\.onnx$/, '.vocab.json')),
    ])
    modelCached = modelPair.cached && vocabPair.cached
    const modelRes = modelPair.res
    const vocabRes = vocabPair.res
    if (!modelRes.ok) throw new Error(`model download failed: HTTP ${modelRes.status}`)
    if (!vocabRes.ok) throw new Error(`vocab download failed: HTTP ${vocabRes.status}`)
    const [modelBytes, vocabBytes] = await Promise.all([
      modelRes.arrayBuffer().then((buf) => new Uint8Array(buf)),
      vocabRes.arrayBuffer().then((buf) => new Uint8Array(buf)),
    ])
    model = {
      handle: loadModel(modelBytes, vocabBytes),
      lang,
      sizeBytes: modelBytes.byteLength + vocabBytes.byteLength,
    }
    semanticState = 'ready'
    postSemantic(lang)
  } catch (error) {
    dropModel()
    semanticState = 'unavailable'
    postSemantic(lang, (error as Error).message)
  }
}

function disableSemantic() {
  dropModel()
  semanticState = 'off'
  postSemantic(activeLang)
}

// wasm-bindgen names the wasm import module after the original relative
// specifier; provide both spellings so a regenerated package still loads.
function importObject(mod: unknown): WebAssembly.Imports {
  return {
    './kotoshu_wasm_bg.js': mod,
    wbg: mod,
  } as unknown as WebAssembly.Imports
}

// Repeat visits load from Cache Storage, not the network: engine
// binary, dictionaries, registry, and model tiers persist under
// version-pinned URLs (a new pin is a new URL, so entries never go
// stale; old-pin entries are evicted opportunistically on open).
const CACHE_NAME = 'kotoshu-playground-v1'

async function cachedFetch(url: string): Promise<{ res: Response; cached: boolean }> {
  const cache = await caches.open(CACHE_NAME)
  const hit = await cache.match(url)
  if (hit) return { res: hit, cached: true }
  const res = await fetch(url)
  if (!res.ok) return { res, cached: false }
  try {
    await cache.put(url, res.clone())
    // Same-origin policy does not apply to reading keys; evict stale
    // pins of the same artifact family opportunistically.
    const keys = await cache.keys()
    for (const key of keys) {
      if (key.url !== url && sameArtifact(key.url, url)) await cache.delete(key)
    }
  } catch {
    /* cache quota or CORS hiccup - network result still returned */
  }
  return { res, cached: false }
}

function sameArtifact(a: string, b: string): boolean {
  const tail = (u: string) => u.split('/').slice(2).join('/').replace(/@[^/]+/, '')
  return tail(a) === tail(b) && a !== b
}

let engineCached = false
let dictCached = false
let modelCached = false

async function ensureEngine(): Promise<void> {
  if (glue) return

  // The glue is a plain ES module on the CDN — import it at runtime.
  glue = (await import(/* @vite-ignore */ GLUE_URL)) as unknown as GlueModule

  const { res, cached } = await cachedFetch(`${WASM_BASE}/kotoshu_wasm_bg.wasm`)
  if (!res.ok) throw new Error(`engine download failed: HTTP ${res.status}`)
  engineCached = cached
  const bytes = new Uint8Array(await res.arrayBuffer())
  const { instance } = await WebAssembly.instantiate(bytes, importObject(glue))
  glue.__wbg_set_wasm(instance.exports)
  const start = (instance.exports as Record<string, unknown>).__wbindgen_start
  if (typeof start === 'function') start()
  engineBytes = bytes.byteLength
}

// Two layouts exist at the pin: the original six full-feature languages
// keep their dictionaries under {lang}/spelling/, everything else —
// including the thirteen new full-feature languages — sits flat at
// {lang}/index.aff. Try the wired layout first, fall back to flat.
async function fetchDictFile(lang: string, ext: 'aff' | 'dic'): Promise<string> {
  const paths = [`${lang}/spelling/index.${ext}`, `${lang}/index.${ext}`]
  let lastStatus = 0
  for (const path of paths) {
    const { res, cached } = await cachedFetch(`${DICT_BASE}/${path}`)
    if (res.ok) {
      dictCached = cached
      return res.text()
    }
    lastStatus = res.status
  }
  throw new Error(`dictionary download failed: no index.${ext} for ${lang} at the pin (HTTP ${lastStatus})`)
}

async function loadLanguage(lang: string): Promise<LoadedLang> {
  if (active && activeLang === lang) return active
  await ensureEngine()

  let sources = sourceCache.get(lang)
  if (!sources) {
    const [aff, dic] = await Promise.all([fetchDictFile(lang, 'aff'), fetchDictFile(lang, 'dic')])
    sources = { aff, dic, sizeBytes: aff.length + dic.length }
    sourceCache.set(lang, sources)
  }

  const t0 = performance.now()
  const dictionary = new glue!.KotoshuWasm(sources.aff, sources.dic)
  active = { dictionary, sizeBytes: sources.sizeBytes, loadMs: performance.now() - t0 }
  activeLang = lang
  suggestCache.clear()
  return active
}

/** Letter runs with optional internal apostrophes — matches the spans the UI underlines. */
const WORD_RE = /[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu

function check(text: string): string[] {
  if (!active) return []
  const misspelled = new Set<string>()
  const seen = new Set<string>()
  for (const match of text.matchAll(WORD_RE)) {
    const word = match[0]
    const key = word.toLowerCase()
    if (key.length < 2 || seen.has(key)) continue
    seen.add(key)
    // A capitalized word may be a proper noun — only flag it when the
    // lowercase form fails too, mirroring how the gem treats names.
    if (!active.dictionary.correct(word) && !active.dictionary.correct(key)) {
      misspelled.add(word)
    }
  }
  return [...misspelled]
}

function suggest(word: string, context: string): Suggestion[] {
  if (!active) return []
  const key = `${activeLang}:${word.toLowerCase()}`
  let suggestions = suggestCache.get(key)
  if (!suggestions) {
    suggestions = active.dictionary.suggest(word, 5)
    if (suggestCache.size > 300) suggestCache.clear()
    suggestCache.set(key, suggestions)
  }
  return rerankSuggestions(suggestions, context)
}

// The gem cascade default never skips (threshold 1.0 = always rerank),
// so with a model loaded every candidate row is adjusted - mirroring
// Kotoshu::Analyzers::SemanticAnalyzer#rank_by_context, which boosts
// each candidate by `0.02 x sum of cosines` over a +/-3-word window
// and clamps at 1.0 before sorting. rerank() returns the MEAN cosine
// over the in-vocab context tokens, so n x mean reconstructs the gem's
// sum; n is recovered with a self-cosine probe (a token scored against
// itself returns ~1.0 in-vocab, exactly 0.0 out-of-vocab). The probe is
// candidate-independent and runs once per popover. Divergence from the
// gem, line by line: the gem calls model.similarity(word, token) per
// token; here the wasm boundary batches them into one mean - the same
// arithmetic with a single boundary crossing.
function rerankSuggestions(suggestions: Suggestion[], context: string): Suggestion[] {
  const rerank = glue?.rerank
  if (!model || semanticState !== 'ready' || !rerank || suggestions.length === 0) {
    return suggestions
  }
  const handle = model.handle
  const tokens = context.match(WORD_RE)?.map((token) => token.toLowerCase()) ?? []
  if (tokens.length === 0) return suggestions
  const inVocab = tokens.filter((token) => rerank(handle, token, token) > 0.5).length
  if (inVocab === 0) return suggestions
  return suggestions
    .map((row, index) => {
      const score = rerank(handle, row.word, context)
      const boosted = Math.min(row.confidence + CONTEXT_BOOST_WEIGHT * inVocab * score, 1)
      return { row: { ...row, confidence: boosted }, index }
    })
    .sort((a, b) => b.row.confidence - a.row.confidence || a.index - b.index)
    .map((entry) => entry.row)
}

self.onmessage = async (event: MessageEvent) => {
  const data = event.data as {
    type: 'load' | 'check' | 'suggest' | 'semantic'
    lang?: string
    text?: string
    word?: string
    context?: string
    enable?: boolean
  }

  if (data.type === 'load') {
    // One model at a time: switching language frees the previous tier's
    // ~3 MB of wasm memory before the new dictionary even loads. The
    // main thread re-requests the new language's tier on 'loaded'.
    if (model && model.lang !== data.lang) {
      dropModel()
      semanticState = 'off'
      postSemantic(data.lang ?? null)
    }
    try {
      await ensureEngine()
      const loaded = await loadLanguage(data.lang!)
      post('loaded', {
        engineCached,
        dictCached,
        lang: data.lang,
        engineBytes,
        dictionaryBytes: loaded.sizeBytes,
        engineVersion: (glue!.KotoshuWasm as unknown as { VERSION?: string }).VERSION ?? WASM_VERSION,
        loadMs: Math.round(loaded.loadMs),
      })
    } catch (error) {
      post('load-error', { lang: data.lang, message: (error as Error).message })
    }
  } else if (data.type === 'check') {
    post('checked', { words: check(data.text ?? '') })
  } else if (data.type === 'suggest') {
    if (!active) return
    post('suggested', { word: data.word, suggestions: suggest(data.word!, data.context ?? '') })
  } else if (data.type === 'semantic') {
    if (data.enable) await enableSemantic(data.lang ?? activeLang ?? '')
    else disableSemantic()
  }
}

function post(type: string, payload: Record<string, unknown>) {
  ;(self as unknown as Worker).postMessage({ type, ...payload })
}
