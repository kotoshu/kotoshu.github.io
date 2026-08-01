// Kotoshu playground — server-backed MVP per TODO.impl/63-web-playground-wasm.md
// (spike failed; WASM-native path documented as future target).

const $ = (sel) => document.querySelector(sel);
const editor = $("#editor");
const serverUrlInput = $("#server-url");
const languageSelect = $("#language");
const healthBtn = $("#health-btn");
const statusSpan = $("#status");
const diagnosticsList = $("#diagnostics");
const diagCount = $("#diag-count");
const emptyMsg = $("#empty");
const rowTemplate = $("#diag-row-template");

let debounceTimer = null;
let lastResults = [];
let currentServerUrl = "";

function setStatus(text, kind = "") {
  statusSpan.textContent = text;
  statusSpan.classList.remove("ok", "err");
  if (kind) statusSpan.classList.add(kind);
}

function serverUrl() {
  return serverUrlInput.value.replace(/\/+$/, "");
}

async function refreshLanguages() {
  currentServerUrl = serverUrl();
  const prev = languageSelect.value;
  try {
    const resp = await fetch(`${currentServerUrl}/v1/languages`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const cached = data.cached || [];
    languageSelect.innerHTML = "";
    const autoOpt = document.createElement("option");
    autoOpt.value = "auto";
    autoOpt.textContent = "auto (detect)";
    languageSelect.appendChild(autoOpt);
    for (const lang of cached) {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = lang;
      languageSelect.appendChild(opt);
    }
    if (cached.includes(prev) || prev === "auto") languageSelect.value = prev;
    else languageSelect.value = "auto";
    setStatus(`ready (${cached.length} lang)`, "ok");
  } catch (err) {
    setStatus(`cannot reach ${currentServerUrl}: ${err.message}`, "err");
  }
}

async function runHealthCheck() {
  currentServerUrl = serverUrl();
  try {
    const resp = await fetch(`${currentServerUrl}/v1/health`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const ready = Object.entries(data.ready || {})
      .map(([k, v]) => `${k}=${v ? "ok" : "—"}`)
      .join(" ");
    setStatus(`healthy: ${ready}`, "ok");
  } catch (err) {
    setStatus(`health check failed: ${err.message}`, "err");
  }
}

async function checkText() {
  const text = editor.value;
  if (!text.trim()) {
    lastResults = [];
    renderDiagnostics([]);
    return;
  }
  currentServerUrl = serverUrl();
  const lang = languageSelect.value === "auto" ? null : languageSelect.value;

  try {
    const resp = await fetch(`${currentServerUrl}/v1/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: lang || "en" }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    lastResults = data.errors || [];
    renderDiagnostics(lastResults);
    setStatus(`${lastResults.length} error(s)`, lastResults.length ? "err" : "ok");
  } catch (err) {
    setStatus(`check failed: ${err.message}`, "err");
  }
}

function renderDiagnostics(errors) {
  diagCount.textContent = String(errors.length);
  diagCount.classList.toggle("zero", errors.length === 0);
  diagnosticsList.innerHTML = "";
  emptyMsg.style.display = errors.length === 0 ? "block" : "none";

  errors.forEach((err) => {
    const node = rowTemplate.content.firstElementChild.cloneNode(true);
    const wordBtn = node.querySelector("button.word");
    wordBtn.textContent = err.word;
    wordBtn.title = `at offset ${err.position ?? "?"}`;
    wordBtn.addEventListener("click", () => highlight(err));

    const sugSpan = node.querySelector(".suggestions");
    err.suggestions.slice(0, 5).forEach((sug) => {
      const b = document.createElement("button");
      b.textContent = sug.word;
      b.title = `confidence=${(sug.confidence * 100).toFixed(0)}% source=${sug.source}`;
      b.addEventListener("click", () => applyFix(err, sug.word));
      sugSpan.appendChild(b);
    });
    diagnosticsList.appendChild(node);
  });
}

function applyFix(err, replacement) {
  const start = err.position ?? 0;
  const end = start + err.word.length;
  editor.value = editor.value.slice(0, start) + replacement + editor.value.slice(end);
  scheduleCheck();
}

function highlight(err) {
  editor.focus();
  const start = err.position ?? 0;
  const end = start + err.word.length;
  editor.setSelectionRange(start, end);
}

function scheduleCheck() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(checkText, 400);
}

editor.addEventListener("input", scheduleCheck);
serverUrlInput.addEventListener("change", refreshLanguages);
languageSelect.addEventListener("change", scheduleCheck);
healthBtn.addEventListener("click", runHealthCheck);

// initial load
refreshLanguages().then(() => scheduleCheck());
