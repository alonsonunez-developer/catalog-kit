import { z } from 'zod'
import { defineComponent } from '../../registry'
import Banner from './Banner.vue'

export const BannerPropsSchema = z.object({
  message: z.string().default('Promoción especial'),
  buttonLabel: z.string().optional(),
  buttonHref: z.string().default('#'),
  tone: z.enum(['primary', 'surface']).default('primary'),
})

export const BannerDefinition = defineComponent({
  name: 'Banner',
  description: 'Banner promocional con un mensaje corto y un botón opcional.',
  category: 'marketing',
  propsSchema: BannerPropsSchema,
  component: Banner,
})