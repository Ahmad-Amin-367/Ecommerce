const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class Cart extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: 'Cart',
        tableName: 'carts',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    this.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
  }
}

module.exports = Cart;
