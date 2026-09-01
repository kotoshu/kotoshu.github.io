# 10 — Dictionary Structure Pass

## Goal

Carry the hero's signature into the page structure. After pass 09 the
hero states the thesis; the body was still four consecutive
card-grids. This pass replaces the most templated block with a
subject-true one and turns the one-off accents into a system.

## Devices

1. **Dictionary page on the home Languages section.** The six
   full-feature languages were rounded chips — the default "tag pill"
   pattern. They are now headword entries on a two-column dictionary
   page: mono headword column (`de`, `en`, …) with hanging-indent
   sense lines (`Deutsch n. — full feature`), mono annotation lines
   (`affixes · frequency · semantic · QWERTZ`), hairline rules between
   senses, a double-ruled banner (`辞書 dictionary of supported
   languages`), and a `see also` line for the frequency-tier
   languages. The hanging indent *is* dictionary typography — the
   structure encodes exactly what the content is.
2. **Vertical accent as a system.** The hero's vertical-rl phrase is
   now a shared component (`VerticalAccent.astro`) with a per-page
   phrase — 言葉を修める, 名の由来, 生態系, 使う人, 言葉の世界,
   導入, 実験 — so the device reads as the site's system, not a
   one-off. Still 1100 px+, still aria-hidden.
3. **Entry device propagates.** The footer defines the name in the
   same headword form as the hero (and drops the now-duplicate kanji
   badge). The 404 defines itself: `four·oh·four 四〇四 n.` with its
   explanation set as sense 1.
4. **Type scale and wrapping.** The home H1 moves to text-7xl at sm+
   with `text-balance`; the hero paragraph gets `text-pretty`.
   Headline presence up, rag unchanged.

## Restraint

Considered and cut: numbered principles (not a sequence), a file-tab
decoration on the demo panel (decoration, not information), and
dot-leader index rows on the projects page (the cards carry real
content there). One structural idea per page: the dictionary page is
the home body's only new structure.

## Acceptance

- Dictionary section renders two columns ≥md, one column on mobile;
  every entry links to /languages.
- All six page heroes carry the vertical accent; hidden below 1100 px.
- Build passes; all routes 200; footer and 404 show the entry line.

## Status

**Implemented** (2026-09-01).
