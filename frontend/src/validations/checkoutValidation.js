import * as Yup from 'yup';

export const checkoutSchema = Yup.object().shape({
  addressId: Yup.string().required('Please select a delivery address'),
  paymentMethod: Yup.string().oneOf(
    ['CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'],
    'Please select a valid payment method'
  ).required('Please select a payment method'),
  notes: Yup.string().max(500, 'Notes cannot exceed 500 characters'),
});

export const addressSchema = Yup.object().shape({
  label: Yup.string().max(50).default('Home'),
  street: Yup.string().min(3, 'Street address is required').max(200).required('Street address is required'),
  city: Yup.string().min(2, 'City is required').max(100).required('City is required'),
  state: Yup.string().min(2, 'State is required').max(100).required('State is required'),
  country: Yup.string().min(2, 'Country is required').max(100).required('Country is required'),
  postalCode: Yup.string().min(3, 'Postal code is required').max(20).required('Postal code is required'),
  isDefault: Yup.boolean().default(false),
});
