import { z } from 'zod'
import { defineComponent } from '../../registry'
import ProductShowcase from './ProductShowcase.vue'

export const ProductShowcasePropsSchema = z.object({
  title: z.string().default(''),
  showCategory: z.boolean().default(true),
  showSku: z.boolean().default(false),
  showAttributes: z.boolean().default(true),
  attributeKeys: z.array(z.string()).default([]), // vacío = todos los atributos del producto
})

export const ProductShowcaseDefinition = defineComponent({
  name: 'ProductShowcase',
  description:
    'Página con un producto destacado grande (el primero) y hasta tres de apoyo en fila debajo. El destacado muestra nombre, precio y atributos.',
  category: 'page-layout',
  propsSchema: ProductShowcasePropsSchema,
  slots: { products: { min: 1, max: 4, label: 'Productos (el primero es el destacado)' } },
  component: ProductShowcase,
})