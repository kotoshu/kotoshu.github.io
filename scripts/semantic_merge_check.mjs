#!/usr/bin/env node
// Unit-style check of the semantic candidate merge (playground side):
// drives src/components/playground/semantic-merge.ts directly — no
// wasm, no worker, no network, no dependencies. The engine half is
// covered by kotoshu-rs scripts/wasm_node_smoke.mjs; this pins the
// MERGE contract the worker relies on (dedupe, labeling, clamping,
// dictionary-only passthrough).
//
// Usage: node scripts/semantic_merge_check.mjs   (or: npm run check:semantic)
import {
  mergeSemanticCandidates,
  SEMANTIC_SUGGEST_K,
} from '../src/components/playground/semantic-merge.ts'

let failures = 0
let assertions = 0

function assert(label, condition) {
  assertions += 1
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}`)
  if (!condition) failures += 1
}

function assertEqual(label, expected, actual) {
  const same = Object.is(expected, actual) || JSON.stringify(expected) === JSON.stringify(actual)
  assert(
    `${label} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`,
    same,
  )
}

const dictRow = (word, confidence = 0.5) => ({
  word,
  distance: 1,
  confidence,
  source: 'edit_distance',
})

// null/empty neighbors — the engine predates semanticSuggest, the layer
// is off, or nothing resolved: the dictionary list comes back verbatim.
const dictionary = [dictRow('helo', 0.6), dictRow('held', 0.4)]
assertEqual('null neighbors return the dictionary list', dictionary, mergeSemanticCandidates(dictionary, null))
assertEqual('empty neighbors return the dictionary list', dictionary, mergeSemanticCandidates(dictionary, []))

// The merge: generated rows are appended, labeled, and clamped.
const merged = mergeSemanticCandidates(dictionary, [
  { word: 'hello', score: 1.0 },
  { word: 'held', score: 0.9 },
  { word: 'hero', score: 0.4 },
  { word: 'hostile', score: -0.3 },
])
assertEqual(
  'the merged order: dictionary rows, then the new semantic rows',
  ['helo', 'held', 'hello', 'hero', 'hostile'],
  merged.map((row) => row.word),
)
assertEqual('a duplicate word does not double up (5 rows, not 6)', 5, merged.length)
assertEqual('the semantic row is labeled', 'semantic', merged[2].source)
assertEqual('cosine becomes confidence at full scale', 1, merged[2].confidence)
assertEqual('mid cosine passes through', 0.4, merged[3].confidence)
assertEqual('negative cosine clamps to 0', 0, merged[4].confidence)
assertEqual('generated rows carry no edit distance', 0, merged[2].distance)

// Case-insensitive dedupe with the dictionary row winning.
const cased = mergeSemanticCandidates([dictRow('hello')], [{ word: 'Hello', score: 1.0 }])
assertEqual('case-duplicate dedupes to the dictionary row', 1, cased.length)
assertEqual('the surviving row is the dictionary one', 'edit_distance', cased[0].source)

// Clamping high: a cosine above 1 (defensive) caps at 1.
const capped = mergeSemanticCandidates([], [{ word: 'hello', score: 1.5 }])
assertEqual('confidence caps at 1', 1, capped[0].confidence)

// Neighbor order is preserved within the generated tail.
const ordered = mergeSemanticCandidates(
  [],
  [
    { word: 'b', score: 0.9 },
    { word: 'a', score: 0.8 },
  ],
).map((row) => row.word)
assertEqual('generated rows keep neighbor order', ['b', 'a'], ordered)

// The worker asks the engine for exactly this many neighbors.
assertEqual('k is 4 (the playground contract)', 4, SEMANTIC_SUGGEST_K)

console.log(`${assertions} assertions, ${failures} failures`)
process.exit(failures === 0 ? 0 : 1)
