// ─── API ──────────────────────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// ─── Order statuses ───────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: { label: 'Pending', color: 'orange' },
  CONFIRMED: { label: 'Confirmed', color: 'blue' },
  PROCESSING: { label: 'Processing', color: 'purple' },
  SHIPPED: { label: 'Shipped', color: 'cyan' },
  DELIVERED: { label: 'Delivered', color: 'green' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  REFUNDED: { label: 'Refunded', color: 'gray' },
};

// ─── Payment methods ──────────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
];

// ─── Sorting options ──────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'name:asc', label: 'Name: A-Z' },
];

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
};
