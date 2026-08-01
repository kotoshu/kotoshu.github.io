# Kotoshu playground

Live at `kotoshu.github.io/playground/`. Server-backed MVP per
`TODO.impl/63-web-playground-wasm.md`.

## Status

MVP. Browser playground that points at a configurable Kotoshu HTTP
server (`/v1/check`, `/v1/languages`, `/v1/health`). Diagnostics render
inline; clicking a suggestion rewrites the editor.

The WASM-native build (ruby.wasm + bundled mini-dictionary, fully
client-side) is the eventual target per plan 63. The
`spike task: verify Kotoshu loads in ruby.wasm at all` is the
prerequisite — until that's confirmed, the server-backed MVP is the
deployable surface.

## Run locally

1. Start a Kotoshu server (`kotoshu-server/`):

   ```bash
   cd ../kotoshu-server && bundle exec ruby exe/kotoshu-server
   ```

2. Serve the playground over HTTP (CORS requires a real origin):

   ```bash
   python3 -m http.server --directory . 8000
   ```

3. Open <http://localhost:8000/> and verify `Server URL` points at
   <http://localhost:9292>.

4. Click `Health check`. The status line should turn green.

## CORS

The server doesn't ship CORS headers by default. For local playground
testing, add a CORS-allowing middleware to the server. For production,
proxy the playground through the same origin (e.g., serve it from
the server itself, or via a reverse proxy).

## WASM-native spike (TODO)

The plan 63 spike task: bundle `kotoshu` into ruby.wasm with a small
English dictionary (top 5K words) and load entirely in-browser. Steps:

1. Build a kotoshu WASM package via `ruby.wasm`'s `rbwasm` toolchain.
2. Strip code paths that touch `onnxruntime` / `suika` (they won't load
   in WASM — see plan 63 constraints).
3. Bundle a top-5K-words subset of the Hunspell `.dic` (subset to ~50KB
   gzipped vs. ~5MB).
4. Replace `fetch('/v1/check')` with in-process `Kotoshu.check` calls
   inside a Web Worker.
5. Service Worker for offline support.

Failure mode if Kotoshu doesn't load in ruby.wasm (File/IO constraints):
keep the server-backed MVP as the production path; document the
constraint in the README.

## License

BSD-2-Clause, same as Kotoshu.
