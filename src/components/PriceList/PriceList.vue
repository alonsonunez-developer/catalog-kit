<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'
import type { Product } from '../../schema/data'
import PriceTag from '../shared/PriceTag.vue'

const props = defineProps<{
  title: string
  products: Product[]
  showDescription: boolean
  showSku: boolean
  showDots: boolean
  showAttributes: boolean
  showCategories: boolean
  attributeKeys: string[]
}>()

const data = useCatalogData()
const categoryName = computed(() => new Map(data.value.categories.map((c) => [c.id, c.name])))

function toItem(p: Product) {
  const rows = props.showAttributes
    ? data.value.attributeDefs
        .filter((d) => !props.attributeKeys.length || props.attributeKeys.includes(d.key))
        .map((d) => {
          const v = p.attributes[d.key]
          return `${d.label}: ${Array.isArray(v) ? v.join(', ') : (v ?? '')}`
        })
        .filter((r) => !r.endsWith(': '))
    : []
  return { product: p, rows }
}

// Productos consecutivos de la misma categoría forman un grupo con su título
const groups = computed(() => {
  const anyCategory = props.products.some((p) => p.categoryId && categoryName.value.has(p.categoryId))
  const out: { key: number; title?: string; items: ReturnType<typeof toItem>[] }[] = []
  for (const p of props.products) {
    let title: string | undefined
    if (props.showCategories) {
      title = p.categoryId ? categoryName.value.get(p.categoryId) : undefined
      if (!title && anyCategory) title = 'Otros'
    }
    const last = out[out.length - 1]
    if (last && last.title === title) last.items.push(toItem(p))
    else out.push({ key: out.length, title, items: [toItem(p)] })
  }
  return out
})
</script>

<template>
  <section class="px-6 py-10" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2 v-if="title" class="mb-6 text-3xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ title }}</h2>
    <div v-if="groups.length" class="flex flex-col gap-8">
      <div v-for="g in groups" :key="g.key">
        <h3
          v-if="g.title"
          class="mb-4 border-b pb-1 text-sm uppercase tracking-[0.2em]"
          :style="{ color: 'var(--ck-primary)', borderColor: 'var(--ck-primary)' }"
        >
          {{ g.title }}
        </h3>
        <ul class="flex flex-col gap-5">
          <li v-for="(it, i) in g.items" :key="`${it.product.id}-${i}`">
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 break-words text-lg font-medium" :style="{ fontFamily: 'var(--ck-font-heading)' }">
                {{ it.product.name }}
              </span>
              <span
                v-if="showDots"
                aria-hidden="true"
                class="min-w-4 flex-1 border-b border-dotted"
                :style="{ borderColor: 'var(--ck-muted)' }"
              />
              <span v-else class="flex-1" />
              <span class="shrink-0">
                <PriceTag :price="it.product.price" :compare-at="it.product.compareAtPrice" :currency="data.currency" />
              </span>
            </div>
            <p v-if="showDescription && it.product.description" class="mt-0.5 text-sm" :style="{ color: 'var(--ck-muted)' }">
              {{ it.product.description }}
            </p>
            <p v-if="showSku && it.product.sku" class="text-xs" :style="{ color: 'var(--ck-muted)' }">
              Cód. {{ it.product.sku }}
            </p>
            <p v-if="it.rows.length" class="text-xs" :style="{ color: 'var(--ck-muted)' }">{{ it.rows.join(' · ') }}</p>
          </li>
        </ul>
      </div>
    </div>
    <p v-else class="text-sm" :style="{ color: 'var(--ck-muted)' }">Sin productos en esta página.</p>
  </section>
</template>