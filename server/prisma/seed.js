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
    // --- ANNIVERSARY ---
    {
      name: 'Luxury Strawberry Tower',
      slug: 'luxury-strawberry-tower',
      description: 'A stunning tower of fresh strawberries dipped in premium Belgian chocolate, decorated with edible flowers and gold flakes. Perfect for anniversaries or special events.',
      price: 150,
      stock: 10,
      categoryId: categories['anniversary'],
      isFeatured: true,
      tags: ['edible arrangement', 'strawberry', 'chocolate', 'luxury'],
      images: ['/products/prod-1.jpg'],
    },
    {
      name: 'Golden Heart Chocolate Box',
      slug: 'golden-heart-chocolate-box',
      description: 'A heart-shaped box filled with golden-wrapped artisan chocolates.',
      price: 45,
      stock: 15,
      categoryId: categories['anniversary'],
      isFeatured: false,
      tags: ['chocolate', 'heart', 'anniversary'],
      images: ['/products/prod-3.jpg'],
    },
    {
      name: 'Rose & Berry Elegance',
      slug: 'rose-berry-elegance',
      description: 'An elegant mix of fresh red roses and chocolate-dipped strawberries in a sleek black box.',
      price: 120,
      stock: 12,
      categoryId: categories['anniversary'],
      isFeatured: true,
      tags: ['roses', 'strawberries', 'anniversary'],
      images: ['/products/prod-2.jpg'],
    },
    {
      name: 'Eternal Love Bouquet',
      slug: 'eternal-love-bouquet',
      description: 'A grand bouquet of 50 premium red roses.',
      price: 200,
      stock: 5,
      categoryId: categories['anniversary'],
      isFeatured: false,
      tags: ['roses', 'bouquet', 'anniversary'],
      images: ['/products/prod-4.jpg'],
    },
    {
      name: 'Anniversary Sweet Platter',
      slug: 'anniversary-sweet-platter',
      description: 'A platter of various sweet treats perfect for sharing on a special day.',
      price: 85,
      stock: 20,
      categoryId: categories['anniversary'],
      isFeatured: false,
      tags: ['sweets', 'platter', 'anniversary'],
      images: ['/products/prod-5.jpg'],
    },

    // --- CUSTOM GIFTS ---
    {
      name: 'Custom Alphabet Floral Box',
      slug: 'custom-alphabet-floral-box',
      description: 'Beautiful fresh roses arranged in the shape of a letter of your choice, presented in our signature acrylic box.',
      price: 85,
      stock: 20,
      categoryId: categories['custom-gifts'],
      isFeatured: true,
      tags: ['flowers', 'roses', 'custom'],
      images: ['/products/prod-2.jpg'],
    },
    {
      name: 'Personalized Engraved Mug',
      slug: 'personalized-engraved-mug',
      description: 'A high-quality ceramic mug with personalized engraving.',
      price: 25,
      stock: 50,
      categoryId: categories['custom-gifts'],
      isFeatured: false,
      tags: ['mug', 'custom'],
      images: ['/products/prod-5.jpg'],
    },
    {
      name: 'Custom Chocolate Message',
      slug: 'custom-chocolate-message',
      description: 'Say it with chocolate! A box of chocolates spelling out a custom message.',
      price: 55,
      stock: 30,
      categoryId: categories['custom-gifts'],
      isFeatured: true,
      tags: ['chocolate', 'custom', 'message'],
      images: ['/products/prod-1.jpg'],
    },
    {
      name: 'Design-Your-Own Fruit Basket',
      slug: 'design-your-own-fruit-basket',
      description: 'Select your favorite fruits and chocolate dips to create the perfect custom basket.',
      price: 110,
      stock: 15,
      categoryId: categories['custom-gifts'],
      isFeatured: false,
      tags: ['fruit', 'basket', 'custom'],
      images: ['/products/prod-6.jpg'],
    },
    {
      name: 'Bespoke Gift Hamper',
      slug: 'bespoke-gift-hamper',
      description: 'Work with our team to create a completely custom hamper from our premium selection.',
      price: 150,
      stock: 10,
      categoryId: categories['custom-gifts'],
      isFeatured: false,
      tags: ['hamper', 'custom', 'bespoke'],
      images: ['/products/prod-3.jpg'],
    },

    // --- BIRTHDAY GIFTS ---
    {
      name: 'Classic Birthday Hamper',
      slug: 'classic-birthday-hamper',
      description: 'A delightful basket featuring imported chocolates, a customized mug, a scented candle, and a handwritten birthday card.',
      price: 60,
      comparePrice: 75,
      stock: 15,
      categoryId: categories['birthday-gifts'],
      isFeatured: false,
      tags: ['hamper', 'birthday', 'chocolates'],
      images: ['/products/prod-3.jpg'],
    },
    {
      name: 'Birthday Balloon & Berry Combo',
      slug: 'birthday-balloon-berry-combo',
      description: 'A festive helium balloon paired with a box of colorful chocolate-dipped strawberries.',
      price: 45,
      stock: 25,
      categoryId: categories['birthday-gifts'],
      isFeatured: true,
      tags: ['birthday', 'balloon', 'berries'],
      images: ['/products/prod-1.jpg'],
    },
    {
      name: 'Ultimate Birthday Cake Box',
      slug: 'ultimate-birthday-cake-box',
      description: 'A decadent mini birthday cake surrounded by fresh berries and macarons.',
      price: 90,
      stock: 8,
      categoryId: categories['birthday-gifts'],
      isFeatured: false,
      tags: ['birthday', 'cake', 'macarons'],
      images: ['/products/prod-4.jpg'],
    },
    {
      name: 'Surprise Party Platter',
      slug: 'surprise-party-platter',
      description: 'A large platter of mixed fruits, chocolates, and cookies designed for a birthday party.',
      price: 130,
      stock: 12,
      categoryId: categories['birthday-gifts'],
      isFeatured: true,
      tags: ['birthday', 'party', 'platter'],
      images: ['/products/prod-6.jpg'],
    },
    {
      name: 'Birthday Bliss Box',
      slug: 'birthday-bliss-box',
      description: 'A curated box of self-care items and sweet treats for a relaxing birthday.',
      price: 75,
      stock: 20,
      categoryId: categories['birthday-gifts'],
      isFeatured: false,
      tags: ['birthday', 'self-care', 'box'],
      images: ['/products/prod-2.jpg'],
    },

    // --- EID SPECIAL ---
    {
      name: 'Premium Eid Date & Nut Platter',
      slug: 'premium-eid-date-nut-platter',
      description: 'A luxurious wooden platter filled with premium stuffed Ajwa dates, roasted nuts, and Turkish delights.',
      price: 120,
      stock: 50,
      categoryId: categories['eid-special'],
      isFeatured: true,
      tags: ['eid', 'dates', 'nuts', 'platter'],
      images: ['/products/prod-4.jpg'],
    },
    {
      name: 'Eid Crescent Floral Arrangement',
      slug: 'eid-crescent-floral-arrangement',
      description: 'A beautiful crescent moon-shaped arrangement of white and gold flowers.',
      price: 85,
      stock: 15,
      categoryId: categories['eid-special'],
      isFeatured: false,
      tags: ['eid', 'floral', 'crescent'],
      images: ['/products/prod-2.jpg'],
    },
    {
      name: 'Family Eid Treat Box',
      slug: 'family-eid-treat-box',
      description: 'A large box of assorted chocolates, dates, and sweets perfect for family gatherings.',
      price: 95,
      stock: 30,
      categoryId: categories['eid-special'],
      isFeatured: true,
      tags: ['eid', 'family', 'treats'],
      images: ['/products/prod-3.jpg'],
    },
    {
      name: 'Luxury Eid Gift Set',
      slug: 'luxury-eid-gift-set',
      description: 'A premium gift set including artisanal perfumes, stuffed dates, and gold-dusted chocolates.',
      price: 250,
      stock: 5,
      categoryId: categories['eid-special'],
      isFeatured: false,
      tags: ['eid', 'luxury', 'gift set'],
      images: ['/products/prod-5.jpg'],
    },
    {
      name: 'Sweet Eid Greetings Basket',
      slug: 'sweet-eid-greetings-basket',
      description: 'A welcoming basket filled with traditional Eid sweets and fresh fruit.',
      price: 65,
      stock: 40,
      categoryId: categories['eid-special'],
      isFeatured: false,
      tags: ['eid', 'basket', 'sweets'],
      images: ['/products/prod-6.jpg'],
    },

    // --- CORPORATE ---
    {
      name: 'Corporate Executive Box',
      slug: 'corporate-executive-box',
      description: 'A sleek black gift box containing a premium leather wallet, a customized pen, and artisan chocolates. Ideal for client appreciation.',
      price: 95,
      stock: 100,
      categoryId: categories['corporate'],
      isFeatured: false,
      tags: ['corporate', 'leather', 'executive'],
      images: ['/products/prod-5.jpg'],
    },
    {
      name: 'Client Appreciation Fruit Basket',
      slug: 'client-appreciation-fruit-basket',
      description: 'A professional and elegant fruit basket to show appreciation to your top clients.',
      price: 110,
      stock: 50,
      categoryId: categories['corporate'],
      isFeatured: true,
      tags: ['corporate', 'client', 'fruit basket'],
      images: ['/products/prod-6.jpg'],
    },
    {
      name: 'Team Celebration Platter',
      slug: 'team-celebration-platter',
      description: 'A massive platter of assorted treats perfect for office parties and team celebrations.',
      price: 180,
      stock: 20,
      categoryId: categories['corporate'],
      isFeatured: false,
      tags: ['corporate', 'team', 'platter'],
      images: ['/products/prod-4.jpg'],
    },
    {
      name: 'Branded Chocolate Box',
      slug: 'branded-chocolate-box',
      description: 'A box of premium chocolates featuring your company logo on the packaging.',
      price: 45,
      stock: 200,
      categoryId: categories['corporate'],
      isFeatured: true,
      tags: ['corporate', 'branded', 'chocolate'],
      images: ['/products/prod-1.jpg'],
    },
    {
      name: 'Welcome Onboard Kit',
      slug: 'welcome-onboard-kit',
      description: 'A thoughtful kit for new employees, including a mug, notebook, and gourmet snacks.',
      price: 55,
      stock: 150,
      categoryId: categories['corporate'],
      isFeatured: false,
      tags: ['corporate', 'onboarding', 'kit'],
      images: ['/products/prod-3.jpg'],
    },

    // --- THANK YOU ---
    {
      name: 'Gourmet Fruit & Chocolate Bouquet',
      slug: 'gourmet-fruit-chocolate-bouquet',
      description: 'Our signature edible arrangement featuring fresh pineapples shaped like daisies, chocolate-dipped apples, and fresh grapes.',
      price: 78,
      stock: 25,
      categoryId: categories['thank-you'],
      isFeatured: true,
      tags: ['edible arrangement', 'fruits', 'thank you'],
      images: ['/products/prod-6.jpg'],
    },
    {
      name: 'Simple Thanks Fruit Box',
      slug: 'simple-thanks-fruit-box',
      description: 'A simple yet elegant box of fresh seasonal fruits to say a quick thank you.',
      price: 35,
      stock: 40,
      categoryId: categories['thank-you'],
      isFeatured: false,
      tags: ['thank you', 'fruit', 'box'],
      images: ['/products/prod-3.jpg'],
    },
    {
      name: 'Gratitude Chocolate Assortment',
      slug: 'gratitude-chocolate-assortment',
      description: 'A beautiful assortment of artisan chocolates with a "Thank You" card.',
      price: 50,
      stock: 30,
      categoryId: categories['thank-you'],
      isFeatured: true,
      tags: ['thank you', 'chocolate'],
      images: ['/products/prod-1.jpg'],
    },
    {
      name: 'Appreciation Floral Mini',
      slug: 'appreciation-floral-mini',
      description: 'A small, bright floral arrangement perfect for a desk or side table.',
      price: 45,
      stock: 25,
      categoryId: categories['thank-you'],
      isFeatured: false,
      tags: ['thank you', 'floral', 'mini'],
      images: ['/products/prod-2.jpg'],
    },
    {
      name: 'Mega Thanks Hamper',
      slug: 'mega-thanks-hamper',
      description: 'A massive hamper filled with fruits, chocolates, and wine to show immense gratitude.',
      price: 160,
      stock: 10,
      categoryId: categories['thank-you'],
      isFeatured: false,
      tags: ['thank you', 'hamper', 'mega'],
      images: ['/products/prod-5.jpg'],
    }
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: { 
        price: prod.price, 
        comparePrice: prod.comparePrice || null,
        images: prod.images 
      },
      create: prod,
    });
  }
  console.log(`✅ ${productsData.length} Products created or updated`);

  // 4. Create Testimonials / Home Reviews
  const testimonialsData = [
    {
      name: 'Ayesha K.',
      location: 'Lahore',
      rating: 5,
      text: 'The edible arrangement was absolutely stunning! My mother loved every bit of it. The packaging was premium and it arrived fresh. Will definitely order again.',
    },
    {
      name: 'Fatima S.',
      location: 'Karachi',
      rating: 5,
      text: 'Ordered a custom birthday hamper for my husband and it exceeded all expectations. The attention to detail was remarkable. Hisna Gifts never disappoints!',
    },
    {
      name: 'Ahmed R.',
      location: 'Islamabad',
      rating: 5,
      text: 'Corporate gifting made easy! We ordered Eid gifts for our entire team and the quality was consistent across every single package. Highly professional service.',
    },
    {
      name: 'Sana M.',
      location: 'Rawalpindi',
      rating: 5,
      text: 'I ordered a gift basket for my friend\'s wedding and it was beautifully arranged. The flowers and chocolates were fresh. Delivery was right on time!',
    },
    {
      name: 'Hassan T.',
      location: 'Faisalabad',
      rating: 5,
      text: 'Best gifting service in Pakistan! The customization options are amazing and the customer support team was incredibly helpful throughout the process.',
    },
  ];

  for (const item of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: item.name, text: item.text },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: item });
    }
  }
  console.log(`✅ ${testimonialsData.length} Testimonials created`);

  // 5. Create Orders (if none exist or < 7)
  const existingOrdersCount = await prisma.order.count();
  if (existingOrdersCount < 7) {
    console.log(`Creating ${7 - existingOrdersCount} Orders...`);
    // Create Customer
    const customerEmail = 'customer@hisnagifts.com';
    const customerPassword = await bcrypt.hash('password123', 10);
    const customer = await prisma.user.upsert({
      where: { email: customerEmail },
      update: {},
      create: {
        name: 'John Doe',
        email: customerEmail,
        password: customerPassword,
        role: 'CUSTOMER',
        phone: '+92 300 1234567',
      },
    });

    // Create Address
    let address = await prisma.address.findFirst({ where: { userId: customer.id } });
    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: customer.id,
          label: 'Home',
          street: '123 Main St',
          city: 'Lahore',
          state: 'Punjab',
          country: 'Pakistan',
          postalCode: '54000',
          isDefault: true,
        },
      });
    }

    // Get some products to use
    const productsList = await prisma.product.findMany({ take: 10 });

    if (productsList.length > 0) {
      const ordersToCreate = 7 - existingOrdersCount;
      const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
      const paymentStatuses = ['UNPAID', 'PAID', 'PAID', 'PAID', 'PAID', 'FAILED', 'REFUNDED'];
      const paymentMethods = ['CASH_ON_DELIVERY', 'CREDIT_CARD', 'BANK_TRANSFER'];

      for (let i = 0; i < ordersToCreate; i++) {
        const orderNumber = `ORD-20260803-00${existingOrdersCount + i + 1}`;
        const p1 = productsList[Math.floor(Math.random() * productsList.length)];
        const p2 = productsList[Math.floor(Math.random() * productsList.length)];
        
        // Randomly choose to have 1 or 2 items
        const hasTwoItems = Math.random() > 0.5 && p1.id !== p2.id;
        const q1 = Math.floor(Math.random() * 3) + 1;
        const q2 = Math.floor(Math.random() * 2) + 1;

        let subtotal = Number(p1.price) * q1;
        const items = [
          {
            productId: p1.id,
            quantity: q1,
            unitPrice: p1.price,
            totalPrice: Number(p1.price) * q1,
          }
        ];

        if (hasTwoItems) {
          subtotal += Number(p2.price) * q2;
          items.push({
            productId: p2.id,
            quantity: q2,
            unitPrice: p2.price,
            totalPrice: Number(p2.price) * q2,
          });
        }

        const shippingFee = subtotal > 1000 ? 0 : 200;
        const totalAmount = subtotal + shippingFee;
        const statusIdx = i % statuses.length; // cycle through different statuses

        await prisma.order.create({
          data: {
            orderNumber,
            userId: customer.id,
            addressId: address.id,
            status: statuses[statusIdx],
            paymentStatus: paymentStatuses[statusIdx],
            paymentMethod: paymentMethods[i % paymentMethods.length],
            subtotal,
            shippingFee,
            totalAmount,
            deliveredAt: statuses[statusIdx] === 'DELIVERED' ? new Date() : null,
            items: { create: items }
          }
        });
      }
      console.log(`✅ ${ordersToCreate} Mock orders created (Total: 7)`);
    }
  }

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
