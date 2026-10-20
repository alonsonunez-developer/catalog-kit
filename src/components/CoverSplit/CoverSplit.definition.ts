import { z } from 'zod'
import { defineComponent } from '../../registry'
import { imageProps } from '../shared/imageProps'
import CoverSplit from './CoverSplit.vue'

export const CoverSplitPropsSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().default(''),
  image: z.string().optional(),
  coverSide: z.enum(['izquierda', 'derecha']).default('derecha'),
  showSku: z.boolean().default(false),
  ...imageProps,
})

export const CoverSplitDefinition = defineComponent({
  name: 'CoverSplit',
  description:
    'Página dividida en dos: una imagen grande a todo lo alto (con título opcional encima) en un lado y hasta 2 productos en el otro. El lado de la imagen es configurable.',
  category: 'page-layout',
  propsSchema: CoverSplitPropsSchema,
  slots: { products: { min: 1, max: 2, label: 'Productos' } },
  component: CoverSplit,
})