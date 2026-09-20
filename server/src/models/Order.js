const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class Order extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        orderNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        addressId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        guestName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        guestEmail: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        guestPhone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM(
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
          type: DataTypes.ENUM('UNPAID', 'PAID', 'FAILED', 'REFUNDED'),
          defaultValue: 'UNPAID',
        },
        paymentMethod: {
          type: DataTypes.ENUM(
            'CASH_ON_DELIVERY',
            'CREDIT_CARD',
            'DEBIT_CARD',
            'BANK_TRANSFER',
            'STRIPE'
          ),
          defaultValue: 'CASH_ON_DELIVERY',
        },
        subtotal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        shippingFee: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0.00,
        },
        discount: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0.00,
        },
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        stripePaymentIntentId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        deliveredAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        fulfillmentType: {
          type: DataTypes.STRING,
          defaultValue: 'DELIVERY',
        },
        deliveryZone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Address, { foreignKey: 'addressId', as: 'address' });
    this.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
  }
}

module.exports = Order;
