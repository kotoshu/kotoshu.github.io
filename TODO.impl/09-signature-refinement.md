# 09 — Signature Refinement Pass

## Goal

Turn the launch site's generic marketing hero into the site's thesis:
a design only a spell checker named in kanji could wear.

## Critique that drove it

The launch design (plans 04–08) was disciplined but its hero was a
template — centered logo, eyebrow, headline, CTA. The palette is
brand-mandated (logo greens on washi / sumi) and stays; the execution
now earns it.

## Devices

1. **Dictionary-entry eyebrow.** The hero opens by defining its own
   name like a headword — `ko·to·shu 言修 n.` — set in mono with the
   kanji as the accent and the part of speech in italic serif. A spell
   checker's native artifact, used as its front door.
2. **Self-mending headline.** "embellishing" loads as "embelishing"
   with a wavy gold underline, then mends itself — once, ~1.2 s in,
   settling through accent green back to ink. The product demonstrated
   in its own headline. Progressive enhancement: no-JS users get the
   correct word; `prefers-reduced-motion` skips the performance.
3. **Vertical Japanese accent.** 「言葉を修める」 runs down the hero's
   right margin (`writing-mode: vertical-rl`), 1100 px and up,
   decorative and aria-hidden. The one real aesthetic risk — justified
   by the name and the zen brief.
4. **Washi grain.** SVG-turbulence paper fibers over the light ground
   at 3.2%, light mode only (ink has no fibers). Fixed overlay,
   pointer-events none.
5. **One family system.** Body swaps Inter Tight → Instrument Sans
   (variable) — the same foundry as Instrument Serif, so display and
   body are a designed pairing rather than two defaults. Mono keeps
   the data voice; Noto Sans JP keeps the kanji.
6. **Header search affordance.** The magnifier gains a visible ⌘K kbd
   hint on ≥sm so the search is discoverable without a tooltip.

## Restraint

One orchestrated moment (the mend); everything else stays quiet. A
planned demo-panel polish was cut — the hero is where the boldness
lives. Chanel's mirror: the grain was nearly cut too; it stays only
because at 3% it reads as paper, not texture.

## Acceptance

- Headline is always correct with JS off; the typo appears only as the
  designed moment with JS on, never under reduced motion.
- Entry line, vertical accent, and grain all present in the built CSS
  and rendered HTML; grain absent in dark mode.
- Build passes; every route still 200; no other page changed.

## Status

**Implemented** (2026-09-01).
