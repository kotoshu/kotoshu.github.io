# 01 — Site Skeleton

## Goal

A published static site at `https://kotoshu.github.io` with a working
home page, navigation, and deployment pipeline.

## Why

The repo currently has only a `.git/` directory — no content at all.
The Kotoshu gem's `homepage` metadata points at
`https://github.com/kotoshu/kotoshu`. A proper landing page is needed
for the v1 announcement (cross-references
`kotoshu/TODO.impl/11-release-v1.md`).

## Tasks

1. **Pick a generator.** Options:
   - **Jekyll** (GitHub Pages default, no build config needed) —
     simplest path; recommended for v1
   - **Hugo** (faster builds, more config) — overkill for v1
   - **Static HTML** — too manual
   - **Bridgetown** (Ruby-based, modern) — interesting but more setup
   Recommendation: **Jekyll with the default `minima` theme**.
2. **Site structure:**
   ```
   _config.yml
   _data/languages.yml      # auto-generated from gem's supported_languages
   _data/navigation.yml
   index.md                 # landing page
   docs/
     quickstart.md
     api.md
     cli.md
     configuration.md
     caching.md
     plugins.md
   languages/
     index.md               # the language matrix
     de.md
     en.md
     ...
   _layouts/
     default.html
     language.html
   assets/
     css/
   ```
3. **GitHub Actions workflow.** `.github/workflows/jekyll.yml` builds
   and deploys on push to `main` via the official Pages action.
4. **CNAME.** If using a custom domain (`kotoshu.org`?), add a `CNAME`
   file. Otherwise the default `kotoshu.github.io` works.
5. **Basic SEO.** `<title>`, `<meta description>`, Open Graph tags on
   the landing page so the link previews well when shared.
6. **Favicon.** Needs a Kotoshi logo. Sourcing or commissioning this
   is its own sub-task; ship a placeholder initial.
7. **Analytics.** Opt-in only. Skip for v1; document how to add
   Plausible/GA later.

## Acceptance criteria

- `https://kotoshu.github.io` returns the landing page after merge
- The site builds locally with `bundle exec jekyll serve`
- All navigation links work
- The deployed build matches local build

## Dependencies

- Blocks: `02-content-port.md`, `03-examples-landing.md`
- Coordinate with `kotoshu/TODO.impl/11-release-v1.md` (announcement
  needs a URL)

## Out of scope

- Blog engine
- Comment system
- Search (defer until site is large enough to need it)

## Status

_Pending._
