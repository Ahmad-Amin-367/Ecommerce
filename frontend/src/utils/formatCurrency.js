/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currency - e.g. 'USD', 'PKR'
 * @param {string} locale - e.g. 'en-US', 'en-PK'
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

/**
 * Calculate discount percentage
 */
export const getDiscountPercent = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};
