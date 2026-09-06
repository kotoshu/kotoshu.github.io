// Semantic candidate generation — the merge half of the playground's
// semantic layer.
//
// The dictionary sweep can only rank candidates that already look like
// the misspelling; the wasm engine's semanticSuggest (0.3.0 surface)
// asks the mini embedding tier for the nearest VOCABULARY words to the
// typed word — an out-of-vocabulary typo embeds through its character
// n-grams, so the intended word often comes back as top-1 outright
// ("catt" → cat at cosine 1.0). This module folds those generated
// neighbors into the dictionary candidates ahead of the existing
// context rerank, so ordering stays the rerank's job.
//
// Kept pure (no worker, no wasm imports): the merge is exactly the kind
// of logic that deserves a unit check, and scripts/semantic_merge_check.mjs
// drives this file directly.

/** A semanticSuggest row — the wasm pair of `{ word, score }`. */
export interface SemanticNeighbor {
  word: string
  score: number
}

/** The suggestion-row shape the engine returns and the UI renders. */
export interface CandidateSuggestion {
  word: string
  distance: number
  confidence: number
  source: string
}

/** How many neighbors the semantic layer asks the model for. */
export const SEMANTIC_SUGGEST_K = 4

/**
 * Fold model-generated neighbors into dictionary candidates.
 *
 * Dedupe is case-insensitive with dictionary rows winning (their
 * confidence is the engine's own, their source names the strategy that
 * produced them); generated rows are labeled `source: 'semantic'` and
 * carry the cosine as confidence clamped to `[0, 1]` so the existing
 * context boost adjusts them exactly as it adjusts dictionary rows.
 * `distance` is 0 — there is no edit distance to a generated word.
 * Dictionary rows come first, so with the semantic layer off (or the
 * engine predating semanticSuggest, `neighbors` null) the merged list
 * is the dictionary list verbatim.
 */
export function mergeSemanticCandidates(
  dictionary: CandidateSuggestion[],
  neighbors: SemanticNeighbor[] | null,
): CandidateSuggestion[] {
  if (!neighbors || neighbors.length === 0) return dictionary
  const seen = new Set(dictionary.map((row) => row.word.toLowerCase()))
  const merged = dictionary.slice()
  for (const neighbor of neighbors) {
    const key = neighbor.word.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    merged.push({
      word: neighbor.word,
      distance: 0,
      confidence: Math.min(1, Math.max(0, neighbor.score)),
      source: 'semantic',
    })
  }
  return merged
}
