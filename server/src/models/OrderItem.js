const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class OrderItem extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        unitPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order', onDelete: 'CASCADE' });
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }
}

module.exports = OrderItem;
