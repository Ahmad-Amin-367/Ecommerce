const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/apiResponse');

const getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  sendSuccess(res, 200, 'Profile fetched', user);
};

const updateProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  sendSuccess(res, 200, 'Profile updated', user);
};

const addAddress = async (req, res) => {
  const address = await userService.addAddress(req.user.id, req.body);
  sendSuccess(res, 201, 'Address added', address);
};

const updateAddress = async (req, res) => {
  const address = await userService.updateAddress(req.user.id, req.params.addressId, req.body);
  sendSuccess(res, 200, 'Address updated', address);
};

const deleteAddress = async (req, res) => {
  await userService.deleteAddress(req.user.id, req.params.addressId);
  sendSuccess(res, 200, 'Address deleted');
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const getAllUsers = async (req, res) => {
  const { users, meta } = await userService.getAllUsers(req.query);
  sendSuccess(res, 200, 'Users fetched', users, meta);
};

const adminUpdateUser = async (req, res) => {
  const user = await userService.adminUpdateUser(req.params.userId, req.body);
  sendSuccess(res, 200, 'User updated', user);
};

module.exports = { getProfile, updateProfile, addAddress, updateAddress, deleteAddress, getAllUsers, adminUpdateUser };
