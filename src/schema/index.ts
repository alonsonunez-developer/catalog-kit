import { z } from 'zod'

export const SectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.unknown()).default({}),
})

export const ThemeSchema = z.object({
  name: z.string(),
  colors: z.object({
    primary: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.string(),
    muted: z.string(),
    onPrimary: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  radius: z.string().default('0.5rem'),
})

export const PageSchema = z.object({
  version: z.literal(1),
  theme: z.union([z.string(), ThemeSchema]).default('joyeria'),
  sections: z.array(SectionSchema),
})

export type Section = z.infer<typeof SectionSchema>
export type Theme = z.infer<typeof ThemeSchema>
export type Page = z.infer<typeof PageSchema>