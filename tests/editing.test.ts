import { describe, expect, it } from 'vitest'
import { PageSchema, type Page } from '../src/schema'
import {
  addMissingProducts,
  addPage,
  changeLayout,
  describeProps,
  missingProducts,
  movePage,
  pageLayouts,
  removePage,
  setPageProducts,
} from '../src/editing'

type PageV2 = Extract<Page, { version: 2 }>

const base = (): PageV2 => ({
  version: 2,
  theme: 'joyeria',
  pages: [
    { id: 'cover', layout: 'Cover', props: { title: 'X' }, slots: {} },
    { id: 'p1', layout: 'ProductGrid8', props: { title: 'Anillos' }, slots: { products: ['a', 'b', 'c', 'd', 'e'] } },
    { id: 'contact', layout: 'ContactPage', props: {}, slots: {} },
  ],
})
const ids = (p: PageV2) => p.pages.map((x) => x.id)
const manyIds = (n: number) => Array.from({ length: n }, (_, i) => `n${i}`)

describe('describeProps', () => {
  it('describe los campos de un layout', () => {
    const f = describeProps('ProductGrid8')
    expect(f.find((x) => x.key === 'title')?.kind).toBe('text')
    expect(f.find((x) => x.key === 'showSku')?.kind).toBe('boolean')
    expect(describeProps('Cover').find((x) => x.key === 'image')?.kind).toBe('text')
    expect(describeProps('ProductFeature').find((x) => x.key === 'attributeKeys')?.kind).toBe('textlist')
  })

  it('layouts desconocidos no tienen campos', () => {
    expect(describeProps('NoExiste')).toEqual([])
  })

  it('pageLayouts lista solo layouts de página', () => {
    const names = pageLayouts().map((l) => l.name)
    expect(names).toEqual(expect.arrayContaining(['Cover', 'ProductDuo', 'ProductGrid8', 'ProductFeature', 'ContactPage']))
    expect(names).not.toContain('Hero')
  })
})

describe('operaciones de página', () => {
  it('agrega una página con id único en la posición pedida', () => {
    const r = addPage(base(), 'ProductDuo', 1)
    expect(r.pages[1].layout).toBe('ProductDuo')
    expect(new Set(ids(r)).size).toBe(r.pages.length)
    expect(PageSchema.safeParse(r).success).toBe(true)
  })

  it('ignora layouts que no existen', () => {
    expect(addPage(base(), 'Inventado')).toEqual(base())
  })

  it('elimina y mueve páginas', () => {
    expect(ids(removePage(base(), 1))).toEqual(['cover', 'contact'])
    expect(ids(movePage(base(), 0, 2))).toEqual(['p1', 'contact', 'cover'])
    expect(ids(movePage(base(), 0, 9))).toEqual(['cover', 'p1', 'contact']) // fuera de rango: sin cambios
  })

  it('no modifica el original', () => {
    const original = base()
    removePage(original, 1)
    movePage(original, 0, 2)
    changeLayout(original, 1, 'ProductFeature')
    expect(original).toEqual(base())
  })
})

describe('cambio de layout', () => {
  it('conserva los productos que caben y descarta los textos que no aplican', () => {
    const r = changeLayout(base(), 1, 'ProductFeature')
    expect(r.pages[1].layout).toBe('ProductFeature')
    expect(r.pages[1].slots.products).toEqual(['a'])
    expect(r.pages[1].props).toEqual({}) // "title" no existe en ProductFeature
  })

  it('conserva los textos compartidos', () => {
    const r = changeLayout(base(), 0, 'ContactPage')
    expect(r.pages[0].props).toEqual({ title: 'X' })
  })

  it('un layout sin productos vacía los slots', () => {
    expect(changeLayout(base(), 1, 'Cover').pages[1].slots).toEqual({})
  })
})

describe('productos de una página', () => {
  it('respeta el máximo del layout y quita duplicados', () => {
    const r = setPageProducts(base(), 1, ['a', 'a', ...manyIds(20)])
    expect(r.pages[1].slots.products).toHaveLength(8)
    expect(r.pages[1].slots.products?.filter((x) => x === 'a')).toHaveLength(1)
  })

  it('no hace nada en páginas sin productos', () => {
    expect(setPageProducts(base(), 0, ['a'])).toEqual(base())
  })
})

describe('productos nuevos', () => {
  it('detecta los productos que ninguna página usa', () => {
    expect(missingProducts(base(), ['a', 'x', 'y'])).toEqual(['x', 'y'])
  })

  it('reparte los faltantes en páginas nuevas antes del contacto', () => {
    const all = ['a', 'b', 'c', 'd', 'e', ...manyIds(11)]
    const r = addMissingProducts(base(), all)
    expect(r.pages.map((p) => p.layout)).toEqual(['Cover', 'ProductGrid8', 'ProductGrid8', 'ProductGrid8', 'ContactPage'])
    expect(r.pages[2].slots.products).toHaveLength(8)
    expect(r.pages[3].slots.products).toHaveLength(3)
    expect(missingProducts(r, all)).toEqual([])
    expect(new Set(ids(r)).size).toBe(r.pages.length)
  })

  it('sin faltantes devuelve el mismo catálogo', () => {
    expect(addMissingProducts(base(), ['a', 'b'])).toEqual(base())
  })

  it('si no hay páginas de productos usa ProductGrid8', () => {
    const solo: PageV2 = { version: 2, theme: 'joyeria', pages: [{ id: 'cover', layout: 'Cover', props: {}, slots: {} }] }
    const r = addMissingProducts(solo, ['a', 'b'])
    expect(r.pages.map((p) => p.layout)).toEqual(['Cover', 'ProductGrid8'])
  })
})