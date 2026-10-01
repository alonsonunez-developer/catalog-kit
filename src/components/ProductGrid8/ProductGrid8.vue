<script setup lang="ts">
import { useCatalogData } from '../../renderer/context'
import { productImages, type Product } from '../../schema/data'
import PriceTag from '../shared/PriceTag.vue'
import ProductImage from '../shared/ProductImage.vue'

defineProps<{ title: string; products: Product[]; showSku: boolean }>()

const data = useCatalogData()
</script>

<template>
  <section class="px-4 py-6" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2 v-if="title" class="mb-4 px-2 text-2xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ title }}</h2>
    <div class="grid grid-cols-2 gap-3">
      <article
        v-for="(p, i) in products"
        :key="`${p.id}-${i}`"
        class="overflow-hidden"
        :style="{ backgroundColor: 'var(--ck-surface)', borderRadius: 'var(--ck-radius)' }"
      >
        <div class="aspect-square w-full">
          <ProductImage :name="p.name" :src="productImages(p)[0]" />
        </div>
        <div class="flex flex-col gap-0.5 p-3">
          <h3 class="text-sm leading-tight" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ p.name }}</h3>
          <p v-if="showSku && p.sku" class="text-[11px]" :style="{ color: 'var(--ck-muted)' }">Cód. {{ p.sku }}</p>
          <PriceTag :price="p.price" :compare-at="p.compareAtPrice" :currency="data.currency" />
        </div>
      </article>
    </div>
    <p v-if="!products.length" class="text-sm" :style="{ color: 'var(--ck-muted)' }">Sin productos en esta página.</p>
  </section>
</template>