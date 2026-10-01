<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogData } from '../../renderer/context'

const props = defineProps<{
  businessName?: string
  tagline?: string
  email?: string
  phone?: string
  address?: string
  whatsapp?: string
  instagram?: string
}>()

const data = useCatalogData()

// Props del diseño > datos del negocio. Un texto vacío en las props oculta el campo.
const info = computed(() => {
  const b = data.value.business
  return {
    name: props.businessName || b.name || 'Mi negocio',
    tagline: props.tagline ?? b.tagline,
    email: props.email ?? b.email,
    phone: props.phone ?? b.phone,
    address: props.address ?? b.address,
    whatsapp: props.whatsapp ?? b.whatsapp,
    instagram: props.instagram ?? b.instagram,
  }
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-6 py-12" :style="{ backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)' }">
    <div class="flex flex-col gap-8 md:flex-row md:justify-between">
      <div>
        <p class="text-2xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ info.name }}</p>
        <p v-if="info.tagline" class="mt-1 text-sm" :style="{ color: 'var(--ck-muted)' }">{{ info.tagline }}</p>
      </div>
      <ul class="flex flex-col gap-1 text-sm">
        <li v-if="info.address">{{ info.address }}</li>
        <li v-if="info.phone"><a :href="`tel:${info.phone}`">{{ info.phone }}</a></li>
        <li v-if="info.email"><a :href="`mailto:${info.email}`">{{ info.email }}</a></li>
        <li v-if="info.whatsapp">
          <a :href="`https://wa.me/${info.whatsapp.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </li>
        <li v-if="info.instagram">
          <a :href="`https://instagram.com/${info.instagram.replace('@', '')}`" target="_blank" rel="noopener noreferrer">
            @{{ info.instagram.replace('@', '') }}
          </a>
        </li>
      </ul>
    </div>
    <p class="mt-8 text-xs" :style="{ color: 'var(--ck-muted)' }">© {{ year }} {{ info.name }}</p>
  </footer>
</template>