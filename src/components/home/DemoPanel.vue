<script setup lang="ts">
import { computed, reactive } from 'vue'

interface Suggestion {
  word: string
  confidence: number
}
interface DemoWord {
  text: string
  misspelled?: boolean
  suggestions?: Suggestion[]
}
interface Demo {
  lang: string
  label: string
  words: DemoWord[]
}

const DEMOS: Demo[] = [
  {
    lang: 'en',
    label: 'English',
    words: [
      { text: 'The' },
      { text: 'quiet' },
      {
        text: 'libary',
        misspelled: true,
        suggestions: [
          { word: 'library', confidence: 0.97 },
          { word: 'Braille', confidence: 0.42 },
        ],
      },
      { text: 'was' },
      {
        text: 'suprsingingly',
        misspelled: true,
        suggestions: [
          { word: 'surprisingly', confidence: 0.94 },
          { word: 'surpassing', confidence: 0.51 },
        ],
      },
      { text: 'full' },
      { text: 'of' },
      {
        text: 'mispelt',
        misspelled: true,
        suggestions: [
          { word: 'misspelt', confidence: 0.96 },
          { word: 'misfit', confidence: 0.48 },
        ],
      },
      { text: 'words.' },
    ],
  },
  {
    lang: 'de',
    label: 'Deutsch',
    words: [
      { text: 'Guten' },
      {
        text: 'Teg',
        misspelled: true,
        suggestions: [
          { word: 'Tag', confidence: 0.98 },
          { word: 'Theke', confidence: 0.40 },
        ],
      },
      { text: ',' },
      { text: 'wie' },
      {
        text: 'geth',
        misspelled: true,
        suggestions: [
          { word: 'geht', confidence: 0.97 },
          { word: 'gilt', confidence: 0.45 },
        ],
      },
      { text: 'es' },
      { text: 'dir' },
      { text: 'heute' },
      { text: '?' },
    ],
  },
]

const state = reactive({
  lang: 'en',
  fixed: {} as Record<string, string>,
  selected: null as string | null,
})

const demo = computed(() => DEMOS.find((d) => d.lang === state.lang)!)

const rendered = computed(() =>
  demo.value.words.map((w) => {
    const key = `${state.lang}:${w.text}`
    const fix = state.fixed[key]
    return {
      key,
      original: w.text,
      display: fix ?? w.text,
      misspelled: w.misspelled && !fix,
      suggestions: w.suggestions ?? [],
    }
  }),
)

const errorCount = computed(
  () => rendered.value.filter((w) => w.misspelled).length,
)

const allFixed = computed(
  () => demo.value.words.some((w) => w.misspelled) && errorCount.value === 0,
)

function select(key: string) {
  state.selected = state.selected === key ? null : key
}

function apply(key: string, original: string, replacement: string) {
  state.fixed[key] = replacement
  state.selected = null
}

function reset() {
  state.fixed = {}
  state.selected = null
}
</script>

<template>
  <div class="code-block overflow-hidden">
    <div class="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-2.5">
      <div class="flex items-center gap-1.5" role="tablist" aria-label="Demo language">
        <button
          v-for="d in DEMOS"
          :key="d.lang"
          role="tab"
          :aria-selected="state.lang === d.lang"
          class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
          :class="
            state.lang === d.lang
              ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-3)] hover:text-[var(--color-text-2)]'
          "
          @click="state.lang = d.lang; reset()"
        >
          {{ d.label }}
        </button>
      </div>
      <div class="flex items-center gap-3">
        <span
          class="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
          :class="
            errorCount === 0
              ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'bg-[var(--color-gold-soft)] text-[var(--color-gold)]'
          "
        >
          {{ errorCount === 0 ? 'clean' : `${errorCount} misspelled` }}
        </span>
        <button
          class="text-xs text-[var(--color-text-3)] hover:text-[var(--color-text-2)] transition-colors"
          @click="reset"
        >
          reset
        </button>
      </div>
    </div>

    <div class="px-5 py-6 text-lg leading-loose text-[var(--color-text)] sm:text-xl">
      <template v-for="w in rendered" :key="w.key">
        <span v-if="!w.misspelled">{{ w.display }} </span>
        <template v-else>
          <button
            class="underline decoration-wavy decoration-[var(--color-gold)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--color-accent)]"
            :aria-expanded="state.selected === w.key"
            @click="select(w.key)"
          >
            {{ w.display }}
          </button>
          <span v-if="state.selected === w.key" class="ml-1 mr-2 inline-flex flex-wrap items-center gap-1.5 align-baseline">
            <button
              v-for="s in w.suggestions"
              :key="s.word"
              class="rounded-full border border-[var(--color-accent)] px-2.5 py-0.5 text-xs text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
              :title="`${Math.round(s.confidence * 100)}% confidence`"
              @click="apply(w.key, w.original, s.word)"
            >
              {{ s.word }} <span class="opacity-70">{{ Math.round(s.confidence * 100) }}%</span>
            </button>
          </span>
        </template>
      </template>
    </div>

    <div class="border-t border-[var(--color-border-subtle)] px-5 py-3">
      <p v-if="allFixed" class="text-xs text-[var(--color-accent)]">
        All fixed — 言修, words tended.
      </p>
      <p v-else class="text-xs text-[var(--color-text-3)]">
        Click a wavy word to see ranked suggestions, then a chip to apply the fix.
      </p>
    </div>
  </div>
</template>
