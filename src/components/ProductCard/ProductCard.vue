<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  price: number
  currency: string
  image?: string
  description?: string
  showDescription?: boolean
}>()

const formattedPrice = computed(() =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: props.currency }).format(props.price),
)
</script>

<template>
  <article
    class="flex flex-col overflow-hidden"
    :style="{ backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)', borderRadius: 'var(--ck-radius)' }"
  >
    <div class="aspect-square w-full overflow-hidden" :style="{ backgroundColor: 'var(--ck-bg)' }">
      <img v-if="image" :src="image" :alt="name" loading="lazy" class="h-full w-full object-contain" />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-4xl"
        :style="{ color: 'var(--ck-muted)', fontFamily: 'var(--ck-font-heading)' }"
        aria-hidden="true"
      >
        {{ name.charAt(0).toUpperCase() }}
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-1 p-4">
      <h3 class="text-lg leading-tight" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ name }}</h3>
      <p v-if="showDescription && description" class="text-sm" :style="{ color: 'var(--ck-muted)' }">
        {{ description }}
      </p>
      <p class="mt-auto pt-2 font-semibold" :style="{ color: 'var(--ck-primary)' }">{{ formattedPrice }}</p>
    </div>
  </article>
</template>