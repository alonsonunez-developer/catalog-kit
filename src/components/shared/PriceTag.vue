<script setup lang="ts">
import { formatPrice } from '../../renderer/format'

defineProps<{
  price: number
  compareAt?: number
  currency: string
  large?: boolean
}>()
</script>

<template>
  <p class="flex items-baseline gap-2">
    <span class="font-semibold" :class="large ? 'text-2xl' : 'text-base'" :style="{ color: 'var(--ck-primary)' }">
      {{ formatPrice(price, currency) }}
    </span>
    <s v-if="compareAt" class="text-sm" :style="{ color: 'var(--ck-muted)' }">
      {{ formatPrice(compareAt, currency) }}
    </s>
  </p>
</template>