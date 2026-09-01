<script setup lang="ts">
import { reactive } from 'vue'

export interface InstallTab {
  id: string
  label: string
  hint: string
  command: string
}

const props = defineProps<{ tabs: InstallTab[] }>()

const state = reactive({
  active: props.tabs[0]?.id ?? '',
  copied: null as string | null,
})

function current(): InstallTab {
  return props.tabs.find((t) => t.id === state.active) ?? props.tabs[0]
}

async function copy() {
  const tab = current()
  if (!tab) return
  try {
    await navigator.clipboard.writeText(tab.command)
    state.copied = tab.id
    setTimeout(() => {
      if (state.copied === tab.id) state.copied = null
    }, 1600)
  } catch {
    /* clipboard unavailable — user can select manually */
  }
}
</script>

<template>
  <div class="code-block overflow-hidden">
    <div
      class="flex items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] px-2 py-1.5"
      role="tablist"
      aria-label="Install options"
    >
      <div class="flex flex-wrap items-center gap-0.5">
        <button
          v-for="t in tabs"
          :key="t.id"
          role="tab"
          :aria-selected="state.active === t.id"
          class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
          :class="
            state.active === t.id
              ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-3)] hover:text-[var(--color-text-2)]'
          "
          @click="state.active = t.id"
        >
          {{ t.label }}
        </button>
      </div>
      <button
        class="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[var(--color-text-2)] transition-colors hover:text-[var(--color-text)] hover:bg-[var(--color-bg-raised)]"
        :aria-label="state.copied ? 'Copied' : 'Copy command'"
        @click="copy"
      >
        <svg v-if="state.copied" class="size-3.5 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        {{ state.copied ? 'copied' : 'copy' }}
      </button>
    </div>

    <div class="px-4 py-4">
      <p class="mb-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-3)]">{{ current()?.hint }}</p>
      <pre class="overflow-x-auto whitespace-pre text-[var(--color-text)]"><code>{{ current()?.command }}</code></pre>
    </div>
  </div>
</template>
