<script setup lang="ts">
import { useCatalogData } from '../../renderer/context'
import { productImages, type Product } from '../../schema/data'
import PriceTag from '../shared/PriceTag.vue'
import ProductImage from '../shared/ProductImage.vue'

defineProps<{
  products: Product[]
  showSku: boolean
  imageFit: 'completa' | 'recortada'
  imageBg: 'tema' | 'blanco' | 'transparente'
}>()

const data = useCatalogData()
</script>

<template>
  <section
    class="flex flex-1 flex-col justify-center gap-6 px-6 py-8"
    :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }"
  >
    <article
      v-for="(p, i) in products"
      :key="`${p.id}-${i}`"
      class="overflow-hidden"
      :style="{ backgroundColor: 'var(--ck-surface)', borderRadius: 'var(--ck-radius)' }"
    >
      <!-- Con un solo producto la foto es más alta, para que la página no se vea vacía -->
      <div class="w-full" :class="products.length === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]'">
        <ProductImage :name="p.name" :src="productImages(p)[0]" :fit="imageFit" :bg="imageBg" />
      </div>
      <div class="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 class="text-xl leading-tight" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ p.name }}</h3>
          <p v-if="showSku && p.sku" class="text-xs" :style="{ color: 'var(--ck-muted)' }">Cód. {{ p.sku }}</p>
        </div>
        <PriceTag :price="p.price" :compare-at="p.compareAtPrice" :currency="data.currency" />
      </div>
    </article>
    <p v-if="!products.length" class="text-sm" :style="{ color: 'var(--ck-muted)' }">Producto no disponible.</p>
  </section>
</template>