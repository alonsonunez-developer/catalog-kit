import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import type { CatalogData } from '../schema/data'

const KEY: InjectionKey<ComputedRef<CatalogData>> = Symbol('catalog-data')
const empty: CatalogData = { currency: 'MXN', categories: [], products: [] }

export function provideCatalogData(data: ComputedRef<CatalogData>) {
  provide(KEY, data)
}

export function useCatalogData(): ComputedRef<CatalogData> {
  return inject(KEY, computed(() => empty))
}