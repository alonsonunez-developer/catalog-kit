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

const featured = computed(() => cards.value[0])
const rest = computed(() => cards.value.slice(1))
</script>

<template>
  <section class="px-6 py-8" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2 v-if="title" class="mb-6 text-2xl uppercase tracking-wide" :style="{ fontFamily: 'var(--ck-font-heading)' }">
      {{ title }}
    </h2>

    <article v-if="featured" class="flex flex-col gap-2">
      <div class="aspect-[4/5] w-full overflow-hidden" :style="{ borderRadius: 'var(--ck-radius)' }">
        <ProductImage :fit="imageFit" :bg="imageBg" :name="featured.product.name" :src="productImages(featured.product)[0]" />
      </div>
      <p class="mt-1 text-[10px] uppercase tracking-[0.15em]" :style="{ color: 'var(--ck-primary)' }">
        {{ featured.label }}
      </p>
      <h3 class="text-2xl leading-tight" :style="{ fontFamily: 'var(--ck-font-heading)' }">
        {{ featured.product.name }}
      </h3>
      <PriceTag
        :price="featured.product.price"
        :compare-at="featured.product.compareAtPrice"
        :currency="data.currency"
        large
      />
      <p v-if="showSku && featured.product.sku" class="text-xs" :style="{ color: 'var(--ck-muted)' }">
        Cód. {{ featured.product.sku }}
      </p>
      <p v-if="featured.rows.length" class="text-xs" :style="{ color: 'var(--ck-muted)' }">
        {{ featured.rows.map((r) => `${r.label}: ${r.value}`).join(' · ') }}
      </p>
    </article>

    <div v-if="rest.length" class="mt-8 grid grid-cols-3 gap-3 border-t pt-6" :style="{ borderColor: 'var(--ck-primary)' }">
      <article v-for="(c, i) in rest" :key="`${c.product.id}-${i}`" class="flex flex-col gap-1.5">
        <div class="aspect-[3/4] w-full overflow-hidden" :style="{ borderRadius: 'var(--ck-radius)' }">
          <ProductImage :fit="imageFit" :bg="imageBg" :name="c.product.name" :src="productImages(c.product)[0]" />
        </div>
        <p class="text-[9px] uppercase tracking-[0.12em]" :style="{ color: 'var(--ck-muted)' }">{{ c.label }}</p>
        <h3 class="text-xs font-medium leading-tight">{{ c.product.name }}</h3>
        <PriceTag :price="c.product.price" :compare-at="c.product.compareAtPrice" :currency="data.currency" />
        <p v-if="showSku && c.product.sku" class="text-[10px]" :style="{ color: 'var(--ck-muted)' }">
          Cód. {{ c.product.sku }}
        </p>
      </article>
    </div>

    <p v-if="!products.length" class="text-sm" :style="{ color: 'var(--ck-muted)' }">Sin productos en esta página.</p>
  </section>
</template>