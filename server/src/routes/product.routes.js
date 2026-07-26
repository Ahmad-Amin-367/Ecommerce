const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const productValidation = require('../validations/product.validation');

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', validate(productValidation.query, 'query'), productController.getProducts);
router.get('/:identifier', productController.getProduct);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.post('/', protect, restrictTo('ADMIN'), validate(productValidation.create), productController.createProduct);
router.patch('/:id', protect, restrictTo('ADMIN'), validate(productValidation.update), productController.updateProduct);
router.delete('/:id', protect, restrictTo('ADMIN'), productController.deleteProduct);

module.exports = router;
