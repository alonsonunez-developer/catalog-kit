import { z } from 'zod'
import { defineComponent } from '../../registry'
import WesternHero from './WesternHero.vue'

export const WesternHeroPropsSchema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().default('Colección'),
  subtitle: z.string().default(''),
  season: z.string().default(''),
  image: z.string().optional(),
  showBusinessName: z.boolean().default(true),
})

export const WesternHeroDefinition = defineComponent({
  name: 'WesternHero',
  description:
    'Portada editorial estilo western: franja con marca y temporada, etiqueta, titular en serif y debajo una foto vertical.',
  category: 'page-static',
  propsSchema: WesternHeroPropsSchema,
  component: WesternHero,
})