import { z } from 'zod'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/)
const fontStack = z.string().min(1).max(200).regex(/^[^;{}<>]*$/)

export const ThemeSchema = z.object({
  name: z.string(),
  colors: z.object({
    primary: hexColor,
    background: hexColor,
    surface: hexColor,
    text: hexColor,
    muted: hexColor,
    onPrimary: hexColor,
  }),
  fonts: z.object({
    heading: fontStack,
    body: fontStack,
  }),
  radius: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default('0.5rem'),
})

export type Theme = z.infer<typeof ThemeSchema>