import api from './api';

const deliveryService = {
  calculateFee: (data) => api.post('/delivery/calculate', data),
  getActiveZones: () => api.get('/delivery/zones'),
  getSettings: () => api.get('/delivery/settings'),

  // Admin APIs
  getAllZonesAdmin: () => api.get('/delivery/admin/zones'),
  createZoneAdmin: (data) => api.post('/delivery/admin/zones', data),
  updateZoneAdmin: (id, data) => api.put(`/delivery/admin/zones/${id}`, data),
  deleteZoneAdmin: (id) => api.delete(`/delivery/admin/zones/${id}`),
  updateSettingsAdmin: (data) => api.put('/delivery/admin/settings', data),
};

export default deliveryService;
