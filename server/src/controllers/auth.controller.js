const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');

const register = async (req, res) => {
  const user = await authService.register(req.body);
  sendSuccess(res, 201, 'Account created successfully', user);
};

const login = async (req, res) => {
  const data = await authService.login(req.body, res);
  sendSuccess(res, 200, 'Logged in successfully', data);
};

const refreshToken = async (req, res) => {
  const data = await authService.refreshToken(req, res);
  sendSuccess(res, 200, 'Token refreshed', data);
};

const logout = (req, res) => {
  authService.logout(res);
  sendSuccess(res, 200, 'Logged out successfully');
};

const changePassword = async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  sendSuccess(res, 200, 'Password changed successfully');
};

const me = (req, res) => {
  sendSuccess(res, 200, 'Current user', req.user);
};

module.exports = { register, login, refreshToken, logout, changePassword, me };
