export type NewsKind = 'release' | 'event'

export interface NewsLink {
  label: string
  href: string
}

/**
 * One news entry — a dictionary entry in the site's catalog voice:
 * the date is the headword's etymology line, the body is the note,
 * set as numbered senses. No blog-engine machinery; this file is the
 * record.
 *
 * Dates are verified against the registries and repository history,
 * never inferred: RubyGems/PyPI/npm/crates.io publish timestamps and
 * git tag dates are the sources of truth.
 */
export interface NewsEntry {
  slug: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  kind: NewsKind
  title: string
  /** One-line summary shown on the index and in feed descriptions. */
  summary: string
  /** Numbered senses — the entry body on /news/{slug}. */
  senses: string[]
  /** See-also links rendered under the senses. */
  links?: NewsLink[]
}

/** Newest first — the index, feeds, and prev/next all read this order. */
export const NEWS: NewsEntry[] = [
  {
    slug: 'wasm-0-3-2',
    date: '2026-09-07',
    kind: 'release',
    title: 'Index once, sweep the slice — @kotoshu/wasm 0.3.2',
    summary:
      'Per-word sweep invariants move into a per-dictionary index built once at the first sweep: heavy dictionaries gain another 1.2-6x, Portuguese foremost.',
    senses: [
      'The 0.3.1 rewrite still walked the whole word list per sweep, decoding each word before its gate — the length window, the Soundex code, the n-gram length bound — all values that never change with the query. 0.3.2 builds them once per dictionary: char lengths, Soundex codes packed into four bytes, and length buckets that let the edit-distance sweep touch only its two-length window (word-list order restored before the ranking sort, so tie order and outputs are untouched).',
      'Benchmark over the pinned dictionaries, average per sweep: pt 1,398 ms to 423 ms and worst 1,931 to 656; es 522 to 89; nb 346 to 277; de 184 to 148; ru 226 to 205; it 144 to 127; en 52 to 45. The one remaining heavy case is a short French word whose length window covers a dense slice of the French vocabulary — the floor for this algorithm as frozen by the conformance contract.',
      'Conformance unchanged at 2,630 vectors, outputs byte-identical; every transposed-word typo in the benchmark still recovers its intended word in the top five.',
    ],
    links: [
      { label: '@kotoshu/wasm on npm', href: 'https://www.npmjs.com/package/@kotoshu/wasm' },
      { label: 'kotoshu-rs PR #23 — the sweep index', href: 'https://github.com/kotoshu/kotoshu-rs/pull/23' },
      { label: 'Playground', href: 'https://www.kotoshu.org/playground/' },
    ],
  },
  {
    slug: 'gem-0-9-1',
    date: '2026-09-07',
    kind: 'release',
    title: 'The sweep fix reaches Ruby — kotoshu 0.9.1',
    summary:
      'Pure-Ruby suggestions drop from tens of seconds to under a second on full dictionaries, and the Damerau sweep ships for gem users: Teh suggests The at rank one.',
    senses: [
      'The patch release carries both suggestion-quality changes for gem users: the Damerau edit sweep (transpositions cost one step, substitutions and insertions enumerate over the aff TRY string, forms validate through affix-aware lookup — Teh to The at rank one, definately to definitely at rank one) and the sweep-performance port: one word index per generate instead of a full dictionary scan per keyboard variant, a length pre-gate ahead of the n-gram scan, one-pass Jaccard without the intermediate key-union array, and buffer-built Soundex.',
      'Benchmarked on full en_US (48,262 words, MRI 3.4.8, pure-Ruby backend): Teh 20.6 s to 0.59 s, mispellings 140.2 s to 0.75 s, recieve 36.2 s to 0.70 s, definately 55.7 s to 0.87 s, asdfghjkl 39.6 s to 0.86 s. Suggestion outputs are byte-identical — the 2,630 conformance vectors are untouched, and equivalence fuzz against the old algorithms (6,004 find-word inputs, 22,011 soundex inputs, 2,986 similarity pairs) found zero mismatches.',
      'The dictionary data files that had ridden along under docs/verification-evidence are no longer packaged — the gem is 269 library files, no stray hunspell data. Suite 3,777 examples, 0 failures; rubocop clean.',
    ],
    links: [
      { label: 'kotoshu on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'gem PR #146 — the Damerau sweep', href: 'https://github.com/kotoshu/kotoshu/pull/146' },
      { label: 'gem PR #147 — the indexed sweep', href: 'https://github.com/kotoshu/kotoshu/pull/147' },
    ],
  },
  {
    slug: 'wasm-0-3-1',
    date: '2026-09-07',
    kind: 'release',
    title: 'Sweeps under a second — @kotoshu/wasm 0.3.1',
    summary:
      'The suggestion sweep is 10-200x faster on full dictionaries: the same suggestions, byte for byte, in milliseconds instead of seconds.',
    senses: [
      'A full-en_US sweep was taking seconds — Teh 3.6 s, recieve 17.3 s, mispellings 38.4 s measured over the published 0.3.0 module — because four allocation and scan patterns compounded per dictionary word: find_word scanned the whole word list per keyboard variant (with a lowercase allocation per word), the n-gram strategy built a map of String trigrams per dictionary word, Soundex allocated a String per word, and the edit loops allocated a fresh char vector per word.',
      'The sweep now builds one word index per call (exact set plus lowercase-form map, borrowed for words already lowercase), packs trigrams into fixed-width integer keys in a reused scratch map with a length pre-gate, compares fixed Soundex keys, and reuses char buffers. Outputs are byte-identical: the 2630 conformance vectors all pass, and the benchmark set returns the same lists — Teh 320 ms, mispellings 189 ms, definately 145 ms, recieve 93 ms.',
      'The playground also sweeps as one batch now: the misspellings pane sends a single message for all its words, the worker walks the queue with a yield between words so a popover click jumps ahead, and a fresh check replaces the pending batch instead of stacking behind it.',
    ],
    links: [
      { label: '@kotoshu/wasm on npm', href: 'https://www.npmjs.com/package/@kotoshu/wasm' },
      { label: 'kotoshu-rs PR #21 — the indexed sweep', href: 'https://github.com/kotoshu/kotoshu-rs/pull/21' },
      { label: 'Playground', href: 'https://www.kotoshu.org/playground/' },
    ],
  },
  {
    slug: 'wasm-0-3-0',
    date: '2026-09-07',
    kind: 'release',
    title: 'The right word, rank one — @kotoshu/wasm 0.3.0',
    summary:
      'The Damerau edit sweep and model-generated candidates reach the browser: Teh suggests The first, definately suggests definitely, and the playground shows every load and inference step.',
    senses: [
      'The engine-side fix: the suggestion sweep now enumerates adjacent transpositions at cost 1 (a swap is one step, not two), substitutions and insertions over the aff TRY string, and deletions — each validated through affix-aware lookup, so dictionary forms like `definite/IYVP` surface with their surface spelling. Root causes fixed: the sweep only ever enumerated stems, so suffixed words like `definitely` could not appear at any distance; the INITCAP form `The` was lookup-valid but charged case plus transposition as two steps; the phonetic and keyboard strategies carried private edit-distance copies that still charged swaps double. Acceptance on full en_US, byte-identical across both engines: `Teh` → `The` at rank 1, `definately` → `definitely` at rank 1, `recieve` → `receive` and `wrold` → `world` unregressed.',
      '`semanticSuggest(model, word, k)` joins the wasm surface: the int8 tier embeds an out-of-vocabulary word through its character n-grams and returns the nearest vocabulary words — candidate generation the edit-distance sweep cannot produce. The playground merges those neighbors into suggestion lists ahead of its context rerank, labeled with their cosine.',
      'The playground itself grew instrumentation: every artifact download — engine, dictionary, the optional semantic tier — reports a phase-labeled byte bar, checking reports the busy dot and elapsed milliseconds, the misspellings pane sweeps with per-word spinners and a done-of-total count, and the suggestion popover closes with a sweep and rerank timing footer. 2630 conformance vectors regenerated for the new sweep, zero divergence between the Ruby and Rust engines.',
    ],
    links: [
      { label: '@kotoshu/wasm on npm', href: 'https://www.npmjs.com/package/@kotoshu/wasm' },
      { label: 'gem PR #146 — the Damerau sweep', href: 'https://github.com/kotoshu/kotoshu/pull/146' },
      { label: 'kotoshu-rs PR #19 — the Rust port', href: 'https://github.com/kotoshu/kotoshu-rs/pull/19' },
      { label: 'Playground', href: 'https://www.kotoshu.org/playground/' },
    ],
  },
  {
    slug: 'server-lsp-0-1-1',
    date: '2026-09-06',
    kind: 'release',
    title: 'kotoshu-server and kotoshu-lsp 0.1.1 — the gems are real',
    summary:
      'The two ecosystem gems republish with actual contents after their empty 0.1.0 cuts — semantic models over HTTP and a personal dictionary that un-flags words.',
    senses: [
      'kotoshu-server 0.1.1: `gem install kotoshu-server` now works. The 0.1.0 cut was published with an empty file list — a gemspec that collected files through `git ls-files` in a build environment without git. 0.1.1 ships the real server: `/v1/check` with the optional `model` flag (cascade-guarded ONNX reranking, memoized per language), `/v1/languages` reporting model availability, and boot-time opt-in through `KOTOSHU_SERVER_MODEL_LANGS` and `KOTOSHU_SERVER_MODEL_TIER` — semantic quality for every SDK user, no implicit downloads ever.',
      'kotoshu-lsp 0.1.1: the LSP server reads the personal dictionary (`~/.config/kotoshu/personal.dic`), reloads it when the file changes, and answers `kotoshu.addToPersonalDictionary` server-side — adding a word republishes diagnostics in any LSP editor, so the flag clears immediately. The first-diagnostic column bug (−11 on didOpen) is fixed too.',
      'Both published through RubyGems trusted publishing — the OIDC exchange, the version bump, and the push all ran in CI with no stored credentials. The empty 0.1.0s stay listed: rubygems does not allow self-yanking versions older than 30 days; install unpinned and you get 0.1.1.',
    ],
    links: [
      { label: 'kotoshu-server 0.1.1 on RubyGems', href: 'https://rubygems.org/gems/kotoshu-server/versions/0.1.1' },
      { label: 'kotoshu-lsp 0.1.1 on RubyGems', href: 'https://rubygems.org/gems/kotoshu-lsp/versions/0.1.1' },
      { label: 'HTTP API — docs', href: '/docs/clients/http' },
    ],
  },
  {
    slug: 'gem-0-9-0',
    date: '2026-09-06',
    kind: 'release',
    title: 'Ruby gem 0.9.0 — Norwegian arrives, corruption fixed',
    summary:
      'nb and the no alias join the twenty language modules, and the long-reported remove_word corruption bug is fixed on RubyGems.',
    senses: [
      'Norwegian joins the module roster: registry v1.3.0 ships nb converted from fastText’s Bokmål-dominated cc.no while nn keeps cc.nn — and the gem now resolves both `nb` and the ISO macro-language `no` to the same Bokmål module, with å æ ø tokenizing as word characters through the shared Latin tokenizer.',
      'The dictionary-mutation bugs first reported in PR #93 are fixed and released: remove_word deleted the wrong word after a prior removal, the PlainText length index drifted out of sync on add and remove, and the suggest hot path could download implicitly — it is now cache-only with offline mode enforced, and `KOTOSHU_OFFLINE` genuinely works through default configuration.',
      'Also in the cut: `NearestNeighbor` accepts the full cosine range (in-vocabulary words no longer crash semantic analysis on rounding drift or true negatives), and the plan corpus — every TODO.impl record from 01 to 98 — is finally tracked in the repository.',
    ],
    links: [
      { label: 'kotoshu 0.9.0 on RubyGems', href: 'https://rubygems.org/gems/kotoshu/versions/0.9.0' },
      { label: 'CHANGELOG', href: 'https://github.com/kotoshu/kotoshu/blob/main/CHANGELOG.md' },
    ],
  },
  {
    slug: 'gem-0-8-0',
    date: '2026-09-06',
    kind: 'release',
    title: 'Ruby gem 0.8.0 — the integrations cut',
    summary:
      'The wave-1 gem reaches RubyGems — Unicode word detection for Greek and Cyrillic, directory-mode checking, baselines, inline ignores, and framework integrations for Rails, RSpec, Rake, and Jekyll.',
    senses: [
      'Ruby gem 0.8.0 puts the whole wave-1 program on RubyGems in one cut — the thirteen language modules and nineteen keyboard layouts, directory-mode checking, CI baselines, inline ignore directives, a pre-commit hook, and four framework integrations — with no new runtime dependencies anywhere. It also repairs remote `kotoshu setup` for staged languages (sublayout first, flat fallback), lets `kotoshu/tasks` and `kotoshu/jekyll` load standalone, and compares baseline paths canonically.',
      'Unicode word detection is the headline fix: word extraction accepted only ASCII letters, so Greek and Ukrainian users could not check any text through the CLI. Extraction now follows the configured language’s tokenizer — Greek for `el`, Cyrillic for `uk` with the in-word apostrophe kept (Мар’яна), Latin capitals such as Å and Ä for Latin languages — while languages without a script tokenizer keep the historical behavior and the frozen conformance vectors are unchanged. Swedish dictionary loading is fixed alongside: `COMPOUNDRULE )k` uses `)` itself as a flag character, and every flag is now escaped at compile time so the affix reader no longer raises.',
      'Directory mode — `kotoshu check DIR [DIR ...]` — checks every file with a known text extension under `--include` / `--exclude` control, honoring `.gitignore` and `.ignore` through a standard glob subset (last-match wins, anchoring, nested scoping; files inside ignored directories cannot be re-included) and skipping hidden files plus `.git`, `node_modules`, `vendor`, and `target` by default. JSON and SARIF emit one combined document with per-file entries, `--baseline` applies per file, and single-file and stdin behavior is byte-identical to before.',
      'Ignores and baselines arrive as a pair: `kotoshu:disable-line`, `disable-next-line [WORDS]`, and the nestable `disable-file` / `enable-file` block are recognized in each format’s comment syntax, with suppressed words moving to `suppressed_errors` — listed by `--show-suppressed` and marked in result JSON and SARIF. `kotoshu baseline init` records existing debt count-based, so baselines survive reformatting; `check --baseline` lets covered errors pass, fails new ones, and reports stale entries as the debt shrinks.',
      'The integrations are opt-in and dependency-free: an ActiveModel `SpellingValidator` that raises one validation error per misspelling with the top suggestion in the message (real ActiveModel standalone — Rails not required), RSpec matchers whose failures list each misspelling and its suggestions, a Rake task over repository text files, and a safe Jekyll generator that fails the build on new spelling errors while a `.kotoshu-baseline.json` in the site source keeps baselined debt from blocking builds. The pre-commit hook (id `kotoshu`, `language: system`) ships too — honestly documented as requiring Ruby and the gem on PATH.',
      'Norwegian is not in this cut. The registry added nb at v1.3.0 today, but the gem-side `no` → `nb` alias and the Norwegian language module are next-cut work; 0.8.0’s thirteen new modules are the wave-1 thirteen and no more.',
    ],
    links: [
      { label: 'kotoshu 0.8.0 on RubyGems', href: 'https://rubygems.org/gems/kotoshu/versions/0.8.0' },
      { label: 'CHANGELOG', href: 'https://github.com/kotoshu/kotoshu/blob/main/CHANGELOG.md' },
      { label: 'Integrations — docs', href: '/docs/integrations' },
      { label: 'Ignores & baselines — docs', href: '/docs/ignores' },
    ],
  },
  {
    slug: 'wasm-0-2-0',
    date: '2026-09-06',
    kind: 'release',
    title: 'Semantic reranking in the browser — @kotoshu/wasm 0.2.0',
    summary:
      'The wasm engine gains the semantic path — loadModel + rerank over the int8 tiers — and CORS-open mirrors put all 55 languages within reach of a browser tab.',
    senses: [
      '`loadModel(model_bytes, vocab_bytes)` loads an int8-per-row embedding tier — mini ~3 MB, fluency ~15 MB — from ONNX bytes plus its `.vocab.json` sibling, returning a `KotoshuModel` that is the wasm twin of the gem’s ONNX provider, scored in pure Rust. `rerank(model, word, context)` returns the mean-cosine context score in [-1, 1] — 0.0 when the word or every token is out of vocabulary — so suggestion lists can be reordered in the browser the way the server does it. TypeScript declarations ship in the package.',
      'The mirrors make that fetchable: registry mirror URLs send `Access-Control-Allow-Origin: *` while GitHub release assets send no CORS header at all, so a browser tab can resolve a model tier for any of the 55 languages and pull it without a server in between. 0.2.0 was built and signed by the kotoshu-rs release workflow with a provenance attestation and zero dependencies.',
      'The Ruby API got its hosted reference the same morning: the YARD documentation is live at kotoshu.github.io/kotoshu/ — served from the site domain, deployed from the gem repository’s main branch — and already covers the 0.8.0 surfaces: model tiers and the confidence cascade, inline ignores, CI baselines, and the pre-commit hook.',
    ],
    links: [
      { label: '@kotoshu/wasm on npm', href: 'https://www.npmjs.com/package/@kotoshu/wasm' },
      { label: 'kotoshu-rs', href: 'https://github.com/kotoshu/kotoshu-rs' },
      { label: 'YARD API reference', href: 'https://kotoshu.github.io/kotoshu/' },
    ],
  },
  {
    slug: 'models-v1-3-0',
    date: '2026-09-06',
    kind: 'release',
    title: 'Semantic models: 55 languages — nb arrives',
    summary:
      'The registry adds Norwegian Bokmål — nb converted from fastText’s cc.no while nn keeps cc.nn — for 55 languages and 165 tiered models behind the same eval gates.',
    senses: [
      'Registry v1.3.0 ships nb × 3 tiers — mini 2.9 MiB, fluency 14.5 MiB, full 114.4 MiB — bringing the registry to 55 languages, 165 resources, and 7.1 GiB at ONNX opset 11, behind the same measured per-tier evals that gate every other language.',
      'fastText publishes no `cc.nb`: the nb models are converted from `cc.no` and carry Bokmål provenance — `models/nb/metadata.json` records the source URL and sha256 of `cc.no.300.vec` — while `nn` ships separately from `cc.nn`, so both written standards of Norwegian are in the registry under their own codes.',
      'The registry itself carries no `no` entries: the ISO macro-language code resolves to `nb` on the engine side, and that alias — with the Norwegian language module — is next-cut gem work, not part of 0.8.0.',
      'That answers the no→nb/nn question this record left as an owner decision at v1.2.0, and it exhausts the convertible pool: what remains — fi sourcing and the nds resource-spec call — is owner decision, not pending work.',
    ],
    links: [
      { label: 'models-fasttext-onnx v1.3.0', href: 'https://github.com/kotoshu/models-fasttext-onnx/releases/tag/v1.3.0' },
      { label: 'Language matrix', href: '/languages' },
    ],
  },
  {
    slug: 'models-v1-2-0',
    date: '2026-09-05',
    kind: 'release',
    title: 'Semantic models: 54 languages',
    summary:
      'The models registry grows from 22 to 54 languages — 32 shipped, the first right-to-left languages among them — behind unchanged eval gates.',
    senses: [
      'Registry v1.2.0 ships 32 new languages × 3 tiers for a total of 54 languages and 162 registry resources. Arabic, Persian, and Hebrew arrive as the registry’s first right-to-left languages, with new dictionaries verified against upstream license headers where none existed.',
      'The gates did not move — fluency at rank correlation 0.97 / top-1 0.95 and mini at 0.90 / 0.85, never weakened — and the whole batch clears them comfortably (fluency 0.9999–1.0000 correlation, mini near-lossless). The keyboard-aware eval grew ten more curated national grids so the newcomers are judged on their own keyboards.',
      'Not everything that converts ships. nds passed both gates but is ISO 639-2 only and the registry’s language contract is two-letter codes; fi has no license-clear Hunspell source upstream; fo, rw, ie, fur, and tlh have no fastText Common Crawl vectors at all. Every drop is recorded with its reason in the README.',
      'The candidate pool is now exhausted: every convertible language either ships or is dropped for a stated reason, so the coverage backlog is empty. What remains — the no→nb/nn alias, fi sourcing, the nds Resource Spec call — is an owner decision, not pending work.',
    ],
    links: [
      { label: 'models-fasttext-onnx v1.2.0', href: 'https://github.com/kotoshu/models-fasttext-onnx/releases/tag/v1.2.0' },
      { label: 'Language matrix', href: '/languages' },
    ],
  },
  {
    slug: 'full-feature-19',
    date: '2026-09-05',
    kind: 'release',
    title: 'Nineteen full-feature languages',
    summary:
      'Thirteen language modules and a wave of keyboard layouts land in the gem — full feature grows from six languages to nineteen.',
    senses: [
      'Language modules for ca, cs, da, el, hu, it, nl, pl, ro, sv, tr, uk, and vi — thin compositions over the shared Latin tokenizer and normalizer, with real care where the script demands it: Turkish dotless-i case folding, Greek final-sigma and accent normalization, and Greek and Cyrillic script tokenizers that keep non-Latin words whole.',
      'Keyboard layouts grow from five to nineteen: the Turkish-Q, Ukrainian-JCUKEN, and Greek-Phonetic national grids are mirrored from the models-repo eval harness with a drift spec guarding the mirror, and an eleven-member Latin family carries the real Nordic å/æ/ø and å/ä/ö keys over the qwerty and qwertz base grids.',
      'The CLI learns directory mode — `kotoshu check DIR` walks trees, honors `.gitignore` and `.ignore`, and applies baselines per file — with baselines wired into CI so existing errors never block a build while new ones still fail it.',
      'Framework integrations with no new runtime dependencies: a Rails/ActiveModel spelling validator, RSpec matchers that print each misspelling with its suggestions, a Rake task over repository text files, and a Jekyll generator that fails the build on new spelling errors.',
    ],
    links: [
      { label: 'kotoshu — CHANGELOG', href: 'https://github.com/kotoshu/kotoshu/blob/main/CHANGELOG.md' },
      { label: 'Framework integrations — docs', href: '/docs/integrations' },
      { label: 'Directory mode — CLI reference', href: '/docs/cli' },
      { label: 'Language matrix', href: '/languages' },
    ],
  },
  {
    slug: 'models-v1-1-0',
    date: '2026-09-05',
    kind: 'release',
    title: 'Semantic models: 22 languages',
    summary:
      'The models registry grows from 9 to 22 languages — thirteen new FastText reranking tiers shipped behind the same eval gates.',
    senses: [
      'Registry v1.1.0 adds ca, cs, da, el, hu, it, nl, pl, ro, sv, tr, uk, and vi — every batch-one language whose dictionary exists — for a total of 22 languages × 3 tiers, 66 registry resources.',
      'The gates did not move: every fluency tier holds rank correlation 0.9999 with top-1 ≥ 0.958; every mini tier is near-lossless. A language that fails gates ships nothing.',
      'The keyboard-aware eval grew with them — QWERTY/QWERTZ supplements plus curated Turkish-Q, Ukrainian ЙЦУКЕН, and Greek-phonetic noise grids — so newcomer languages are judged on their own keyboards.',
      'The released registry.json is byte-identical to the committed one: local rebuilds reproduce the CI sha256 exactly, so future expansions are verifiable, not trusted.',
    ],
    links: [
      { label: 'models-fasttext-onnx v1.1.0', href: 'https://github.com/kotoshu/models-fasttext-onnx/releases/tag/v1.1.0' },
      { label: 'Language matrix', href: '/languages' },
    ],
  },
  {
    slug: 'keyless-publishing',
    date: '2026-09-05',
    kind: 'event',
    title: 'Keyless publishing on every channel',
    summary:
      'Releases now reach npm, RubyGems, and crates.io through CI-held OIDC trust — no long-lived tokens stored anywhere.',
    senses: [
      'npm publishes `@kotoshu/client` and `@kotoshu/wasm` keyless: the release workflow exchanges GitHub’s OIDC identity for registry trust, and every artifact carries a provenance attestation.',
      'crates.io trusted publishing (RFC 3691) is registered and verified for the `kotoshu` crate — the exchange was proven by a smoke dispatch before the first release. The first publish of a crate still needs a token; keyless covers 0.1.1 onward.',
      'RubyGems is wired the same way — the gem’s release workflow plus the owner-side registration — so `gem push` never runs on a stored credential.',
    ],
    links: [
      { label: 'kotoshu-rs — publishing ledger', href: 'https://github.com/kotoshu/kotoshu-rs/blob/main/TODO.impl/06-publishing.md' },
      { label: 'npm provenance', href: 'https://docs.npmjs.com/generating-provenance-statements' },
      { label: 'crates.io trusted publishing', href: 'https://crates.io/docs/trusted-publishing' },
    ],
  },
  {
    slug: 'gem-0-7-0',
    date: '2026-09-05',
    kind: 'release',
    title: 'Ruby gem 0.7.0 — the universal-kotoshu cut',
    summary:
      'Tiered models with a registry, the native extension, and a conformance-frozen engine: the biggest gem release yet.',
    senses: [
      'Model tiers — `full` (~120 MB), `fluency` (~15 MB, the new default), and `mini` (~3 MB) — resolve through the models repo’s registry with SHA-256-verified primary, mirror, and vocab downloads. `KOTOSHU_MODEL_TIER`, `setup --model --tier`, and a tier-less legacy-cache bridge keep older caches loading.',
      'The optional native extension compiles the Rust core into the gem: `KOTOSHU_BACKEND=ruby|native|auto` selects it, and the Ruby and Rust engines agree on all 2630 frozen conformance vectors.',
      'A confidence cascade skips the ONNX rerank when the composite strategies are already confident — semantic quality where it matters, plain speed where it does not.',
      'Hunspell correctness: CHECKCOMPOUNDPATTERN replacement support, dot-split casing, INITCAP ngram-root skip, and AF alias flag parsing. The integrational suite runs 176 examples with zero failures.',
    ],
    links: [
      { label: 'kotoshu 0.7.0 on RubyGems', href: 'https://rubygems.org/gems/kotoshu/versions/0.7.0' },
      { label: 'CHANGELOG', href: 'https://github.com/kotoshu/kotoshu/blob/main/CHANGELOG.md' },
      { label: 'Model tiers — docs', href: '/docs/caching' },
    ],
  },
  {
    slug: 'npm-and-crates-io-live',
    date: '2026-09-05',
    kind: 'release',
    title: 'npm and crates.io open — the engine arrives as packages',
    summary: '@kotoshu/client and @kotoshu/wasm on npm, the kotoshu crate on crates.io — all 0.1.0.',
    senses: [
      '`@kotoshu/client` 0.1.0 — the typed HTTP client for Node 18+, Deno, Bun, and browsers: check, suggest, detect, correct.',
      '`@kotoshu/wasm` 0.1.0 — the whole engine compiled to WebAssembly, 291 KiB gzipped. Construct a dictionary from `.aff`/`.dic` contents and check words in-process, offline.',
      '`kotoshu` 0.1.0 on crates.io — the Rust core itself: `Dictionary::load`, `correct`, ranked `suggest`, the batch C ABI, and the models registry behind the `resources` feature.',
    ],
    links: [
      { label: '@kotoshu/client on npm', href: 'https://www.npmjs.com/package/@kotoshu/client' },
      { label: '@kotoshu/wasm on npm', href: 'https://www.npmjs.com/package/@kotoshu/wasm' },
      { label: 'kotoshu on crates.io', href: 'https://crates.io/crates/kotoshu' },
    ],
  },
  {
    slug: 'pypi-live',
    date: '2026-09-04',
    kind: 'release',
    title: 'Python ships — kotoshu and kotoshu-native on PyPI',
    summary: 'The HTTP client and the maturin wheel embedding the Rust engine, both at 0.1.0.',
    senses: [
      '`kotoshu` 0.1.0 — the Python client: `Client.check`, `suggest`, `detect`, and `correct` over the HTTP API, with the same result types the other SDKs use.',
      '`kotoshu-native` 0.1.0 — a maturin-built wheel embedding the Rust engine. `KOTOSHU_BACKEND=native|http|auto` picks the backend; word-level checking runs fully offline, no server in sight.',
      'Result handling is identical across backends — the same `Suggestion` rows come back whether the engine runs in-process or over the wire.',
    ],
    links: [
      { label: 'kotoshu on PyPI', href: 'https://pypi.org/project/kotoshu/' },
      { label: 'kotoshu-native on PyPI', href: 'https://pypi.org/project/kotoshu-native/' },
    ],
  },
  {
    slug: 'engine-correctness-wave',
    date: '2026-09-04',
    kind: 'event',
    title: 'Engine correctness wave — compound semantics, conformance green',
    summary:
      'CHECKCOMPOUNDPATTERN replacement semantics ported; 2630 conformance vectors green in Ruby and Rust alike.',
    senses: [
      'The gem’s CHECKCOMPOUNDPATTERN replacement semantics — the subtlest rule in the compound family — ported to the Rust core, with the conformance vector pack regenerated from the gem’s engine.',
      'All 2630 frozen vectors — 1315 `correct` + 1315 `suggest` — pass in the Ruby engine, the Rust engine, and over the C ABI. Both sides of the conformance suite run in CI, so behavior cannot drift.',
    ],
    links: [
      { label: 'kotoshu-rs', href: 'https://github.com/kotoshu/kotoshu-rs' },
    ],
  },
  {
    slug: 'models-registry-v1-0-1',
    date: '2026-09-03',
    kind: 'release',
    title: 'Models registry v1.0.1 — nine languages, three tiers',
    summary: 'FastText-ONNX embedding models for de en es fr ja ko pt ru zh in full, fluency, and mini tiers.',
    senses: [
      'One registry — `kotoshu://models/{lang}/{tier}` — resolves every model with SHA-256 checksums, license, and minimum engine version; clients try primary, then mirror, then vocab.',
      'Per-tier evaluation reports are published for each language. `fluency` is int8 with the top 50k words, near-lossless; `mini` is the wasm and edge tier at ~3 MB.',
      'The `full` tier (~120 MB) also serves from a media-host mirror, so the first setup does not lean on release bandwidth.',
    ],
    links: [
      { label: 'models-fasttext-onnx', href: 'https://github.com/kotoshu/models-fasttext-onnx' },
      { label: 'Model tiers — docs', href: '/docs/caching' },
    ],
  },
  {
    slug: 'site-launch',
    date: '2026-09-01',
    kind: 'event',
    title: 'kotoshu.org goes live',
    summary: 'The ecosystem site — a dictionary-catalog of the project, its languages, and its docs.',
    senses: [
      'One page per audience, one page per language, seven docs pages — and a playground that runs the real engine against any kotoshu-server.',
      'The design treats the site itself as a dictionary: headwords, part-of-speech lines, and numbered senses throughout.',
    ],
    links: [
      { label: 'Language support', href: '/languages' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  {
    slug: 'ring-around-the-gem',
    date: '2026-08-01',
    kind: 'release',
    title: 'The ring around the gem — LSP, server, Go, Action',
    summary: 'kotoshu-lsp 0.1.0, kotoshu-server 0.1.0, kotoshu-go v0.1.0, and action-kotoshu v1, all first releases.',
    senses: [
      '`kotoshu-lsp` — diagnostics, quick-fixes, and hover suggestions in any editor that speaks LSP.',
      '`kotoshu-server` — seven JSON endpoints over Rack, Sinatra, and Puma; the deployment surface for every SDK.',
      '`kotoshu-go` and `action-kotoshu` — a Go client with context-aware methods, and a GitHub Action that lands SARIF in the Security tab.',
    ],
    links: [
      { label: 'kotoshu-lsp', href: 'https://github.com/kotoshu/kotoshu-lsp' },
      { label: 'kotoshu-server', href: 'https://github.com/kotoshu/kotoshu-server' },
      { label: 'kotoshu-go', href: 'https://github.com/kotoshu/kotoshu-go' },
      { label: 'action-kotoshu', href: 'https://github.com/kotoshu/action-kotoshu' },
    ],
  },
]

export function newsNeighbors(slug: string): { prev?: NewsEntry; next?: NewsEntry } {
  const idx = NEWS.findIndex((e) => e.slug === slug)
  if (idx === -1) return {}
  // "Next" is the newer entry (index order is newest first).
  return {
    prev: idx < NEWS.length - 1 ? NEWS[idx + 1] : undefined,
    next: idx > 0 ? NEWS[idx - 1] : undefined,
  }
}
