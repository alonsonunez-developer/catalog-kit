import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductGrid from './ProductGrid.vue'

export const ProductGridPropsSchema = z.object({
  title: z.string().default('Productos'),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  spacing: z.enum(['compact', 'normal', 'relaxed']).default('normal'),
  categoryId: z.string().optional(),
  limit: z.number().int().positive().optional(),
  showDescription: z.boolean().default(false),
  respectFilter: z.boolean().default(true),
})

export const ProductGridDefinition = defineComponent({
  name: 'ProductGrid',
  description:
    'Cuadrícula de productos del catálogo. No contiene productos: los toma de los datos del negocio, opcionalmente filtrados por categoría.',
  category: 'catalog',
  propsSchema: ProductGridPropsSchema,
  component: ProductGrid,
})