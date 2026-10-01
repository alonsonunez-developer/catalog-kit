import { z } from 'zod'
import { defineComponent } from '../../registry'
import Cover from './Cover.vue'

export const CoverPropsSchema = z.object({
  title: z.string().default('Catálogo'),
  subtitle: z.string().default(''),
  image: z.string().optional(),
  showBusinessName: z.boolean().default(true),
})

export const CoverDefinition = defineComponent({
  name: 'Cover',
  description: 'Portada del catálogo: título, subtítulo, nombre del negocio y una imagen de fondo opcional.',
  category: 'page-static',
  propsSchema: CoverPropsSchema,
  component: Cover,
})