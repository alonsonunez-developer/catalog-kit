<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'
import { productImages, type Product } from '../../schema/data'
import PriceTag from '../shared/PriceTag.vue'
import ProductImage from '../shared/ProductImage.vue'

const props = defineProps<{
  title: string
  products: Product[]
  showCategory: boolean
  showSku: boolean
  showAttributes: boolean
  attributeKeys: string[]
  imageFit: 'completa' | 'recortada'
  imageBg: 'tema' | 'blanco' | 'transparente'
}>()

const data = useCatalogData()
const categoryName = computed(() => new Map(data.value.categories.map((c) => [c.id, c.name])))

const cards = computed(() =>
  props.products.map((p, i) => {
    const category = p.categoryId ? categoryName.value.get(p.categoryId) : undefined
    const label = [String(i + 1).padStart(2, '0'), props.showCategory ? category : undefined]
      .filter(Boolean)
      .join(' / ')
    // attributeKeys vacío = todos los atributos que el producto tenga llenos
    const rows = props.showAttributes
      ? data.value.attributeDefs
          .filter((d) => !props.attributeKeys.length || props.attributeKeys.includes(d.key))
          .map((d) => {
            const v = p.attributes[d.key]
            return { key: d.key, label: d.label, value: Array.isArray(v) ? v.join(' · ') : (v ?? '') }
          })
          .filter((r) => r.value)
      : []
    return { product: p, label, rows }
  }),
)
</script>

<template>
  <section class="px-6 py-8" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2
      v-if="title"
      class="mb-6 text-2xl font-extrabold uppercase tracking-tight"
      :style="{ fontFamily: 'var(--ck-font-heading)' }"
    >
      {{ title }}
    </h2>
    <div class="grid grid-cols-2 gap-x-3 gap-y-8">
      <article v-for="(c, i) in cards" :key="`${c.product.id}-${i}`" class="flex flex-col gap-2">
        <div class="aspect-[4/5] w-full overflow-hidden" :style="{ borderRadius: 'var(--ck-radius)' }">
          <ProductImage :fit="imageFit" :bg="imageBg" :name="c.product.name" :src="productImages(c.product)[0]" />
        </div>
        <p class="text-[10px] uppercase tracking-[0.15em]" :style="{ color: 'var(--ck-muted)' }">{{ c.label }}</p>
        <h3 class="text-sm font-medium leading-tight">{{ c.product.name }}</h3>
        <PriceTag :price="c.product.price" :compare-at="c.product.compareAtPrice" :currency="data.currency" />
        <p v-if="showSku && c.product.sku" class="text-[11px]" :style="{ color: 'var(--ck-muted)' }">
          Cód. {{ c.product.sku }}
        </p>
        <p v-for="r in c.rows" :key="r.key" class="text-[11px]" :style="{ color: 'var(--ck-muted)' }">
          {{ r.label }}: {{ r.value }}
        </p>
      </article>
    </div>
    <p v-if="!products.length" class="text-sm" :style="{ color: 'var(--ck-muted)' }">Sin productos en esta página.</p>
  </section>
</template>