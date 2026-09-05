export type DocsSectionId = 'start' | 'clients' | 'reference' | 'extend' | 'adopt'

export interface DocsSection {
  id: DocsSectionId
  label: string
}

export interface DocsPageMeta {
  /** '' is the docs landing page → /docs; otherwise /docs/{slug} */
  slug: string
  title: string
  nav: string
  description: string
  section: DocsSectionId
  keywords: string
}

export const DOCS_SECTIONS: DocsSection[] = [
  { id: 'start', label: 'Getting started' },
  { id: 'clients', label: 'Clients & channels' },
  { id: 'reference', label: 'Reference' },
  { id: 'extend', label: 'Extend' },
  { id: 'adopt', label: 'Adopt' },
]

/** Flat order = reading order (drives prev/next). */
export const DOCS_PAGES: DocsPageMeta[] = [
  {
    slug: '',
    title: 'Documentation',
    nav: 'Overview',
    section: 'start',
    description:
      'Everything about using Kotoshu well: the two-stage resource model, the CLI, the Ruby API, configuration, caches, plugins, and how to move over from another checker.',
    keywords: 'docs documentation manual guide overview contents index',
  },
  {
    slug: 'cli',
    title: 'The kotoshu CLI',
    nav: 'CLI',
    section: 'start',
    description:
      'The kotoshu command: setup, check (text, files, stdin, interactive), formats (text, JSON, SARIF), cache management, exit codes, and environment variables.',
    keywords: 'cli command line kotoshu check setup interactive sarif json format cache exit code',
  },
  {
    slug: 'windows',
    title: 'Kotoshu on Windows',
    nav: 'Windows',
    section: 'start',
    description:
      'gem install kotoshu on Windows: the tested Ruby versions, path handling, the onnxruntime soft dependency, and the honest status of the native extension.',
    keywords: 'windows win32 powershell gem install onnxruntime native extension rust rb_sys path xdg',
  },
  {
    slug: 'clients/python',
    title: 'Python client',
    nav: 'Python',
    section: 'clients',
    description:
      'pip install kotoshu: the Python client over the HTTP API, plus the kotoshu-native wheel for offline word-level checking with the Rust engine in-process.',
    keywords: 'python pip pypi kotoshu-native maturin wheel native offline client check suggest detect',
  },
  {
    slug: 'clients/javascript',
    title: 'JavaScript client',
    nav: 'JavaScript',
    section: 'clients',
    description:
      'npm install @kotoshu/client: typed HTTP client for Node, Deno, Bun, and browsers, plus the @kotoshu/wasm engine for offline checking in-process.',
    keywords: 'javascript typescript npm node deno bun browser client wasm offline createWasmDictionary',
  },
  {
    slug: 'clients/rust',
    title: 'Rust engine',
    nav: 'Rust',
    section: 'clients',
    description:
      'cargo add kotoshu: the engine itself as a crate — Dictionary load, correct, ranked suggest, the C ABI batch format, and the models registry behind the resources feature.',
    keywords: 'rust cargo crates.io crate engine dictionary correct suggest c abi batch kosh registry',
  },
  {
    slug: 'clients/go',
    title: 'Go client',
    nav: 'Go',
    section: 'clients',
    description:
      'go get github.com/kotoshu/kotoshu-go: the Go client over the HTTP API — check, suggest, detect, correct, all context-aware.',
    keywords: 'golang go get client http check suggest detect context apierror',
  },
  {
    slug: 'clients/http',
    title: 'HTTP API server',
    nav: 'HTTP API',
    section: 'clients',
    description:
      'kotoshu-server: seven JSON endpoints over Rack, Sinatra, and Puma — check, suggest, detect, health, version, languages. The contract every SDK speaks.',
    keywords: 'http api server rest json sinatra puma rack endpoints v1 check suggest detect docker self-host',
  },
  {
    slug: 'clients/lsp',
    title: 'Editor integration via LSP',
    nav: 'Editor (LSP)',
    section: 'clients',
    description:
      'gem install kotoshu-lsp: diagnostics, quick-fixes, and hover suggestions in Neovim, VS Code, Emacs, and any editor that speaks the Language Server Protocol.',
    keywords: 'lsp language server editor neovim vscode emacs eglot lsp-mode diagnostics code action hover',
  },
  {
    slug: 'clients/action',
    title: 'GitHub Action',
    nav: 'GitHub Action',
    section: 'clients',
    description:
      'kotoshu/action-kotoshu@v1: spell-check files in CI, cache dictionaries between runs, and upload SARIF to the Security tab.',
    keywords: 'github action ci sarif security tab workflow yaml prewarm cache fail_on_error',
  },
  {
    slug: 'api',
    title: 'Ruby API',
    nav: 'Ruby API',
    section: 'reference',
    description:
      'The Kotoshu module facade — correct?, suggest, check, check_file, setup, detect_language — plus the Spellchecker, resource bundle, and result objects.',
    keywords: 'ruby api kotoshu module correct suggest check setup spellchecker facade bundler',
  },
  {
    slug: 'configuration',
    title: 'Configuration',
    nav: 'Configuration',
    section: 'reference',
    description:
      'Programmatic settings, KOTOSHU_* environment variables, kotoshu.cfg, priority order (flags > env > programmatic > defaults), and the personal dictionary.',
    keywords: 'configuration config options env environment variables kotoshu.cfg defaults personal dictionary',
  },
  {
    slug: 'caching',
    title: 'Caching & resources',
    nav: 'Caching & resources',
    section: 'reference',
    description:
      'Where dictionaries, frequency lists, and models live (XDG paths), the two-stage setup/resolve lifecycle, TTLs, integrity checks, and cache commands.',
    keywords: 'cache caching resources dictionaries models download xdg ttl setup resolve manifest offline tier tiers fluency mini full model size',
  },
  {
    slug: 'plugins',
    title: 'Plugins & custom dictionaries',
    nav: 'Plugins',
    section: 'extend',
    description:
      'Registering suggestion algorithms, custom dictionary backends, per-language modules, and project dictionaries — extending the engine without forking it.',
    keywords: 'plugin plugins custom dictionary backend register algorithm extend language module hook',
  },
  {
    slug: 'ignores',
    title: 'Ignoring words, baselines & the pre-commit hook',
    nav: 'Ignores & baselines',
    section: 'adopt',
    description:
      'Inline ignore directives per document format, CI baselines that freeze existing spelling debt, and the shipped pre-commit hook — the three tools for real-world prose.',
    keywords: 'ignore suppress disable-line disable-next-line disable-file baseline ci debt pre-commit hook inline directive',
  },
  {
    slug: 'integrations',
    title: 'Framework integrations — Rails, RSpec, Rake & Jekyll',
    nav: 'Integrations',
    section: 'adopt',
    description:
      'The Rails/ActiveModel spelling validator with its options, RSpec matchers that print each misspelling with suggestions, rake kotoshu:check, and the Jekyll generator that fails the build on new errors.',
    keywords: 'integrations rails activemodel validates spelling validator rspec matcher expect_words be_spelled_correctly rake task jekyll generator pre-commit action ci',
  },
  {
    slug: 'migration',
    title: 'Migrating from hunspell & aspell',
    nav: 'Migration',
    section: 'adopt',
    description:
      'Moving existing documents and CI from hunspell, aspell, or cspell: what maps directly, what converts, and the behavior differences to expect.',
    keywords: 'migration migrate from hunspell aspell cspell codespell switch port convert',
  },
  {
    slug: 'comparison',
    title: 'Comparison with other checkers',
    nav: 'Comparison',
    section: 'adopt',
    description:
      'Kotoshu next to hunspell, aspell, cspell, and LanguageTool: architecture, languages, semantic ability, dependencies, and where each one wins.',
    keywords: 'comparison versus hunspell aspell cspell languagetool codespell differences tradeoffs',
  },
]

export function docsPath(slug: string): string {
  return slug === '' ? '/docs' : `/docs/${slug}`
}

export function docsNeighbors(slug: string): { prev?: DocsPageMeta; next?: DocsPageMeta } {
  const idx = DOCS_PAGES.findIndex((p) => p.slug === slug)
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? DOCS_PAGES[idx - 1] : undefined,
    next: idx < DOCS_PAGES.length - 1 ? DOCS_PAGES[idx + 1] : undefined,
  }
}
