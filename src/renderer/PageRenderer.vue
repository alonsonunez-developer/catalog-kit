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

// Logo del negocio: solo en catálogos por páginas (v2) que lo activan
const showLogo = computed(
  () => parsed.value.success && parsed.value.data.version === 2 && parsed.value.data.showLogo === true,
)
const logoUrl = computed(() => catalogData.value.business.logo)
const logoAlt = computed(() => catalogData.value.business.name ?? 'Logo')

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
    return {
      id: s.id,
      component: def.component,
      props: componentProps,
      showLogo: showLogo.value && !s.hideLogo,
    }
  })
})
</script>

<template>
  <div v-if="!parsed.success" class="p-4 text-sm text-red-600">
    Page JSON inválido: {{ parsed.error.message }}
  </div>
  <div
    v-else
    class="flex flex-col"
    :style="{
      ...themeStyle,
      backgroundColor: 'var(--ck-bg)',
      fontFamily: 'var(--ck-font-body)',
      minHeight: 'var(--ck-page-min-h, 0px)',
    }"
  >
    <template v-for="item in items" :key="item.id">
      <template v-if="item.component">
        <!-- Franja del logo: arriba a la izquierda, en el flujo, para no tapar el contenido de la página -->
        <div v-if="item.showLogo && logoUrl" class="px-6 pb-2 pt-4">
          <img :src="logoUrl" :alt="logoAlt" class="h-10 w-auto max-w-[40%] object-contain object-left" />
        </div>
        <!-- Este contenedor ocupa el alto sobrante, para que el layout pueda centrarse o llenar la página -->
        <div class="flex flex-1 flex-col">
          <component :is="item.component" v-bind="item.props" />
        </div>
      </template>
      <div v-else class="m-4 rounded border border-red-400 bg-red-50 p-3 text-sm text-red-700">
        {{ item.error }}
      </div>
    </template>
  </div>
</template>