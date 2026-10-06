import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductGrid4 from './ProductGrid4.vue'

export const ProductGrid4PropsSchema = z.object({
  title: z.string().default(''),
  showCategory: z.boolean().default(true),
  showSku: z.boolean().default(false),
  showAttributes: z.boolean().default(true),
  attributeKeys: z.array(z.string()).default([]), // vacío = todos los atributos del producto
})

export const ProductGrid4Definition = defineComponent({
  name: 'ProductGrid4',
  description:
    'Página con hasta 4 productos en cuadrícula de 2 columnas: foto vertical, número y categoría, nombre, precio y atributos (colores, tallas…).',
  category: 'page-layout',
  propsSchema: ProductGrid4PropsSchema,
  slots: { products: { min: 1, max: 4, label: 'Productos' } },
  component: ProductGrid4,
})