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
  ca: {
    code: 'ca',
    tagline: 'Cedillas and geminated els, in their place',
    sample: {
      text: 'Gràcies pel teu missatge, aixo tambe és informacio molt important.',
      corrections: [
        { from: 'aixo', to: 'això' },
        { from: 'tambe', to: 'també' },
        { from: 'informacio', to: 'informació' },
      ],
    },
    variants: ['ca-valencia'],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Catalan-QWERTY grid — the Spanish physical layout, where à é í ó ú ç and the geminated l·l are dead-key sequences.',
      'The fastText ONNX model fasttext.ca.onnx is available for semantic reranking of suggestions.',
      'The ca-valencia dictionary is staged for Valencian orthography.',
      'No Kelly frequency list is published for Catalan yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  cs: {
    code: 'cs',
    tagline: 'Háčeks and čárkas, each on the right letter',
    sample: {
      text: 'Dobrý den, dekuji za zpravu a odpoved.',
      corrections: [
        { from: 'dekuji', to: 'děkuji' },
        { from: 'zpravu', to: 'zprávu' },
        { from: 'odpoved', to: 'odpověď' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Czech-QWERTZ grid — z and y swapped, with háčky and čárky as dead keys.',
      'The fastText ONNX model fasttext.cs.onnx is available for semantic reranking of suggestions.',
      'Czech ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Czech yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  da: {
    code: 'da',
    tagline: 'The å æ ø keys are real keys',
    sample: {
      text: 'Tak for din besked, vi har alerede laest den og svarer imorgen.',
      corrections: [
        { from: 'alerede', to: 'allerede' },
        { from: 'laest', to: 'læst' },
        { from: 'imorgen', to: 'i morgen' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Danish-QWERTY grid, where real å æ ø keys replace the US bracket and semicolon keys.',
      'The fastText ONNX model fasttext.da.onnx is available for semantic reranking of suggestions.',
      'Danish ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Danish yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  el: {
    code: 'el',
    tagline: 'Tonos and final sigma, set correctly',
    sample: {
      text: 'Ευχαριστω για το μηνυμα σας, θα απαντησουμε συντομα.',
      corrections: [
        { from: 'Ευχαριστω', to: 'Ευχαριστώ' },
        { from: 'μηνυμα', to: 'μήνυμα' },
        { from: 'απαντησουμε', to: 'απαντήσουμε' },
        { from: 'συντομα', to: 'σύντομα' },
      ],
    },
    variants: ['el-polyton'],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Greek-Phonetic grid, mirrored from the models-repo eval harness.',
      'The Greek tokenizer and normalizer handle the Greek script natively — final sigma folds correctly and accents normalize before lookup.',
      'The fastText ONNX model fasttext.el.onnx is available for semantic reranking of suggestions.',
      'Kelly frequency tiers rank suggestions by usage, from the Kelly Project CEFR vocabulary lists.',
      'The el-polyton dictionary is staged for polytonic orthography.',
    ],
  },
  hu: {
    code: 'hu',
    tagline: 'Long ő ű and double accents, tamed',
    sample: {
      text: 'Koszonom az uzenetet, hamarosan valaszolunk.',
      corrections: [
        { from: 'Koszonom', to: 'Köszönöm' },
        { from: 'uzenetet', to: 'üzenetet' },
        { from: 'valaszolunk', to: 'válaszolunk' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Hungarian-QWERTZ grid, with the long vowels ő and ű as dead-key sequences.',
      'The fastText ONNX model fasttext.hu.onnx is available for semantic reranking of suggestions.',
      'Hungarian ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Hungarian yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  it: {
    code: 'it',
    tagline: 'Accents only where they belong',
    sample: {
      text: 'Grazie per il mesaggio, le risponderemo al piu presto.',
      corrections: [
        { from: 'mesaggio', to: 'messaggio' },
        { from: 'piu', to: 'più' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Italian-QWERTY grid — the US physical layout, with à è é ì ò ù as dead keys.',
      'The fastText ONNX model fasttext.it.onnx is available for semantic reranking of suggestions.',
      'Italian ships a single base dictionary; no regional variants are staged yet.',
      'Kelly frequency tiers rank suggestions by usage, from the Kelly Project CEFR vocabulary lists.',
    ],
  },
  nl: {
    code: 'nl',
    tagline: 'Old spellings caught, new ones kept',
    sample: {
      text: 'Dank u voor uw berigt, dit lijkt mij een practische oplossing.',
      corrections: [
        { from: 'berigt', to: 'bericht' },
        { from: 'practische', to: 'praktische' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Dutch-QWERTY grid — the US physical layout, with loanword accents as dead keys.',
      'The fastText ONNX model fasttext.nl.onnx is available for semantic reranking of suggestions.',
      'Dutch ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Dutch yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  pl: {
    code: 'pl',
    tagline: 'Nine diacritics, one alphabet',
    sample: {
      text: 'Dziekuje za wiadomosc, odpowiemy wkrotce.',
      corrections: [
        { from: 'Dziekuje', to: 'Dziękuję' },
        { from: 'wiadomosc', to: 'wiadomość' },
        { from: 'wkrotce', to: 'wkrótce' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Polish-QWERTY grid — the programmers layout, where ą ć ę ł ń ó ś ź ż are AltGr sequences.',
      'The fastText ONNX model fasttext.pl.onnx is available for semantic reranking of suggestions.',
      'Polish ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Polish yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  ro: {
    code: 'ro',
    tagline: 'Comma-below diacritics, no cedilla shortcuts',
    sample: {
      text: 'Multumesc pentru mesaj, vom raspunde foarte curand.',
      corrections: [
        { from: 'Multumesc', to: 'Mulțumesc' },
        { from: 'raspunde', to: 'răspunde' },
        { from: 'curand', to: 'curând' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Romanian-QWERTY grid — the US physical layout, with ă â î ș ț as AltGr sequences.',
      'The fastText ONNX model fasttext.ro.onnx is available for semantic reranking of suggestions.',
      'Romanian ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Romanian yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  sv: {
    code: 'sv',
    tagline: 'Å ä ö are real keys',
    sample: {
      text: 'Tack för ditt medelande, vi maste gora detta inom kort.',
      corrections: [
        { from: 'medelande', to: 'meddelande' },
        { from: 'maste', to: 'måste' },
        { from: 'gora', to: 'göra' },
      ],
    },
    variants: ['sv-FI'],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Swedish-QWERTY grid, where real å ä ö keys replace the US bracket and semicolon keys.',
      'The fastText ONNX model fasttext.sv.onnx is available for semantic reranking of suggestions.',
      'The sv-FI dictionary is staged for Finland Swedish orthography.',
      'Kelly frequency tiers rank suggestions by usage, from the Kelly Project CEFR vocabulary lists.',
    ],
  },
  tr: {
    code: 'tr',
    tagline: 'Dotless ı, dotted İ — case folding done right',
    sample: {
      text: 'Tesekkurler mesajiniz icin, en kisa zamanda cevap verecegiz.',
      corrections: [
        { from: 'Tesekkurler', to: 'Teşekkürler' },
        { from: 'icin', to: 'için' },
        { from: 'kisa', to: 'kısa' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Turkish-Q grid, the national Turkish layout with its own vowel row.',
      'The Turkish normalizer folds case correctly for the dotted and dotless i — İZMİR lowercases to izmir, ISTANBUL to ıstanbul.',
      'The fastText ONNX model fasttext.tr.onnx is available for semantic reranking of suggestions.',
      'Turkish ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Turkish yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  uk: {
    code: 'uk',
    tagline: 'Cyrillic on a Ukrainian grid',
    sample: {
      text: "Дякую за повідомленя, ми обовязково відповімо найближчим часом.",
      corrections: [
        { from: 'повідомленя', to: 'повідомлення' },
        { from: 'обовязково', to: "обов'язково" },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Ukrainian-JCUKEN grid, the dedicated layout with the ґ є і ї keys.',
      'The Cyrillic tokenizer keeps Ukrainian words whole, including the apostrophe used in names and words like обов’язково.',
      'The fastText ONNX model fasttext.uk.onnx is available for semantic reranking of suggestions.',
      'Ukrainian ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Ukrainian yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
  vi: {
    code: 'vi',
    tagline: 'Six tones, every mark in place',
    sample: {
      text: 'Cảm ơn bạn đã gửi tin, chúng tôi sẽ phản hồi rat som.',
      corrections: [
        { from: 'rat', to: 'rất' },
        { from: 'som', to: 'sớm' },
      ],
    },
    variants: [],
    hasModel: true,
    notes: [
      'Keyboard-proximity suggestions use the Vietnamese-QWERTY grid, where tone and vowel marks are typed as dead keys over ASCII letters.',
      'The fastText ONNX model fasttext.vi.onnx is available for semantic reranking of suggestions.',
      'Vietnamese ships a single base dictionary; no regional variants are staged yet.',
      'No Kelly frequency list is published for Vietnamese yet; frequency data is an optional resource, so checking works without it.',
    ],
  },
}
