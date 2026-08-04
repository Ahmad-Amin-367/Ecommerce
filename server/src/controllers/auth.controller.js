const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');

const register = async (req, res) => {
  const data = await authService.register(req.body);
  sendSuccess(res, 201, 'Registration pending OTP verification', data);
};

const verifyOtp = async (req, res) => {
  const data = await authService.verifyOtp(req.body, res);
  sendSuccess(res, 200, 'Account verified and logged in successfully', data);
};

const resendOtp = async (req, res) => {
  const data = await authService.resendOtp(req.body);
  sendSuccess(res, 200, 'OTP resent successfully', data);
};

const login = async (req, res) => {
  const data = await authService.login(req.body, res);
  sendSuccess(res, 200, 'Logged in successfully', data);
};

const googleLogin = async (req, res) => {
  const data = await authService.googleLogin(req.body, res);
  sendSuccess(res, 200, 'Logged in with Google successfully', data);
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

const forgotPassword = async (req, res) => {
  const data = await authService.forgotPassword(req.body);
  sendSuccess(res, 200, 'Password reset OTP sent to email', data);
};

const resetPassword = async (req, res) => {
  const data = await authService.resetPassword(req.body);
  sendSuccess(res, 200, 'Password reset successfully', data);
};

const me = async (req, res) => {
  sendSuccess(res, 200, 'Current user', req.user);
};

module.exports = { register, verifyOtp, resendOtp, login, googleLogin, refreshToken, logout, changePassword, forgotPassword, resetPassword, me };
