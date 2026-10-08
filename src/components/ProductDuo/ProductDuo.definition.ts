import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductDuo from './ProductDuo.vue'
import { imageProps } from '../shared/imageProps'

export const ProductDuoPropsSchema = z.object({
  showSku: z.boolean().default(true),
  ...imageProps
})

export const ProductDuoDefinition = defineComponent({
  name: 'ProductDuo',
  description: 'Página con dos productos, uno sobre otro: foto, nombre, código y precio (con precio anterior si hay oferta).',
  category: 'page-layout',
  propsSchema: ProductDuoPropsSchema,
  slots: { products: { min: 1, max: 2, label: 'Productos' } },
  component: ProductDuo,
})