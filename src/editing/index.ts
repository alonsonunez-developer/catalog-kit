import { z } from 'zod'
import { builtinComponents } from '../components'
import type { Page } from '../schema'

type PageV2 = Extract<Page, { version: 2 }>
type Entry = PageV2['pages'][number]

const defOf = (layout: string) => builtinComponents.find((c) => c.name === layout)

// ===== Descripción de los layouts y de sus props (para generar formularios) =====

export interface LayoutInfo {
  name: string
  description: string
  maxProducts: number // 0 = la página no lleva productos
}

export function pageLayouts(): LayoutInfo[] {
  return builtinComponents
    .filter((c) => c.category === 'page-layout' || c.category === 'page-static')
    .map((c) => ({ name: c.name, description: c.description, maxProducts: c.slots?.products?.max ?? 0 }))
}

export interface PropField {
  key: string
  kind: 'text' | 'boolean' | 'select' | 'number' | 'textlist' | 'unsupported'
  options?: string[]
  default?: unknown
}

export function describeProps(layout: string): PropField[] {
  const def = defOf(layout)
  if (!def) return []
  const js = z.toJSONSchema(def.propsSchema, { io: 'input' }) as { properties?: Record<string, any> }
  return Object.entries(js.properties ?? {}).map(([key, p]) => {
    const base = { key, default: p.default }
    if (p.type === 'boolean') return { ...base, kind: 'boolean' as const }
    if (Array.isArray(p.enum) && p.enum.every((o: unknown) => typeof o === 'string'))
      return { ...base, kind: 'select' as const, options: p.enum as string[] }
    if (p.type === 'string') return { ...base, kind: 'text' as const }
    if (p.type === 'number' || p.type === 'integer') return { ...base, kind: 'number' as const }
    if (p.type === 'array' && p.items?.type === 'string') return { ...base, kind: 'textlist' as const }
    return { ...base, kind: 'unsupported' as const }
  })
}

// ===== Operaciones sobre un catálogo v2 (siempre devuelven un objeto nuevo) =====

export function newPageId(page: PageV2): string {
  const used = new Set(page.pages.map((p) => p.id))
  let n = 1
  while (used.has(`p${n}`)) n++
  return `p${n}`
}

export function addPage(page: PageV2, layout: string, index = page.pages.length): PageV2 {
  if (!defOf(layout)) return page
  const at = Math.max(0, Math.min(page.pages.length, index))
  const entry: Entry = { id: newPageId(page), layout, props: {}, slots: {} }
  const pages = [...page.pages]
  pages.splice(at, 0, entry)
  return { ...page, pages }
}

export function removePage(page: PageV2, index: number): PageV2 {
  if (index < 0 || index >= page.pages.length) return page
  return { ...page, pages: page.pages.filter((_, i) => i !== index) }
}

export function movePage(page: PageV2, from: number, to: number): PageV2 {
  const n = page.pages.length
  if (from < 0 || from >= n || to < 0 || to >= n || from === to) return page
  const pages = [...page.pages]
  const [item] = pages.splice(from, 1)
  pages.splice(to, 0, item)
  return { ...page, pages }
}

// Cambia el layout conservando los textos que el nuevo layout también tiene
// y los productos que quepan. Los que no caben quedan sin página (ver addMissingProducts).
export function changeLayout(page: PageV2, index: number, layout: string): PageV2 {
  const def = defOf(layout)
  const current = page.pages[index]
  if (!def || !current || current.layout === layout) return page
  const keys = new Set(describeProps(layout).map((f) => f.key))
  const props = Object.fromEntries(Object.entries(current.props).filter(([k]) => keys.has(k)))
  const max = def.slots?.products?.max
  const slots = max ? { products: (current.slots.products ?? []).slice(0, max) } : {}
  const pages = page.pages.map((p, i) => (i === index ? { ...p, layout, props, slots } : p))
  return { ...page, pages }
}

export function setPageProducts(page: PageV2, index: number, ids: string[]): PageV2 {
  const current = page.pages[index]
  const max = current ? defOf(current.layout)?.slots?.products?.max : undefined
  if (!current || !max) return page
  const unique = [...new Set(ids)].slice(0, max)
  const pages = page.pages.map((p, i) => (i === index ? { ...p, slots: { ...p.slots, products: unique } } : p))
  return { ...page, pages }
}

// Productos que ninguna página usa
export function missingProducts(page: PageV2, productIds: string[]): string[] {
  const used = new Set(page.pages.flatMap((p) => p.slots.products ?? []))
  return productIds.filter((id) => !used.has(id))
}

// Reparte los productos que faltan en páginas nuevas, con el mismo layout de la última página de
// productos (o ProductGrid8 si no hay ninguna), antes de la página de contacto si es la última.
export function addMissingProducts(page: PageV2, productIds: string[]): PageV2 {
  const missing = missingProducts(page, productIds)
  if (!missing.length) return page
  const last = [...page.pages].reverse().find((p) => defOf(p.layout)?.slots?.products)
  const layout = last?.layout ?? 'ProductGrid8'
  const capacity = defOf(layout)?.slots?.products?.max ?? 1
  const tail = page.pages[page.pages.length - 1]
  const insertAt = tail?.layout === 'ContactPage' ? page.pages.length - 1 : page.pages.length

  let result = page
  for (let i = 0, at = insertAt; i < missing.length; i += capacity, at++) {
    result = addPage(result, layout, at)
    result = setPageProducts(result, at, missing.slice(i, i + capacity))
  }
  return result
}