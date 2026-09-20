const prisma = require('../config/db');
const ApiError = require('../utils/apiError');

/**
 * Standardize Canadian postal code to first 3 characters (FSA)
 * E.g. "l9t 4b2" -> "L9T"
 */
const formatPostalCodeFSA = (postalCode) => {
  if (!postalCode || typeof postalCode !== 'string') return '';
  const cleaned = postalCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return cleaned.substring(0, 3);
};

/**
 * Calculate delivery fee based on postal code, fulfillment type, and items
 */
const calculateDeliveryFee = async ({ postalCode, fulfillmentType = 'DELIVERY', items = [] }) => {
  // 1. Fetch current settings
  let settings = await prisma.deliverySetting.findFirst();
  if (!settings) {
    settings = await prisma.deliverySetting.create({
      data: {
        pickupEnabled: true,
        pickupLocationName: 'Milton, ON',
        pickupAddress: 'Milton, Ontario (Exact address provided upon order confirmation)',
        unservicedAreaMessage:
          'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
        eventSetupMessage:
          'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
      },
    });
  }

  // 2. Check if any product in items has isEventSetup === true
  if (items && items.length > 0) {
    const productIds = items
      .map((item) => item.productId || item.product?.id || item.id)
      .filter(Boolean);

    if (productIds.length > 0) {
      const eventProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          isEventSetup: true,
        },
        select: { id: true, name: true, isEventSetup: true },
      });

      if (eventProducts.length > 0) {
        return {
          isEventSetup: true,
          isAvailable: false,
          requiresQuote: true,
          fee: null,
          eventSetupMessage: settings.eventSetupMessage,
          eventItems: eventProducts.map((p) => p.name),
        };
      }
    }
  }

  // 3. Store Pickup Branch
  if (fulfillmentType === 'PICKUP') {
    if (!settings.pickupEnabled) {
      throw ApiError.badRequest('Store pickup is currently unavailable');
    }
    return {
      fulfillmentType: 'PICKUP',
      isAvailable: true,
      requiresQuote: false,
      fee: 0,
      zoneName: 'Free Store Pickup (Milton)',
      pickupLocationName: settings.pickupLocationName,
      pickupAddress: settings.pickupAddress,
    };
  }

  // 4. Local Delivery Branch
  const fsa = formatPostalCodeFSA(postalCode);
  if (!fsa || fsa.length < 3) {
    return {
      fulfillmentType: 'DELIVERY',
      isAvailable: false,
      requiresQuote: false,
      fee: null,
      message: 'Please enter a valid Canadian postal code (e.g. L9T 4B2)',
    };
  }

  // Find matching active zone
  const activeZones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  const matchedZone = activeZones.find((zone) =>
    zone.postalCodes.some((code) => code.trim().toUpperCase() === fsa)
  );

  if (matchedZone) {
    return {
      fulfillmentType: 'DELIVERY',
      isAvailable: true,
      requiresQuote: false,
      fee: Number(matchedZone.fee),
      zoneName: matchedZone.name,
      zoneId: matchedZone.id,
      postalCodeFSA: fsa,
    };
  }

  // Unserviced Area / Contact Us Branch
  return {
    fulfillmentType: 'DELIVERY',
    isAvailable: false,
    requiresQuote: false,
    fee: null,
    isUnserviced: true,
    unservicedAreaMessage: settings.unservicedAreaMessage,
    postalCodeFSA: fsa,
  };
};

/**
 * Admin: Get all delivery zones
 */
const getAllZones = async () => {
  return prisma.deliveryZone.findMany({
    orderBy: { sortOrder: 'asc' },
  });
};

/**
 * Public: Get active delivery zones (for customers to browse supported areas)
 */
const getActiveZones = async () => {
  return prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
};

/**
 * Admin: Create a new delivery zone
 */
const createZone = async (data) => {
  const { name, description, fee, postalCodes, isActive = true, sortOrder = 0 } = data;

  if (!name || fee === undefined || !postalCodes) {
    throw ApiError.badRequest('Name, fee, and postalCodes are required');
  }

  // Clean postal codes array (uppercase, first 3 chars)
  const formattedCodes = Array.isArray(postalCodes)
    ? postalCodes
        .map((code) => formatPostalCodeFSA(code))
        .filter((code) => code.length === 3)
    : [];

  return prisma.deliveryZone.create({
    data: {
      name,
      description,
      fee: Number(fee),
      postalCodes: Array.from(new Set(formattedCodes)),
      isActive: Boolean(isActive),
      sortOrder: Number(sortOrder) || 0,
    },
  });
};

/**
 * Admin: Update a delivery zone
 */
const updateZone = async (id, data) => {
  const existing = await prisma.deliveryZone.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Delivery zone not found');
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.fee !== undefined) updateData.fee = Number(data.fee);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
  if (data.sortOrder !== undefined) updateData.sortOrder = Number(data.sortOrder);

  if (data.postalCodes !== undefined) {
    const formattedCodes = Array.isArray(data.postalCodes)
      ? data.postalCodes
          .map((code) => formatPostalCodeFSA(code))
          .filter((code) => code.length === 3)
      : [];
    updateData.postalCodes = Array.from(new Set(formattedCodes));
  }

  return prisma.deliveryZone.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Admin: Delete a delivery zone
 */
const deleteZone = async (id) => {
  const existing = await prisma.deliveryZone.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Delivery zone not found');
  }

  return prisma.deliveryZone.delete({ where: { id } });
};

/**
 * Get delivery settings (singleton)
 */
const getDeliverySettings = async () => {
  let settings = await prisma.deliverySetting.findFirst();
  if (!settings) {
    settings = await prisma.deliverySetting.create({
      data: {
        pickupEnabled: true,
        pickupLocationName: 'Milton, ON',
        pickupAddress: 'Milton, Ontario (Exact address provided upon order confirmation)',
        unservicedAreaMessage:
          'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
        eventSetupMessage:
          'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
      },
    });
  }
  return settings;
};

/**
 * Admin: Update delivery settings
 */
const updateDeliverySettings = async (data) => {
  const settings = await getDeliverySettings();

  const updateData = {};
  if (data.pickupEnabled !== undefined) updateData.pickupEnabled = Boolean(data.pickupEnabled);
  if (data.pickupLocationName !== undefined) updateData.pickupLocationName = data.pickupLocationName;
  if (data.pickupAddress !== undefined) updateData.pickupAddress = data.pickupAddress;
  if (data.unservicedAreaMessage !== undefined) updateData.unservicedAreaMessage = data.unservicedAreaMessage;
  if (data.eventSetupMessage !== undefined) updateData.eventSetupMessage = data.eventSetupMessage;

  return prisma.deliverySetting.update({
    where: { id: settings.id },
    data: updateData,
  });
};

module.exports = {
  formatPostalCodeFSA,
  calculateDeliveryFee,
  getAllZones,
  getActiveZones,
  createZone,
  updateZone,
  deleteZone,
  getDeliverySettings,
  updateDeliverySettings,
};
