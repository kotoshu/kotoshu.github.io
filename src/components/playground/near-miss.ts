// Near-miss candidate generation — the stopgap half of the playground's
// suggestion quality, until @kotoshu/wasm 0.3.0 carries the engine-side
// Damerau sweep (gem PR #146 + its Rust port).
//
// The 0.2.0 dictionary sweep enumerates deletions and n-gram neighbors but
// never adjacent transpositions or single substitutions, so "Teh" misses
// "The" (a 1-step swap) and "definately" misses "definitely" (a 1-step
// substitution). Both classes can be enumerated cheaply here and vetted
// against the engine's own correct(), so the fix is visible today; when
// the pin moves to a release whose suggest() produces these rows itself,
// the dedupe below lets the engine rows win and this adds nothing.
//
// Kept pure (no worker, no wasm imports): scripts/near_miss_check.mjs
// drives this file directly.

/** The suggestion-row shape the engine returns and the UI renders. */
export interface CandidateSuggestion {
  word: string
  distance: number
  confidence: number
  source: string
}

const LATIN = 'abcdefghijklmnopqrstuvwxyz'

/**
 * All words one adjacent swap away: "Teh" → eTh, The.
 * Script-agnostic by construction — only the word's own characters move.
 */
export function adjacentTranspositions(word: string): string[] {
  const out: string[] = []
  for (let i = 0; i + 1 < word.length; i++) {
    out.push(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2))
  }
  return out
}

/**
 * All words one substituted letter away, over a letter set drawn from the
 * word itself, plain ASCII letters, and the letters the engine's own
 * candidates already use (for non-Latin scripts the returned candidates
 * carry the alphabet; "definately" borrows the i from "indefinably").
 */
export function singleSubstitutions(word: string, alphabet: string): string[] {
  const letters = new Set<string>((word + LATIN + alphabet).toLowerCase())
  const out: string[] = []
  for (let i = 0; i < word.length; i++) {
    for (const letter of letters) {
      if (letter === word[i]) continue
      out.push(word.slice(0, i) + letter + word.slice(i + 1))
    }
  }
  return out
}

/**
 * Vet near-miss candidates against the engine's correct() and fold the
 * survivors in after the dictionary rows: same shape, `source: 'edit1'`,
 * distance 1, confidence on par with the engine's distance-1 rows so the
 * context rerank orders them exactly as it orders engine candidates.
 * Case variants of the typed word are dropped — the dictionary is
 * case-insensitive for correctness, so a case swap alone is noise.
 */
export function mergeNearMissCandidates(
  word: string,
  dictionary: CandidateSuggestion[],
  isCorrect: (candidate: string) => boolean,
  max = 4,
): CandidateSuggestion[] {
  const known = new Set(dictionary.map((row) => row.word.toLowerCase()))
  known.add(word.toLowerCase())
  const alphabet = dictionary.map((row) => row.word).join('')
  const merged = dictionary.slice()
  for (const candidate of [
    ...adjacentTranspositions(word),
    ...singleSubstitutions(word, alphabet),
  ]) {
    if (merged.length - dictionary.length >= max) break
    const key = candidate.toLowerCase()
    if (key === word.toLowerCase() || known.has(key)) continue
    if (!isCorrect(candidate)) continue
    known.add(key)
    merged.push({ word: candidate, distance: 1, confidence: 1, source: 'edit1' })
  }
  return merged
}
