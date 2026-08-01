const testimonialService = require('../services/testimonial.service');
const { sendSuccess } = require('../utils/apiResponse');

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await testimonialService.getTestimonials(req.query);
    sendSuccess(res, 200, 'Testimonials fetched successfully', testimonials);
  } catch (error) {
    next(error);
  }
};

const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.getTestimonialById(req.params.id);
    sendSuccess(res, 200, 'Testimonial fetched successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    sendSuccess(res, 201, 'Testimonial created successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
    sendSuccess(res, 200, 'Testimonial updated successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);
    sendSuccess(res, 200, 'Testimonial deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
