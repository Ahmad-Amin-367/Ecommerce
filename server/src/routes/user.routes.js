const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const userValidation = require('../validations/user.validation');

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get('/profile', protect, userController.getProfile);
router.patch('/profile', protect, validate(userValidation.updateProfile), userController.updateProfile);

// ─── Addresses ────────────────────────────────────────────────────────────────
router.post('/addresses', protect, validate(userValidation.addAddress), userController.addAddress);
router.patch('/addresses/:addressId', protect, validate(userValidation.updateAddress), userController.updateAddress);
router.delete('/addresses/:addressId', protect, userController.deleteAddress);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.get('/', protect, restrictTo('ADMIN'), userController.getAllUsers);
router.patch('/:userId', protect, restrictTo('ADMIN'), validate(userValidation.adminUpdateUser), userController.adminUpdateUser);

module.exports = router;
