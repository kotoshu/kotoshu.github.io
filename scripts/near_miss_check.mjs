#!/usr/bin/env node
// Unit-style check of the near-miss candidate generation (playground
// side): drives src/components/playground/near-miss.ts directly — no
// wasm, no worker, no network, no dependencies. This pins the STOPGAP
// contract: transpositions and substitutions are enumerated, vetted by
// correct(), deduped against dictionary rows, and capped — the two
// flagship cases are "Teh" → "The" (swap) and "definately" →
// "definitely" (substitution over the suggestion letters).
//
// Usage: node scripts/near_miss_check.mjs
import {
  adjacentTranspositions,
  singleSubstitutions,
  mergeNearMissCandidates,
} from '../src/components/playground/near-miss.ts'

let failures = 0
let assertions = 0

function assert(label, condition) {
  assertions += 1
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}`)
  if (!condition) failures += 1
}

function assertEqual(label, expected, actual) {
  const same = Object.is(expected, actual) || JSON.stringify(expected) === JSON.stringify(actual)
  assert(`${label} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`, same)
}

// Transpositions: exactly one per adjacent pair, word's own letters only.
assertEqual(
  'Teh swaps to its two adjacent rearrangements',
  ['eTh', 'The'],
  adjacentTranspositions('Teh'),
)
assertEqual('a two-letter word has one swap', ['ba'], adjacentTranspositions('ab'))
assertEqual('a one-letter word has none', [], adjacentTranspositions('a'))

// Substitutions: the alphabet unions the word, ASCII letters, and the
// letters the dictionary candidates carry ("definately" borrows the i
// from "indefinably").
const subs = singleSubstitutions('definately', 'indefinably')
assert('substituting the sixth letter yields definitely', subs.includes('definitely'))
assert('substitution count is bounded by length x alphabet', subs.length <= 10 * 26)

const dictRow = (word) => ({ word, distance: 1, confidence: 0.5, source: 'edit_distance' })

// The flagship merge: "Teh" with the 0.2.0 dictionary rows eh/meh/neh,
// correct() accepting "The".
const merged = mergeNearMissCandidates(
  'Teh',
  [dictRow('eh'), dictRow('meh'), dictRow('neh')],
  (candidate) => candidate === 'The',
)
assertEqual(
  'The joins after the dictionary rows',
  ['eh', 'meh', 'neh', 'The'],
  merged.map((row) => row.word),
)
assertEqual('the swap row is labeled edit1', 'edit1', merged[3].source)
assertEqual('the swap row is distance 1', 1, merged[3].distance)
assertEqual('the swap row carries top confidence', 1, merged[3].confidence)

// "definately" → "definitely" via the suggestion-letter alphabet.
const mergedSub = mergeNearMissCandidates(
  'definately',
  [dictRow('definable'), dictRow('indefinably'), dictRow('define')],
  (candidate) => candidate === 'definitely',
)
assert(
  'definitely joins via substitution',
  mergedSub.some((row) => row.word === 'definitely' && row.source === 'edit1'),
)

// Dedupe: a near-miss word the dictionary already returned must not
// double up — with correct() always true, other candidates do join, but
// "the" itself appears exactly once, as the dictionary row.
const deduped = mergeNearMissCandidates(
  'teh',
  [dictRow('the')],
  () => true,
)
assertEqual('the appears exactly once', 1, deduped.filter((row) => row.word === 'the').length)
assertEqual('the survives as the dictionary row', 'edit_distance', deduped.find((row) => row.word === 'the').source)

// The word itself (case-swapped) is never offered.
const selfCase = mergeNearMissCandidates('Teh', [], (candidate) => candidate === 'tEh' || candidate === 'TEh')
assertEqual('case variants of the word are not candidates', 0, selfCase.length)

// The cap bounds the tail.
const capped = mergeNearMissCandidates(
  'abcdefgh',
  [],
  () => true,
)
assertEqual('the near-miss tail is capped at 4', 4, capped.length)

// Nothing correct nearby: the dictionary list verbatim.
assertEqual(
  'no near misses returns the dictionary list verbatim',
  [dictRow('x')],
  mergeNearMissCandidates('qqqq', [dictRow('x')], () => false),
)

console.log(`${assertions} assertions, ${failures} failures`)
process.exit(failures === 0 ? 0 : 1)
