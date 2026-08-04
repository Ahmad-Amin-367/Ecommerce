const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const authValidation = require('../validations/auth.validation');

router.post('/register', authLimiter, validate(authValidation.register), authController.register);
router.post('/verify-otp', authLimiter, authController.verifyOtp);
router.post('/resend-otp', authLimiter, authController.resendOtp);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.post('/google', authLimiter, authController.googleLogin);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);
router.post('/refresh-token', authLimiter, authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.me);
router.patch('/change-password', protect, validate(authValidation.changePassword), authController.changePassword);

module.exports = router;
