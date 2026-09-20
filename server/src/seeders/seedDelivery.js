const initialZones = [
  {
    name: 'Milton',
    description: 'Free delivery in Milton',
    fee: 0.00,
    postalCodes: ['L9T', 'L9E'],
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Oakville, Burlington & Halton Hills',
    description: 'Oakville, Burlington & Georgetown / Halton Hills',
    fee: 15.00,
    postalCodes: [
      'L6H', 'L6J', 'L6K', 'L6L', 'L6M',
      'L7L', 'L7M', 'L7N', 'L7P', 'L7R',
      'L7G', 'L7J'
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Mississauga (West - Closer)',
    description: 'Mississauga West closer to Milton',
    fee: 20.00,
    postalCodes: ['L5M', 'L5N', 'L5W', 'L5L', 'L5K', 'L5J'],
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'Mississauga (East - Farther)',
    description: 'Mississauga East / Central farther from Milton',
    fee: 25.00,
    postalCodes: [
      'L4T', 'L4V', 'L4W', 'L4X', 'L4Y', 'L4Z',
      'L5A', 'L5B', 'L5C', 'L5E', 'L5G', 'L5H', 'L5R', 'L5V'
    ],
    isActive: true,
    sortOrder: 4,
  },
  {
    name: 'Brampton (West - Closer)',
    description: 'Brampton West / South closer to Milton',
    fee: 20.00,
    postalCodes: ['L6X', 'L6Y', 'L6W', 'L6V'],
    isActive: true,
    sortOrder: 5,
  },
  {
    name: 'Brampton (East - Farther)',
    description: 'Brampton East / North farther from Milton',
    fee: 25.00,
    postalCodes: ['L6P', 'L6R', 'L6S', 'L6T', 'L6Z', 'L7A'],
    isActive: true,
    sortOrder: 6,
  },
];

async function seedDelivery(models) {
  const { DeliveryZone, DeliverySetting } = models;

  try {
    const zoneCount = await DeliveryZone.count();
    if (zoneCount === 0) {
      console.log('🌱 Seeding default Canadian Delivery Zones...');
      for (const zone of initialZones) {
        await DeliveryZone.create(zone);
        console.log(`   ✓ Created zone: ${zone.name}`);
      }
      console.log('✅ Delivery zones seeded successfully');
    } else {
      console.log(`ℹ️ Delivery zones already exist in DB (${zoneCount} zones found). Skipping zone seed.`);
    }

    const settingCount = await DeliverySetting.count();
    if (settingCount === 0) {
      console.log('🌱 Seeding default Delivery & Pickup Settings...');
      await DeliverySetting.create({
        pickupEnabled: true,
        pickupLocationName: 'Milton, ON',
        pickupAddress: 'Milton, Ontario (Exact address provided upon order confirmation)',
        unservicedAreaMessage:
          'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
        eventSetupMessage:
          'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
      });
      console.log('✅ Delivery settings seeded successfully');
    } else {
      console.log('ℹ️ Delivery settings already exist in DB. Skipping setting seed.');
    }
  } catch (error) {
    console.error('❌ Error in seedDelivery:', error.message);
    throw error;
  }
}

module.exports = { seedDelivery, initialZones };
