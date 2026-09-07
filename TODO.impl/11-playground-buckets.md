# Plan 11 (site) — The playground semantic layer passes bucket bytes

## Why
@kotoshu/wasm 0.4.0 loadModel accepts an optional third bucketsBytes and
semanticSuggest then reaches OOV words through hashed bucket rows — but the
worker never fetches kotoshu://models/{lang}/buckets, so the live playground
gains nothing from the en/de tables already mirrored.

## Work (site repo)
1. enableSemantic: after the mini pair, resolve {lang}/buckets in the
   registry; when present, fetch (phase semantic, kind {lang} buckets) and
   call loadModel(model, vocab, buckets). Absent or failed fetch degrades
   to the two-arg call exactly as today.
2. Readout/status: semantic-ready line appends buckets KiB when attached.
3. Specimen note in the page copy: the semantic switch now also generates
   candidates for out-of-vocabulary typos via bucket rows (en/de first).

## Verification
CDP cold run: registry lookup, bucket fetch progress label, Teh gains a
model-generated candidate; de spot check; language without buckets (e.g.
fr) still enables semantic cleanly.

## Status
Executed 2026-09-07 — site PR (playground buckets attach).
