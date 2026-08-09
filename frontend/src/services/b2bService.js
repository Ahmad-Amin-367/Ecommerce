import api from './api';

export const b2bService = {
  // Submit a B2B quote request
  submitQuote: async (data) => {
    const res = await api.post('/b2b/quote', data);
    return res.data;
  },

  // Get all B2B quotes (Admin only)
  getQuotes: async (params) => {
    const res = await api.get('/b2b/quotes', { params });
    return res.data;
  },

  // Get single quote (Admin)
  getQuoteById: async (id) => {
    const res = await api.get(`/b2b/quotes/${id}`);
    return res.data;
  },

  // Update quote (Admin)
  updateQuote: async (id, data) => {
    const res = await api.patch(`/b2b/quotes/${id}`, data);
    return res.data;
  },

  // Delete quote (Admin)
  deleteQuote: async (id) => {
    const res = await api.delete(`/b2b/quotes/${id}`);
    return res.data;
  },
};

export default b2bService;
