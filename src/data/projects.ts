export type ProjectStatus = 'live' | 'beta' | 'pending'

export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  repo: string
  install?: string
  lang?: string
  status: ProjectStatus
  audiences: string[]
  featured?: boolean
}

export const PROJECTS: Project[] = [
  {
    id: 'kotoshu',
    name: 'kotoshu',
    tagline: 'The core spell checker',
    description:
      'Pure-Ruby, Hunspell-compatible spell checking with affix morphology, frequency-ranked suggestions, and an optional FastText/ONNX semantic layer. Two-stage resources: explicit setup, cache-only hot path.',
    repo: 'https://github.com/kotoshu/kotoshu',
    install: 'gem install kotoshu',
    lang: 'Ruby · 3.1+',
    status: 'live',
    audiences: ['ruby-devs', 'multilingual'],
    featured: true,
  },
  {
    id: 'kotoshu-rs',
    name: 'kotoshu-rs',
    tagline: 'The Rust core',
    description:
      'The checking engines rebuilt in Rust behind a C ABI: dictionary and suggestion engines, reranking with pluggable embedding providers, optional ONNX (ort load-dynamic), and registry/SHA-256-verified resources. Ships magnus Ruby bindings, a WASM package, and a pyo3 wheel — none published to a registry yet. Behavior is verified against the gem by 2,630 conformance vectors plus differential fuzzing, with zero mismatches.',
    repo: 'https://github.com/kotoshu/kotoshu-rs',
    lang: 'Rust · C ABI',
    status: 'pending',
    audiences: ['ruby-devs', 'polyglot'],
    featured: false,
  },
  {
    id: 'kotoshu-lsp',
    name: 'kotoshu-lsp',
    tagline: 'Language Server Protocol server',
    description:
      'Inline squiggles, quick-fixes, and hover suggestions in every LSP-capable editor — VS Code, Neovim, Emacs (lsp-mode / eglot), JetBrains, Helix, Zed. Diagnostics carry ranked suggestions as code actions.',
    repo: 'https://github.com/kotoshu/kotoshu-lsp',
    install: 'gem install kotoshu-lsp',
    lang: 'Ruby · LSP over stdio',
    status: 'live',
    audiences: ['editors', 'multilingual'],
    featured: true,
  },
  {
    id: 'kotoshu-server',
    name: 'kotoshu-server',
    tagline: 'Self-hostable HTTP API',
    description:
      'A Sinatra/Puma service exposing /v1/check, /v1/suggest, /v1/detect over JSON, with an OpenAPI 3.1 spec and a Docker image. The deployment surface for every non-Ruby SDK.',
    repo: 'https://github.com/kotoshu/kotoshu-server',
    install: 'gem install kotoshu-server',
    lang: 'Ruby · HTTP',
    status: 'live',
    audiences: ['polyglot', 'ci-cd'],
    featured: true,
  },
  {
    id: 'kotoshu-python',
    name: 'kotoshu-python',
    tagline: 'Python client',
    description:
      'Sync requests-based client with typed dataclasses — check, suggest, detect, correct. Installable from source now; PyPI release pending token refresh.',
    repo: 'https://github.com/kotoshu/kotoshu-python',
    install: 'pip install git+https://github.com/kotoshu/kotoshu-python',
    lang: 'Python · 3.10+',
    status: 'beta',
    audiences: ['polyglot'],
  },
  {
    id: 'kotoshu-js',
    name: 'kotoshu-js',
    tagline: 'TypeScript client',
    description:
      'Fetch-based client with full TypeScript types for Node 18+, Deno, Bun, and browsers. Installable from source now; npm @kotoshu/client release pending login.',
    repo: 'https://github.com/kotoshu/kotoshu-js',
    install: 'npm install github:kotoshu/kotoshu-js',
    lang: 'TypeScript · Node 18+',
    status: 'beta',
    audiences: ['polyglot'],
  },
  {
    id: 'kotoshu-go',
    name: 'kotoshu-go',
    tagline: 'Go client',
    description:
      'Idiomatic Go client — context.Context everywhere, typed errors, APIError with IsResourceNotSetup. Tagged v0.1.0 and resolvable via the Go module proxy.',
    repo: 'https://github.com/kotoshu/kotoshu-go',
    install: 'go get github.com/kotoshu/kotoshu-go@v0.1.0',
    lang: 'Go · 1.21+',
    status: 'live',
    audiences: ['polyglot'],
  },
  {
    id: 'action-kotoshu',
    name: 'action-kotoshu',
    tagline: 'GitHub Action',
    description:
      'One line to spell-check a repo in CI: caches dictionaries between runs, runs kotoshu check, uploads SARIF to the GitHub Security tab. Tagged v1.',
    repo: 'https://github.com/kotoshu/action-kotoshu',
    install: 'uses: kotoshu/action-kotoshu@v1',
    lang: 'YAML · Composite action',
    status: 'live',
    audiences: ['ci-cd'],
    featured: true,
  },
  {
    id: 'docker-kotoshu-ci',
    name: 'docker-kotoshu-ci',
    tagline: 'Docker CI image',
    description:
      'Pre-warmed Ruby image with the gem and English dictionary baked in — docker run and check, no per-run downloads. Registry publication (ghcr.io) pending.',
    repo: 'https://github.com/kotoshu/docker-kotoshu-ci',
    install: 'docker build -t kotoshu-ci github.com/kotoshu/docker-kotoshu-ci',
    lang: 'Docker · ruby:3.4-slim',
    status: 'beta',
    audiences: ['ci-cd'],
  },
  {
    id: 'dictionaries',
    name: 'dictionaries',
    tagline: 'Hunspell dictionaries — 98 languages',
    description:
      'The content repo behind every spelling check: Hunspell .aff/.dic pairs with per-language license metadata, fetched on demand by the LanguageCache.',
    repo: 'https://github.com/kotoshu/dictionaries',
    lang: 'Data · Hunspell format',
    status: 'live',
    audiences: ['multilingual', 'ruby-devs'],
  },
  {
    id: 'frequency-list-kelly',
    name: 'frequency-list-kelly',
    tagline: 'Kelly frequency tiers',
    description:
      'Kelly Project frequency lists that rank suggestions by real-world usage — high-frequency corrections surface first.',
    repo: 'https://github.com/kotoshu/frequency-list-kelly',
    lang: 'Data · JSON tiers',
    status: 'live',
    audiences: ['multilingual'],
  },
  {
    id: 'models-fasttext-onnx',
    name: 'models-fasttext-onnx',
    tagline: 'FastText → ONNX embeddings',
    description:
      'FastText crawl vectors converted to ONNX upstream, downloaded on demand by the ModelCache for context-aware reranking and out-of-vocabulary handling.',
    repo: 'https://github.com/kotoshu/models-fasttext-onnx',
    lang: 'Data · ONNX, 300-dim',
    status: 'live',
    audiences: ['ruby-devs'],
  },
  {
    id: 'kotoshu.github.io',
    name: 'kotoshu.github.io',
    tagline: 'This website & playground',
    description:
      'The site you are reading, plus the browser playground that talks to any running kotoshu-server.',
    repo: 'https://github.com/kotoshu/kotoshu.github.io',
    lang: 'Astro · Vue islands',
    status: 'live',
    audiences: ['editors'],
  },
]
