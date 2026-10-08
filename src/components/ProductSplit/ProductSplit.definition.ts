import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductSplit from './ProductSplit.vue'
import { imageProps } from '../shared/imageProps'

export const ProductSplitPropsSchema = z.object({
  imageSide: z.enum(['alternar', 'izquierda', 'derecha']).default('alternar'),
  showDescription: z.boolean().default(true),
  showSku: z.boolean().default(false),
  showAttributes: z.boolean().default(true),
  attributeKeys: z.array(z.string()).default([]), // vacío = todos los atributos del producto
  ...imageProps
})

export const ProductSplitDefinition = defineComponent({
  name: 'ProductSplit',
  description:
    'Página con hasta 2 productos: foto grande a un lado y al otro nombre, precio, descripción y atributos. La foto puede alternar de lado.',
  category: 'page-layout',
  propsSchema: ProductSplitPropsSchema,
  slots: { products: { min: 1, max: 2, label: 'Productos' } },
  component: ProductSplit,
})