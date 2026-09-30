<script setup lang="ts">
import { computed } from 'vue'

// Se declara aquí (y no importado de Zod) para que el compilador de Vue lo resuelva sin problemas.
const props = defineProps<{
  title: string
  subtitle: string
  image?: string
  buttonLabel?: string
  buttonHref: string
  alignment: 'left' | 'center' | 'right'
}>()

const alignClass = computed(
  () => ({ left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' })[props.alignment],
)
</script>

<template>
  <section
    class="relative isolate flex flex-col justify-center px-6 py-24 md:py-36"
    :class="alignClass"
    :style="{ backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)' }"
  >
    <img v-if="image" :src="image" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" />
    <div v-if="image" class="absolute inset-0 -z-10 bg-black/50" />

    <h1 class="max-w-3xl text-4xl md:text-6xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="mt-4 max-w-xl text-lg" :style="{ color: 'var(--ck-muted)', fontFamily: 'var(--ck-font-body)' }">
      {{ subtitle }}
    </p>
    <a
      v-if="buttonLabel"
      :href="buttonHref"
      class="mt-8 inline-block px-8 py-3 font-medium transition hover:opacity-90"
      :style="{ backgroundColor: 'var(--ck-primary)', color: 'var(--ck-on-primary)', borderRadius: 'var(--ck-radius)' }"
    >
      {{ buttonLabel }}
    </a>
  </section>
</template>