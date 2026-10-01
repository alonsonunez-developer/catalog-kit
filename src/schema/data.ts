import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

// Atributo definido por el negocio (tallas, colores, sabores, tamaños…)
export const AttributeDefSchema = z.object({
  key: z.string().regex(/^[a-z][a-z0-9_]*$/),
  label: z.string(),
  type: z.enum(['text', 'list']).default('text'),
})

export const AttributeValueSchema = z.union([z.string(), z.array(z.string())])

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(), // precio anterior, se muestra tachado
  description: z.string().optional(),
  image: z.string().optional(), // compatibilidad: usa images
  images: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
  sku: z.string().optional(),
  attributes: z.record(z.string(), AttributeValueSchema).default({}),
})

export const BusinessSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
})

export const CatalogDataSchema = z.object({
  currency: z.string().default('MXN'),
  business: BusinessSchema.default({}),
  attributeDefs: z.array(AttributeDefSchema).default([]),
  categories: z.array(CategorySchema).default([]),
  products: z.array(ProductSchema).default([]),
})

export type Category = z.infer<typeof CategorySchema>
export type AttributeDef = z.infer<typeof AttributeDefSchema>
export type Product = z.infer<typeof ProductSchema>
export type Business = z.infer<typeof BusinessSchema>
export type CatalogData = z.infer<typeof CatalogDataSchema>
// Lo que acepta el renderer (los campos con default son opcionales)
export type CatalogDataInput = z.input<typeof CatalogDataSchema>

// Fotos de un producto: "images" si existe; si no, la antigua "image"
export function productImages(p: { image?: string; images?: string[] }): string[] {
  if (p.images?.length) return p.images
  return p.image ? [p.image] : []
}