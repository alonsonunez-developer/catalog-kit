import { describe, expect, it } from 'vitest'
import { PageSchema, ProductSchema, CatalogDataSchema, pageEntries, productImages, ThemeSchema } from '../src/schema'

describe('PageSchema', () => {
  it('acepta una página válida y aplica el tema por defecto', () => {
    const r = PageSchema.safeParse({ version: 1, sections: [{ id: 'a', type: 'Hero' }] })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.theme).toBe('joyeria')
      expect(pageEntries(r.data)[0].props).toEqual({})
    }
  })

  it('rechaza versiones desconocidas', () => {
    expect(PageSchema.safeParse({ version: 3, sections: [] }).success).toBe(false)
  })

  it('rechaza secciones sin id o sin type', () => {
    expect(PageSchema.safeParse({ version: 1, sections: [{ type: 'Hero' }] }).success).toBe(false)
    expect(PageSchema.safeParse({ version: 1, sections: [{ id: 'a' }] }).success).toBe(false)
  })
})

describe('datos del catálogo', () => {
  it('rechaza precios negativos', () => {
    expect(ProductSchema.safeParse({ id: '1', name: 'X', price: -1 }).success).toBe(false)
  })

  it('completa moneda, categorías y productos por defecto', () => {
    const d = CatalogDataSchema.parse({})
    expect(d).toEqual({ currency: 'MXN', business: {}, attributeDefs: [], categories: [], products: [] })
  })
  
  it('acepta un tema de marca válido (o null) y rechaza uno inválido', () => {
    expect(CatalogDataSchema.safeParse({ brandTheme: null }).success).toBe(true)
    expect(CatalogDataSchema.safeParse({ brandTheme: ThemeSchema.parse({
      name: 'x',
      colors: { primary: '#111111', background: '#ffffff', surface: '#eeeeee', text: '#000000', muted: '#555555', onPrimary: '#ffffff' },
      fonts: { heading: 'Inter', body: 'Inter' },
    }) }).success).toBe(true)
    expect(CatalogDataSchema.safeParse({ brandTheme: { name: 'x' } }).success).toBe(false)
  })
})

describe('Page v2 y productos con atributos', () => {
  it('acepta páginas con slots y completa los valores por defecto', () => {
    const r = PageSchema.safeParse({
      version: 2,
      pages: [{ id: 'p1', layout: 'ProductFeature', slots: { products: ['a'] } }],
    })
    expect(r.success).toBe(true)
    if (r.success) {
      const [entry] = pageEntries(r.data)
      expect(entry).toEqual({ id: 'p1', type: 'ProductFeature', props: {}, slots: { products: ['a'] } })
    }
  })

  it('pageEntries normaliza las secciones de v1', () => {
    const r = PageSchema.parse({ version: 1, sections: [{ id: 'a', type: 'Hero' }] })
    expect(pageEntries(r)).toEqual([{ id: 'a', type: 'Hero', props: {}, slots: {} }])
  })

  it('el producto acepta atributos de texto y de lista', () => {
    const p = ProductSchema.parse({
      id: '1', name: 'Vestido', price: 900, compareAtPrice: 1200,
      attributes: { talla: ['S', 'M'], color: 'Rosa' },
    })
    expect(p.images).toEqual([])
    expect(p.attributes.talla).toEqual(['S', 'M'])
  })

  it('rechaza atributos que no sean texto o lista de textos', () => {
    expect(ProductSchema.safeParse({ id: '1', name: 'X', price: 1, attributes: { talla: 5 } }).success).toBe(false)
  })

  it('acepta display single/double (opcional) y rechaza otros valores', () => {
    const base = { version: 2, pages: [] }
    expect(PageSchema.safeParse(base).success).toBe(true)
    expect(PageSchema.safeParse({ ...base, display: 'double' }).success).toBe(true)
    expect(PageSchema.safeParse({ ...base, display: 'triple' }).success).toBe(false)
  })
})

describe('productImages', () => {
  it('prefiere "images" y cae a "image" si no hay galería', () => {
    expect(productImages({ image: 'x', images: ['a', 'b'] })).toEqual(['a', 'b'])
    expect(productImages({ image: 'x', images: [] })).toEqual(['x'])
    expect(productImages({})).toEqual([])
  })
})