const prisma = require('../config/db');
const ApiError = require('../utils/apiError');

/**
 * Get all testimonials
 * @param {Object} query - { admin: boolean }
 */
const getTestimonials = async (query = {}) => {
  const where = {};
  
  // If not admin query, only return active testimonials
  if (!query.admin) {
    where.isActive = true;
  }

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return testimonials;
};

/**
 * Get single testimonial by ID
 */
const getTestimonialById = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw ApiError.notFound('Testimonial not found');
  }

  return testimonial;
};

/**
 * Create testimonial (Admin)
 */
const createTestimonial = async (data) => {
  return await prisma.testimonial.create({
    data: {
      name: data.name,
      location: data.location || 'Pakistan',
      rating: Number(data.rating) || 5,
      text: data.text,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    },
  });
};

/**
 * Update testimonial (Admin)
 */
const updateTestimonial = async (id, data) => {
  await getTestimonialById(id);

  return await prisma.testimonial.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.location && { location: data.location }),
      ...(data.rating !== undefined && { rating: Number(data.rating) }),
      ...(data.text && { text: data.text }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    },
  });
};

/**
 * Delete testimonial (Admin)
 */
const deleteTestimonial = async (id) => {
  await getTestimonialById(id);
  await prisma.testimonial.delete({ where: { id } });
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
