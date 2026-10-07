<script setup lang="ts">
withDefaults(defineProps<{ name: string; src?: string; fit?: 'contain' | 'cover' }>(), { fit: 'contain' })
</script>

<template>
  <div class="h-full w-full overflow-hidden" :style="{ backgroundColor: 'var(--ck-surface)' }">
    <img
      v-if="src"
      :src="src"
      :alt="name"
      loading="lazy"
      class="h-full w-full"
      :class="fit === 'cover' ? 'object-cover' : 'object-contain'"
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