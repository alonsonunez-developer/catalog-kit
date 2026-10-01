import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { CatalogData } from '../schema/data'

const DATA_KEY: InjectionKey<ComputedRef<CatalogData>> = Symbol('catalog-data')
const FILTER_KEY: InjectionKey<Ref<string | null>> = Symbol('catalog-category-filter')

const empty: CatalogData = { currency: 'MXN', business: {}, categories: [], products: [] }

export function provideCatalogData(data: ComputedRef<CatalogData>) {
  provide(DATA_KEY, data)
}

export function useCatalogData(): ComputedRef<CatalogData> {
  return inject(DATA_KEY, computed(() => empty))
}

export function provideCategoryFilter(): Ref<string | null> {
  const selected = ref<string | null>(null)
  provide(FILTER_KEY, selected)
  return selected
}

export function useCategoryFilter(): Ref<string | null> {
  return inject(FILTER_KEY, ref<string | null>(null))
}