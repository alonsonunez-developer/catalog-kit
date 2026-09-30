<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'
import ProductCard from '../ProductCard/ProductCard.vue'

const props = defineProps<{
  title: string
  columns: 2 | 3 | 4
  spacing: 'compact' | 'normal' | 'relaxed'
  categoryId?: string
  limit?: number
  showDescription: boolean
}>()

const data = useCatalogData()

const colClass = { 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' }
const gapClass = { compact: 'gap-3', normal: 'gap-6', relaxed: 'gap-10' }

const products = computed(() => {
  let list = data.value.products
  if (props.categoryId) list = list.filter((p) => p.categoryId === props.categoryId)
  return props.limit ? list.slice(0, props.limit) : list
})
</script>

<template>
  <section class="px-6 py-12" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2 v-if="title" class="mb-8 text-3xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ title }}</h2>
    <div v-if="products.length" class="grid" :class="[colClass[columns], gapClass[spacing]]">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :name="p.name"
        :price="p.price"
        :currency="data.currency"
        :image="p.image"
        :description="p.description"
        :show-description="showDescription"
      />
    </div>
    <p v-else class="text-sm" :style="{ color: 'var(--ck-muted)' }">No hay productos para mostrar.</p>
  </section>
</template>