import { z } from 'zod'
import { defineComponent } from '../../registry'
import ContactPage from './ContactPage.vue'

export const ContactPagePropsSchema = z.object({
  title: z.string().default('Contáctanos'),
  message: z.string().default(''),
})

export const ContactPageDefinition = defineComponent({
  name: 'ContactPage',
  description: 'Página final con los datos de contacto del negocio y botones de WhatsApp e Instagram. Los datos vienen del negocio.',
  category: 'page-static',
  propsSchema: ContactPagePropsSchema,
  component: ContactPage,
})