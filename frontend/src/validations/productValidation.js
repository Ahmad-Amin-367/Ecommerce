import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().positive('Price must be a positive number'),
  comparePrice: z.union([z.coerce.number().min(0, 'Compare price must be positive'), z.null()]).optional(),
  sku: z.string().max(100).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});
