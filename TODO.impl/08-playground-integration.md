# 08 — Playground Integration

## Goal

The existing static playground (`playground/`, built 2026-07-31)
served as part of the site at `/playground/`, wrapped in the site
chrome.

## Approach

`scripts/sync-static.mjs` copies `playground/` and `assets/` into
`public/` before dev/build (npm `predev`/`prebuild`). The repo-root
copies remain the editable source; the `public/` copies are
gitignored derived output.

## Tasks

1. Sync script + gitignore entries (done in plan 04's scaffold).
2. `/playground` page — site-chrome wrapper embedding
   `/playground/index.html` in a full-height frame, "open in new tab"
   link, and a note that live checking needs a running
   `kotoshu-server` (the WASM-native port is tracked in the gem repo's
   `TODO.impl/63-web-playground-wasm.md`).
3. Home page links into `/playground`.

## Acceptance

- `/playground/` (the raw app) and `/playground` (the framed page)
  both serve correctly from the built site.
- Editing repo-root `playground/` files is reflected on next
  `npm run dev` / `build`.

## Dependencies

- Blocked by: 04.

## Status

_Pending._
