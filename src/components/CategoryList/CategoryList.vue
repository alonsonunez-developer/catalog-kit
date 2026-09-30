<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'

const props = defineProps<{
  title: string
  layout: 'chips' | 'cards'
  showCount: boolean
}>()

const data = useCatalogData()

const items = computed(() =>
  data.value.categories.map((c) => ({
    ...c,
    count: data.value.products.filter((p) => p.categoryId === c.id).length,
  })),
)
</script>

<template>
  <section class="px-6 py-10" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2 v-if="title" class="mb-6 text-3xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ title }}</h2>

    <div v-if="items.length && layout === 'chips'" class="flex flex-wrap gap-3">
      <a
        v-for="c in items"
        :key="c.id"
        :href="`#categoria-${c.id}`"
        class="px-5 py-2 text-sm font-medium transition hover:opacity-80"
        :style="{ backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)', border: '1px solid var(--ck-primary)', borderRadius: 'var(--ck-radius)' }"
      >
        {{ c.name }}<span v-if="showCount" :style="{ color: 'var(--ck-muted)' }"> ({{ c.count }})</span>
      </a>
    </div>

    <div v-else-if="items.length" class="grid grid-cols-2 gap-4 md:grid-cols-3">
      <a
        v-for="c in items"
        :key="c.id"
        :href="`#categoria-${c.id}`"
        class="flex flex-col justify-end p-6 transition hover:opacity-80"
        :style="{ backgroundColor: 'var(--ck-surface)', borderRadius: 'var(--ck-radius)', minHeight: '8rem' }"
      >
        <span class="text-xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ c.name }}</span>
        <span v-if="showCount" class="text-sm" :style="{ color: 'var(--ck-muted)' }">{{ c.count }} productos</span>
      </a>
    </div>

    <p v-else class="text-sm" :style="{ color: 'var(--ck-muted)' }">No hay categorías para mostrar.</p>
  </section>
</template>