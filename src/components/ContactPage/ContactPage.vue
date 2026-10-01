<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'

defineProps<{ title: string; message: string }>()

const data = useCatalogData()
const b = computed(() => data.value.business)
</script>

<template>
  <section
    class="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-8 py-16 text-center"
    :style="{ backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)' }"
  >
    <h2 class="text-4xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ title }}</h2>
    <p v-if="message" class="max-w-sm" :style="{ color: 'var(--ck-muted)' }">{{ message }}</p>
    <p v-if="b.name" class="text-xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ b.name }}</p>
    <ul class="flex flex-col gap-2 text-base">
      <li v-if="b.address">{{ b.address }}</li>
      <li v-if="b.phone"><a :href="`tel:${b.phone}`">{{ b.phone }}</a></li>
      <li v-if="b.email"><a :href="`mailto:${b.email}`">{{ b.email }}</a></li>
    </ul>
    <div class="flex flex-wrap justify-center gap-3">
      <a
        v-if="b.whatsapp"
        :href="`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`"
        target="_blank"
        rel="noopener noreferrer"
        class="px-6 py-3 font-medium"
        :style="{ backgroundColor: 'var(--ck-primary)', color: 'var(--ck-on-primary)', borderRadius: 'var(--ck-radius)' }"
      >
        Escríbenos por WhatsApp
      </a>
      <a
        v-if="b.instagram"
        :href="`https://instagram.com/${b.instagram.replace('@', '')}`"
        target="_blank"
        rel="noopener noreferrer"
        class="px-6 py-3 font-medium"
        :style="{ border: '1px solid var(--ck-primary)', borderRadius: 'var(--ck-radius)' }"
      >
        @{{ b.instagram.replace('@', '') }}
      </a>
    </div>
  </section>
</template>