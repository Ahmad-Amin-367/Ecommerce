const { Testimonial } = require('../models');
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

  const testimonials = await Testimonial.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  return testimonials;
};

/**
 * Get single testimonial by ID
 */
const getTestimonialById = async (id) => {
  const testimonial = await Testimonial.findByPk(id);

  if (!testimonial) {
    throw ApiError.notFound('Testimonial not found');
  }

  return testimonial;
};

/**
 * Create testimonial (Admin)
 */
const createTestimonial = async (data) => {
  return await Testimonial.create({
    name: data.name,
    location: data.location || 'Canada',
    rating: Number(data.rating) || 5,
    text: data.text,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  });
};

/**
 * Update testimonial (Admin)
 */
const updateTestimonial = async (id, data) => {
  const testimonial = await getTestimonialById(id);

  await testimonial.update({
    ...(data.name && { name: data.name }),
    ...(data.location && { location: data.location }),
    ...(data.rating !== undefined && { rating: Number(data.rating) }),
    ...(data.text && { text: data.text }),
    ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
  });

  return testimonial;
};

/**
 * Delete testimonial (Admin)
 */
const deleteTestimonial = async (id) => {
  const testimonial = await getTestimonialById(id);
  await testimonial.destroy();
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
