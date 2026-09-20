const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class CartItem extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        cartId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cart_items',
        indexes: [
          {
            unique: true,
            fields: ['cartId', 'productId'],
          },
        ],
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart', onDelete: 'CASCADE' });
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });
  }
}

module.exports = CartItem;
