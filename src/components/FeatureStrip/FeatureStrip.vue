<script setup lang="ts">
defineProps<{ title: string; text: string; features: string[] }>()
</script>

<template>
  <section class="px-6 py-14" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <h2
      v-if="title"
      class="text-3xl font-extrabold uppercase leading-tight tracking-tight"
      :style="{ fontFamily: 'var(--ck-font-heading)' }"
    >
      {{ title }}
    </h2>
    <p v-if="text" class="mt-3 max-w-sm" :style="{ color: 'var(--ck-muted)' }">{{ text }}</p>
    <ol v-if="features.length" class="mt-8 grid grid-cols-2 gap-x-4">
      <li
        v-for="(f, i) in features"
        :key="i"
        class="flex items-baseline gap-3 border-t py-3 text-sm uppercase tracking-[0.12em]"
        :style="{ borderColor: 'color-mix(in srgb, var(--ck-muted) 40%, transparent)' }"
      >
        <span :style="{ color: 'var(--ck-primary)' }">{{ String(i + 1).padStart(2, '0') }}</span>
        {{ f }}
      </li>
    </ol>
  </section>
</template>