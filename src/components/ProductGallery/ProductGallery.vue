<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCatalogData } from '../../renderer/context'
import { productImages, type Product } from '../../schema/data'
import PriceTag from '../shared/PriceTag.vue'
import ProductImage from '../shared/ProductImage.vue'

const props = defineProps<{
  products: Product[]
  showDescription: boolean
  showSku: boolean
  showAttributes: boolean
  attributeKeys: string[]
  imageFit: 'completa' | 'recortada'
  imageBg: 'tema' | 'blanco' | 'transparente'
}>()

const data = useCatalogData()
const product = computed(() => props.products[0])
const images = computed(() => (product.value ? productImages(product.value) : []))

const scroller = ref<HTMLElement | null>(null)
const current = ref(0)

// Al deslizar, la miniatura activa y el contador siguen a la foto visible
function onScroll() {
  const el = scroller.value
  if (!el || !el.clientWidth) return
  current.value = Math.round(el.scrollLeft / el.clientWidth)
}

function goTo(i: number) {
  current.value = i
  const el = scroller.value
  el?.scrollTo?.({ left: i * el.clientWidth, behavior: 'smooth' })
}

const rows = computed(() => {
  const p = product.value
  if (!p || !props.showAttributes) return []
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
  <section class="flex flex-col pb-8" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <template v-if="product">
      <div class="relative">
        <!-- data-no-swipe: el visualizador no cambia de página al deslizar aquí -->
        <div
          ref="scroller"
          class="flex snap-x snap-mandatory overflow-x-auto"
          style="scrollbar-width: none"
          :data-no-swipe="images.length > 1 ? '' : undefined"
          @scroll.passive="onScroll"
        >
          <div
            v-for="(src, i) in images"
            :key="`${src}-${i}`"
            data-testid="slide"
            class="aspect-[4/5] w-full shrink-0 snap-center"
          >
            <ProductImage :fit="imageFit" :bg="imageBg" :name="product.name" :src="src" />
          </div>
          <div v-if="!images.length" class="aspect-[4/5] w-full shrink-0">
            <ProductImage :fit="imageFit" :bg="imageBg" :name="product.name" />
          </div>
        </div>
        <span
          v-if="images.length > 1"
          class="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
        >
          {{ current + 1 }} / {{ images.length }}
        </span>
      </div>

      <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto px-6 pt-3" data-no-swipe>
        <button
          v-for="(src, i) in images"
          :key="`t-${src}-${i}`"
          type="button"
          data-thumb
          class="h-14 w-14 shrink-0 cursor-pointer overflow-hidden"
          :style="{
            borderRadius: 'var(--ck-radius)',
            outline: i === current ? '2px solid var(--ck-primary)' : '1px solid transparent',
            outlineOffset: '1px',
          }"
          :aria-label="`Ver foto ${i + 1}`"
          @click="goTo(i)"
        >
          <img :src="src" alt="" class="h-full w-full object-cover" />
        </button>
      </div>

      <div class="flex flex-col gap-3 px-6 pt-5">
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="text-3xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ product.name }}</h2>
          <p v-if="showSku && product.sku" class="text-xs" :style="{ color: 'var(--ck-muted)' }">Cód. {{ product.sku }}</p>
        </div>
        <PriceTag :price="product.price" :compare-at="product.compareAtPrice" :currency="data.currency" large />
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