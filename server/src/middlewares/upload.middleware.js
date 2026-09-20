const multer = require('multer');
const ApiError = require('../utils/apiError');

// Store in memory, we'll optimize with Sharp and upload directly to Cloudflare R2
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Only accept images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit (Sharp optimizes this down to ~200KB WebP)
  },
  fileFilter: fileFilter,
});

module.exports = upload;
