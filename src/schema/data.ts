import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  image: z.string().optional(),
  categoryId: z.string().optional(),
  sku: z.string().optional(),
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
  categories: z.array(CategorySchema).default([]),
  products: z.array(ProductSchema).default([]),
})

export type Category = z.infer<typeof CategorySchema>
export type Product = z.infer<typeof ProductSchema>
export type Business = z.infer<typeof BusinessSchema>
export type CatalogData = z.infer<typeof CatalogDataSchema>
// Lo que acepta el renderer (los campos con default son opcionales)
export type CatalogDataInput = z.input<typeof CatalogDataSchema>