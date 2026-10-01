import { z } from 'zod'
import { defineComponent } from '../../registry'
import Footer from './Footer.vue'

export const FooterPropsSchema = z.object({
  businessName: z.string().optional(),
  tagline: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
})

export const FooterDefinition = defineComponent({
  name: 'Footer',
  description:
  'Pie de página con nombre del negocio y contacto. Si no se indican props, toma los datos del negocio (nombre, teléfono, correo, WhatsApp, Instagram, dirección).',
  category: 'layout',
  propsSchema: FooterPropsSchema,
  component: Footer,
})