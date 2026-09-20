const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const storageService = require('../services/storage.service');
const { sendSuccess } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * Upload & optimize single image to Cloudflare R2
 * POST /api/v1/upload
 */
router.post('/', protect, restrictTo('ADMIN'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('Please upload an image file');
    }

    const folder = req.query.folder || 'products';
    const result = await storageService.optimizeAndUpload(req.file.buffer, folder);

    sendSuccess(res, 200, 'Image uploaded successfully', {
      url: result.url,
      key: result.key,
      public_id: result.key, // Backward compatibility alias
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete image from Cloudflare R2
 * DELETE /api/v1/upload
 */
router.delete('/', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const { key, url } = req.body;
    if (!key && !url) {
      throw ApiError.badRequest('Please provide the image key or url to delete');
    }

    await storageService.deleteFromR2(key || url);

    sendSuccess(res, 200, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
