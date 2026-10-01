import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductGrid8 from './ProductGrid8.vue'

export const ProductGrid8PropsSchema = z.object({
  title: z.string().default(''),
  showSku: z.boolean().default(true),
})

export const ProductGrid8Definition = defineComponent({
  name: 'ProductGrid8',
  description: 'Página con hasta 8 productos en cuadrícula de 2 columnas: foto, nombre, código y precio.',
  category: 'page-layout',
  propsSchema: ProductGrid8PropsSchema,
  slots: { products: { min: 1, max: 8, label: 'Productos' } },
  component: ProductGrid8,
})