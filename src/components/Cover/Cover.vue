<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'

const props = defineProps<{
  title: string
  subtitle: string
  image?: string
  showBusinessName: boolean
}>()

const data = useCatalogData()
const businessName = computed(() => (props.showBusinessName ? data.value.business.name : undefined))
</script>

<template>
  <section
    class="relative isolate flex min-h-[85vh] flex-col items-center justify-center gap-4 px-8 py-20 text-center"
    :style="{ backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)' }"
  >
    <img v-if="image" :src="image" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" />
    <div v-if="image" class="absolute inset-0 -z-10 bg-black/50" />
    <p v-if="businessName" class="text-sm uppercase tracking-[0.3em]" :style="{ color: image ? '#fff' : 'var(--ck-muted)' }">
      {{ businessName }}
    </p>
    <h1 class="text-5xl leading-tight" :style="{ fontFamily: 'var(--ck-font-heading)', color: image ? '#fff' : 'var(--ck-text)' }">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="max-w-sm text-lg" :style="{ color: image ? '#f3f3f3' : 'var(--ck-muted)' }">{{ subtitle }}</p>
  </section>
</template>