export type NewsKind = 'release' | 'event' | 'docs'

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
    slug: 'gem-1-0-2',
    date: '2026-09-12',
    kind: 'release',
    title: 'kotoshu 1.0.2: the Rust engine installs precompiled',
    summary:
      'gem install kotoshu now resolves a precompiled native platform gem on Linux, macOS, and Windows, so the Rust engine runs with no compiler toolchain, and the backend default became auto: use the native engine when it loads, fall back to pure Ruby when it does not.',
    senses: [
      'Five platform gems ship alongside the pure-Ruby gem — x86_64-linux, aarch64-linux, arm64-darwin, x86_64-darwin, and x64-mingw-ucrt — each carrying the compiled extension inside the gem and built natively on its own runner. The CI matrix proves every one by installing the platform gem into a toolchain-free environment and asserting that the native engine engages. RubyGems picks the platform gem automatically on a matching machine, and every other platform, including musl Linux, resolves the pure-Ruby gem exactly as before.',
      'The backend setting now defaults to auto, which selects the native engine when the extension loads and silently uses pure Ruby when it does not; KOTOSHU_BACKEND=native and KOTOSHU_BACKEND=ruby still force an engine explicitly. No output changes anywhere: both engines remain pinned to the frozen 2,630-vector conformance contract. The Docker CI image follows in the same arc by dropping its build-tool layer in favor of the platform gem.',
    ],
    links: [
      { label: 'gem on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'Install paths', href: '/install' },
    ],
  },
  {
    slug: 'gem-1-0-1',
    date: '2026-09-12',
    kind: 'release',
    title: 'kotoshu 1.0.1: deterministic ranking by construction',
    summary:
      'The gem now embeds the frozen Kelly frequency tiers, so a machine with a cold cache ranks suggestions exactly like the frozen conformance vectors, without any download, CI seeding, or dataset switch at cache expiry.',
    senses: [
      'This release closes the last dataset-divergence path. The frequency provider now falls back from the cache to the frozen embedded tiers before the local YAML file, and the embedded table is generated from the same arrays the Rust engine compiles in, with provenance and the upstream checksum stored inside the file. The empty-cache conformance comparison over all 2,630 vectors passes byte for byte with no cache present at all.',
      'The patch also threads the baseline suggestion-skip through the Jekyll generator, so baselined builds stop paying the sweep for covered words, matching the CLI and Rake paths. kotoshu-server 1.0.1 fixes its runtime floor, because the ~> 0.6 cap it had shipped with silently excluded the 1.x gem.',
    ],
    links: [
      { label: 'gem on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'Determinism writeup', href: '/news/gem-0-11-1' },
    ],
  },
  {
    slug: 'evidence-2026-09',
    date: '2026-09-12',
    kind: 'docs',
    title: 'Synthetic typo corpora, published error budgets, and suggestion reporting',
    summary:
      'Four new 5,000-pair dictionary-grounded typo corpora, a published per-tier error budget, one-click wrong-suggestion reporting in the playground, and a rebuilt Docker CI image.',
    senses: [
      'The synthetic corpora are verifiable by construction: every correction is a dictionary stem, every misspelling is reachable by a declared keyboard-noise operation, and the whole file is a seeded pure function of the dictionary pin. The headline measurement is that even the full tier can embed only about 1.5% of these realistic misspellings, which quantifies the gap between embedding tiers and actual misspellings and motivates the dictionary sweep.',
      'The performance documentation now carries the tier error budget, listing worst-case rank correlation and top-1 agreement across all 55 languages next to the gates that enforce them, so every claim about a cheaper tier carries its measured number.',
      'The playground popover gained a report link: one click opens a pre-filled issue with the word, the offered suggestions, the language, and the engine version, and nothing else. Verified reports feed the corpora.',
      'The Docker CI image could not install kotoshu at all once the native extension shipped; a newly added version guard caught the failure on its first run, and the image now builds the Rust accelerator properly.',
    ],
    links: [
      { label: 'Error budgets', href: '/docs/performance' },
      { label: 'Playground', href: '/playground' },
    ],
  },
  {
    slug: 'kotoshu-1-0',
    date: '2026-09-10',
    kind: 'release',
    title: 'kotoshu 1.0.0: the stability freeze',
    summary:
      'The coordinated 1.0 cut: the Ruby gem, @kotoshu/wasm, and kotoshu-server all reach 1.0.0 with the public surface frozen and the 2,630-vector Ruby==Rust conformance contract gated in CI on both sides.',
    senses: [
      'Version 1.0 freezes the strict two-stage resource model, in which setup is never implicit and the hot path never downloads; the CLI exit codes 0 through 3 and the JSON and SARIF output shapes; the kotoshu.resources/v1 registry schema and the /v1 HTTP prefix; the extension points for custom dictionary types and suggestion algorithms; and the behavioral contract itself, which is the set of 2,630 frozen conformance vectors that the Ruby and Rust engines must both match byte for byte, now enforced by CI jobs in both repositories.',
      'The last blocker before the cut was found by running the audit checklist, not by a user: suggestion ranking silently changed when the frequency cache passed its 7-day TTL, because the reader fell back to a differently-curated local dataset. Fixed, tested with the cache deliberately expired, and the compare job added so the invariant can never drift silently again.',
      'At 1.0 the gem is on RubyGems, @kotoshu/wasm is on npm with loadPack language packs for English, German, and Portuguese, and kotoshu-server ships model-aware checking. The GitHub action runs in six repositories including this one, and kotoshu-lsp, PyPI, crates.io, the Go client, and the zero-install playground complete the channel picture.',
    ],
    links: [
      { label: 'Docs home', href: '/docs' },
      { label: 'gem on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'Performance and correctness', href: '/docs/performance' },
    ],
  },
  {
    slug: 'gem-0-11-1',
    date: '2026-09-10',
    kind: 'release',
    title: 'kotoshu 0.11.1: baselines that work on real repositories',
    summary:
      'The baseline command now accepts directories and globs, ignores the personal dictionary, and skips the suggestion sweep, and check --baseline no longer generates suggestions for the occurrences it suppresses.',
    senses: [
      'Dogfooding action-kotoshu@v2 on the gem repository itself surfaced four defects in baseline init, all fixed: directories and globs expand exactly like check directory mode; a target matching no file is refused with the same File not found instead of silently vanishing; the personal dictionary is never consulted, so baselines freeze what every machine sees; and file reads scrub invalid bytes.',
      'The baseline generator also skips the suggestion sweep whose output it was discarding, which turned 49 CPU-minutes over the gem repository into 84 seconds. The gate side received the same treatment, so check --baseline only generates suggestions for occurrences that will surface. On this repository\'s own CI gate, 1,905 covered occurrences no longer generate suggestions, and the check phase dropped from 13 minutes to 14 seconds with identical output.',
      'The gem repository now runs its own spellcheck workflow — the sixth repo in the rollout and the first Ruby one, closing the loop that found these bugs.',
    ],
    links: [
      { label: 'gem on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'CI baselines docs', href: '/docs/integrations' },
    ],
  },
  {
    slug: 'wasm-0-5-0',
    date: '2026-09-10',
    kind: 'release',
    title: 'loadPack ships in @kotoshu/wasm 0.5.0',
    summary:
      'A single language pack now carries the dictionary, the embedding tier, the vocabulary, and the bucket table, and one loadPack call turns one fetch into the complete set of engine handles.',
    senses: [
      'loadPack(packBytes) parses the KPK1 container, verifies the checksum of every section before constructing anything, and returns dictionary and model handles, with the model already bucket-attached when the pack carries a bucket table. The package published through keyless publishing after the owner cleared a publishing-policy setting on the npm side.',
      'The playground uses it for English, German, and Portuguese, so three or more round trips collapse into one, and per-artifact loading remains the fallback for languages without a pack.',
    ],
    links: [
      { label: '@kotoshu/wasm on npm', href: 'https://www.npmjs.com/package/@kotoshu/wasm' },
      { label: 'Playground', href: '/playground' },
    ],
  },
  {
    slug: 'registry-v1-6-0',
    date: '2026-09-10',
    kind: 'release',
    title: 'Language packs and the typo-biencoder hybrid in registry v1.6.0',
    summary:
      'One fetch now loads a whole language through KPK1 packs for English, German, and Portuguese, and the typo-biencoder hybrid becomes the first alternative model to beat the full tier on every gate.',
    senses: [
      'A language pack concatenates the dictionary files, the mini tier, the vocabulary, and the bucket table into one KPK1 artifact with per-section checksum footers, so three round trips become one. loadPack on the wasm surface and pack mode in @kotoshu/worker both fall back to per-artifact loading when no pack exists.',
      'The model bake-off closed with a winner: the 0.48 MB typo-biencoder hybrid, which retrieves with the tiny bi-encoder and rescores with fastText, beats the full tier on every real-pair component at 3 to 4 ms per lookup. English gains +6.3 points on top-5 with a confidence interval of +4.9 to +7.7 over 2,509 pairs, German gains +28.6, Spanish gains +10, and no component regresses. The hybrid is registered opt-in as kotoshu://models/typo/typo-biencoder, and the candidates rejected on measurement along the way were int4, the MiniLM rerank, ModernBERT, and the standalone bi-encoder.',
      'The registry now carries 383 release assets, and the lid primary URLs work again after pointing at unattached assets since v1.5.0.',
    ],
    links: [
      { label: 'models-fasttext-onnx', href: 'https://github.com/kotoshu/models-fasttext-onnx' },
      { label: 'Performance docs', href: '/docs/performance' },
    ],
  },
  {
    slug: 'worker-0-1-0',
    date: '2026-09-09',
    kind: 'release',
    title: 'The engine worker ships as @kotoshu/worker 0.1.0',
    summary:
      'The playground worker protocol ships on npm as createEngine, covering load, check, suggest-batch, semantic, and detect, with the same pinned resources, the same caching, and no install step.',
    senses: [
      '@kotoshu/worker exposes createEngine(onMessage), which speaks the full protocol the playground runs: dictionary loading with progress, batched priority suggestions, the opt-in semantic tier with buckets, and language detection, plus a ready new Worker() entry and the pure semantic-merge half. It runs in the browser and in Node.',
      'CI now enforces what docs used to claim: latency gates (en 56 ms average vs the 120 ms budget, pt 346 vs 700) and frozen wasm memory ceilings (en 46.9/64 MB resident with tier and buckets).',
    ],
    links: [
      { label: '@kotoshu/worker on npm', href: 'https://www.npmjs.com/package/@kotoshu/worker' },
      { label: 'kotoshu-rs PR #28', href: 'https://github.com/kotoshu/kotoshu-rs/pull/28' },
    ],
  },
  {
    slug: 'registry-v1-5-0',
    date: '2026-09-08',
    kind: 'release',
    title: 'Bucket tables for 47 languages in registry v1.5.0',
    summary: 'Model-generated candidates now reach out-of-vocabulary misspellings in 45 more languages, and eight languages were rejected on measurement with full evidence ladders.',
    senses: ['Forty-five new bucket-table siblings of 10 to 12 MB each let semanticSuggest embed the out-of-vocabulary n-grams the vocabulary lacks, in every language the fidelity gates passed. French rose from 0.696 to 1.000, Spanish from 0.667 to 1.000, and Russian from 0.623 to 1.000 in out-of-vocabulary resolution on real-corpus probes.','Eight languages (ar, cs, fa, he, ja, pl, vi, zh) were rejected on measurement, with the gates never weakened; full ladder evidence is committed for a future decision. Serbian and Swedish ship at K=65536 with a recorded size deviation.','The registry now holds 213 resources at revision 7, and the playground picks up every addition automatically.'],
    links: [{ label: 'models-fasttext-onnx', href: 'https://github.com/kotoshu/models-fasttext-onnx' }],
  },
  {
    slug: 'gem-0-11-0',
    date: '2026-09-07',
    kind: 'release',
    title: 'All staged languages reachable; Korean and Nepali gain full support in kotoshu 0.11.0',
    summary:
      'setup no longer gates on a module, so 95 staged languages work out of the box with script-aware fallbacks, and Korean and Nepali join the full-feature 35.',
    senses: [
      'The basic tier (plan 107) derives AVAILABLE_LANGUAGES from the dictionaries manifest instead of a hardcoded module list, so every staged language installs and checks, with script-aware tokenizers and per-script keyboard fallbacks applied automatically. Modules are now upgrades rather than gates, and nn is wired as the 33rd full-feature language.',
      'Korean and Nepali reach full feature (plan 108) through a Hangul eojeol tokenizer on the Dubeolsik 2-set grid (KS X 5002) and a Devanagari tokenizer that keeps matras and conjuncts whole on the InScript grid, covering the last big-population languages without support. The total is 35 full-feature languages, with live specimen round trips in both scripts.',
      'The cut also carries the 1.0 public-surface cleanup: the global DictCommand leak is fixed, dead command classes and unused aliases are removed (1,095 lines), and the experimental checkers are documented. The suite runs 3,985 examples with conformance untouched.',
    ],
    links: [
      { label: 'kotoshu on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'gem PR #160 — basic tier', href: 'https://github.com/kotoshu/kotoshu/pull/160' },
      { label: 'gem PR #161 — ko and ne', href: 'https://github.com/kotoshu/kotoshu/pull/161' },
    ],
  },
  {
    slug: 'server-0-1-2',
    date: '2026-09-07',
    kind: 'release',
    title: '/v1/detect covers 169 languages in kotoshu-server 0.1.2',
    summary:
      'Detection prefers the lid-176 model through the gem 0.10.0 native path, and the engine field reports which detector served the answer.',
    senses: [
      'POST /v1/detect returns { language, confidence, engine }: lid-176 (176 languages, lazy model setup on first request) when kotoshu >= 0.10.0 and the native extension can load the model; heuristic (the 7-language fallback) otherwise - old gems, KOTOSHU_BACKEND=ruby, offline setup failures, or KOTOSHU_DETECT=heuristic. Setup failures log once and degrade; never a 5xx.',
      'The release also fixes a pre-existing failing build on main, where App::VERSION had drifted from the release-workflow bumps, and documents the engine field in the README and the OpenAPI schema.',
    ],
    links: [
      { label: 'kotoshu-server on RubyGems', href: 'https://rubygems.org/gems/kotoshu-server' },
      { label: 'server PR #6', href: 'https://github.com/kotoshu/kotoshu-server/pull/6' },
    ],
  },
  {
    slug: 'gem-0-10-0',
    date: '2026-09-07',
    kind: 'release',
    title: 'Personal dictionaries in the check path and native detection in kotoshu 0.10.0',
    summary:
      'kotoshu check finally consults the personal dictionary, and Kotoshu.detect_language identifies 176 languages through the pure-Rust lid reader.',
    senses: [
      'The personal dictionary reaches the check path (plan 105): a word added with kotoshu personal add stops being an error on the next check - case-insensitive, no metadata, one load per process, mirroring the editor integration. Opt out with --no-personal or KOTOSHU_PERSONAL_DICTIONARY=false. Until now the README story was false on the CLI path.',
      'Kotoshu.detect_language -> { code, score } (plan 106): the lid-176 model through the native extension, ~42 microseconds warm, 55/55 parity with the reference on the frozen corpus (en 0.87, de 0.99, ja 0.998, ar 0.97 live). Pure-Ruby installs keep the 7-language heuristic; kotoshu-server /v1/detect upgrades to the 176-language path in 0.1.2.',
    ],
    links: [
      { label: 'kotoshu on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'gem PR #155', href: 'https://github.com/kotoshu/kotoshu/pull/155' },
      { label: 'gem PR #156', href: 'https://github.com/kotoshu/kotoshu/pull/156' },
    ],
  },
  {
    slug: 'gem-0-9-3',
    date: '2026-09-07',
    kind: 'release',
    title: 'Twelve more languages ship in the gem with kotoshu 0.9.3',
    summary:
      'Full-feature batch 3 reaches RubyGems with 32 languages carrying modules and keyboards, plus the right-to-left tokenizer fix, on the 0.9.2 indexed-sweep base.',
    senses: [
      'Cut from main after PR #151: ar, id, fa, he, bg, sr, hr, sk, sl, lt, lv, et as full-feature modules (national keyboard grids, AVAILABLE_LANGUAGES 20 to 32, 49 engine-verified specimens). The script-aware word regex fix means kotoshu check -l ar|fa|he extracts real words from RTL documents.',
      'The release sits on the 0.9.2 sweep index, so the new languages get the indexed sweep from the first install, and gem install kotoshu now resolves 0.9.3 for lsp and server users too.',
    ],
    links: [
      { label: 'kotoshu on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'Language matrix', href: '/languages' },
    ],
  },
  {
    slug: 'wasm-0-4-0',
    date: '2026-09-07',
    kind: 'release',
    title: 'Language detection and OOV bucket tables in @kotoshu/wasm 0.4.0',
    summary:
      'loadLid and detectLanguage bring 176-language identification, and bucket-backed out-of-vocabulary embedding lets Teh reach The through the model path.',
    senses: [
      'The lid-176 model (~1 MB + vocab) ships through the registry v1.4.0 mirror. The playground detect control loads it once, scores the editor text, and proposes a language switch — never auto-switches an explicit choice.',
      'Bucket-table siblings for English and German close the model-side Teh gap: n-grams absent from the vocabulary fall back to hashed bucket rows, while in-vocabulary behavior stays byte-identical.',
    ],
    links: [
      { label: '@kotoshu/wasm on npm', href: 'https://www.npmjs.com/package/@kotoshu/wasm' },
      { label: 'Playground', href: '/playground' },
    ],
  },
  {
    slug: 'full-feature-32',
    date: '2026-09-07',
    kind: 'release',
    title: 'Twelve more full-feature languages bring the total to 32',
    summary:
      'Arabic, Indonesian, Persian, Hebrew, and eight European languages join the full-feature set: gem modules, national keyboards, and engine-verified specimens.',
    senses: [
      'Plan 100 batch 3 promotes ar, id, fa, he, bg, sr, hr, sk, sl, lt, lv, and et from the degraded path to full feature. Enumeration was data-driven: every language present in both the dictionaries manifest and the models registry that lacked a module, ranked by speakers. ko and ne rank higher by speakers but need Hangul jamo and Devanagari tokenizers outside this batch.',
      'Six national keyboard grids (Arabic 101, Persian ISIRI 9147, Hebrew SI-1452, Bulgarian BDS, Serbian Cyrillic, Croatian/Slovenian QWERTZ) plus five parameterized Latin family members. AVAILABLE_LANGUAGES grows 20 to 32. A real bug fixed on the way: the script-aware word regex never reached the ar/fa/he tokenizers, so Kotoshu.check extracted zero words from RTL documents — those tokenizers now declare their script sets (fa includes ZWNJ).',
      'Forty-nine specimen pairs engine-verified across the twelve languages, plus RTL sentence round trips. Suite 3,887 examples, 0 failures.',
    ],
    links: [
      { label: 'Language matrix', href: '/languages' },
      { label: 'gem PR #151', href: 'https://github.com/kotoshu/kotoshu/pull/151' },
    ],
  },
  {
    slug: 'action-v2',
    date: '2026-09-07',
    kind: 'release',
    title: 'GitHub Action v2 adds gem directory mode and baselines',
    summary:
      'The files input now walks the whole repository tree, and baselines, include/exclude, and SARIF suppression notes ship in the wrapper that CI actually runs.',
    senses: [
      'Version 1 expanded globs in bash and had no baseline input, even after the gem shipped directory mode and baselines in 0.8.0. Version 2 passes paths straight to kotoshu check, adds baseline, include, exclude, show_suppressed, and category inputs, and merges per-file SARIF runs so upload-sarif accepts the report.',
      'A self-test workflow runs the action against a fixture repository with two misspellings and a committed baseline: baselined entries pass as notes, new errors fail, and gitignored files stay out. The action requires gem 0.8.0 or newer, and the v2 tag was cut by the owner.',
    ],
    links: [
      { label: 'Action docs', href: '/docs/clients/action' },
      { label: 'action-kotoshu PR #2', href: 'https://github.com/kotoshu/action-kotoshu/pull/2' },
    ],
  },
  {
    slug: 'gem-0-9-2',
    date: '2026-09-07',
    kind: 'release',
    title: 'The sweep index reaches Ruby in kotoshu 0.9.2',
    summary:
      'Per-word sweep invariants now live in a lazily memoized per-dictionary index, which gives 2.2x on the English average and up to 6x on short words, with byte-identical outputs.',
    senses: [
      'This release is the twin of the wasm 0.3.2 release: Kotoshu::Suggestions::SweepIndex memoizes character lengths, Soundex codes, and length buckets on the dictionary, built at the first sweep. The edit-distance strategy draws its length window from the buckets with word-list order restored so ranking tie order is untouched, the phonetic strategy compares memoized codes, and the n-gram gate reads indexed lengths; the strategies also stop copying the whole word list per sweep.',
      'Warm benchmarks on full cached dictionaries under MRI 3.4.8 show the English average dropping from 1,472 to 661 ms per suggest (2.2x), the Spanish average from 2,591 to 1,396 ms (1.9x), and short words gaining up to 6.2x, with Teh at 185 ms, wrold at 656 ms, and gatoss at 1,249 ms. Mutation safety is explicit: every add_word, remove_word, clear, and merge path resets the memo, pinned by specs on real Hunspell and PlainText dictionaries.',
      'Outputs byte-identical across 14 en+es combinations; the 2,630 conformance vectors untouched and replay green; suite 3,795 examples, 0 failures; rubocop clean over 447 files. Soundex now lives once in Algorithms::Soundex, shared by strategy and index.',
    ],
    links: [
      { label: 'kotoshu on RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'gem PR #148 — the sweep index', href: 'https://github.com/kotoshu/kotoshu/pull/148' },
    ],
  },
  {
    slug: 'wasm-0-3-2',
    date: '2026-09-07',
    kind: 'release',
    title: 'The per-dictionary sweep index ships in @kotoshu/wasm 0.3.2',
    summary:
      'Per-word sweep invariants now live in a per-dictionary index built once at the first sweep, so heavy dictionaries gain another 1.2 to 6x, Portuguese foremost.',
    senses: [
      'The 0.3.1 rewrite still walked the whole word list per sweep, decoding each word before its gate — the length window, the Soundex code, the n-gram length bound — all values that never change with the query. 0.3.2 builds them once per dictionary: char lengths, Soundex codes packed into four bytes, and length buckets that let the edit-distance sweep touch only its two-length window (word-list order restored before the ranking sort, so tie order and outputs are untouched).',
      'Benchmarks over the pinned dictionaries show the average per sweep dropping for Portuguese from 1,398 to 423 ms with the worst case from 1,931 to 656 ms, for Spanish from 522 to 89 ms, for Norwegian from 346 to 277 ms, for German from 184 to 148 ms, for Russian from 226 to 205 ms, for Italian from 144 to 127 ms, and for English from 52 to 45 ms. The one remaining heavy case is a short French word whose length window covers a dense slice of the French vocabulary, which is the floor for this algorithm as frozen by the conformance contract.',
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
    title: 'The sweep fix reaches Ruby in kotoshu 0.9.1',
    summary:
      'Pure-Ruby suggestions drop from tens of seconds to under a second on full dictionaries, and the Damerau sweep ships for gem users, so Teh suggests The in first place.',
    senses: [
      'The patch release carries both suggestion-quality changes for gem users. The Damerau edit sweep charges transpositions one step, enumerates substitutions and insertions over the aff TRY string, and validates forms through affix-aware lookup, which puts Teh to The and definately to definitely in first place. The sweep-performance port builds one word index per generate instead of scanning the dictionary per keyboard variant, adds a length pre-gate ahead of the n-gram scan, computes Jaccard in one pass without the intermediate key-union array, and builds Soundex in reused buffers.',
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
    title: 'Suggestion sweeps complete in under a second with @kotoshu/wasm 0.3.1',
    summary:
      'The suggestion sweep is 10 to 200x faster on full dictionaries, returning the same suggestions byte for byte in milliseconds instead of seconds.',
    senses: [
      'A full-en_US sweep had been taking seconds, with Teh at 3.6 s, recieve at 17.3 s, and mispellings at 38.4 s measured over the published 0.3.0 module, because four allocation and scan patterns compounded per dictionary word: find_word scanned the whole word list per keyboard variant with a lowercase allocation per word, the n-gram strategy built a map of String trigrams per dictionary word, Soundex allocated a String per word, and the edit loops allocated a fresh char vector per word.',
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
    title: 'The Damerau sweep ranks the right word first in @kotoshu/wasm 0.3.0',
    summary:
      'The Damerau edit sweep and model-generated candidates reach the browser: Teh now suggests The first, definately suggests definitely, and the playground shows every load and inference step.',
    senses: [
      'The engine-side fix changes the suggestion sweep to enumerate adjacent transpositions at cost 1, substitutions and insertions over the aff TRY string, and deletions, each validated through affix-aware lookup so that dictionary forms like `definite/IYVP` surface with their surface spelling. The root causes fixed were that the sweep had only ever enumerated stems, so suffixed words like `definitely` could not appear at any distance; that the INITCAP form `The` was lookup-valid but charged case plus transposition as two steps; and that the phonetic and keyboard strategies carried private edit-distance copies that still charged swaps double. Acceptance on full en_US, byte-identical across both engines: `Teh` to `The` at rank 1, `definately` to `definitely` at rank 1, with `recieve` to `receive` and `wrold` to `world` unregressed.',
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
    title: 'kotoshu-server and kotoshu-lsp 0.1.1 republish with their real contents',
    summary:
      'The two ecosystem gems republish with their actual contents after the empty 0.1.0 cuts: kotoshu-server brings semantic models over HTTP, and kotoshu-lsp brings a personal dictionary that un-flags words.',
    senses: [
      'kotoshu-server 0.1.1 makes `gem install kotoshu-server` work. The 0.1.0 cut had been published with an empty file list because its gemspec collected files through `git ls-files` in a build environment without git. Version 0.1.1 ships the real server: `/v1/check` with the optional `model` flag providing cascade-guarded ONNX reranking memoized per language, `/v1/languages` reporting model availability, and boot-time opt-in through `KOTOSHU_SERVER_MODEL_LANGS` and `KOTOSHU_SERVER_MODEL_TIER`, bringing semantic quality to every SDK user with no implicit downloads.',
      'kotoshu-lsp 0.1.1 reads the personal dictionary at `~/.config/kotoshu/personal.dic`, reloads it when the file changes, and answers `kotoshu.addToPersonalDictionary` server-side, so adding a word republishes diagnostics in any LSP editor and the flag clears immediately. The first-diagnostic column bug (a −11 offset on didOpen) is fixed as well.',
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
    title: 'kotoshu 0.9.0 adds Norwegian and fixes dictionary corruption',
    summary:
      'Norwegian Bokmål and the no alias join the twenty language modules, and the long-reported remove_word corruption bug is fixed on RubyGems.',
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
    title: 'kotoshu 0.8.0 ships the integrations wave',
    summary:
      'The wave-1 program reaches RubyGems in one cut, bringing Unicode word detection for Greek and Cyrillic, directory-mode checking, baselines, inline ignores, and framework integrations for Rails, RSpec, Rake, and Jekyll.',
    senses: [
      'kotoshu 0.8.0 puts the whole wave-1 program on RubyGems in one cut: the thirteen language modules and nineteen keyboard layouts, directory-mode checking, CI baselines, inline ignore directives, a pre-commit hook, and four framework integrations, with no new runtime dependencies anywhere. The release also repairs remote `kotoshu setup` for staged languages through a sublayout-first, flat-fallback strategy, lets `kotoshu/tasks` and `kotoshu/jekyll` load standalone, and compares baseline paths canonically.',
      'Unicode word detection is the headline fix: word extraction had accepted only ASCII letters, so Greek and Ukrainian users could not check any text through the CLI. Extraction now follows the configured language’s tokenizer, using Greek for `el` and Cyrillic for `uk` with the in-word apostrophe kept (Мар’яна), and Latin capitals such as Å and Ä for Latin languages, while languages without a script tokenizer keep the historical behavior and the frozen conformance vectors are unchanged. Swedish dictionary loading is fixed alongside: `COMPOUNDRULE )k` uses `)` itself as a flag character, and every flag is now escaped at compile time so the affix reader no longer raises.',
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
    title: 'Semantic reranking in the browser with @kotoshu/wasm 0.2.0',
    summary:
      'The wasm engine gains the semantic path with loadModel and rerank over the int8 tiers, and CORS-open mirrors put all 55 languages within reach of a browser tab.',
    senses: [
      '`loadModel(model_bytes, vocab_bytes)` loads an int8-per-row embedding tier — mini ~3 MB, fluency ~15 MB — from ONNX bytes plus its `.vocab.json` sibling, returning a `KotoshuModel` that is the wasm twin of the gem’s ONNX provider, scored in pure Rust. `rerank(model, word, context)` returns the mean-cosine context score in [-1, 1] — 0.0 when the word or every token is out of vocabulary — so suggestion lists can be reordered in the browser the way the server does it. TypeScript declarations ship in the package.',
      'The mirrors make that fetchable: registry mirror URLs send `Access-Control-Allow-Origin: *` while GitHub release assets send no CORS header at all, so a browser tab can resolve a model tier for any of the 55 languages and pull it without a server in between. Version 0.2.0 was built and signed by the kotoshu-rs release workflow with a provenance attestation and zero dependencies.',
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
    title: 'Semantic models cover 55 languages; Norwegian Bokmål arrives',
    summary:
      'The registry adds Norwegian Bokmål, with nb converted from fastText’s cc.no while nn keeps cc.nn, for a total of 55 languages and 165 tiered models behind the same eval gates.',
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
    title: 'Semantic models cover 54 languages',
    summary:
      'The models registry grows from 22 to 54 languages, with 32 new languages shipped including the first right-to-left languages, behind unchanged eval gates.',
    senses: [
      'Registry v1.2.0 ships 32 new languages × 3 tiers for a total of 54 languages and 162 registry resources. Arabic, Persian, and Hebrew arrive as the registry’s first right-to-left languages, with new dictionaries verified against upstream license headers where none existed.',
      'The gates did not move, with fluency held at rank correlation 0.97 and top-1 0.95 and mini at 0.90 and 0.85, never weakened, and the whole batch clears them comfortably, with fluency at 0.9999 to 1.0000 correlation and mini near-lossless. The keyboard-aware evaluation grew ten more curated national grids so the newcomer languages are judged on their own keyboards.',
      'Not everything that converts ships. The nds language passed both gates but is ISO 639-2 only, while the registry’s language contract is two-letter codes; fi has no license-clear Hunspell source upstream; and fo, rw, ie, fur, and tlh have no fastText Common Crawl vectors at all. Every drop is recorded with its reason in the README.',
      'The candidate pool is now exhausted: every convertible language either ships or is dropped for a stated reason, so the coverage backlog is empty. What remains, namely the no→nb/nn alias, fi sourcing, and the nds Resource Spec call, is an owner decision rather than pending work.',
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
    title: 'Nineteen languages reach full-feature support',
    summary:
      'Thirteen language modules and a wave of keyboard layouts land in the gem, and full-feature support grows from six languages to nineteen.',
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
    title: 'Semantic models cover 22 languages',
    summary:
      'The models registry grows from 9 to 22 languages, with thirteen new FastText reranking tiers shipped behind the same eval gates.',
    senses: [
      'Registry v1.1.0 adds ca, cs, da, el, hu, it, nl, pl, ro, sv, tr, uk, and vi — every batch-one language whose dictionary exists — for a total of 22 languages × 3 tiers, 66 registry resources.',
      'The gates did not move: every fluency tier holds rank correlation 0.9999 with top-1 of at least 0.958, every mini tier is near-lossless, and a language that fails its gates ships nothing.',
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
    title: 'kotoshu 0.7.0 ships model tiers and the native extension',
    summary:
      'The biggest gem release so far brings tiered models with a registry, the native extension, and a conformance-frozen engine.',
    senses: [
      'The model tiers are `full` at about 120 MB, `fluency` at about 15 MB as the new default, and `mini` at about 3 MB, and they resolve through the models repository’s registry with SHA-256-verified primary, mirror, and vocab downloads. `KOTOSHU_MODEL_TIER`, `setup --model --tier`, and a tier-less legacy-cache bridge keep older caches loading.',
      'The optional native extension compiles the Rust core into the gem, `KOTOSHU_BACKEND=ruby|native|auto` selects it, and the Ruby and Rust engines agree on all 2,630 frozen conformance vectors.',
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
    title: 'The engine ships on npm and crates.io',
    summary: '@kotoshu/client and @kotoshu/wasm are on npm and the kotoshu crate is on crates.io, all at 0.1.0.',
    senses: [
      '`@kotoshu/client` 0.1.0 is the typed HTTP client for Node 18+, Deno, Bun, and browsers, covering check, suggest, detect, and correct.',
      '`@kotoshu/wasm` 0.1.0 is the whole engine compiled to WebAssembly at 291 KiB gzipped; a consumer constructs a dictionary from `.aff`/`.dic` contents and checks words in-process and offline.',
      '`kotoshu` 0.1.0 on crates.io is the Rust core itself, exposing `Dictionary::load`, `correct`, ranked `suggest`, the batch C ABI, and the models registry behind the `resources` feature.',
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
    title: 'Python packages ship on PyPI',
    summary: 'The Python HTTP client and the maturin wheel that embeds the Rust engine both ship at 0.1.0.',
    senses: [
      '`kotoshu` 0.1.0 is the Python client, exposing `Client.check`, `suggest`, `detect`, and `correct` over the HTTP API with the same result types the other SDKs use.',
      '`kotoshu-native` 0.1.0 is a maturin-built wheel embedding the Rust engine. `KOTOSHU_BACKEND=native|http|auto` picks the backend, and word-level checking runs fully offline with no server involved.',
      'Result handling is identical across backends: the same `Suggestion` rows come back whether the engine runs in-process or over the wire.',
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
    title: 'Engine correctness wave: compound semantics and green conformance',
    summary:
      'CHECKCOMPOUNDPATTERN replacement semantics are ported, and all 2,630 conformance vectors pass in both the Ruby and the Rust engine.',
    senses: [
      'The gem’s CHECKCOMPOUNDPATTERN replacement semantics, the subtlest rule in the compound family, are ported to the Rust core, with the conformance vector pack regenerated from the gem’s engine.',
      'All 2,630 frozen vectors, comprising 1,315 `correct` and 1,315 `suggest` cases, pass in the Ruby engine, the Rust engine, and over the C ABI. Both sides of the conformance suite run in CI, so behavior cannot drift.',
    ],
    links: [
      { label: 'kotoshu-rs', href: 'https://github.com/kotoshu/kotoshu-rs' },
    ],
  },
  {
    slug: 'models-registry-v1-0-1',
    date: '2026-09-03',
    kind: 'release',
    title: 'Models registry v1.0.1 serves nine languages in three tiers',
    summary: 'FastText-ONNX embedding models for nine languages ship in full, fluency, and mini tiers.',
    senses: [
      'One registry, addressed as `kotoshu://models/{lang}/{tier}`, resolves every model with SHA-256 checksums, license, and minimum engine version; clients try the primary URL, then the mirror, then the vocab.',
      'Per-tier evaluation reports are published for each language. `fluency` is int8 with the top 50,000 words and near-lossless, while `mini` is the wasm and edge tier at about 3 MB.',
      'The `full` tier at about 120 MB also serves from a media-host mirror, so the first setup does not lean on release bandwidth.',
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
    summary: 'The ecosystem site opens as a catalog of the project, its languages, and its documentation.',
    senses: [
      'The site carries one page per audience, one page per language, seven documentation pages, and a playground that runs the real engine against any kotoshu-server.',
      'The design treats the site itself as a dictionary, with headwords, part-of-speech lines, and numbered senses throughout.',
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
    title: 'The ecosystem around the gem: LSP, server, Go client, and Action',
    summary: 'kotoshu-lsp, kotoshu-server, kotoshu-go, and action-kotoshu all reach their first releases.',
    senses: [
      '`kotoshu-lsp` provides diagnostics, quick-fixes, and hover suggestions in any editor that speaks LSP.',
      '`kotoshu-server` provides seven JSON endpoints over Rack, Sinatra, and Puma, forming the deployment surface for every SDK.',
      '`kotoshu-go` and `action-kotoshu` provide a Go client with context-aware methods and a GitHub Action that lands SARIF in the Security tab.',
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
