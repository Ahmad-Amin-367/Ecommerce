const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const cloudinary = require('../config/cloudinary');
const { sendSuccess } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * Upload single image to Cloudinary
 * POST /api/v1/upload
 */
router.post('/', protect, restrictTo('ADMIN'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('Please upload a file');
    }

    // Stream the file from memory to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'hisna_gifts/products' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        const { Readable } = require('stream');
        const readable = new Readable();
        readable._read = () => {};
        readable.push(req.file.buffer);
        readable.push(null);
        readable.pipe(stream);
      });
    };

    const result = await streamUpload(req);

    sendSuccess(res, 200, 'Image uploaded successfully', {
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
