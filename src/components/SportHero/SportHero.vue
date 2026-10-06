<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'

const props = defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  season: string
  image?: string
  showBusinessName: boolean
}>()

const data = useCatalogData()
const brand = computed(() => (props.showBusinessName ? data.value.business.name : undefined))
const onImage = computed(() => !!props.image)
</script>

<template>
  <section
    class="relative isolate flex min-h-[85vh] flex-col px-6 py-6"
    :style="{ backgroundColor: 'var(--ck-surface)', color: onImage ? '#ffffff' : 'var(--ck-text)' }"
  >
    <img v-if="image" :src="image" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" />
    <div v-if="image" class="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

    <header
      v-if="brand || season"
      class="flex items-center justify-between border-b pb-3 text-[11px] uppercase tracking-[0.2em]"
      :style="{ borderColor: onImage ? 'rgba(255,255,255,0.4)' : 'var(--ck-muted)' }"
    >
      <span>{{ brand }}</span>
      <span>{{ season }}</span>
    </header>

    <div class="mt-auto flex flex-col gap-3 pt-24">
      <p
        v-if="eyebrow"
        class="text-xs uppercase tracking-[0.2em]"
        :style="{ color: onImage ? 'rgba(255,255,255,0.85)' : 'var(--ck-primary)' }"
      >
        {{ eyebrow }}
      </p>
      <h1
        class="break-words text-5xl font-extrabold uppercase leading-[0.95] tracking-tight"
        :style="{ fontFamily: 'var(--ck-font-heading)' }"
      >
        {{ title }}
      </h1>
      <p v-if="subtitle" class="max-w-xs text-base opacity-85">{{ subtitle }}</p>
    </div>
  </section>
</template>