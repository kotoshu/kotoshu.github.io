export const SITE = {
  name: 'Kotoshu',
  kanji: '言修',
  meaning: 'The fixing and embellishing of words',
  url: 'https://kotoshu.github.io',
  description:
    'Kotoshu (言修) is a pure-Ruby spell checker with semantic reranking — dictionaries, frequency lists, and embedding models resolved on demand for every language you write.',
  githubOrg: 'https://github.com/kotoshu',
  repo: 'https://github.com/kotoshu/kotoshu',
  siteRepo: 'https://github.com/kotoshu/kotoshu.github.io',
  license: 'BSD-2-Clause',
  author: 'Ribose Inc.',
} as const

export interface NavItem {
  label: string
  href: string
}

export const NAV: NavItem[] = [
  { label: 'Projects', href: '/projects' },
  { label: 'Audiences', href: '/audiences' },
  { label: 'Languages', href: '/languages' },
  { label: 'Playground', href: '/playground' },
  { label: 'Install', href: '/install' },
  { label: 'About', href: '/about' },
]

export const FOOTER_COLUMNS: { heading: string; links: NavItem[] }[] = [
  {
    heading: 'Ecosystem',
    links: [
      { label: 'All projects', href: '/projects' },
      { label: 'kotoshu gem', href: 'https://github.com/kotoshu/kotoshu' },
      { label: 'kotoshu-lsp', href: 'https://github.com/kotoshu/kotoshu-lsp' },
      { label: 'kotoshu-server', href: 'https://github.com/kotoshu/kotoshu-server' },
      { label: 'GitHub Action', href: 'https://github.com/kotoshu/action-kotoshu' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Install & quickstart', href: '/install' },
      { label: 'Language support', href: '/languages' },
      { label: 'Who uses Kotoshu', href: '/audiences' },
      { label: 'Playground', href: '/playground' },
      { label: 'About the name', href: '/about' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'GitHub org', href: SITE.githubOrg },
      { label: 'RubyGems', href: 'https://rubygems.org/gems/kotoshu' },
      { label: 'Dictionaries repo', href: 'https://github.com/kotoshu/dictionaries' },
      { label: 'Report an issue', href: 'https://github.com/kotoshu/kotoshu/issues' },
      { label: 'Security policy', href: 'https://github.com/kotoshu/kotoshu/blob/main/SECURITY.md' },
    ],
  },
]
