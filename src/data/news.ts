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
