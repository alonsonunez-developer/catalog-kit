<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'
import { formatPrice } from '../../renderer/format'
import { productImages, type Product } from '../../schema/data'

const props = defineProps<{
  products: Product[]
  showDescription: boolean
  attributeKeys: string[]
}>()

const data = useCatalogData()
const product = computed(() => props.products[0])
const image = computed(() => (product.value ? productImages(product.value)[0] : undefined))

// Atributos definidos por el negocio que este producto tiene llenos.
// Si attributeKeys está vacío se muestran todos.
const rows = computed(() => {
  const p = product.value
  if (!p) return []
  return data.value.attributeDefs
    .filter((d) => !props.attributeKeys.length || props.attributeKeys.includes(d.key))
    .map((d) => {
      const v = p.attributes[d.key]
      return { key: d.key, label: d.label, value: Array.isArray(v) ? v.join(', ') : (v ?? '') }
    })
    .filter((r) => r.value)
})
</script>

<template>
  <section class="flex flex-col" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <template v-if="product">
      <div class="aspect-[4/5] w-full overflow-hidden" :style="{ backgroundColor: 'var(--ck-surface)' }">
        <img v-if="image" :src="image" :alt="product.name" class="h-full w-full object-contain" />
        <div
          v-else
          class="flex h-full w-full items-center justify-center text-7xl"
          :style="{ color: 'var(--ck-muted)', fontFamily: 'var(--ck-font-heading)' }"
          aria-hidden="true"
        >
          {{ product.name.charAt(0).toUpperCase() }}
        </div>
      </div>
      <div class="flex flex-col gap-3 px-6 py-6">
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="text-3xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ product.name }}</h2>
          <p v-if="product.sku" class="text-xs" :style="{ color: 'var(--ck-muted)' }">Cód. {{ product.sku }}</p>
        </div>
        <p class="flex items-baseline gap-3">
          <span class="text-2xl font-semibold" :style="{ color: 'var(--ck-primary)' }">
            {{ formatPrice(product.price, data.currency) }}
          </span>
          <s v-if="product.compareAtPrice" class="text-base" :style="{ color: 'var(--ck-muted)' }">
            {{ formatPrice(product.compareAtPrice, data.currency) }}
          </s>
        </p>
        <p v-if="showDescription && product.description" :style="{ color: 'var(--ck-muted)' }">
          {{ product.description }}
        </p>
        <dl v-if="rows.length" class="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <template v-for="r in rows" :key="r.key">
            <dt :style="{ color: 'var(--ck-muted)' }">{{ r.label }}</dt>
            <dd>{{ r.value }}</dd>
          </template>
        </dl>
      </div>
    </template>
    <p v-else class="px-6 py-12 text-sm" :style="{ color: 'var(--ck-muted)' }">Producto no disponible.</p>
  </section>
</template>