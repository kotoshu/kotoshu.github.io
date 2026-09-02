# 03 — Examples & Interactive Landing

## Goal

A landing page that lets a visitor see Kotoshu in action within 30
seconds — without installing anything.

## Why

Spellcheckers are visual products. A wall of text doesn't sell one.
The v1 announcement (cross-references `kotoshu/TODO.impl/11-release-v1.md`)
needs a memorable demo: paste-a-sentence, see-corrections, copy-the-
install-command.

## Tasks

1. **Static before/after examples.** Three or four well-chosen
   sentences with their correction output rendered side-by-side.
   Pick examples that highlight Kotoshu's strengths:
   - Semantic correction (desert vs dessert in context)
   - Multi-language (a German sentence with mixed-language content)
   - CI output (a SARIF snippet rendered as GitHub annotations)
   - Interactive review (a screenshot or asciinema of the TUI)
2. **Asciinema cast.** Record a 60-second terminal session of
   `kotoshu check README.md --interactive`. Embed via the asciinema
   player. Lets visitors see the interactive UX without running it.
3. **Try-it-yourself widget (stretch).** A client-side textarea that
   runs Kotoshu via WebAssembly. Substantial work — likely a v1.1
   feature, but mock the UI on the landing page now so visitors know
   it's coming.
4. **"Get started in 60 seconds" panel.** Three commands:
   ```bash
   gem install kotoshu
   echo 'Hello wrold' | kotoshu check --from-stdin
   kotoshu check README.md --interactive
   ```
5. **Comparison table.** Kotoshu vs hunspell-cli vs cspell vs
   LanguageTool. Dimensions: pure-Ruby, dynamic download, multi-
   language, semantic, interactive, SARIF. Honest — don't pretend to
   beat LanguageTool on grammar coverage.
6. **Quotes / social proof (deferred until they exist).** A spot for
   testimonials once v1 ships and people use it.
7. **Performance chart.** "10–100x faster than pure-Ruby alternatives"
   claim from the README — back it with a benchmark chart on the
   landing page.

## Acceptance criteria

- Landing page loads in <3 seconds on a cold cache
- The asciinema cast plays without errors
- A visitor can read the landing page, see a working example, and copy
  the install command in under 60 seconds
- The comparison table is accurate and verifiable

## Dependencies

- Blocked by: `01-site-skeleton.md`, `02-content-port.md`
- Coordinate with `kotoshu/TODO.impl/05-semantic-path.md` (benchmark
  numbers come from there) and `kotoshu/TODO.impl/11-release-v1.md`
  (announcement)

## Out of scope

- Full WebAssembly port (defer to v1.1+)
- User accounts / saved sessions
- A "Try Kotoshu in your browser" feature that requires a backend

## Status

**Implemented (2026-09-02)**, with two conscious deferrals:

- Interactive demo: `DemoPanel` island on the home page (paste a
  sentence, see corrections) — no install needed.
- "60 seconds" panel: `InstallTabs` on home and `/install` (gem, LSP,
  Action, server, Go).
- Live playground: `/playground` against any running `kotoshu-server`
  (plan 08) — better than a recording because it is the real engine.
- Comparison table: `/docs/comparison` — honest, dimension-by-dimension.
- Per-language specimens: `/languages/{code}` pages carry a native
  sample sentence with underlined misspellings and ranked corrections.

Deferred: the **asciinema cast** (needs a recorded terminal session of
`kotoshu check --interactive`; the slot is the playground's job until
one is recorded) and the **WASM try-it** (client-side engine — tracked
in the gem repo as plans 63/66 via kotoshu-rs; the server-backed
playground covers the need meanwhile). Performance chart deferred until
plan 05 publishes benchmark numbers worth charting.
