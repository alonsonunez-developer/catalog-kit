import { describe, expect, it } from 'vitest'
import { PageSchema, ProductSchema, CatalogDataSchema } from '../src/schema'

describe('PageSchema', () => {
  it('acepta una página válida y aplica el tema por defecto', () => {
    const r = PageSchema.safeParse({ version: 1, sections: [{ id: 'a', type: 'Hero' }] })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.theme).toBe('joyeria')
      expect(r.data.sections[0].props).toEqual({})
    }
  })

  it('rechaza versiones desconocidas', () => {
    expect(PageSchema.safeParse({ version: 2, sections: [] }).success).toBe(false)
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
    expect(d).toEqual({ currency: 'MXN', categories: [], products: [] })
  })
})