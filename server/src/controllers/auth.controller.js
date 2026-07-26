const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');

const register = async (req, res) => {
  const user = await authService.register(req.body);
  sendSuccess(res, 201, 'Account created successfully', user);
};

const login = async (req, res) => {
  const { accessToken, user } = await authService.login(req.body, res);
  sendSuccess(res, 200, 'Logged in successfully', { accessToken, user });
};

const refreshToken = async (req, res) => {
  const { accessToken } = await authService.refreshToken(req);
  sendSuccess(res, 200, 'Token refreshed', { accessToken });
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
