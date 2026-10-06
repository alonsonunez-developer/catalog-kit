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
</script>

<template>
  <section class="flex flex-col px-6 py-6" :style="{ backgroundColor: 'var(--ck-bg)', color: 'var(--ck-text)' }">
    <header
      v-if="brand || season"
      class="flex items-center justify-between border-b pb-3 text-[11px] uppercase tracking-[0.2em]"
      :style="{ borderColor: 'var(--ck-primary)' }"
    >
      <span>{{ brand }}</span>
      <span :style="{ color: 'var(--ck-muted)' }">{{ season }}</span>
    </header>

    <div class="flex flex-col gap-4 py-10">
      <p v-if="eyebrow" class="text-xs uppercase tracking-[0.2em]" :style="{ color: 'var(--ck-primary)' }">
        {{ eyebrow }}
      </p>
      <h1
        class="break-words text-5xl uppercase leading-[1.05] tracking-wide"
        :style="{ fontFamily: 'var(--ck-font-heading)' }"
      >
        {{ title }}
      </h1>
      <p v-if="subtitle" class="max-w-xs text-base" :style="{ color: 'var(--ck-muted)' }">{{ subtitle }}</p>
    </div>

    <div
      v-if="image"
      class="aspect-[4/5] w-full overflow-hidden"
      :style="{ backgroundColor: 'var(--ck-surface)', borderRadius: 'var(--ck-radius)' }"
    >
      <img :src="image" alt="" class="h-full w-full object-cover" />
    </div>
  </section>
</template>