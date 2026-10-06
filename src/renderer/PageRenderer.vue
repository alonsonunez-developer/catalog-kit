<script setup lang="ts">
import { computed, watch } from 'vue'
import { PageSchema, CatalogDataSchema, pageEntries, type CatalogDataInput } from '../schema'
import { getComponent, registerComponent } from '../registry'
import { builtinComponents } from '../components'
import { resolveTheme, themeToStyle } from '../themes'
import { provideCatalogData, provideCategoryFilter } from './context'

builtinComponents.forEach(registerComponent)

// "only": índice (desde 0) de la única página/sección que se dibuja. Sin él se dibujan todas.
const props = defineProps<{ page: unknown; data?: CatalogDataInput; only?: number }>()

const parsed = computed(() => PageSchema.safeParse(props.page))

const catalogData = computed(() => {
  const r = CatalogDataSchema.safeParse(props.data ?? {})
  return r.success ? r.data : CatalogDataSchema.parse({})
})
provideCatalogData(catalogData)

const productsById = computed(() => new Map(catalogData.value.products.map((p) => [p.id, p])))

// Si la categoría seleccionada deja de existir (cambian los datos), se limpia el filtro
const selectedCategory = provideCategoryFilter()
watch(catalogData, (d) => {
  if (selectedCategory.value && !d.categories.some((c) => c.id === selectedCategory.value)) {
    selectedCategory.value = null
  }
})

const themeStyle = computed(() =>
  parsed.value.success
    ? themeToStyle(resolveTheme(parsed.value.data.theme, catalogData.value.brandTheme))
    : {},
)

const items = computed(() => {
  if (!parsed.value.success) return []
  let entries = pageEntries(parsed.value.data)
  if (props.only !== undefined) entries = entries.slice(props.only, props.only + 1)
  return entries.map((s) => {
    const def = getComponent(s.type)
    if (!def) return { id: s.id, error: `Componente desconocido: "${s.type}"` }
    const r = def.propsSchema.safeParse(s.props)
    if (!r.success) return { id: s.id, error: `Props inválidas en "${s.type}": ${r.error.message}` }
    const componentProps: Record<string, unknown> = { ...(r.data as Record<string, unknown>) }
    const slot = def.slots?.products
    if (slot) {
      // Los ids que ya no existen (producto borrado u oculto) se omiten sin romper la página
      componentProps.products = (s.slots.products ?? [])
        .map((id) => productsById.value.get(id))
        .filter((p) => p !== undefined)
        .slice(0, slot.max)
    }
    return { id: s.id, component: def.component, props: componentProps }
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