export interface FullLanguage {
  code: string
  name: string
  native: string
  keyboards: string
}

export const FULL_LANGUAGES: FullLanguage[] = [
  { code: 'de', name: 'German', native: 'Deutsch', keyboards: 'QWERTZ' },
  { code: 'en', name: 'English', native: 'English', keyboards: 'QWERTY' },
  { code: 'es', name: 'Spanish', native: 'Español', keyboards: 'QWERTY' },
  { code: 'fr', name: 'French', native: 'Français', keyboards: 'AZERTY' },
  { code: 'pt', name: 'Portuguese', native: 'Português', keyboards: 'QWERTY' },
  { code: 'ru', name: 'Russian', native: 'Русский', keyboards: 'JCUKEN' },
]

export const FREQUENCY_LANGUAGES: { code: string; name: string }[] = [
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'el', name: 'Greek' },
  { code: 'it', name: 'Italian' },
  { code: 'no', name: 'Norwegian' },
  { code: 'sv', name: 'Swedish' },
]

export const LANGUAGE_STATS = {
  fullFeature: FULL_LANGUAGES.length,
  frequencyOnly: FREQUENCY_LANGUAGES.length,
  dictionariesStaged: 98,
  detectionLanguages: 176,
} as const

/** Languages with a semantic model in the models registry — mirror of
 *  models-fasttext-onnx registry v1.1.0 (22 languages x 3 tiers).
 *  The gem resolves models registry-driven at setup time, so this list
 *  is presentation truth, not engine truth. */
export const MODEL_LANGUAGES: string[] = [
  'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fr', 'hu', 'it', 'ja',
  'ko', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'tr', 'uk', 'vi', 'zh',
]

export const LANGUAGE_ROADMAP: { title: string; detail: string }[] = [
  {
    title: 'CJK morphological support',
    detail:
      'Japanese via the suika tokenizer, Chinese via confusion rules — a different paradigm than Hunspell lookup (gem plans 06 / 54).',
  },
  {
    title: 'RTL shaping-aware affixes',
    detail:
      'Arabic, Hebrew, Persian, Urdu with shaping-aware normalization (gem plans 07 / 55).',
  },
  {
    title: '≥ 30 wired language modules',
    detail:
      'Per-language tokenizer, normalizer, and keyboard modules composed from the 98 staged dictionaries (gem plan 04).',
  },
]

/** Languages with a published Kelly frequency list (frequency-list-kelly
 *  manifest: ar, el, en, it, no, ru, sv, zh). Among full-feature
 *  languages that is en and ru; the rest of the six rank via dictionary
 *  and model until a list is published. */
export const KELLY_LANGUAGES: string[] = ['ar', 'el', 'en', 'it', 'no', 'ru', 'sv', 'zh']

export const FULL_FEATURE_INCLUDES = [
  'Hunspell dictionary with affix morphology and compounding',
  'FastText ONNX embedding model for semantic reranking',
  'Keyboard-layout proximity suggestions (QWERTY / QWERTZ / AZERTY / JCUKEN)',
  'Kelly frequency ranking where a list is published (English, Russian)',
  'Automatic detection from document content',
]
