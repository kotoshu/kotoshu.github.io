# 02 — Content Port

## Goal

Port the user-facing sections of the gem's `README.adoc` into a proper
docs site with per-page depth, cross-links, and per-language pages.

## Why

The README is currently the only documentation. It's 800+ lines
covering purpose, architecture, install, quickstart, API, CLI, models,
caching, language matrix, and contributing all in one file. The site
should split this into navigable pages.

## Tasks

1. **Quickstart page.** 5-minute path from `gem install` to first
   checked document. Single page, copy-pasteable commands.
2. **API reference.** Auto-generated from YARD docs in the gem. Set up
   a `yard` job that publishes to `/api/`. Each public method gets a
   page.
3. **CLI reference.** One page per subcommand (`check`, `dict`,
   `cache`, `model`), with every flag documented and an example.
4. **Configuration page.** Mirrors `Configuration::SCHEMA` — every
   option, its env var, default, type, description. Auto-generated
   from the gem's schema.
5. **Caching page.** Explains the three caches, TTLs, cache management
   CLI, offline mode, integrity verification.
6. **Per-language pages.** `_layouts/language.html` plus
   `languages/{code}.md` for each supported language. Each page:
   - Resource availability (spelling, grammar, frequency, model)
   - Special tokenizer/normalizer behavior
   - Known limitations
   - Sample check output
   Auto-generates from the gem's `Kotoshu.supported_languages` and
   `COVERAGE.md` from the dictionaries repo.
7. **Plugin authoring.** How to write a custom dictionary backend or
   suggestion algorithm (mirrors the gem's `PLUGINS.md`).
8. **Migration guides.** For users coming from `hunspell`, `aspell`,
   `cspell` — what's familiar, what's different.
9. **Search.** Add `lunr.js` or Algolia DocSearch once the site has
   enough pages to warrant it.

## Acceptance criteria

- Every section of `README.adoc` has a corresponding site page
- The API reference is generated from YARD, not hand-written
- Each supported language has a dedicated page
- Internal links work and external links are valid
- A reader can go from "never heard of Kotoshu" to "running it in CI"
   using only the site

## Dependencies

- Blocked by: `01-site-skeleton.md`
- Coordinate with `kotoshu/TODO.impl/02-cli-unification.md` (CLI docs
  must match the unified CLI surface) and `kotoshu/TODO.impl/04-language-modules.md`
  (language pages mirror the supported matrix)

## Status

_Pending._
