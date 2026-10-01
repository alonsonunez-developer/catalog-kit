<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData, useCategoryFilter } from '../../renderer/context'

defineProps<{
  title: string
  layout: 'chips' | 'cards'
  showCount: boolean
  showAll: boolean
}>()

const data = useCatalogData()
const selected = useCategoryFilter()

const items = computed(() =>
  data.value.categories.map((c) => ({
    ...c,
    count: data.value.products.filter((p) => p.categoryId === c.id).length,
  })),
)

// Pulsar la categoría activa otra vez quita el filtro
function toggle(id: string) {
  selected.value = selected.value === id ? null : id
}

const chipStyle = (active: boolean) => ({
  backgroundColor: active ? 'var(--ck-primary)' : 'var(--ck-surface)',
  color: active ? 'var(--ck-on-primary)' : 'var(--ck-text)',
  border: '1px solid var(--ck-primary)',
  borderRadius: 'var(--ck-radius)',
})
</script>

<template>
  <section class="px-6 py-10" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2 v-if="title" class="mb-6 text-3xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ title }}</h2>

    <div v-if="items.length && layout === 'chips'" class="flex flex-wrap gap-3">
      <button
        v-if="showAll"
        type="button"
        class="cursor-pointer px-5 py-2 text-sm font-medium transition hover:opacity-80"
        :style="chipStyle(selected === null)"
        :aria-pressed="selected === null"
        @click="selected = null"
      >
        Todas<span v-if="showCount"> ({{ data.products.length }})</span>
      </button>
      <button
        v-for="c in items"
        :key="c.id"
        type="button"
        class="cursor-pointer px-5 py-2 text-sm font-medium transition hover:opacity-80"
        :style="chipStyle(selected === c.id)"
        :aria-pressed="selected === c.id"
        @click="toggle(c.id)"
      >
        {{ c.name }}<span v-if="showCount"> ({{ c.count }})</span>
      </button>
    </div>

    <div v-else-if="items.length" class="grid grid-cols-2 gap-4 md:grid-cols-3">
      <button
        v-for="c in items"
        :key="c.id"
        type="button"
        class="flex cursor-pointer flex-col items-start justify-end p-6 text-left transition hover:opacity-80"
        :style="{
          backgroundColor: 'var(--ck-surface)',
          color: 'var(--ck-text)',
          borderRadius: 'var(--ck-radius)',
          minHeight: '8rem',
          outline: selected === c.id ? '2px solid var(--ck-primary)' : 'none',
        }"
        :aria-pressed="selected === c.id"
        @click="toggle(c.id)"
      >
        <span class="text-xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ c.name }}</span>
        <span v-if="showCount" class="text-sm" :style="{ color: 'var(--ck-muted)' }">{{ c.count }} productos</span>
      </button>
    </div>

    <p v-else class="text-sm" :style="{ color: 'var(--ck-muted)' }">No hay categorías para mostrar.</p>
  </section>
</template>