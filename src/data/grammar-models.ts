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
  /** Suite capability flags for this language. */
  capabilities?: {
    gec: boolean
    spell: boolean
    rules: boolean
  }
  /** Measured decode performance (arm64 local, this exact artifact). */
  perf?: {
    ms_per_sentence: number
    rounds: number
    peak_rss_mb: number
  }
}

export const GRAMMAR_MODELS: GrammarModel[] = [
  {
    repo: 'grammar-en',
    lang: 'English',
    native: 'English',
    date: '2026-11-22',
    capabilities: { gec: true, spell: true, rules: true },
    perf: { ms_per_sentence: 490, rounds: 4, peak_rss_mb: 704 },
    size: '350 MB',
    status: 'published',
    benchmark: {
      name: 'CoNLL-14 (official M² scorer)',
      metric: 'F0.5',
      score: '0.5458',
      comparison: '3.4× LanguageTool (0.168) on the same full set',
      protocol:
        'Official M² scorer, full test set (1,312), decodes from this exact shipped artifact through the SpmBpe serving path, 4 rounds (P 0.5985, R 0.4036). Calibrated serving surface on the same artifact: 0.5585 (MIN_CONFIDENCE 0.5 shipped in serving.json — this encoder, like Urdu, benefits from thresholding).',
    },
    note: 'The deberta-v3-base rung: slow-spm tokenizer + per-word alignment, max_len 128, 3-round schedule on a 400k slice of the MEGA corpus. +1.1pt over the MEGA line (0.5346, roberta — remains in repo history); the deberta encoder has won every language gated. Ships at 350MB fp16 under a recorded ceiling exception — a 45k frequency cap fits 250MB but measured 0.5250 (dropped rare-word pieces cost 2.1pt), so no size-compliant deberta beats MEGA.',
  },
  {
    repo: 'grammar-fr',
    lang: 'French',
    native: 'Français',
    date: '2026-11-21',
    size: '271 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.9803',
      protocol:
        'Strict span scorer with artifact guards; 1,239-sentence held-out probe decoded from this exact artifact via the SpmBpe serving path, 1 round (P 0.997, R 0.918). Ruby product surface on the same artifact: 0.9302 (MIN_CONFIDENCE-calibrated at 0.0).',
    },
    note: 'deberta-v3-base rung: slow-spm tokenizer + per-word alignment, max_len 128, 3-round schedule. +0.17 F0.5 over the previous mdeberta weights (0.811) at half the shipped size; fp16 weight storage with Cast-to-fp32 nodes (quantize_dynamic collapses deberta activations). v1 remains in the repo history.',
  },
  {
    repo: 'grammar-es',
    lang: 'Spanish',
    native: 'Español',
    date: '2026-11-21',
    size: '184 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.668',
      protocol:
        'Strict span scorer; freshly corrupted 908-sentence held-out slice (seed-pinned), decoded from this exact artifact via the SpmBpe serving path, 1 round (P 0.92, R 0.32). Ruby product surface on the same artifact: 0.6999 (MIN_CONFIDENCE-calibrated at 0.0).',
    },
    note: 'deberta-v3-base rung: slow-spm tokenizer + per-word alignment, max_len 128, 3-round schedule. +4.8pt F0.5 over the previous mdeberta weights (0.620); fp16 weight storage with Cast-to-fp32 nodes. v1 remains in the repo history.',
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
    date: '2026-11-21',
    size: '213 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.8333',
      protocol:
        'Strict span scorer; 812 held-out single-error sentences, decoded from this exact artifact through the SpmBpe path, 1 round (P 0.99, R 0.51). Ruby product surface on the same artifact: 0.7382 (MIN_CONFIDENCE-calibrated at 0.0) — the measured serving law for this encoder.',
    },
    note: 'deberta-v3-base rung on the same 182,031-row mix (112,567 verified corruption pack + 69,464 GLM-5.3-Flash-verified corrections): slow-spm tokenizer + per-word alignment, max_len 128, 3-round schedule. +0.40 F0.5 over the v11.1 mdeberta weights (0.4315 on the identical gate); fp16 weight storage with Cast-to-fp32 nodes, half the shipped size. v11.1 remains in the repo history. Real-learner evaluation pending a licensed corpus.',
  },
  {
    repo: 'grammar-cjk',
    lang: 'Chinese · Japanese · Korean',
    native: '中文 · 日本語 · 한국어',
    date: '2026-11-17',
    size: '464 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out + real-error benchmarks',
      metric: 'F0.5 (zh-Hans / zh-Hant)',
      score: '0.661 / 0.788',
      protocol:
        'Strict span scorer with character-level CJK comparison; 254 + 253 held-out single-error sentences, precision 0.66 / 0.77. Decoded from the shipped artifact, 4 rounds, zero-confidence gate.',
    },
    note: 'One shared model across three scripts. Real-error slices: NLPCC-zh 0.111, CSCD-zh 0.349, Korean held-out 0.129, Japanese held-out (JWTD) 0.319. This wave trades some zh-Hant held-out recall (the previous weights measured 0.852 on the same slice under the identical pipeline) for large gains on every real-error slice — Japanese +0.18, CSCD-zh +0.12.',
  },
  {
    repo: 'grammar-ko',
    lang: 'Korean',
    native: '한국어',
    date: '2026-11-25',
    size: '264 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out single-error benchmark',
      metric: 'F0.5',
      score: '0.5558',
      comparison:
        '4.3× the grammar-cjk Korean weights (0.129) on the same 1,582-sentence slice',
      protocol:
        'Strict span scorer; the same fixed 1,582 held-out sentences (643 gold edits), decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.6378, R 0.367).',
    },
    note: 'deberta-v3-base rung: +0.16 F0.5 (+41%) over the v1 mdeberta weights (0.394, remain in repo history) at a similar size — recall 2.3× (0.16 → 0.367) at equal precision. Same balanced corruption-pack lineage (359,212 pairs; particle swaps, attested conjugation swaps, homophone confusables; seed 20261123), 3-round schedule, fp16 weight storage.',
  },
  {
    repo: 'grammar-ur',
    lang: 'Urdu',
    native: 'اردو',
    date: '2026-11-21',
    size: '184 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.9137',
      protocol:
        'Strict span scorer; 1,500 held-out single-error sentences, precision 0.96, recall 0.76. Decoded from this exact artifact through the SpmBpe serving path, 1 round; the deberta encoder replaces the mdeberta v2 (0.640, 420 MB) at a third of the size. Ruby product surface on the same artifact: 0.8377 (MIN_CONFIDENCE-calibrated at 0.7 — +10.5pt, this encoder needs thresholding).',
    },
    capabilities: { gec: true, spell: false, rules: true },
    perf: { ms_per_sentence: 446, rounds: 1, peak_rss_mb: 1061 },
    note: "Urdu v3 (deberta-v3-base, fp16 pruned). Trained on a synthetic corruption pack derived from the CLE Urdu Digest Corpus 1M and CLE Urdu WordNet (Ribose⇄CLE license); released after a MEASURED Clause 16(e) run — zero verbatim corpus reproductions at the 25-word threshold over 200 held-in documents, membership AUC 0.529 / attack success 0.0%, no completion surface, zero tokenizer leakage. v2 (mdeberta) remains in repo history. Spelling dictionary planned separately (kotoshu/dictionaries ur/, compiled-package shape per Schedule C).",
  },
  {
    repo: 'grammar-pt',
    lang: 'Portuguese',
    native: 'Português',
    date: '2026-11-24',
    size: '196 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.7902',
      protocol:
        'Strict span scorer; the same fixed 1,467 held-out single-error sentences across six balanced classes, decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.9819, R 0.4438).',
    },
    note: 'deberta-v3-base rung: +0.22 F0.5 (+38%) over the wave-1 mdeberta weights (0.571, remain in repo history) at under half the shipped size. Same balanced corruption-pack recipe (seed 20261123), 3-round schedule, fp16 weight storage.',
  },
  {
    repo: 'grammar-nl',
    lang: 'Dutch',
    native: 'Nederlands',
    date: '2026-11-23',
    size: '200 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.739',
      protocol:
        'Strict span scorer; the same fixed 1,458 held-out single-error sentences, decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.903, R 0.428).',
    },
    note: 'deberta-v3-base rung: +0.17 F0.5 (+31%) over the wave-2 mdeberta weights (0.565, remain in repo history) at under half the shipped size. Same balanced corruption-pack recipe (no diacritic class — Dutch orthography; seed 20261123), 3-round schedule, fp16 weight storage.',
  },
  {
    repo: 'grammar-pl',
    lang: 'Polish',
    native: 'Polski',
    date: '2026-11-23',
    size: '194 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.7698',
      protocol:
        'Strict span scorer; the same fixed 1,490 held-out single-error sentences across six balanced classes (including the full Polish diacritic set ą ć ę ł ń ó ś ź ż), decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.9794, R 0.4148).',
    },
    note: 'deberta-v3-base rung: +0.35 F0.5 (+84%) over the wave-2 mdeberta weights (0.418, remain in repo history) at under half the shipped size. Same balanced corruption-pack recipe (seed 20261123), 3-round schedule, fp16 weight storage with Cast-to-fp32 nodes.',
  },
  {
    repo: 'grammar-it',
    lang: 'Italian',
    native: 'Italiano',
    date: '2026-11-25',
    size: '267 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.8035',
      protocol:
        'Strict span scorer; the same fixed 1,468 held-out single-error sentences across six balanced classes (Italian accents à è é ì ò ù), decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.9633, R 0.483).',
    },
    note: 'deberta-v3-base rung: +0.43 F0.5 (+115%) over the wave-1 mdeberta weights (0.374, remain in repo history) at half the shipped size — recall 4.4× (0.11 → 0.483) at equal precision, the largest delta of the rung. Same balanced corruption-pack recipe (seed 20261123), 3-round schedule, fp16 weight storage.',
  },
  {
    repo: 'grammar-uk',
    lang: 'Ukrainian',
    native: 'Українська',
    date: '2026-11-24',
    size: '190 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.7401',
      protocol:
        'Strict span scorer; the same fixed 1,366 held-out single-error sentences (Cyrillic keyboard adjacency, і/ї/ґ swaps), decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.9551, R 0.3895).',
    },
    note: 'deberta-v3-base rung: +0.064 F0.5 (+9.5%) over the wave-2 mdeberta weights (0.676 — the highest bar on the shelf — remain in repo history) at under half the shipped size. Same balanced corruption-pack recipe (seed 20261123), 3-round schedule, fp16 weight storage.',
  },
  {
    repo: 'grammar-tr',
    lang: 'Turkish',
    native: 'Türkçe',
    date: '2026-11-24',
    size: '192 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.7526',
      protocol:
        'Strict span scorer; the same fixed 1,485 held-out single-error sentences (Turkish-Q layout adjacency, ç ğ ı ö ş ü diacritics), decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.9614, R 0.4027).',
    },
    note: 'deberta-v3-base rung: +0.156 F0.5 (+26%) over the wave-2 mdeberta weights (0.597, remain in repo history) at under half the shipped size. Same balanced corruption-pack recipe (seed 20261123), 3-round schedule, fp16 weight storage.',
  },
  {
    repo: 'grammar-sr',
    lang: 'Serbian',
    native: 'Српски',
    date: '2026-11-24',
    size: '189 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.739',
      protocol:
        'Strict span scorer; the same fixed 1,361 held-out single-error sentences (Serbian Cyrillic layout adjacency — ђ љ њ ћ џ), decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.963, R 0.3828).',
    },
    note: 'deberta-v3-base rung: +0.23 F0.5 (+45%) over the wave-2 mdeberta weights (0.509, remain in repo history) at under half the shipped size. Same balanced corruption-pack recipe (seed 20261123), 3-round schedule, fp16 weight storage.',
  },
  {
    repo: 'grammar-el',
    lang: 'Greek',
    native: 'Ελληνικά',
    date: '2026-11-23',
    size: '183 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.6471',
      protocol:
        'Strict span scorer; the same fixed 1,486 held-out single-error sentences (Greek layout adjacency, ά έ ή ί ό ύ ώ accents), decoded from this exact artifact through the SpmBpe serving path, 1 round (P 0.9349, R 0.29).',
    },
    note: 'deberta-v3-base rung: +0.28 F0.5 (+76%) over the wave-2 mdeberta weights (0.367, remain in repo history) at under half the shipped size. Same balanced corruption-pack recipe (6 Greek classes, licensed hunspell vocabulary, seed 20261123), 3-round schedule, fp16 weight storage with Cast-to-fp32 nodes.',
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
