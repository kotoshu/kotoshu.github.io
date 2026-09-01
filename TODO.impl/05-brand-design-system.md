# 05 — Brand & Design System

## Goal

A zen design system derived from the Kotoshu logos: washi-paper light
mode, sumi-ink dark mode, Instrument Serif display type, bilingual
kanji accents, and calm motion.

## Brand inputs

The two logo variants in `assets/` define the palette:

| Variant | Ground | Leaf greens | Gold |
|---|---|---|---|
| `kotoshu-logo_logo-light.svg` | washi white | `#308a4f` `#49ad55` | `#cecc89` `#86bf3c` `#afd37d` sage `#aaa79e` |
| `kotoshu-logo_logo-dark.svg` | (transparent) | `#10bc4b` `#23df39` | `#dcbe63` `#fbf664` `#8bee0c` `#b7ff53` |

Both marks share the same geometry — the light variant reads on light
ground, the vivid variant on dark. The site swaps them with CSS.

## Name

**Kotoshu 「言修」** — *koto* (言, word / language) + *shu* (修, to fix,
to cultivate). Together: **the fixing or embellishing of words**. The
name echoes 修辞 (*shūji*, rhetoric) and 修养 (*shūyō*, cultivation):
words tended like a garden — the leaf mark is that garden.

## Design tokens (`src/styles/global.css`)

- Tailwind 4 `@theme`: `--color-bg` (washi `#fbfbf8` / sumi `#0b0d0a`),
  `--color-accent` (leaf green), `--color-gold`, text/border scales,
  `--font-display` (Instrument Serif), `--font-sans` (Inter Tight),
  `--font-jp` (Noto Sans JP), `--font-mono` (JetBrains Mono).
- Manual dark mode: `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`.
- Pre-paint theme bootstrap (inline script in BaseLayout):
  `localStorage` → `prefers-color-scheme` → set `data-theme`.

## Zen design rules

1. **Restraint.** One accent color per surface. Gold appears only as
   tiny highlights (badges, active states).
2. **Space.** Sections breathe: `py-24`–`py-32`, generous line-height.
3. **Bilingual accents.** Section eyebrows pair kanji + English
   (生態系 Ecosystem, 言葉 Languages, 使う人 Audiences, 導入 Install,
   物語 About). Hero carries a large low-opacity 言修 watermark.
4. **Calm motion.** 500 ms fade-lift on scroll (IntersectionObserver),
   disabled under `prefers-reduced-motion`. No parallax, no bounce.
5. **Ink hairlines.** 1 px borders at low alpha; never boxes on boxes.

## Tasks

1. `global.css` with tokens, dark overrides, base styles, `animate-in`.
2. `Logo.astro` — dual-image swap, size + wordmark variants.
3. `BaseLayout.astro` — theme bootstrap, skip link, header/footer,
   scroll-observer script, OG/Twitter meta, dual favicon by scheme.
4. `Header.astro` — sticky blur, nav, theme toggle, search button.
5. `Footer.astro` — kanji wordmark, meaning, link columns, license.

## Acceptance

- No flash of wrong theme on reload (pre-paint script).
- Both logo variants render correctly in their respective modes.
- `prefers-reduced-motion` disables scroll animation.
- Lighthouse-style contrast: body text ≥ 4.5:1 in both modes.

## Dependencies

- Blocked by: 04.

## Status

_Pending._
