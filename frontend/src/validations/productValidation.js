import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().positive('Price must be a positive number'),
  comparePrice: z.coerce.number().positive().optional().or(z.literal('')),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(0),
  sku: z.string().max(100).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});
