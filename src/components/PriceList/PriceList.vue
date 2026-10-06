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
  attributeKeys: string[]
}>()

const data = useCatalogData()

const items = computed(() =>
  props.products.map((p) => {
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
  }),
)
</script>

<template>
  <section class="px-6 py-10" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2 v-if="title" class="mb-6 text-3xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ title }}</h2>
    <ul v-if="items.length" class="flex flex-col gap-5">
      <li v-for="(it, i) in items" :key="`${it.product.id}-${i}`">
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
    <p v-else class="text-sm" :style="{ color: 'var(--ck-muted)' }">Sin productos en esta página.</p>
  </section>
</template>