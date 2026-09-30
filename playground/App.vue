<script setup lang="ts">
import { computed, ref } from 'vue'
import { PageRenderer, themes } from '../src'

const theme = ref('joyeria')
const text = ref(
  JSON.stringify(
    {
      version: 1,
      sections: [
        {
          id: 'hero-1',
          type: 'Hero',
          props: {
            title: 'Elegancia que perdura',
            subtitle: 'Colección otoño 2026',
            buttonLabel: 'Ver catálogo',
            alignment: 'center',
          },
        },
      ],
    },
    null,
    2,
  ),
)

const page = computed(() => {
  try {
    return { ...JSON.parse(text.value), theme: theme.value }
  } catch {
    return null
  }
})
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 lg:grid-cols-[380px_1fr]">
    <aside class="flex flex-col gap-3 border-r border-neutral-300 bg-white p-4 text-neutral-900">
      <label class="text-sm font-semibold">Tema</label>
      <select v-model="theme" class="rounded border p-2">
        <option v-for="name in Object.keys(themes)" :key="name" :value="name">{{ name }}</option>
      </select>
      <label class="text-sm font-semibold">Page JSON</label>
      <textarea v-model="text" class="min-h-96 flex-1 rounded border p-2 font-mono text-xs" spellcheck="false" />
      <p v-if="!page" class="text-sm text-red-600">JSON con error de sintaxis</p>
    </aside>
    <main class="overflow-auto">
      <PageRenderer v-if="page" :page="page" />
    </main>
  </div>
</template>