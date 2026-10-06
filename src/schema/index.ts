import { z } from 'zod'
import { ThemeSchema } from './theme'

export const SectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.unknown()).default({}),
})

// v2: una página del catálogo. "slots.products" son los ids de los productos de esa página.
export const PageEntrySchema = z.object({
  id: z.string(),
  layout: z.string(),
  props: z.record(z.string(), z.unknown()).default({}),
  slots: z.record(z.string(), z.array(z.string())).default({}),
})

// Nombre de un tema predefinido, "brand" (colores del negocio) o un tema completo
const themeField = z.union([z.string(), ThemeSchema]).default('joyeria')

// v1: una sola página larga con secciones apiladas
export const PageV1Schema = z.object({
  version: z.literal(1),
  theme: themeField,
  sections: z.array(SectionSchema),
})

// v2: catálogo de varias páginas, cada una con su layout
export const PageV2Schema = z.object({
  version: z.literal(2),
  theme: themeField,
  pages: z.array(PageEntrySchema),
})

export const PageSchema = z.discriminatedUnion('version', [PageV1Schema, PageV2Schema])

export type Section = z.infer<typeof SectionSchema>
export type PageEntry = z.infer<typeof PageEntrySchema>
export type Page = z.infer<typeof PageSchema>

// Vista común de v1 y v2: una lista de { id, type, props, slots }
export function pageEntries(page: Page) {
  return page.version === 1
    ? page.sections.map((s) => ({ id: s.id, type: s.type, props: s.props, slots: {} as Record<string, string[]> }))
    : page.pages.map((p) => ({ id: p.id, type: p.layout, props: p.props, slots: p.slots }))
}

export * from './theme'
export * from './data'