import { z } from 'zod'
import { defineComponent } from '../../registry'
import Hero from './Hero.vue'

export const HeroPropsSchema = z.object({
  title: z.string().default('Título principal'),
  subtitle: z.string().default(''),
  image: z.string().optional(),
  buttonLabel: z.string().optional(),
  buttonHref: z.string().default('#'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
})

export const HeroDefinition = defineComponent({
  name: 'Hero',
  description: 'Encabezado principal con título, subtítulo, imagen de fondo y botón opcional.',
  category: 'layout',
  propsSchema: HeroPropsSchema,
  component: Hero,
})