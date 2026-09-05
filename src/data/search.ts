import { SITE, NAV } from './site'
import { PROJECTS } from './projects'
import { AUDIENCES } from './audiences'
import { FULL_LANGUAGES, FREQUENCY_LANGUAGES, LANGUAGE_ROADMAP } from './languages'
import { DOCS_PAGES, docsPath } from './docs'
import { NEWS } from './news'

export interface SearchEntry {
  id: string
  url: string
  title: string
  section: string
  description: string
  keywords?: string
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  entries.push(
    {
      id: 'page-home',
      url: '/',
      title: 'Home',
      section: 'Pages',
      description: SITE.description,
      keywords: 'kotoshu spell checker landing hero demo install',
    },
    {
      id: 'page-about',
      url: '/about',
      title: 'About Kotoshu',
      section: 'Pages',
      description:
        'The name 言修 — koto (word) + shu (to fix, to cultivate): the fixing and embellishing of words. The logo, the philosophy, the license.',
      keywords: 'about name meaning etymology kanji logo brand license ribose',
    },
    {
      id: 'page-projects',
      url: '/projects',
      title: 'Projects — the ecosystem',
      section: 'Pages',
      description:
        'All thirteen repositories: the core gem and its Rust core, LSP server, HTTP API, Python / JS / Go SDKs, GitHub Action, Docker image, and the content repos.',
      keywords: 'ecosystem repositories repos gems sdks action docker rust kotoshu-rs native c abi wasm bindings',
    },
    {
      id: 'page-audiences',
      url: '/audiences',
      title: 'Audiences — who uses Kotoshu',
      section: 'Pages',
      description:
        'Ruby developers, writers and editors, CI maintainers, non-Ruby teams, multilingual writers — what each needs and what to install.',
      keywords: 'who uses audience personas ruby dev editor ci http sdk multilingual',
    },
    {
      id: 'page-languages',
      url: '/languages',
      title: 'Languages — what we support',
      section: 'Pages',
      description:
        'Six full-feature languages, frequency data for six more, 98 staged dictionaries, automatic detection in 176 languages, and the roadmap.',
      keywords: 'languages support german english spanish french portuguese russian detection matrix roadmap cjk rtl',
    },
    {
      id: 'page-install',
      url: '/install',
      title: 'Install & quickstart',
      section: 'Pages',
      description:
        'Every channel: the Ruby gem and CLI, Python and JavaScript packages, the Rust crate, the Go client, the HTTP server, the editor LSP, and the GitHub Action.',
      keywords: 'install quickstart getting started setup gem pip npm cargo client sdks cli lsp action server channels python javascript rust go docker exit codes offline native backend wasm kotoshu-rs rust engine',
    },
    {
      id: 'page-playground',
      url: '/playground',
      title: 'Playground',
      section: 'Pages',
      description:
        'Try Kotoshu in the browser — point the playground at any running kotoshu-server and see live diagnostics.',
      keywords: 'playground demo try browser live server',
    },
    {
      id: 'page-news',
      url: '/news',
      title: 'News & releases',
      section: 'Pages',
      description:
        'Kotoshu releases and events, newest first — the gem, Python and JavaScript packages, the Rust core, models, keyless publishing.',
      keywords: 'news releases changelog announcements rss atom feed versions 0.7.0 0.1.0',
    },
  )

  for (const entry of NEWS) {
    entries.push({
      id: `news-${entry.slug}`,
      url: `/news/${entry.slug}`,
      title: entry.title,
      section: 'News',
      description: entry.summary,
      keywords: `${entry.date} ${entry.kind} release`,
    })
  }

  for (const p of PROJECTS) {
    entries.push({
      id: `project-${p.id}`,
      url: '/projects',
      title: p.name,
      section: 'Projects',
      description: `${p.tagline}. ${p.description}`,
      keywords: `${p.install ?? ''} ${p.lang ?? ''} ${p.audiences.join(' ')}`,
    })
  }

  for (const a of AUDIENCES) {
    entries.push({
      id: `audience-${a.id}`,
      url: '/audiences',
      title: a.name,
      section: 'Audiences',
      description: `${a.headline}. ${a.who}`,
      keywords: `${a.install} ${a.projects.map((p) => p.label).join(' ')}`,
    })
  }

  for (const l of FULL_LANGUAGES) {
    entries.push({
      id: `lang-${l.code}`,
      url: `/languages/${l.code}`,
      title: `${l.name} (${l.code}) — ${l.native}`,
      section: 'Languages',
      description:
        'Full-feature support: spelling with affixes, ONNX semantic model, keyboard layouts — and frequency ranking where Kelly data exists.',
      keywords: `full feature ${l.name} ${l.native} ${l.code} ${l.keyboards} dictionary hunspell`,
    })
  }

  entries.push({
    id: 'lang-frequency',
    url: '/languages',
    title: 'Frequency-supported languages',
    section: 'Languages',
    description: `Kelly frequency tiers available for ${FREQUENCY_LANGUAGES.map((l) => l.name).join(', ')} (and Russian).`,
    keywords: FREQUENCY_LANGUAGES.map((l) => `${l.name} ${l.code}`).join(' ') + ' frequency kelly',
  })

  entries.push(
    {
      id: 'lang-detection',
      url: '/languages',
      title: 'Automatic language detection',
      section: 'Languages',
      description: 'FastText LID detection from document content across 176 model languages.',
      keywords: 'detect detection auto automatic identify fasttext lid',
    },
    {
      id: 'lang-roadmap',
      url: '/languages',
      title: 'Language roadmap — CJK & RTL',
      section: 'Languages',
      description: LANGUAGE_ROADMAP.map((r) => r.title).join('; ') + '.',
      keywords: 'roadmap cjk japanese chinese rtl arabic hebrew upcoming',
    },
    {
      id: 'ext-github',
      url: SITE.githubOrg,
      title: 'Kotoshu on GitHub',
      section: 'Links',
      description: 'The kotoshu organization — all repositories.',
      keywords: 'github org source code',
    },
    {
      id: 'ext-rubygems',
      url: 'https://rubygems.org/gems/kotoshu',
      title: 'kotoshu on RubyGems',
      section: 'Links',
      description: 'The core gem on RubyGems.org.',
      keywords: 'rubygems gem download',
    },
  )

  for (const p of DOCS_PAGES) {
    entries.push({
      id: `docs-${p.slug || 'index'}`,
      url: docsPath(p.slug),
      title: p.title,
      section: 'Docs',
      description: p.description,
      keywords: p.keywords,
    })
  }

  // Nav quick links
  for (const item of NAV) {
    entries.push({
      id: `nav-${item.href}`,
      url: item.href,
      title: item.label,
      section: 'Navigation',
      description: `Go to ${item.label}.`,
    })
  }

  return entries
}
