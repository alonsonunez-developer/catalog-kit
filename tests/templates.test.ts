import { describe, expect, it } from 'vitest'
import { builtinComponents } from '../src/components'
import { PageSchema } from '../src/schema'
import { themes } from '../src/themes'
import { buildPageFromTemplate, catalogTemplates } from '../src/templates'

const products = (n: number, prefix = 'p', categoryId?: string) =>
  Array.from({ length: n }, (_, i) => ({ id: `${prefix}${i + 1}`, categoryId }))
const template = (id: string) => catalogTemplates.find((t) => t.id === id)!
const layouts = (page: ReturnType<typeof buildPageFromTemplate>) => page.pages.map((p) => p.layout)

describe('plantillas', () => {
  it('cada plantilla usa un layout y un tema que existen', () => {
    for (const t of catalogTemplates) {
      const def = builtinComponents.find((c) => c.name === t.productLayout)
      expect(def?.category, t.id).toBe('page-layout')
      expect(Object.keys(themes), t.id).toContain(t.theme)
    }
  })

  it('reparte 20 productos en páginas de 8 entre portada y contacto', () => {
    const page = buildPageFromTemplate(template('compacto'), {
      title: 'Primavera',
      products: products(20),
      categories: [],
    })
    expect(layouts(page)).toEqual(['Cover', 'ProductGrid8', 'ProductGrid8', 'ProductGrid8', 'ContactPage'])
    expect(page.pages.slice(1, 4).map((p) => p.slots.products.length)).toEqual([8, 8, 4])
    expect(page.pages[0].props).toEqual({ title: 'Primavera', subtitle: '' })
  })

  it('cada categoría empieza en una página nueva, con su nombre como título', () => {
    const page = buildPageFromTemplate(template('compacto'), {
      title: 'Menú',
      categories: [
        { id: 'a', name: 'Pasteles' },
        { id: 'b', name: 'Cupcakes' },
      ],
      products: [
        ...products(9, 'a', 'a'),
        ...products(1, 'b', 'b'),
        { id: 'suelto' }, // sin categoría
      ],
    })
    const productPages = page.pages.filter((p) => p.layout === 'ProductGrid8')
    expect(productPages.map((p) => p.props.title)).toEqual(['Pasteles', 'Pasteles', 'Cupcakes', 'Otros'])
    expect(productPages.map((p) => p.slots.products.length)).toEqual([8, 1, 1, 1])
  })

  it('un producto por página con la plantilla Galería, sin título', () => {
    const page = buildPageFromTemplate(template('galeria'), {
      title: 'Joyas',
      products: products(3),
      categories: [{ id: 'x', name: 'Anillos' }],
    })
    const productPages = page.pages.filter((p) => p.layout === 'ProductFeature')
    expect(productPages).toHaveLength(3)
    expect(productPages[0].props).toEqual({})
  })

  it('sin productos genera solo portada y contacto', () => {
    const page = buildPageFromTemplate(template('duo'), { title: 'Vacío', products: [], categories: [] })
    expect(layouts(page)).toEqual(['Cover', 'ContactPage'])
  })

  it('puede omitir la página de contacto', () => {
    const page = buildPageFromTemplate(
      { ...template('duo'), includeContact: false },
      { title: 'X', products: products(2), categories: [] },
    )
    expect(layouts(page)).toEqual(['Cover', 'ProductDuo'])
  })

  it('el resultado es un Page JSON válido con ids únicos', () => {
    const page = buildPageFromTemplate(template('duo'), { title: 'X', products: products(7), categories: [] })
    expect(PageSchema.safeParse(page).success).toBe(true)
    const ids = page.pages.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('la plantilla Deportivo usa portada deportiva y 4 productos por página', () => {
    const page = buildPageFromTemplate(template('deportivo'), { title: 'Run', products: products(9), categories: [] })
    expect(layouts(page)).toEqual(['SportHero', 'ProductGrid4', 'ProductGrid4', 'ProductGrid4', 'ContactPage'])
    expect(page.pages.slice(1, 4).map((p) => p.slots.products.length)).toEqual([4, 4, 1])
    expect(page.pages[0].props).toMatchObject({ title: 'Run', eyebrow: 'Nueva colección' })
    expect(PageSchema.safeParse(page).success).toBe(true)
  })
})