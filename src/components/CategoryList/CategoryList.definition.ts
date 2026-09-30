import { z } from 'zod'
import { defineComponent } from '../../registry'
import CategoryList from './CategoryList.vue'

export const CategoryListPropsSchema = z.object({
  title: z.string().default('Categorías'),
  layout: z.enum(['chips', 'cards']).default('chips'),
  showCount: z.boolean().default(false),
})

export const CategoryListDefinition = defineComponent({
  name: 'CategoryList',
  description: 'Lista de categorías del catálogo, como etiquetas o tarjetas. Toma las categorías de los datos del negocio.',
  category: 'catalog',
  propsSchema: CategoryListPropsSchema,
  component: CategoryList,
})