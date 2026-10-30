/**
 * The neural grammar models — measured, not marketed.
 *
 * Every number here was produced by the frozen measurement pipeline:
 * decodes run on the shipped artifact, scored against held-out gold by
 * the span scorer with its artifact guards (inflation rejection,
 * character-level CJK comparison, span-size matching). CoNLL-14 uses
 * the official M2 scorer. When a number can't survive that pipeline,
 * it doesn't appear on this page.
 */

export interface GrammarModel {
  /** HF repo under github.com/kotoshu. */
  repo: string
  lang: string
  native: string
  /** ISO publish date of the current weights. */
  date: string
  size: string
  status: 'published' | 'evaluation'
  benchmark?: {
    /** Human-readable benchmark name. */
    name: string
    /** Our headline metric on that benchmark. */
    metric: string
    score: string
    /** Comparison line, only where independently verifiable. */
    comparison?: string
    /** Scoring protocol — stated on the page, always. */
    protocol: string
  }
  note?: string
}

export const GRAMMAR_MODELS: GrammarModel[] = [
  {
    repo: 'grammar-en',
    lang: 'English',
    native: 'English',
    date: '2026-10-14',
    size: '190 MB',
    status: 'published',
    benchmark: {
      name: 'CoNLL-14 (official M² scorer)',
      metric: 'F0.5',
      score: '0.522',
      comparison: '2.49× LanguageTool (0.168) on the same full set',
      protocol: 'Official M² scorer, full test set, decodes from the shipped artifact.',
    },
  },
  {
    repo: 'grammar-fr',
    lang: 'French',
    native: 'Français',
    date: '2026-10-29',
    size: '473 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.811',
      protocol:
        'Strict span scorer with artifact guards; re-measured 2026-10-29 on the shipped fp32 weights.',
    },
  },
  {
    repo: 'grammar-es',
    lang: 'Spanish',
    native: 'Español',
    date: '2026-10-29',
    size: '473 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.620',
      protocol:
        'Strict span scorer; freshly corrupted held-out slice (seed-pinned), precision-first profile (P 0.92).',
    },
  },
  {
    repo: 'grammar-de',
    lang: 'German',
    native: 'Deutsch',
    date: '2026-10-12',
    size: '220 MB',
    status: 'published',
    note: 'Measured on its held-out suite with an LLM-judge gate; see the model card.',
  },
  {
    repo: 'grammar-ru',
    lang: 'Russian',
    native: 'Русский',
    date: '2026-10-30',
    size: '436 MB',
    status: 'evaluation',
    note: 'Trained on 112,567 verified parallel rows; in final evaluation.',
  },
  {
    repo: 'grammar-cjk',
    lang: 'Chinese · Japanese · Korean',
    native: '中文 · 日本語 · 한국어',
    date: '2026-10-30',
    size: '464 MB',
    status: 'evaluation',
    note: 'One shared model across three scripts; in final evaluation on held-out and real-error benchmarks.',
  },
]

export const GRAMMAR_PLATFORMS = {
  line: 'Verified on Apple Silicon (arm64) and x86-64 Linux',
  detail:
    'Single-file ONNX per model, loaded through the gem with no Python runtime. Every shipped file passes a cross-architecture confidence check before publish.',
} as const

export const GRAMMAR_PROTOCOL = {
  title: 'Measured, not marketed',
  body: 'Every score on this page comes from the same frozen pipeline: decodes run against the exact artifact you download, and the scorer rejects the failure modes that inflate GEC numbers — output inflation, CJK tokenization mirages, span-size mirages. Where a comparison appears, the baseline was run on the same test set. Numbers that cannot survive this pipeline are not published.',
} as const
