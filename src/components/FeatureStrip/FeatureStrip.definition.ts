import { z } from 'zod'
import { defineComponent } from '../../registry'
import FeatureStrip from './FeatureStrip.vue'

export const FeatureStripPropsSchema = z.object({
  title: z.string().default('Destacados'),
  text: z.string().default(''),
  features: z.array(z.string()).default([]),
})

export const FeatureStripDefinition = defineComponent({
  name: 'FeatureStrip',
  description: 'Página editorial con un titular, un texto corto y una lista numerada de características de la colección.',
  category: 'page-static',
  propsSchema: FeatureStripPropsSchema,
  component: FeatureStrip,
})