import { z } from 'zod'
import { defineComponent } from '../../registry'
import PriceList from './PriceList.vue'

export const PriceListPropsSchema = z.object({
  title: z.string().default(''),
  showDescription: z.boolean().default(true),
  showSku: z.boolean().default(false),
  showDots: z.boolean().default(true),
  showCategories: z.boolean().default(false), // títulos de categoría dentro de la lista
  showAttributes: z.boolean().default(false),
  attributeKeys: z.array(z.string()).default([]), // vacío = todos los atributos del producto
})

export const PriceListDefinition = defineComponent({
  name: 'PriceList',
  description:
    'Página de lista de precios sin fotos, para menús y tarifas: hasta 12 productos con nombre, puntos guía, precio y descripción.',
  category: 'page-layout',
  propsSchema: PriceListPropsSchema,
  slots: { products: { min: 1, max: 12, label: 'Productos' } },
  component: PriceList,
})