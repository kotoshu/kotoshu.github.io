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
    size: '451 MB',
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
    size: '452 MB',
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
    date: '2026-11-14',
    size: '436 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.422',
      protocol:
        'Strict span scorer with artifact guards; 812 held-out single-error sentences, precision 0.86, recall 0.14. Decode at margin gate 1.0, zero-confidence gate, 4 rounds — the measured serving law for this encoder.',
    },
    note: 'Trained on 182,031 rows: the 112,567 verified corruption pack + 69,464 GLM-5.3-Flash-verified corrections (exact-restore gate). +9.5% F0.5 over the previous Russian weights, precision +0.15 at equal recall. Real-learner evaluation pending a licensed corpus.',
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
    date: '2026-11-09',
    size: '356 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out single-error benchmark',
      metric: 'F0.5',
      score: '0.394',
      comparison:
        '3.1× the grammar-cjk Korean weights (0.129) on the same 1,582-sentence slice',
      protocol:
        'Strict span scorer; 1,582 held-out sentences, precision 0.61, recall 0.16. Decoded from this exact artifact at margin gate 1.0, rounds 4.',
    },
    note: 'Trained on 359,212 balanced corruption pairs (particle swaps, attested conjugation swaps, homophone confusables — uniformly drawn) over a Korean Wikipedia corpus. The balanced class design replaced the earlier skew that had trained merge/delete-heavy behavior into the CJK-line Korean weights.',
  },
  {
    repo: 'grammar-ur',
    lang: 'Urdu',
    native: 'اردو',
    date: '2026-11-18',
    size: '420 MB',
    status: 'published',
    benchmark: {
      name: 'Held-out corruption benchmark',
      metric: 'F0.5',
      score: '0.640',
      protocol:
        'Strict span scorer; 1,500 held-out single-error sentences across six balanced classes (homophone letter sets, Arabic↔Urdu confusions, keyboard adjacency, transpositions, space joins, real-word swaps), precision 0.68, recall 0.52. Decoded from this exact artifact at the zero-confidence gate, 4 rounds.',
    },
    note: "First Urdu model. Trained on a synthetic corruption pack derived from the CLE Urdu Digest Corpus 1M and CLE Urdu WordNet (Ribose⇄CLE license); released after passing the agreement's Clause 16(e) extraction/memorization testing — zero novel corpus reproductions, no membership signal (AUC 0.485), no tokenizer leakage. Spelling dictionary packaged separately (kotoshu/dictionaries ur/).",
  },
]
