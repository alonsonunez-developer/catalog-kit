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

  it('ProductDuo muestra dos productos', () => {
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'p', layout: 'ProductDuo', slots: { products: ['1', '2'] } }] },
        data,
      },
    })
    expect(w.findAll('article')).toHaveLength(2)
  })

  it('ProductGrid8 admite como máximo 8 productos', () => {
    const ids = ['1', '2', '3', '1', '2', '3', '1', '2', '3', '1']
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'p', layout: 'ProductGrid8', slots: { products: ids } }] },
        data,
      },
    })
    expect(w.findAll('article')).toHaveLength(8)
  })

  it('ContactPage toma los datos del negocio', () => {
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'p', layout: 'ContactPage' }] },
        data: { business: { name: 'Dulce Hogar', whatsapp: '+52 636 000 0000' } },
      },
    })
    expect(w.text()).toContain('Dulce Hogar')
    expect(w.find('a[href="https://wa.me/526360000000"]').exists()).toBe(true)
  })

  it('"only" dibuja solo la página pedida', () => {
    const page = {
      version: 2,
      pages: [
        { id: 'a', layout: 'Cover', props: { title: 'Portada' } },
        { id: 'b', layout: 'ContactPage', props: { title: 'Hablemos' } },
      ],
    }
    const primera = mount(PageRenderer, { props: { page, only: 0 } })
    expect(primera.text()).toContain('Portada')
    expect(primera.text()).not.toContain('Hablemos')

    const segunda = mount(PageRenderer, { props: { page, only: 1 } })
    expect(segunda.text()).toContain('Hablemos')
    expect(segunda.text()).not.toContain('Portada')
  })

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
  it('SportHero muestra etiqueta, título, marca y temporada', () => {
    const w = mount(PageRenderer, {
      props: {
        page: {
          version: 2,
          pages: [{ id: 'h', layout: 'SportHero', props: { eyebrow: 'Nueva colección', title: 'Mueve', season: 'PV 2026' } }],
        },
        data: { business: { name: 'North' } },
      },
    })
    for (const t of ['Nueva colección', 'Mueve', 'PV 2026', 'North']) expect(w.text()).toContain(t)
  })

  it('ProductGrid4 admite 4 productos, con número, categoría y atributos', () => {
    const w = mount(PageRenderer, {
      props: {
        page: {
          version: 2,
          pages: [{ id: 'p', layout: 'ProductGrid4', slots: { products: ['1', '2', '3', '1', '2'] } }],
        },
        data: {
          ...data,
          attributeDefs: [{ key: 'color', label: 'Color', type: 'text' as const }],
          products: data.products.map((p) => ({ ...p, attributes: { color: 'Negro' } })),
        },
      },
    })
    expect(w.findAll('article')).toHaveLength(4)
    expect(w.text()).toContain('01 / Pasteles')
    expect(w.text()).toContain('Color: Negro')
  })

    it('WesternHero muestra etiqueta, título, marca y temporada', () => {
    const w = mount(PageRenderer, {
      props: {
        page: {
          version: 2,
          pages: [{ id: 'h', layout: 'WesternHero', props: { eyebrow: 'Nuevos esenciales', title: 'Frontier', season: 'OI 2026' } }],
        },
        data: { business: { name: 'Ranch' } },
      },
    })
    for (const t of ['Nuevos esenciales', 'Frontier', 'OI 2026', 'Ranch']) expect(w.text()).toContain(t)
  })

  it('ProductShowcase muestra un destacado y los de apoyo', () => {
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'p', layout: 'ProductShowcase', slots: { products: ['1', '2', '3'] } }] },
        data,
      },
    })
    expect(w.findAll('article')).toHaveLength(3)
    expect(w.find('h3').text()).toBe('Pastel de Fresa') // el primero es el destacado
    expect(w.text()).toContain('01 / Pasteles')
  })

  it('ProductGallery muestra todas las fotos, miniaturas y contador', () => {
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'g', layout: 'ProductGallery', slots: { products: ['c1'] } }] },
        data: { products: [{ id: 'c1', name: 'Chamarra', price: 900, images: ['a.jpg', 'b.jpg', 'c.jpg'] }] },
      },
    })
    expect(w.findAll('[data-testid="slide"] img')).toHaveLength(3)
    expect(w.findAll('button[data-thumb]')).toHaveLength(3)
    expect(w.text()).toContain('1 / 3')
    expect(w.text()).toContain('Chamarra')
  })

  it('ProductGallery con una sola foto no muestra miniaturas, y sin fotos muestra la inicial', () => {
    const una = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'g', layout: 'ProductGallery', slots: { products: ['c1'] } }] },
        data: { products: [{ id: 'c1', name: 'Chamarra', price: 900, images: ['a.jpg'] }] },
      },
    })
    expect(una.findAll('button[data-thumb]')).toHaveLength(0)

    const ninguna = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'g', layout: 'ProductGallery', slots: { products: ['c1'] } }] },
        data: { products: [{ id: 'c1', name: 'Chamarra', price: 900 }] },
      },
    })
    expect(ninguna.find('[aria-hidden="true"]').text()).toBe('C')
  })

  it('FeatureStrip numera las características', () => {
    const w = mount(PageRenderer, {
      props: {
        page: { version: 2, pages: [{ id: 'f', layout: 'FeatureStrip', props: { features: ['Ligero', 'Flexible'] } }] },
      },
    })
    expect(w.text()).toContain('01')
    expect(w.text()).toContain('Flexible')
  })
})