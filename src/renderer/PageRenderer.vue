<script setup lang="ts">
import { computed } from 'vue'
import { PageSchema } from '../schema'
import { getComponent } from '../registry'
import { resolveTheme, themeToStyle } from '../themes'

const props = defineProps<{ page: unknown }>()

const parsed = computed(() => PageSchema.safeParse(props.page))

const themeStyle = computed(() =>
  parsed.value.success ? themeToStyle(resolveTheme(parsed.value.data.theme)) : {},
)

const items = computed(() => {
  if (!parsed.value.success) return []
  return parsed.value.data.sections.map((s) => {
    const def = getComponent(s.type)
    if (!def) return { id: s.id, error: `Componente desconocido: "${s.type}"` }
    const r = def.propsSchema.safeParse(s.props)
    if (!r.success) return { id: s.id, error: `Props inválidas en "${s.type}": ${r.error.message}` }
    return { id: s.id, component: def.component, props: r.data as Record<string, unknown> }
  })
})
</script>

<template>
  <div v-if="!parsed.success" class="p-4 text-sm text-red-600">
    Page JSON inválido: {{ parsed.error.message }}
  </div>
  <div v-else :style="{ ...themeStyle, backgroundColor: 'var(--ck-bg)', fontFamily: 'var(--ck-font-body)' }">
    <template v-for="item in items" :key="item.id">
      <component :is="item.component" v-if="item.component" v-bind="item.props" />
      <div v-else class="m-4 rounded border border-red-400 bg-red-50 p-3 text-sm text-red-700">
        {{ item.error }}
      </div>
    </template>
  </div>
</template>