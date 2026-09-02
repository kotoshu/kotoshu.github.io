export type DocsSectionId = 'start' | 'reference' | 'extend' | 'adopt'

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
    keywords: 'cache caching resources dictionaries models download xdg ttl setup resolve manifest offline',
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
