const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const { sendB2BQuoteNotification } = require('./email.service');

/**
 * Generate unique B2B quote number (e.g. B2B-20260809-A4F2)
 */
const generateQuoteNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `B2B-${dateStr}-${randomStr}`;
};

/**
 * Create a new B2B quote request
 */
const createQuote = async (data) => {
  const quoteNumber = generateQuoteNumber();

  const quote = await prisma.b2BQuote.create({
    data: {
      quoteNumber,
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      eventType: data.eventType || 'Corporate Event',
      guestCount: data.guestCount || '25-50',
      budgetRange: data.budgetRange || null,
      serviceType: data.serviceType || 'Corporate Gifting',
      notes: data.notes || null,
    },
  });

  // Trigger non-blocking email notification
  sendB2BQuoteNotification(quote).catch(() => {});

  return quote;
};

/**
 * Get all B2B quotes (Admin only)
 */
const getQuotes = async (query = {}) => {
  const { status, search, page = 1, limit = 20 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { contactName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { quoteNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [quotes, total] = await Promise.all([
    prisma.b2BQuote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.b2BQuote.count({ where }),
  ]);

  return {
    quotes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get single B2B quote by ID
 */
const getQuoteById = async (id) => {
  const quote = await prisma.b2BQuote.findUnique({
    where: { id },
  });

  if (!quote) {
    throw ApiError.notFound('B2B Quote not found');
  }

  return quote;
};

/**
 * Update quote status or admin details (Admin only)
 */
const updateQuote = async (id, data) => {
  await getQuoteById(id);

  const updateData = {};
  if (data.status) updateData.status = data.status;
  if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;
  if (data.estimatedAmount !== undefined) updateData.estimatedAmount = data.estimatedAmount;

  return await prisma.b2BQuote.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Delete B2B quote (Admin only)
 */
const deleteQuote = async (id) => {
  await getQuoteById(id);
  await prisma.b2BQuote.delete({ where: { id } });
};

module.exports = {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
};
