import { z } from 'zod'

// ============================================
// COMMON TYPES
// ============================================

export const MultiLanguageSchema = z.record(z.string(), z.string())

export type MultiLanguage = z.infer<typeof MultiLanguageSchema>

// ============================================
// PRODUCT TYPES
// ============================================

export const ProductOptionSchema = z.object({
  name: z.string(),
  values: z.array(z.string()),
})

export const ProductImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
  position: z.number(),
})

export const CreateProductSchema = z.object({
  title: MultiLanguageSchema,
  description: MultiLanguageSchema.optional(),
  slug: z.string(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(ProductImageSchema).default([]),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  trackInventory: z.boolean().default(true),
  quantity: z.number().int().default(0),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
  collectionIds: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export type CreateProduct = z.infer<typeof CreateProductSchema>

export const UpdateProductSchema = CreateProductSchema.partial()

export type UpdateProduct = z.infer<typeof UpdateProductSchema>

// ============================================
// CATEGORY TYPES
// ============================================

export const CreateCategorySchema = z.object({
  name: MultiLanguageSchema,
  description: MultiLanguageSchema.optional(),
  slug: z.string(),
  parentId: z.string().nullish(),
  image: z.string().optional(),
  isVisible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
})

export type CreateCategory = z.infer<typeof CreateCategorySchema>

// ============================================
// ORDER TYPES
// ============================================

export const AddressSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().optional(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  province: z.string().optional(),
  country: z.string(),
  zip: z.string(),
  phone: z.string().optional(),
})

export type Address = z.infer<typeof AddressSchema>

export const OrderItemSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  title: z.string(),
  sku: z.string().optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

export const CreateOrderSchema = z.object({
  customerId: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  billingAddress: AddressSchema,
  shippingAddress: AddressSchema,
  items: z.array(OrderItemSchema).min(1),
  currency: z.string().default('TRY'),
  note: z.string().optional(),
})

export type CreateOrder = z.infer<typeof CreateOrderSchema>

// ============================================
// CUSTOMER TYPES
// ============================================

export const CreateCustomerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  acceptsMarketing: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  note: z.string().optional(),
})

export type CreateCustomer = z.infer<typeof CreateCustomerSchema>

// ============================================
// STORE TYPES
// ============================================

export const CreateStoreSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
})

export type CreateStore = z.infer<typeof CreateStoreSchema>

export const UpdateStoreSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
  currencies: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  defaultCurrency: z.string().optional(),
  defaultLanguage: z.string().optional(),
})

export type UpdateStore = z.infer<typeof UpdateStoreSchema>

// ============================================
// THEME TYPES
// ============================================

export const ThemeColorSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
})

export const ThemeConfigSchema = z.object({
  colors: ThemeColorSchema,
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  layout: z.object({
    headerStyle: z.enum(['classic', 'centered', 'minimal']),
    showSearchBar: z.boolean(),
    showWishlist: z.boolean(),
  }),
})

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>

// ============================================
// API RESPONSE TYPES
// ============================================

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export type PaginationParams = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
