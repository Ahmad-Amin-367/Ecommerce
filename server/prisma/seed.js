const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Admin User
  const adminEmail = 'admin@hisnagifts.com';
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create Categories
  const categoriesData = [
    { name: 'Birthday Gifts', slug: 'birthday-gifts', description: 'Perfect gifts to celebrate birthdays' },
    { name: 'Anniversary', slug: 'anniversary', description: 'Romantic and memorable anniversary gifts' },
    { name: 'Eid Special', slug: 'eid-special', description: 'Exclusive gift hampers for Eid' },
    { name: 'Custom Gifts', slug: 'custom-gifts', description: 'Personalized and customized gifts' },
    { name: 'Corporate', slug: 'corporate', description: 'Professional corporate gifting solutions' },
    { name: 'Thank You', slug: 'thank-you', description: 'Gifts to express your gratitude' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[category.slug] = category.id;
  }
  console.log('✅ Categories created');

  // 3. Create Products (Inspired by Hisna Gifts Instagram)
  const productsData = [
    {
      name: 'Luxury Strawberry Tower',
      slug: 'luxury-strawberry-tower',
      description: 'A stunning tower of fresh strawberries dipped in premium Belgian chocolate, decorated with edible flowers and gold flakes. Perfect for anniversaries or special events.',
      price: 15000,
      stock: 10,
      sku: 'HG-ST-001',
      categoryId: categories['anniversary'],
      isFeatured: true,
      tags: ['edible arrangement', 'strawberry', 'chocolate', 'luxury'],
    },
    {
      name: 'Custom Alphabet Floral Box',
      slug: 'custom-alphabet-floral-box',
      description: 'Beautiful fresh roses arranged in the shape of a letter of your choice, presented in our signature acrylic box.',
      price: 8500,
      stock: 20,
      sku: 'HG-FL-002',
      categoryId: categories['custom-gifts'],
      isFeatured: true,
      tags: ['flowers', 'roses', 'custom'],
    },
    {
      name: 'Classic Birthday Hamper',
      slug: 'classic-birthday-hamper',
      description: 'A delightful basket featuring imported chocolates, a customized mug, a scented candle, and a handwritten birthday card.',
      price: 6000,
      comparePrice: 7500,
      stock: 15,
      sku: 'HG-BD-003',
      categoryId: categories['birthday-gifts'],
      isFeatured: false,
      tags: ['hamper', 'birthday', 'chocolates'],
    },
    {
      name: 'Premium Eid Date & Nut Platter',
      slug: 'premium-eid-date-nut-platter',
      description: 'A luxurious wooden platter filled with premium stuffed Ajwa dates, roasted nuts, and Turkish delights.',
      price: 12000,
      stock: 50,
      sku: 'HG-EID-004',
      categoryId: categories['eid-special'],
      isFeatured: true,
      tags: ['eid', 'dates', 'nuts', 'platter'],
    },
    {
      name: 'Corporate Executive Box',
      slug: 'corporate-executive-box',
      description: 'A sleek black gift box containing a premium leather wallet, a customized pen, and artisan chocolates. Ideal for client appreciation.',
      price: 9500,
      stock: 100,
      sku: 'HG-CORP-005',
      categoryId: categories['corporate'],
      isFeatured: false,
      tags: ['corporate', 'leather', 'executive'],
    },
    {
      name: 'Gourmet Fruit & Chocolate Bouquet',
      slug: 'gourmet-fruit-chocolate-bouquet',
      description: 'Our signature edible arrangement featuring fresh pineapples shaped like daisies, chocolate-dipped apples, and fresh grapes.',
      price: 7800,
      stock: 25,
      sku: 'HG-FR-006',
      categoryId: categories['thank-you'],
      isFeatured: true,
      tags: ['edible arrangement', 'fruits', 'thank you'],
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log(`✅ ${productsData.length} Products created`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
