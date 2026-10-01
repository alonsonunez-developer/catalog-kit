import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PageRenderer from '../src/renderer/PageRenderer.vue'

const data = {
  categories: [
    { id: 'pasteles', name: 'Pasteles' },
    { id: 'cupcakes', name: 'Cupcakes' },
  ],
  products: [
    { id: '1', name: 'Pastel de Fresa', price: 450, categoryId: 'pasteles' },
    { id: '2', name: 'Pastel de Chocolate', price: 480, categoryId: 'pasteles' },
    { id: '3', name: 'Cupcake Vainilla', price: 45, categoryId: 'cupcakes' },
  ],
}

const pageWith = (sections: unknown[]) => ({ version: 1, theme: 'pasteleria', sections })

describe('PageRenderer', () => {

  it('catálogo v2: ProductFeature muestra producto, oferta y atributos del negocio', () => {
    const dataVestidos = {
      attributeDefs: [
        { key: 'talla', label: 'Tallas', type: 'list' as const },
        { key: 'color', label: 'Color', type: 'text' as const },
      ],
      products: [
        {
          id: 'v1', name: 'Vestido Rosa', price: 900, compareAtPrice: 1200, sku: 'VR-01',
          attributes: { talla: ['S', 'M'], color: 'Rosa' },
        },
      ],
    }
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, theme: 'pasteleria', pages: [{ id: 'p1', layout: 'ProductFeature', slots: { products: ['v1'] } }] },
        data: dataVestidos,
      },
    })
    expect(w.text()).toContain('Vestido Rosa')
    expect(w.text()).toContain('$900.00')
    expect(w.find('s').text()).toBe('$1,200.00')
    expect(w.text()).toContain('Tallas')
    expect(w.text()).toContain('S, M')
    expect(w.text()).toContain('VR-01')
  })

  it('catálogo v2: un producto que ya no existe no rompe la página', () => {
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'p1', layout: 'ProductFeature', slots: { products: ['borrado'] } }] },
        data,
      },
    })
    expect(w.text()).toContain('Producto no disponible')
  })

  it('muestra un error si el Page JSON es inválido', () => {
    const w = mount(PageRenderer, { props: { page: { version: 99 } } })
    expect(w.text()).toContain('Page JSON inválido')
  })

  it('muestra un error por componente desconocido sin romper el resto', () => {
    const w = mount(PageRenderer, {
      props: {
        page: pageWith([
          { id: 'x', type: 'Galeria' },
          { id: 'h', type: 'Hero', props: { title: 'Hola' } },
        ]),
      },
    })
    expect(w.text()).toContain('Componente desconocido: "Galeria"')
    expect(w.text()).toContain('Hola')
  })

  it('muestra un error por props inválidas', () => {
    const w = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'g', type: 'ProductGrid', props: { columns: 5 } }]) },
    })
    expect(w.text()).toContain('Props inválidas en "ProductGrid"')
  })

  it('renderiza el Hero con sus props', () => {
    const w = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'h', type: 'Hero', props: { title: 'Dulce Hogar', buttonLabel: 'Ver' } }]) },
    })
    expect(w.text()).toContain('Dulce Hogar')
    expect(w.find('a').text()).toBe('Ver')
  })

  it('ProductGrid toma los productos de data', () => {
    const w = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'g', type: 'ProductGrid' }]), data },
    })
    expect(w.findAll('article')).toHaveLength(3)
  })

  it('ProductGrid filtra por categoría y respeta limit', () => {
    const porCategoria = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'g', type: 'ProductGrid', props: { categoryId: 'cupcakes' } }]), data },
    })
    expect(porCategoria.findAll('article')).toHaveLength(1)

    const conLimite = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'g', type: 'ProductGrid', props: { limit: 2 } }]), data },
    })
    expect(conLimite.findAll('article')).toHaveLength(2)
  })

  it('ProductGrid muestra un mensaje cuando no hay productos', () => {
    const w = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'g', type: 'ProductGrid' }]) },
    })
    expect(w.text()).toContain('No hay productos')
  })

  it('ProductCard sin imagen muestra la inicial', () => {
    const w = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'g', type: 'ProductGrid' }]), data },
    })
    expect(w.find('article img').exists()).toBe(false)
    expect(w.find('article [aria-hidden="true"]').text()).toBe('P')
  })

  it('CategoryList cuenta productos por categoría', () => {
    const w = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'c', type: 'CategoryList', props: { showCount: true } }]), data },
    })
    expect(w.text()).toContain('Pasteles (2)')
    expect(w.text()).toContain('Cupcakes (1)')
  })
  it('CategoryList filtra el ProductGrid al pulsar una categoría', async () => {
    const w = mount(PageRenderer, {
      props: {
        page: pageWith([
          { id: 'c', type: 'CategoryList' },
          { id: 'g', type: 'ProductGrid' },
        ]),
        data,
      },
    })
    const button = (label: string) => w.findAll('button').find((b) => b.text().startsWith(label))!

    expect(w.findAll('article')).toHaveLength(3)
    await button('Cupcakes').trigger('click')
    expect(w.findAll('article')).toHaveLength(1)
    await button('Todas').trigger('click')
    expect(w.findAll('article')).toHaveLength(3)
  })

  it('ProductGrid con respectFilter en false ignora el filtro', async () => {
    const w = mount(PageRenderer, {
      props: {
        page: pageWith([
          { id: 'c', type: 'CategoryList' },
          { id: 'g', type: 'ProductGrid', props: { respectFilter: false } },
        ]),
        data,
      },
    })
    await w.findAll('button').find((b) => b.text().startsWith('Cupcakes'))!.trigger('click')
    expect(w.findAll('article')).toHaveLength(3)
  })

  it('Footer usa los datos del negocio y las props tienen prioridad', () => {
    const conDatos = { ...data, business: { name: 'Dulce Hogar', phone: '6360000000' } }

    const delNegocio = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'f', type: 'Footer' }]), data: conDatos },
    })
    expect(delNegocio.text()).toContain('Dulce Hogar')
    expect(delNegocio.find('a[href="tel:6360000000"]').exists()).toBe(true)

    const conProps = mount(PageRenderer, {
      props: { page: pageWith([{ id: 'f', type: 'Footer', props: { businessName: 'Otro Nombre' } }]), data: conDatos },
    })
    expect(conProps.text()).toContain('Otro Nombre')
  })
})