# 06 — Site Content & Pages

## Goal

Every page the launch needs: home, about, projects, audiences,
languages, install, playground wrapper, 404. Implements the launch
scope of `02-content-port.md` and the landing intent of
`03-examples-landing.md` (full docs port and asciinema remain later
work under those plans).

## Information architecture

```
/                home — hero, demo, audiences, ecosystem, languages, principles
/about           name etymology, logo, philosophy, license
/projects/       all 12 ecosystem repos, each properly represented
/audiences/      who uses Kotoshu — five elaborated audiences
/languages/      what we support — support matrix + roadmap
/install/        getting started for every surface (tabs)
/playground/     wrapper that embeds the existing static playground
404              zen not-found
```

## Pages

### Home

1. Hero — logo mark, 言修 watermark, headline "The fixing and
   embellishing of words.", copyable `gem install kotoshu`, CTAs.
2. **Demo island** (`DemoPanel.vue`) — deterministic client-side demo
   (no server): a sentence with misspelled words; click a word to see
   ranked suggestions; click a suggestion to apply. EN + DE examples
   to show multi-language. Satisfies the try-it-yourself intent of
   plan 03 without the WASM build.
3. Audiences strip — five cards → `/audiences/`.
4. Ecosystem grid — highlight cards → `/projects/`.
5. Languages strip — 6 full-feature + counts → `/languages/`.
6. Principles — pure Ruby, two-stage offline-safe resources, optional
   semantic layer, every-language promise.

### About

Etymology (言 + 修, evocation of 修辞/修养), the leaf-mark story,
the five-repo architecture, Ribose stewardship, BSD-2-Clause, brand
asset listing (both SVGs + PNGs + PDF in `/assets/`).

### Audiences — "who uses Kotoshu"

Each audience: a persona description, "you need Kotoshu if…"
bullets, install snippet, links to the relevant projects.

| Audience | Surface | Install |
|---|---|---|
| Ruby developers | `kotoshu` gem API, two-stage setup, personal dictionary | `gem install kotoshu` |
| Writers & editors | `kotoshu-lsp` in VS Code / Neovim / Emacs / JetBrains | `gem install kotoshu-lsp` |
| Maintainers & CI | `action-kotoshu` (SARIF), Docker CI image, exit codes | `uses: kotoshu/action-kotoshu@v1` |
| Non-Ruby teams | `kotoshu-server` HTTP API + Python/JS/Go SDKs + OpenAPI | `gem install kotoshu-server` |
| Multilingual writers | 6 full-feature languages, auto-detect, interactive CLI review | `gem install kotoshu` |

### Languages — "what we support"

- **Full feature** (spelling + affixes + frequency + ONNX + keyboard
  layouts): de, en, es, fr, pt, ru.
- **Frequency data**: ar, zh, el, it, no, sv (Kelly tiers).
- **Dictionaries repo**: ~98 language directories ready to wire.
- **Detection**: FastText LID, 176 model languages.
- **Roadmap**: CJK morphological support, RTL shaping, ≥30 wired
  language modules.
- How to add a language (pointer to gem plan 04).

### Projects

Data-driven registry (`src/data/projects.ts`), one card per repo:
description, repo link, install/usage snippet, status badge
(live / beta / pending), audience tags. Honest status: PyPI and npm
publishes pending; registry Docker image pending.

### Install

`InstallTabs.vue` island reused: Ruby gem / CLI, Editor (LSP), CI
(GitHub Action), HTTP server + SDKs, Docker. Exit-code table. Links.

### Playground

Embeds `/playground/` (served via `public/`) in a framed layout with
an open-in-new-tab link and a note that it needs a running
`kotoshu-server`.

## Data registries

`src/data/{site,projects,audiences,languages,search}.ts` — single
source of truth consumed by pages and the search index.

## Acceptance

- Every page reachable from nav/footer; no dead internal links.
- Every project card links to its real repo.
- Audiences page answers "who uses this and what do they install".
- Languages page answers "what is supported where".

## Dependencies

- Blocked by: 04, 05.

## Status

_Pending._
