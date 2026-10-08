import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductFeature from './ProductFeature.vue'
import { imageProps } from '../shared/imageProps'

export const ProductFeaturePropsSchema = z.object({
  showDescription: z.boolean().default(true),
  attributeKeys: z.array(z.string()).default([]), // vacío = todos los atributos del producto
  ...imageProps
})

export const ProductFeatureDefinition = defineComponent({
  name: 'ProductFeature',
  description:
    'Página con un solo producto: foto grande y debajo nombre, precio (con precio anterior si hay oferta), código, descripción y sus atributos (tallas, colores, sabores…).',
  category: 'page-layout',
  propsSchema: ProductFeaturePropsSchema,
  slots: { products: { min: 1, max: 1, label: 'Producto' } },
  component: ProductFeature,
})