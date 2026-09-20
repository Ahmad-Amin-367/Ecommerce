const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Public routes ────────────────────────────────────────────────────────────
router.post('/calculate', deliveryController.calculateFee);
router.get('/zones', deliveryController.getActiveZones);
router.get('/settings', deliveryController.getSettings);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.get('/admin/zones', protect, restrictTo('ADMIN'), deliveryController.getAllZones);
router.post('/admin/zones', protect, restrictTo('ADMIN'), deliveryController.createZone);
router.put('/admin/zones/:id', protect, restrictTo('ADMIN'), deliveryController.updateZone);
router.delete('/admin/zones/:id', protect, restrictTo('ADMIN'), deliveryController.deleteZone);
router.put('/admin/settings', protect, restrictTo('ADMIN'), deliveryController.updateSettings);

module.exports = router;
