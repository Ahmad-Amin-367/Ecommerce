const prisma = require('../src/config/db');

async function seedDelivery() {
  console.log('Seeding Delivery Zones & Settings...');

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

  // Seed or sync delivery zones
  for (const zone of initialZones) {
    const existing = await prisma.deliveryZone.findFirst({
      where: { name: zone.name },
    });

    if (!existing) {
      await prisma.deliveryZone.create({
        data: zone,
      });
      console.log(`Created zone: ${zone.name}`);
    } else {
      await prisma.deliveryZone.update({
        where: { id: existing.id },
        data: zone,
      });
      console.log(`Updated zone: ${zone.name}`);
    }
  }

  // Seed delivery settings
  const existingSetting = await prisma.deliverySetting.findFirst();
  if (!existingSetting) {
    await prisma.deliverySetting.create({
      data: {
        pickupEnabled: true,
        pickupLocationName: 'Milton, ON',
        pickupAddress: 'Milton, Ontario (Exact address provided upon order confirmation)',
        unservicedAreaMessage: 'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
        eventSetupMessage: 'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
      },
    });
    console.log('Created default delivery settings');
  } else {
    console.log('Delivery settings already exist');
  }

  console.log('Seeding completed successfully!');
}

seedDelivery()
  .catch((e) => {
    console.error('Error seeding delivery data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
