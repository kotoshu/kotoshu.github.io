# 04 — Astro Foundation (supersedes the Jekyll recommendation in 01)

## Goal

An Astro 7 + Vite 8 + Tailwind 4 + Vue-islands static site living in
this repo, deployed to GitHub Pages at `https://kotoshu.github.io`,
with a professional zen design language, light/dark modes, and search.

## Why

Plan 01 recommended Jekyll for speed-to-v1. The requirements have
grown: interactive demo islands, tabbed install commands, a Cmd+K
search modal, and a design system that matches the new brand logos —
all substantially easier in Astro with Vue islands. The sibling site
[`pubid/pubid.github.io`](https://github.com/pubid/pubid.github.io)
establishes the exact stack and patterns this repo now follows.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Generator | Astro 7 (`^7.0`) | Islands architecture — static HTML, Vue hydrated only where interactive |
| Bundler | Vite 8 (`^8.1`) | Ships with Astro 7; required by `@tailwindcss/vite` 4 |
| Styling | Tailwind 4 via `@tailwindcss/vite` | No PostCSS chain; CSS-first `@theme` tokens |
| Interactivity | Vue 3.5 + `@astrojs/vue` | Shared with pubid reference; islands for demo/search/tabs |
| Docs engine | none yet (Starlight later) | Launch scope is marketing + reference pages; docs port (plan 02) lands later on Starlight |
| Search | MiniSearch + JSON endpoint | Works in dev and prod; no post-build indexing step |
| Deploy | GitHub Pages via Actions | User-site repo publishes from `main` via `withastro/action` |

## Tasks

1. `package.json` with the stack above plus Fontsource packages.
2. `astro.config.mjs`: `site: 'https://kotoshu.github.io'`, `vue()`,
   `sitemap()`, `vite.plugins: [tailwindcss()]`, dual shiki themes.
3. `tsconfig.json`: `astro/tsconfigs/strict` + `~/*` path alias.
4. `scripts/sync-static.mjs` — copies `playground/` and `assets/` into
   `public/` (npm `predev`/`prebuild` hooks). Single source of truth
   stays at repo root; synced copies are gitignored.
5. `.gitignore`: add `.astro/`, `dist/`, `node_modules/`,
   `public/playground/`, `public/assets/`.
6. `.github/workflows/deploy.yml` — build and deploy on push to main.
7. Enable Pages with `build_type: workflow`.

## Acceptance

- `npm run build` succeeds with zero errors.
- `astro preview` serves every page; curl returns 200.
- Pushing to `main` deploys to `https://kotoshu.github.io`.

## Dependencies

- Blocks: 05, 06, 07, 08.
- Supersedes: the generator choice in `01-site-skeleton.md` (Jekyll).

## Status

**Implemented** (2026-09-01).
