const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    'any.required': 'Product name is required',
  }),
  slug: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
    }),
  description: Joi.string().max(5000).optional(),
  price: Joi.number().positive().precision(2).required().messages({
    'any.required': 'Price is required',
    'number.positive': 'Price must be a positive number',
  }),
  comparePrice: Joi.number().positive().precision(2).optional(),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().max(100).optional(),
  categoryId: Joi.string().required().messages({
    'any.required': 'Category is required',
  }),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  images: Joi.array().items(Joi.string().uri()).default([]),
  tags: Joi.array().items(Joi.string()).default([]),
});

const update = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  slug: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .optional(),
  description: Joi.string().max(5000).optional(),
  price: Joi.number().positive().precision(2).optional(),
  comparePrice: Joi.number().positive().precision(2).optional().allow(null),
  stock: Joi.number().integer().min(0).optional(),
  sku: Joi.string().max(100).optional().allow(null),
  categoryId: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

const query = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  search: Joi.string().max(200).optional(),
  categoryId: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  sortBy: Joi.string().valid('price', 'createdAt', 'name', 'stock').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = { create, update, query };
