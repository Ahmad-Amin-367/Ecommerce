const express = require('express');
const router = express.Router();
const b2bController = require('../controllers/b2b.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Public route: Submit B2B Quote
router.post('/quote', b2bController.createQuote);

// Admin routes: Manage quotes
router.get('/quotes', protect, restrictTo('ADMIN'), b2bController.getQuotes);
router.get('/quotes/:id', protect, restrictTo('ADMIN'), b2bController.getQuoteById);
router.patch('/quotes/:id', protect, restrictTo('ADMIN'), b2bController.updateQuote);
router.delete('/quotes/:id', protect, restrictTo('ADMIN'), b2bController.deleteQuote);

module.exports = router;
