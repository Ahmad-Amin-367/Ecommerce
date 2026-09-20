const deliveryService = require('../services/delivery.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Calculate delivery fee
 * @route   POST /api/v1/delivery/calculate
 * @access  Public
 */
const calculateFee = async (req, res, next) => {
  try {
    const { postalCode, fulfillmentType, items } = req.body;
    const result = await deliveryService.calculateDeliveryFee({
      postalCode,
      fulfillmentType,
      items,
    });
    return sendSuccess(res, 200, 'Delivery fee calculated', result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active delivery zones (public)
 * @route   GET /api/v1/delivery/zones
 * @access  Public
 */
const getActiveZones = async (req, res, next) => {
  try {
    const zones = await deliveryService.getActiveZones();
    return sendSuccess(res, 200, 'Active delivery zones retrieved', zones);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get delivery settings (public)
 * @route   GET /api/v1/delivery/settings
 * @access  Public
 */
const getSettings = async (req, res, next) => {
  try {
    const settings = await deliveryService.getDeliverySettings();
    return sendSuccess(res, 200, 'Delivery settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get all delivery zones (including inactive)
 * @route   GET /api/v1/delivery/admin/zones
 * @access  Private (Admin)
 */
const getAllZones = async (req, res, next) => {
  try {
    const zones = await deliveryService.getAllZones();
    return sendSuccess(res, 200, 'All delivery zones retrieved', zones);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Create a new delivery zone
 * @route   POST /api/v1/delivery/admin/zones
 * @access  Private (Admin)
 */
const createZone = async (req, res, next) => {
  try {
    const zone = await deliveryService.createZone(req.body);
    return sendSuccess(res, 201, 'Delivery zone created', zone);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Update a delivery zone
 * @route   PUT /api/v1/delivery/admin/zones/:id
 * @access  Private (Admin)
 */
const updateZone = async (req, res, next) => {
  try {
    const zone = await deliveryService.updateZone(req.params.id, req.body);
    return sendSuccess(res, 200, 'Delivery zone updated', zone);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Delete a delivery zone
 * @route   DELETE /api/v1/delivery/admin/zones/:id
 * @access  Private (Admin)
 */
const deleteZone = async (req, res, next) => {
  try {
    await deliveryService.deleteZone(req.params.id);
    return sendSuccess(res, 200, 'Delivery zone deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Update delivery settings
 * @route   PUT /api/v1/delivery/admin/settings
 * @access  Private (Admin)
 */
const updateSettings = async (req, res, next) => {
  try {
    const settings = await deliveryService.updateDeliverySettings(req.body);
    return sendSuccess(res, 200, 'Delivery settings updated', settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateFee,
  getActiveZones,
  getSettings,
  getAllZones,
  createZone,
  updateZone,
  deleteZone,
  updateSettings,
};
