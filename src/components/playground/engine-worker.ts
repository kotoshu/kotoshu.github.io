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
// transforms were trying to produce. Pinned to the exact 0.1.0.
const WASM_VERSION = '0.1.0'
const WASM_BASE = `https://cdn.jsdelivr.net/npm/@kotoshu/wasm@${WASM_VERSION}`
const GLUE_URL = `${WASM_BASE}/kotoshu_wasm_bg.js`

// jsDelivr /gh serves tags and commit SHAs — branch pins 404. This
// commit is the head of the dictionaries repo's v1 branch, the same
// pin the gem resolves at runtime.
const DICT_PIN = '1829a3e2e67dc7ffb38f8dcd2d3d2294b6a8580d'
const DICT_BASE = `https://cdn.jsdelivr.net/gh/kotoshu/dictionaries@${DICT_PIN}`

/** The wasm-bindgen bundler-target glue surface this playground uses. */
interface GlueModule {
  KotoshuWasm: new (aff: string, dic: string) => {
    correct(word: string): boolean
    suggest(word: string, limit?: number): Suggestion[]
  } & { VERSION?: string }
  __wbg_set_wasm(exports: unknown): void
}

interface Suggestion {
  word: string
  distance: number
  confidence: number
  source: string
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

// wasm-bindgen names the wasm import module after the original relative
// specifier; provide both spellings so a regenerated package still loads.
function importObject(mod: unknown): WebAssembly.Imports {
  return {
    './kotoshu_wasm_bg.js': mod,
    wbg: mod,
  } as unknown as WebAssembly.Imports
}

async function ensureEngine(): Promise<void> {
  if (glue) return

  // The glue is a plain ES module on the CDN — import it at runtime.
  glue = (await import(/* @vite-ignore */ GLUE_URL)) as unknown as GlueModule

  const res = await fetch(`${WASM_BASE}/kotoshu_wasm_bg.wasm`)
  if (!res.ok) throw new Error(`engine download failed: HTTP ${res.status}`)
  const bytes = new Uint8Array(await res.arrayBuffer())
  const { instance } = await WebAssembly.instantiate(bytes, importObject(glue))
  glue.__wbg_set_wasm(instance.exports)
  const start = (instance.exports as Record<string, unknown>).__wbindgen_start
  if (typeof start === 'function') start()
  engineBytes = bytes.byteLength
}

async function loadLanguage(lang: string): Promise<LoadedLang> {
  if (active && activeLang === lang) return active
  await ensureEngine()

  let sources = sourceCache.get(lang)
  if (!sources) {
    const [affRes, dicRes] = await Promise.all([
      fetch(`${DICT_BASE}/${lang}/spelling/index.aff`),
      fetch(`${DICT_BASE}/${lang}/spelling/index.dic`),
    ])
    if (!affRes.ok || !dicRes.ok) {
      throw new Error(`dictionary download failed: aff HTTP ${affRes.status}, dic HTTP ${dicRes.status}`)
    }
    const [aff, dic] = await Promise.all([affRes.text(), dicRes.text()])
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

function suggest(word: string): Suggestion[] {
  if (!active) return []
  const key = `${activeLang}:${word.toLowerCase()}`
  const cached = suggestCache.get(key)
  if (cached) return cached
  const suggestions = active.dictionary.suggest(word, 5)
  if (suggestCache.size > 300) suggestCache.clear()
  suggestCache.set(key, suggestions)
  return suggestions
}

self.onmessage = async (event: MessageEvent) => {
  const data = event.data as { type: 'load' | 'check' | 'suggest'; lang?: string; text?: string; word?: string }

  if (data.type === 'load') {
    try {
      await ensureEngine()
      const loaded = await loadLanguage(data.lang!)
      post('loaded', {
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
    post('suggested', { word: data.word, suggestions: suggest(data.word!) })
  }
}

function post(type: string, payload: Record<string, unknown>) {
  ;(self as unknown as Worker).postMessage({ type, ...payload })
}
