import { z } from 'zod'

// Opciones de foto compartidas por los layouts con productos
export const imageProps = {
  imageFit: z.enum(['completa', 'recortada']).default('completa'),
  imageBg: z.enum(['tema', 'blanco', 'transparente']).default('tema'),
}