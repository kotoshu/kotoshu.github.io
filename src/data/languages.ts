export interface FullLanguage {
  code: string
  name: string
  native: string
  keyboards: string
}

export const FULL_LANGUAGES: FullLanguage[] = [
  { code: 'ca', name: 'Catalan', native: 'Català', keyboards: 'Catalan-QWERTY' },
  { code: 'cs', name: 'Czech', native: 'Čeština', keyboards: 'Czech-QWERTZ' },
  { code: 'da', name: 'Danish', native: 'Dansk', keyboards: 'Danish-QWERTY' },
  { code: 'de', name: 'German', native: 'Deutsch', keyboards: 'QWERTZ' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', keyboards: 'Greek-Phonetic' },
  { code: 'en', name: 'English', native: 'English', keyboards: 'QWERTY' },
  { code: 'es', name: 'Spanish', native: 'Español', keyboards: 'QWERTY' },
  { code: 'fr', name: 'French', native: 'Français', keyboards: 'AZERTY' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', keyboards: 'Hungarian-QWERTZ' },
  { code: 'it', name: 'Italian', native: 'Italiano', keyboards: 'Italian-QWERTY' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', keyboards: 'Dutch-QWERTY' },
  { code: 'pl', name: 'Polish', native: 'Polski', keyboards: 'Polish-QWERTY' },
  { code: 'pt', name: 'Portuguese', native: 'Português', keyboards: 'QWERTY' },
  { code: 'ro', name: 'Romanian', native: 'Română', keyboards: 'Romanian-QWERTY' },
  { code: 'ru', name: 'Russian', native: 'Русский', keyboards: 'JCUKEN' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', keyboards: 'Swedish-QWERTY' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', keyboards: 'Turkish-Q' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', keyboards: 'Ukrainian-JCUKEN' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', keyboards: 'Vietnamese-QWERTY' },
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

export interface PlaygroundLanguage {
  code: string
  native: string
  /** Approximate aff+dic download size; shown for the largest dictionaries. */
  mb?: string
}

/** Languages the browser playground serves: every Hunspell dictionary
 *  under ~5 MB (aff + dic, measured against the CDN pin in
 *  engine-worker.ts) minus CJK — ja and zh have no Hunspell files; their
 *  checking rides the gem tokenizer — and minus the over-budget giants
 *  (he 5.8, nb 5.4, tr 9.4, uk 8.7, ko 14, el 19 MB), which stay
 *  gem-only until the CDN story changes. Everything loads the same
 *  staged files the gem downloads at setup. Dictionary-only behavior —
 *  no model in wasm yet. */
export const PLAYGROUND_LANGUAGES: PlaygroundLanguage[] = [
  { code: 'bg', native: 'Български' },
  { code: 'ca', native: 'Català' },
  { code: 'cs', native: 'Čeština', mb: '3.8 MB' },
  { code: 'cy', native: 'Cymraeg' },
  { code: 'da', native: 'Dansk', mb: '3.8 MB' },
  { code: 'de', native: 'Deutsch' },
  { code: 'en', native: 'English' },
  { code: 'es', native: 'Español' },
  { code: 'et', native: 'Eesti', mb: '4.7 MB' },
  { code: 'fr', native: 'Français' },
  { code: 'ga', native: 'Gaeilge' },
  { code: 'hr', native: 'Hrvatski' },
  { code: 'hu', native: 'Magyar', mb: '4.0 MB' },
  { code: 'hy', native: 'Հայերեն' },
  { code: 'is', native: 'Íslenska' },
  { code: 'it', native: 'Italiano' },
  { code: 'ka', native: 'ქართული', mb: '3.9 MB' },
  { code: 'lt', native: 'Lietuvių' },
  { code: 'lv', native: 'Latviešu' },
  { code: 'mk', native: 'Македонски' },
  { code: 'nl', native: 'Nederlands' },
  { code: 'nn', native: 'Nynorsk', mb: '3.4 MB' },
  { code: 'pl', native: 'Polski', mb: '5.0 MB' },
  { code: 'pt', native: 'Português', mb: '5.5 MB' },
  { code: 'ro', native: 'Română' },
  { code: 'ru', native: 'Русский', mb: '3.5 MB' },
  { code: 'sk', native: 'Slovenčina', mb: '3.6 MB' },
  { code: 'sl', native: 'Slovenščina', mb: '3.1 MB' },
  { code: 'sr', native: 'Српски', mb: '4.4 MB' },
  { code: 'sr-Latn', native: 'Srpski latinica' },
  { code: 'sv', native: 'Svenska' },
  { code: 'vi', native: 'Tiếng Việt' },
]

/** Languages with a semantic model in the models registry — the exact
 *  roster of models-fasttext-onnx registry v1.2.0 (54 languages x 3
 *  tiers, 162 registry resources; unique language codes extracted from
 *  its kotoshu://models/<lang>/<tier> resource keys). The gem resolves
 *  models registry-driven at setup time, so this list is presentation
 *  truth, not engine truth. */
export const MODEL_LANGUAGES: string[] = [
  'ar', 'bg', 'br', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es',
  'et', 'eu', 'fa', 'fr', 'fy', 'ga', 'gd', 'gl', 'he', 'hr', 'hu', 'hy',
  'ia', 'id', 'is', 'it', 'ja', 'ka', 'ko', 'la', 'lb', 'lt', 'lv', 'mk',
  'mn', 'ne', 'nl', 'nn', 'oc', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr',
  'sv', 'tk', 'tr', 'uk', 'vi', 'zh',
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
 *  languages those are el, en, it, ru, and sv; the rest rank via
 *  dictionary and model until a list is published. */
export const KELLY_LANGUAGES: string[] = ['ar', 'el', 'en', 'it', 'no', 'ru', 'sv', 'zh']

export const FULL_FEATURE_INCLUDES = [
  'Hunspell dictionary with affix morphology and compounding',
  'FastText ONNX embedding model for semantic reranking',
  'Keyboard-layout proximity suggestions across 19 layouts (QWERTY, QWERTZ, AZERTY, JCUKEN, Turkish-Q, Greek-Phonetic, and the Nordic and programmer Latin grids)',
  'Kelly frequency ranking where a list is published (English, Greek, Italian, Russian, Swedish)',
  'Automatic detection from document content',
]
