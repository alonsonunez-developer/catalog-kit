<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    src?: string
    fit?: 'completa' | 'recortada'
    bg?: 'tema' | 'blanco' | 'transparente'
  }>(),
  { fit: 'completa', bg: 'tema' },
)

const background = computed(() =>
  props.bg === 'blanco' ? '#ffffff' : props.bg === 'transparente' ? 'transparent' : 'var(--ck-surface)',
)
</script>

<template>
  <div class="h-full w-full overflow-hidden" :style="{ backgroundColor: background }">
    <img
      v-if="src"
      :src="src"
      :alt="name"
      loading="lazy"
      class="h-full w-full"
      :class="fit === 'recortada' ? 'object-cover' : 'object-contain'"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center text-5xl"
      :style="{ color: 'var(--ck-muted)', fontFamily: 'var(--ck-font-heading)' }"
      aria-hidden="true"
    >
      {{ name.charAt(0).toUpperCase() }}
    </div>
  </div>
</template>