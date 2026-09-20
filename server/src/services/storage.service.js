const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const crypto = require('crypto');
const r2Client = require('../config/r2');
const logger = require('../config/logger');
const ApiError = require('../utils/apiError');

/**
 * Resize, optimize to WebP, and upload image buffer to Cloudflare R2
 * @param {Buffer} buffer - Original image buffer from multer
 * @param {string} folder - Destination folder in bucket ('products', 'banners', etc.)
 * @returns {Promise<{ url: string, key: string }>}
 */
const optimizeAndUpload = async (buffer, folder = 'products') => {
  if (!buffer) {
    throw ApiError.badRequest('No image buffer provided for upload');
  }

  // Optimize with Sharp: Max 1600px width/height, WebP format with 85% quality
  const optimizedBuffer = await sharp(buffer)
    .rotate() // Auto-orient based on EXIF before stripping
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  const uniqueId = crypto.randomBytes(6).toString('hex');
  const key = `${folder}/${Date.now()}-${uniqueId}.webp`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: optimizedBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await r2Client.send(command);

  const publicBaseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
  const url = `${publicBaseUrl}/${key}`;

  logger.info(`[R2 Storage] Image uploaded: ${key}`);

  return { url, key };
};

/**
 * Delete an object from Cloudflare R2
 * @param {string} keyOrUrl - The S3 object key or full public URL
 */
const deleteFromR2 = async (keyOrUrl) => {
  if (!keyOrUrl) return;

  try {
    let key = keyOrUrl;
    if (key.startsWith('http')) {
      const parsed = new URL(key);
      key = parsed.pathname.replace(/^\/+/, '');
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    logger.info(`[R2 Storage] Image deleted: ${key}`);
  } catch (error) {
    logger.error(`[R2 Storage] Failed to delete image: ${error.message}`, { keyOrUrl });
  }
};

module.exports = {
  optimizeAndUpload,
  deleteFromR2,
};
