<script setup lang="ts">
defineProps<{
  businessName: string
  tagline?: string
  email?: string
  phone?: string
  address?: string
  whatsapp?: string
  instagram?: string
}>()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-6 py-12" :style="{ backgroundColor: 'var(--ck-surface)', color: 'var(--ck-text)' }">
    <div class="flex flex-col gap-8 md:flex-row md:justify-between">
      <div>
        <p class="text-2xl" :style="{ fontFamily: 'var(--ck-font-heading)' }">{{ businessName }}</p>
        <p v-if="tagline" class="mt-1 text-sm" :style="{ color: 'var(--ck-muted)' }">{{ tagline }}</p>
      </div>
      <ul class="flex flex-col gap-1 text-sm">
        <li v-if="address">{{ address }}</li>
        <li v-if="phone"><a :href="`tel:${phone}`">{{ phone }}</a></li>
        <li v-if="email"><a :href="`mailto:${email}`">{{ email }}</a></li>
        <li v-if="whatsapp">
          <a :href="`https://wa.me/${whatsapp.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </li>
        <li v-if="instagram">
          <a :href="`https://instagram.com/${instagram.replace('@', '')}`" target="_blank" rel="noopener noreferrer">
            @{{ instagram.replace('@', '') }}
          </a>
        </li>
      </ul>
    </div>
    <p class="mt-8 text-xs" :style="{ color: 'var(--ck-muted)' }">© {{ year }} {{ businessName }}</p>
  </footer>
</template>