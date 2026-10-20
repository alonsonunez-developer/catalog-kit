<script setup lang="ts">
import { useCatalogData } from '../../renderer/context'
import { productImages, type Product } from '../../schema/data'
import PriceTag from '../shared/PriceTag.vue'
import ProductImage from '../shared/ProductImage.vue'

defineProps<{
  title: string
  subtitle: string
  image?: string
  coverSide: 'izquierda' | 'derecha'
  products: Product[]
  showSku: boolean
  imageFit: 'completa' | 'recortada'
  imageBg: 'tema' | 'blanco' | 'transparente'
}>()

const data = useCatalogData()
</script>

<template>
  <section class="flex flex-1" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <!-- Imagen grande a todo lo alto -->
    <div
      class="relative min-h-[28rem] w-[42%] shrink-0 overflow-hidden"
      :class="coverSide === 'izquierda' ? 'order-1' : 'order-2'"
      :style="{ backgroundColor: 'var(--ck-surface)' }"
    >
      <img v-if="image" :src="image" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div v-if="image && (title || subtitle)" class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div v-if="title || subtitle" class="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3">
        <h2
          v-if="title"
          class="break-words text-xl leading-tight"
          :style="{ fontFamily: 'var(--ck-font-heading)', color: image ? '#ffffff' : 'var(--ck-text)' }"
        >
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-xs" :style="{ color: image ? 'rgba(255,255,255,0.85)' : 'var(--ck-muted)' }">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- Productos, del lado opuesto. Se reparten la altura de la página en lugar de usar una proporción fija -->
    <div
      class="flex min-w-0 flex-1 flex-col justify-center gap-4 p-4"
      :class="coverSide === 'izquierda' ? 'order-2' : 'order-1'"
    >
      <article
        v-for="(p, i) in products"
        :key="`${p.id}-${i}`"
        class="flex min-h-0 max-h-[30rem] flex-1 flex-col gap-1.5"
      >
        <div class="relative min-h-[8rem] flex-1">
          <div class="absolute inset-0 overflow-hidden" :style="{ borderRadius: 'var(--ck-radius)' }">
            <ProductImage :name="p.name" :src="productImages(p)[0]" :fit="imageFit" :bg="imageBg" />
          </div>
        </div>
        <h3 class="break-words text-base leading-tight" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ p.name }}</h3>
        <p v-if="showSku && p.sku" class="text-[11px]" :style="{ color: 'var(--ck-muted)' }">Cód. {{ p.sku }}</p>
        <PriceTag :price="p.price" :compare-at="p.compareAtPrice" :currency="data.currency" />
      </article>
      <p v-if="!products.length" class="text-sm" :style="{ color: 'var(--ck-muted)' }">Producto no disponible.</p>
    </div>
  </section>
</template>