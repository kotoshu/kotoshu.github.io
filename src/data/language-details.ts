export interface LanguageDetail {
  code: string
  tagline: string
  sample: { text: string; corrections: { from: string; to: string }[] }
  variants: string[]
  hasModel: boolean
  notes: string[]
}

export const LANGUAGE_DETAILS: Record<string, LanguageDetail> = {
  de: {
    code: 'de',
    tagline: 'Compounds and umlauts, tamed',
    sample: {
      text: 'Guten Teg, wie geth es Ihnen?',
      corrections: [
        { from: 'Teg', to: 'Tag' },
        { from: 'geth', to: 'geht' },
      ],
    },
    variants: ['de-AT', 'de-CH'],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the German QWERTZ layout, including the umlaut and eszett keys.',
      'The fastText ONNX model fasttext.de.onnx is available for semantic reranking of suggestions.',
      'de-AT and de-CH dictionaries are staged for Austrian and Swiss orthography.',
      'No Kelly frequency list is published for German yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  en: {
    code: 'en',
    tagline: "The default dictionary for the world's most-spelled language",
    sample: {
      text: 'I recieved your seperate report yesterday.',
      corrections: [
        { from: 'recieved', to: 'received' },
        { from: 'seperate', to: 'separate' },
      ],
    },
    variants: ['en-AU', 'en-CA', 'en-GB', 'en-ZA'],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the QWERTY layout, which is also the fallback for all other languages.',
      'Kelly frequency tiers rank suggestions by usage (7,549 CEFR-annotated words from the Kelly Project).',
      'The fastText ONNX model fasttext.en.onnx is available for semantic reranking of suggestions.',
      'en-AU, en-CA, en-GB, and en-ZA dictionaries cover Australian, Canadian, British, and South African spelling.',
    ],
  },
  es: {
    code: 'es',
    tagline: 'Every accent and ñ in its place',
    sample: {
      text: 'Gracias por su mensage, haremos el envio manana.',
      corrections: [
        { from: 'mensage', to: 'mensaje' },
        { from: 'envio', to: 'envío' },
        { from: 'manana', to: 'mañana' },
      ],
    },
    variants: [
      'es-AR',
      'es-BO',
      'es-CL',
      'es-CO',
      'es-CR',
      'es-CU',
      'es-DO',
      'es-EC',
      'es-GT',
      'es-HN',
      'es-MX',
      'es-NI',
      'es-PA',
      'es-PE',
      'es-PH',
      'es-PR',
      'es-PY',
      'es-SV',
      'es-US',
      'es-UY',
      'es-VE',
    ],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the QWERTY layout.',
      'The fastText ONNX model fasttext.es.onnx is available for semantic reranking of suggestions.',
      'Twenty-one regional dictionaries cover Latin America plus es-PH and es-US.',
      'No Kelly frequency list is published for Spanish yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  fr: {
    code: 'fr',
    tagline: 'Cedillas and accents, nothing out of place',
    sample: {
      text: 'Merci beaucoups, nous avons bien recu votre message.',
      corrections: [
        { from: 'beaucoups', to: 'beaucoup' },
        { from: 'recu', to: 'reçu' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the French AZERTY layout.',
      'The fastText ONNX model fasttext.fr.onnx is available for semantic reranking of suggestions.',
      'French ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for French yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  pt: {
    code: 'pt',
    tagline: 'One dictionary for both sides of the Atlantic',
    sample: {
      text: 'Obrigado pela mensagem, vamos analizar o relatorio amanha.',
      corrections: [
        { from: 'analizar', to: 'analisar' },
        { from: 'relatorio', to: 'relatório' },
        { from: 'amanha', to: 'amanhã' },
      ],
    },
    variants: ['pt-BR', 'pt-PT'],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the QWERTY layout, covering pt, pt-BR, and pt-PT.',
      'The fastText ONNX model fasttext.pt.onnx is available for semantic reranking of suggestions.',
      'pt-BR and pt-PT dictionaries cover Brazilian and European Portuguese.',
      'No Kelly frequency list is published for Portuguese yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  ru: {
    code: 'ru',
    tagline: 'Cyrillic spelling, checked letter by letter',
    sample: {
      text: 'Здраствуйте, извените за задержку с ответом.',
      corrections: [
        { from: 'Здраствуйте', to: 'Здравствуйте' },
        { from: 'извените', to: 'извините' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the JCUKEN layout, the standard Cyrillic arrangement.',
      'Kelly frequency tiers rank suggestions by usage, from the Kelly Project CEFR vocabulary lists.',
      'The fastText ONNX model fasttext.ru.onnx is available for semantic reranking of suggestions.',
      'Russian ships a single base dictionary; no regional variants are staged yet.',
    ],
  },
}
