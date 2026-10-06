import { builtinComponents } from '../components'
import type { Page } from '../schema'

type PageV2 = Extract<Page, { version: 2 }>

export interface CatalogTemplate {
  id: string
  name: string
  description: string
  theme: string
  productLayout: string // layout (categoría "page-layout") que se repite para los productos
  groupByCategory: boolean // cada categoría empieza en página nueva
  includeContact: boolean
  coverLayout?: string // por defecto "Cover"
  coverProps?: Record<string, unknown> // textos fijos de la portada (el título y el subtítulo del catálogo los sobrescriben)
}

export const catalogTemplates: CatalogTemplate[] = [
  {
    id: 'compacto',
    name: 'Compacto',
    description: 'Portada, 8 productos por página y contacto. Ideal para catálogos grandes.',
    theme: 'pasteleria',
    productLayout: 'ProductGrid8',
    groupByCategory: true,
    includeContact: true,
  },
  {
    id: 'duo',
    name: 'Dúo',
    description: 'Portada, 2 productos por página con foto grande y contacto.',
    theme: 'joyeria',
    productLayout: 'ProductDuo',
    groupByCategory: true,
    includeContact: true,
  },
  {
    id: 'galeria',
    name: 'Galería',
    description: 'Portada, un producto por página con todos sus detalles y contacto.',
    theme: 'joyeria',
    productLayout: 'ProductFeature',
    groupByCategory: false,
    includeContact: true,
  },
  {
    id: 'deportivo',
    name: 'Deportivo',
    description: 'Portada con foto, 4 productos por página con colores y tallas, y contacto. Pensado para ropa deportiva.',
    theme: 'deportivo',
    productLayout: 'ProductGrid4',
    groupByCategory: true,
    includeContact: true,
    coverLayout: 'SportHero',
    coverProps: { eyebrow: 'Nueva colección' },
  },
  {
    id: 'western',
    name: 'Western',
    description: 'Portada editorial, un producto destacado y tres de apoyo por página, y contacto. Para ropa western, botas y piel.',
    theme: 'western',
    productLayout: 'ProductShowcase',
    groupByCategory: true,
    includeContact: true,
    coverLayout: 'WesternHero',
    coverProps: { eyebrow: 'Nuevos esenciales' },
  },
  {
    id: 'menu',
    name: 'Menú',
    description: 'Portada, lista de precios sin fotos (12 por página, con la categoría como título) y contacto. Para restaurantes, cafeterías y tarifas.',
    theme: 'restaurante',
    productLayout: 'PriceList',
    groupByCategory: true,
    includeContact: true,
  },
  {
    id: 'destacados',
    name: 'Destacados',
    description: 'Portada, 2 productos por página con foto grande y texto al lado, y contacto. Para pastelerías y productos con historia.',
    theme: 'pasteleria',
    productLayout: 'ProductSplit',
    groupByCategory: true,
    includeContact: true,
  },
]

export interface BuildInput {
  title: string
  subtitle?: string
  // Solo los productos que deben aparecer (por ejemplo, los activos), en el orden deseado
  products: { id: string; categoryId?: string }[]
  // En el orden en que deben aparecer
  categories: { id: string; name: string }[]
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

// Reparte los productos en páginas según la plantilla y devuelve un Page JSON v2 válido
export function buildPageFromTemplate(template: CatalogTemplate, input: BuildInput): PageV2 {
  const def = builtinComponents.find((c) => c.name === template.productLayout)
  if (!def || def.category !== 'page-layout') {
    throw new Error(`La plantilla "${template.id}" usa un layout inexistente: ${template.productLayout}`)
  }
  const coverLayout = template.coverLayout ?? 'Cover'
  if (!builtinComponents.some((c) => c.name === coverLayout)) {
    throw new Error(`La plantilla "${template.id}" usa una portada inexistente: ${coverLayout}`)
  }
  const capacity = def.slots?.products?.max ?? 1
  // Solo se pasa "title" a los layouts que lo admiten
  const acceptsTitle = 'title' in (def.propsSchema.parse({}) as object)

  const groups: { title: string; ids: string[] }[] = []
  if (template.groupByCategory && input.categories.length) {
    const known = new Set(input.categories.map((c) => c.id))
    for (const c of input.categories) {
      const ids = input.products.filter((p) => p.categoryId === c.id).map((p) => p.id)
      if (ids.length) groups.push({ title: c.name, ids })
    }
    const rest = input.products.filter((p) => !p.categoryId || !known.has(p.categoryId)).map((p) => p.id)
    if (rest.length) groups.push({ title: groups.length ? 'Otros' : '', ids: rest })
  } else if (input.products.length) {
    groups.push({ title: '', ids: input.products.map((p) => p.id) })
  }

  const coverProps = template.coverProps ?? {}
  const pages: PageV2['pages'] = [
    {
      id: 'cover',
      layout: coverLayout,
      props: {
        ...coverProps,
        title: input.title,
        subtitle: input.subtitle || (typeof coverProps.subtitle === 'string' ? coverProps.subtitle : ''),
      },
      slots: {},
    },
  ]
  let n = 1
  for (const g of groups) {
    for (const ids of chunk(g.ids, capacity)) {
      pages.push({
        id: `p${n++}`,
        layout: template.productLayout,
        props: acceptsTitle && g.title ? { title: g.title } : {},
        slots: { products: ids },
      })
    }
  }
  if (template.includeContact) {
    pages.push({ id: 'contact', layout: 'ContactPage', props: {}, slots: {} })
  }
  return { version: 2, theme: template.theme, pages }
}