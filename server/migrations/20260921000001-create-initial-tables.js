'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Users Table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      authProvider: {
        type: Sequelize.STRING,
        defaultValue: 'LOCAL',
      },
      role: {
        type: Sequelize.ENUM('CUSTOMER', 'ADMIN'),
        defaultValue: 'CUSTOMER',
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      resetPasswordOtp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 2. Pending Users Table
    await queryInterface.createTable('pending_users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 3. Addresses Table
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      label: {
        type: Sequelize.STRING,
        defaultValue: 'Home',
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 4. Categories Table
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 5. Products Table
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      comparePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isEventSetup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 6. Carts Table
    await queryInterface.createTable('carts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 7. Cart Items Table
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Unique constraint on (cartId, productId)
    await queryInterface.addIndex('cart_items', ['cartId', 'productId'], {
      unique: true,
      name: 'cart_items_cart_product_unique',
    });

    // 8. Orders Table
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      addressId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'addresses',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      guestName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      guestEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      guestPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'CONFIRMED',
          'PROCESSING',
          'SHIPPED',
          'DELIVERED',
          'CANCELLED',
          'REFUNDED'
        ),
        defaultValue: 'PENDING',
      },
      paymentStatus: {
        type: Sequelize.ENUM('UNPAID', 'PAID', 'FAILED', 'REFUNDED'),
        defaultValue: 'UNPAID',
      },
      paymentMethod: {
        type: Sequelize.ENUM(
          'CASH_ON_DELIVERY',
          'CREDIT_CARD',
          'DEBIT_CARD',
          'BANK_TRANSFER',
          'STRIPE'
        ),
        defaultValue: 'CASH_ON_DELIVERY',
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      shippingFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fulfillmentType: {
        type: Sequelize.STRING,
        defaultValue: 'DELIVERY',
      },
      deliveryZone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 9. Order Items Table
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 10. Reviews Table
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('reviews', ['userId', 'productId'], {
      unique: true,
      name: 'reviews_user_product_unique',
    });

    // 11. Testimonials Table
    await queryInterface.createTable('testimonials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 12. B2B Quotes Table
    await queryInterface.createTable('b2b_quotes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      quoteNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      eventDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      guestCount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      budgetRange: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      serviceType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'REVIEWED', 'QUOTED', 'APPROVED', 'FULFILLED', 'REJECTED'),
        defaultValue: 'PENDING',
      },
      adminNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estimatedAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 13. Delivery Zones Table
    await queryInterface.createTable('delivery_zones', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      postalCodes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 14. Delivery Settings Table
    await queryInterface.createTable('delivery_settings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      pickupEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      pickupLocationName: {
        type: Sequelize.STRING,
        defaultValue: 'Milton, ON',
      },
      pickupAddress: {
        type: Sequelize.TEXT,
        defaultValue: 'Milton, Ontario (Exact address provided upon order confirmation)',
      },
      unservicedAreaMessage: {
        type: Sequelize.TEXT,
        defaultValue:
          'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
      },
      eventSetupMessage: {
        type: Sequelize.TEXT,
        defaultValue:
          'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('cart_items');
    await queryInterface.dropTable('carts');
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('addresses');
    await queryInterface.dropTable('pending_users');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('testimonials');
    await queryInterface.dropTable('b2b_quotes');
    await queryInterface.dropTable('delivery_settings');
    await queryInterface.dropTable('delivery_zones');
  },
};
