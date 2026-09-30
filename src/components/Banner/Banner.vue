<script setup lang="ts">
defineProps<{
  message: string
  buttonLabel?: string
  buttonHref: string
  tone: 'primary' | 'surface'
}>()
</script>

<template>
  <section
    class="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center md:flex-row md:gap-8"
    :style="
      tone === 'primary'
        ? { backgroundColor: 'var(--ck-primary)', color: 'var(--ck-on-primary)' }
        : { backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)' }
    "
  >
    <p class="text-xl md:text-2xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ message }}</p>
    <a
      v-if="buttonLabel"
      :href="buttonHref"
      class="px-6 py-2 font-medium transition hover:opacity-80"
      :style="
        tone === 'primary'
          ? { border: '1px solid var(--ck-on-primary)', color: 'var(--ck-on-primary)', borderRadius: 'var(--ck-radius)' }
          : { backgroundColor: 'var(--ck-primary)', color: 'var(--ck-on-primary)', borderRadius: 'var(--ck-radius)' }
      "
    >
      {{ buttonLabel }}
    </a>
  </section>
</template>