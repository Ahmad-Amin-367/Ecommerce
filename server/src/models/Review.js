const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class Review extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        indexes: [
          {
            unique: true,
            fields: ['userId', 'productId'],
          },
        ],
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });
  }
}

module.exports = Review;
