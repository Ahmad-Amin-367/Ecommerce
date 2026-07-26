const Joi = require('joi');

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-()]{7,15}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
});

const addAddress = Joi.object({
  label: Joi.string().max(50).default('Home'),
  street: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Street address is required',
  }),
  city: Joi.string().min(2).max(100).required().messages({
    'any.required': 'City is required',
  }),
  state: Joi.string().min(2).max(100).required().messages({
    'any.required': 'State/Province is required',
  }),
  country: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Country is required',
  }),
  postalCode: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Postal code is required',
  }),
  isDefault: Joi.boolean().default(false),
});

const updateAddress = Joi.object({
  label: Joi.string().max(50).optional(),
  street: Joi.string().min(3).max(200).optional(),
  city: Joi.string().min(2).max(100).optional(),
  state: Joi.string().min(2).max(100).optional(),
  country: Joi.string().min(2).max(100).optional(),
  postalCode: Joi.string().min(3).max(20).optional(),
  isDefault: Joi.boolean().optional(),
});

const adminUpdateUser = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  role: Joi.string().valid('CUSTOMER', 'ADMIN').optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = { updateProfile, addAddress, updateAddress, adminUpdateUser };
