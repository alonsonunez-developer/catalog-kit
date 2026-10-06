import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductGallery from './ProductGallery.vue'

export const ProductGalleryPropsSchema = z.object({
  showDescription: z.boolean().default(true),
  showSku: z.boolean().default(true),
  showAttributes: z.boolean().default(true),
  attributeKeys: z.array(z.string()).default([]), // vacío = todos los atributos del producto
})

export const ProductGalleryDefinition = defineComponent({
  name: 'ProductGallery',
  description:
    'Página con un solo producto y todas sus fotos en un carrusel deslizable con miniaturas; debajo, nombre, precio, código, descripción y atributos.',
  category: 'page-layout',
  propsSchema: ProductGalleryPropsSchema,
  slots: { products: { min: 1, max: 1, label: 'Producto' } },
  component: ProductGallery,
})