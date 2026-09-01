<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import MiniSearch from 'minisearch'

interface Entry {
  id: string
  url: string
  title: string
  section: string
  description: string
  keywords?: string
}

const open = ref(false)
const query = ref('')
const results = ref<Entry[]>([])
const loading = ref(false)
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

let miniSearch: MiniSearch<Entry> | null = null
let loaded = false

const QUICK_LINKS = [
  { title: 'Install & quickstart', url: '/install', section: 'Pages' },
  { title: 'The ecosystem', url: '/projects', section: 'Pages' },
  { title: 'Playground', url: '/playground', section: 'Pages' },
  { title: 'kotoshu on GitHub', url: 'https://github.com/kotoshu', section: 'Links' },
]

async function ensureIndex() {
  if (loaded) return
  loading.value = true
  try {
    const res = await fetch('/api/search-index.json')
    const data = (await res.json()) as { entries: Entry[] }
    miniSearch = new MiniSearch<Entry>({
      fields: ['title', 'section', 'description', 'keywords'],
      storeFields: ['title', 'section', 'description', 'url'],
      searchOptions: {
        boost: { title: 3, section: 2 },
        fuzzy: 0.2,
        prefix: true,
        limit: 12,
      },
    })
    miniSearch.addAll(data.entries)
    loaded = true
  } catch (err) {
    console.error('kotoshu search: failed to load index', err)
  } finally {
    loading.value = false
  }
}

function search() {
  activeIndex.value = 0
  if (!miniSearch || !query.value.trim()) {
    results.value = []
    return
  }
  results.value = miniSearch.search(query.value) as unknown as Entry[]
}

const showQuick = computed(() => !query.value.trim())

function move(delta: number) {
  const pool = showQuick.value ? QUICK_LINKS : results.value
  if (pool.length === 0) return
  activeIndex.value = (activeIndex.value + delta + pool.length) % pool.length
}

function go(entry?: { url: string }) {
  const pool = showQuick.value ? QUICK_LINKS : results.value
  const target = entry ?? pool[activeIndex.value]
  if (!target) return
  close()
  window.location.href = target.url
}

function openModal() {
  open.value = true
  activeIndex.value = 0
  nextTick(() => inputEl.value?.focus())
  document.body.style.overflow = 'hidden'
  void ensureIndex().then(() => {
    if (query.value) search()
  })
}

function close() {
  open.value = false
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    open.value ? close() : openModal()
    return
  }
  if (!open.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    go()
  }
}

function onDocOpen() {
  openModal()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('kotoshu:search-open', onDocOpen)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('kotoshu:search-open', onDocOpen)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[90]"
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <div
        class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        @click="close"
      />
      <div
        class="relative mx-auto mt-[12vh] w-[min(92vw,36rem)] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl"
      >
        <div class="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
          <svg class="size-4 shrink-0 text-[var(--color-text-3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            ref="inputEl"
            v-model="query"
            type="search"
            placeholder="Search pages, projects, audiences, languages…"
            aria-label="Search query"
            class="h-12 w-full bg-transparent text-[15px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-3)]"
            @input="search"
          />
          <kbd class="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-3)]">esc</kbd>
        </div>

        <div class="max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="Search results">
          <p v-if="loading" class="px-3 py-6 text-center text-sm text-[var(--color-text-3)]">
            Loading index…
          </p>

          <template v-else-if="showQuick">
            <p class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-3)]">Quick links</p>
            <button
              v-for="(link, i) in QUICK_LINKS"
              :key="link.url"
              class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left"
              :class="i === activeIndex ? 'bg-[var(--color-accent-soft)]' : ''"
              @click="go(link)"
              @mousemove="activeIndex = i"
            >
              <span class="text-sm text-[var(--color-text)]">{{ link.title }}</span>
              <span class="text-[10px] uppercase tracking-wider text-[var(--color-text-3)]">{{ link.section }}</span>
            </button>
          </template>

          <template v-else-if="results.length > 0">
            <button
              v-for="(r, i) in results"
              :key="r.id"
              class="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left"
              :class="i === activeIndex ? 'bg-[var(--color-accent-soft)]' : ''"
              @click="go(r)"
              @mousemove="activeIndex = i"
            >
              <span class="flex items-center justify-between gap-3">
                <span class="truncate text-sm font-medium text-[var(--color-text)]">{{ r.title }}</span>
                <span class="shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-text-3)]">{{ r.section }}</span>
              </span>
              <span class="line-clamp-1 text-xs text-[var(--color-text-2)]">{{ r.description }}</span>
            </button>
          </template>

          <p v-else class="px-3 py-6 text-center text-sm text-[var(--color-text-3)]">
            No results for “{{ query }}”.
          </p>
        </div>

        <div class="flex items-center gap-4 border-t border-[var(--color-border)] px-4 py-2 text-[11px] text-[var(--color-text-3)]">
          <span><kbd class="font-mono">↑↓</kbd> navigate</span>
          <span><kbd class="font-mono">↵</kbd> open</span>
          <span><kbd class="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
