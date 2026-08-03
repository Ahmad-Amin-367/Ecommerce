const Joi = require('joi');

const placeOrder = Joi.object({
  addressId: Joi.string().required().messages({
    'any.required': 'Delivery address is required',
  }),
  paymentMethod: Joi.string()
    .valid('CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER')
    .default('CASH_ON_DELIVERY'),
  notes: Joi.string().max(500).optional().allow(''),
});

const updateStatus = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')
    .required()
    .messages({
      'any.required': 'Order status is required',
      'any.only': 'Invalid order status provided',
    }),
});

const query = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().max(200).optional(),
  status: Joi.string()
    .valid('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')
    .optional(),
  paymentStatus: Joi.string().valid('UNPAID', 'PAID', 'FAILED', 'REFUNDED').optional(),
  paymentMethod: Joi.string().valid('CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  minTotal: Joi.number().min(0).optional(),
  maxTotal: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('createdAt', 'totalAmount').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = { placeOrder, updateStatus, query };
