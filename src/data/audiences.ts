export interface Audience {
  id: string
  kanji: string
  name: string
  headline: string
  who: string
  needs: string[]
  install: string
  projects: { label: string; href: string }[]
  icon: 'code' | 'pen' | 'gear' | 'globe' | 'letters'
}

export const AUDIENCES: Audience[] = [
  {
    id: 'ruby-devs',
    kanji: '技',
    name: 'Ruby developers',
    headline: 'A spell checker that behaves like a Ruby gem',
    who: 'Application and gem teams who want checking inside their own code — model validations, rake tasks, test suites — without shelling out to hunspell or aspell.',
    needs: [
      'Pure-Ruby API: Kotoshu.correct?, .suggest, .check, .check_file',
      'Two-stage resources — explicit Kotoshu.setup, then a cache-only hot path that never surprises you with a download',
      'Personal dictionaries, XDG layout, offline mode, SHA-256 verified downloads',
      'Hunspell-compatible morphology: affix rules, compounding, ~98 dictionaries',
      'Optional semantic reranking via ONNX when you install onnxruntime',
    ],
    install: 'gem install kotoshu',
    projects: [
      { label: 'kotoshu gem', href: 'https://github.com/kotoshu/kotoshu' },
      { label: 'models-fasttext-onnx', href: 'https://github.com/kotoshu/models-fasttext-onnx' },
    ],
    icon: 'code',
  },
  {
    id: 'editors',
    kanji: '文',
    name: 'Writers & editors',
    headline: 'Squiggles and one-keystroke fixes, in your editor',
    who: 'Prose writers, docs authors, and reviewers who live in VS Code, Neovim, Emacs, JetBrains, Helix, or Zed and want misspellings flagged as they type — with ranked quick-fixes.',
    needs: [
      'LSP diagnostics on open and change, debounced as you type',
      'Code actions: change to the top suggestion, or add to your personal dictionary',
      'Hover a flagged word to see ranked candidates with confidence',
      'Respects .kotoshu.yml project ignore lists',
      'One server, every LSP-capable editor',
    ],
    install: 'gem install kotoshu-lsp',
    projects: [
      { label: 'kotoshu-lsp', href: 'https://github.com/kotoshu/kotoshu-lsp' },
      { label: 'Editor wiring guide', href: 'https://github.com/kotoshu/kotoshu-lsp#readme' },
    ],
    icon: 'pen',
  },
  {
    id: 'ci-cd',
    kanji: '検',
    name: 'Maintainers & CI',
    headline: 'Spell checks that fail the build — nicely',
    who: 'Repository maintainers who want typos caught in pull requests with SARIF annotations in the GitHub Security tab, and deterministic, cached CI runs.',
    needs: [
      'One-line GitHub Action with dictionary caching between runs',
      'SARIF 2.1.0 output that renders as GitHub code annotations',
      'Stable exit codes: 0 clean, 1 errors, 2 usage, 3 not set up',
      'Offline-first Docker image with dictionaries pre-baked',
      'Works from markdown to AsciiDoc to plain text',
    ],
    install: 'uses: kotoshu/action-kotoshu@v1',
    projects: [
      { label: 'action-kotoshu', href: 'https://github.com/kotoshu/action-kotoshu' },
      { label: 'docker-kotoshu-ci', href: 'https://github.com/kotoshu/docker-kotoshu-ci' },
    ],
    icon: 'gear',
  },
  {
    id: 'polyglot',
    kanji: '橋',
    name: 'Non-Ruby teams',
    headline: 'One HTTP service, every language ecosystem',
    who: 'Python, JavaScript/TypeScript, and Go teams — or anyone with an OpenAPI client — who want Kotoshu as a self-hosted service. Your text never leaves your network.',
    needs: [
      'Self-hostable HTTP API: /v1/check, /v1/suggest, /v1/detect',
      'Typed SDKs: kotoshu-python, kotoshu-js, kotoshu-go',
      'OpenAPI 3.1 spec — generate clients for Rust, .NET, Java',
      'Docker image with healthcheck; Helm-friendly',
      'Languages pre-warmed on boot; add more without downtime',
    ],
    install: 'gem install kotoshu-server',
    projects: [
      { label: 'kotoshu-server', href: 'https://github.com/kotoshu/kotoshu-server' },
      { label: 'kotoshu-python', href: 'https://github.com/kotoshu/kotoshu-python' },
      { label: 'kotoshu-js', href: 'https://github.com/kotoshu/kotoshu-js' },
      { label: 'kotoshu-go', href: 'https://github.com/kotoshu/kotoshu-go' },
    ],
    icon: 'globe',
  },
  {
    id: 'multilingual',
    kanji: '言葉',
    name: 'Multilingual writers',
    headline: 'Every language you write, resolved on demand',
    who: 'Translators, technical writers, and teams producing documentation across several languages, who need the right dictionary, frequency list, and embedding model to just appear.',
    needs: [
      'Full-featured support: German, English, Spanish, French, Portuguese, Russian',
      'Automatic language detection from document content',
      'Frequency-ranked suggestions (Kelly tiers) in six more languages',
      'Interactive CLI review: navigate, accept, skip',
      '98 dictionaries staged and ready as language modules land',
    ],
    install: 'gem install kotoshu',
    projects: [
      { label: 'Language support matrix', href: '/languages' },
      { label: 'dictionaries repo', href: 'https://github.com/kotoshu/dictionaries' },
      { label: 'frequency-list-kelly', href: 'https://github.com/kotoshu/frequency-list-kelly' },
    ],
    icon: 'letters',
  },
]
