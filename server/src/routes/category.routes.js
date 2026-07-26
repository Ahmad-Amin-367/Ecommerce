const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', categoryController.getCategories);            // ?tree=true for nested
router.get('/:identifier', categoryController.getCategory);  // by ID or slug

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.post('/', protect, restrictTo('ADMIN'), categoryController.createCategory);
router.patch('/:id', protect, restrictTo('ADMIN'), categoryController.updateCategory);
router.delete('/:id', protect, restrictTo('ADMIN'), categoryController.deleteCategory);

module.exports = router;
