<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'
import { productImages, type Product } from '../../schema/data'
import PriceTag from '../shared/PriceTag.vue'
import ProductImage from '../shared/ProductImage.vue'

const props = defineProps<{
  products: Product[]
  imageSide: 'alternar' | 'izquierda' | 'derecha'
  showDescription: boolean
  showSku: boolean
  showAttributes: boolean
  attributeKeys: string[]
  imageFit: 'completa' | 'recortada'
  imageBg: 'tema' | 'blanco' | 'transparente'
}>()

const data = useCatalogData()

// Con "alternar" la foto va a la izquierda en el primero, a la derecha en el segundo
const reversed = (i: number) =>
  props.imageSide === 'derecha' || (props.imageSide === 'alternar' && i % 2 === 1)

const items = computed(() =>
  props.products.map((p) => {
    const rows = props.showAttributes
      ? data.value.attributeDefs
          .filter((d) => !props.attributeKeys.length || props.attributeKeys.includes(d.key))
          .map((d) => {
            const v = p.attributes[d.key]
            return { key: d.key, label: d.label, value: Array.isArray(v) ? v.join(', ') : (v ?? '') }
          })
          .filter((r) => r.value)
      : []
    return { product: p, rows }
  }),
)
</script>

<template>
  <section class="flex flex-col gap-8 px-6 py-8" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <article
      v-for="(it, i) in items"
      :key="`${it.product.id}-${i}`"
      class="flex items-center gap-4"
      :class="reversed(i) ? 'flex-row-reverse' : 'flex-row'"
    >
      <div class="aspect-[3/4] w-[55%] shrink-0 overflow-hidden" :style="{ borderRadius: 'var(--ck-radius)' }">
        <ProductImage :fit="imageFit" :bg="imageBg" :name="it.product.name" :src="productImages(it.product)[0]" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <h3 class="break-words text-xl leading-tight" :style="{ fontFamily: 'var(--ck-font-heading)' }">
          {{ it.product.name }}
        </h3>
        <PriceTag :price="it.product.price" :compare-at="it.product.compareAtPrice" :currency="data.currency" />
        <p v-if="showDescription && it.product.description" class="text-sm" :style="{ color: 'var(--ck-muted)' }">
          {{ it.product.description }}
        </p>
        <p v-if="showSku && it.product.sku" class="text-xs" :style="{ color: 'var(--ck-muted)' }">
          Cód. {{ it.product.sku }}
        </p>
        <p v-for="r in it.rows" :key="r.key" class="text-xs" :style="{ color: 'var(--ck-muted)' }">
          {{ r.label }}: {{ r.value }}
        </p>
      </div>
    </article>
    <p v-if="!items.length" class="text-sm" :style="{ color: 'var(--ck-muted)' }">Sin productos en esta página.</p>
  </section>
</template>