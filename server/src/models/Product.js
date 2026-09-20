const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class Product extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        comparePrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        categoryId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        isFeatured: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isEventSetup: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        images: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          defaultValue: [],
        },
        tags: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          defaultValue: [],
        },
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    this.hasMany(models.CartItem, { foreignKey: 'productId', as: 'cartItems', onDelete: 'CASCADE' });
    this.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
    this.hasMany(models.Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
  }
}

module.exports = Product;
