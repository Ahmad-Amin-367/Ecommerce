import { z } from 'zod';

export const checkoutSchema = z.object({
  addressId: z.string().min(1, 'Please select a delivery address'),
  paymentMethod: z.enum(
    ['CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'],
    { errorMap: () => ({ message: 'Please select a payment method' }) }
  ),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const addressSchema = z.object({
  label: z.string().max(50).default('Home'),
  street: z.string().min(3, 'Street address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  postalCode: z.string().min(3, 'Postal code is required').max(20),
  isDefault: z.boolean().default(false),
});
