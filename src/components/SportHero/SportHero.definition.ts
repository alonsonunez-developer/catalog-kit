import { z } from 'zod'
import { defineComponent } from '../../registry'
import SportHero from './SportHero.vue'

export const SportHeroPropsSchema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().default('Mueve tu mejor versión'),
  subtitle: z.string().default(''),
  season: z.string().default(''),
  image: z.string().optional(),
  showBusinessName: z.boolean().default(true),
})

export const SportHeroDefinition = defineComponent({
  name: 'SportHero',
  description:
    'Portada deportiva: foto a pantalla completa, franja con marca y temporada, etiqueta superior y titular grande en mayúsculas.',
  category: 'page-static',
  propsSchema: SportHeroPropsSchema,
  component: SportHero,
})