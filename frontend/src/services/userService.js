import api from './api';

const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (addressId, data) => api.patch(`/users/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
  changePassword: (data) => api.patch('/auth/change-password', data),
  // Admin
  getAllUsers: (params) => api.get('/users', { params }),
  adminUpdateUser: (userId, data) => api.patch(`/users/${userId}`, data),
};

export default userService;
