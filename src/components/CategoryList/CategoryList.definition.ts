import { z } from 'zod'
import { defineComponent } from '../../registry'
import CategoryList from './CategoryList.vue'

export const CategoryListPropsSchema = z.object({
  title: z.string().default('Categorías'),
  layout: z.enum(['chips', 'cards']).default('chips'),
  showCount: z.boolean().default(false),
  showAll: z.boolean().default(true), // botón "Todas" (solo en layout chips)
})

export const CategoryListDefinition = defineComponent({
  name: 'CategoryList',
  description: 'Lista de categorías del catálogo, como etiquetas o tarjetas. Al pulsar una, filtra los ProductGrid de la página.',
  category: 'catalog',
  propsSchema: CategoryListPropsSchema,
  component: CategoryList,
})