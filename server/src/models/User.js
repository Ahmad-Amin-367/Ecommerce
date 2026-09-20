const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class User extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        googleId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        authProvider: {
          type: DataTypes.STRING,
          defaultValue: 'LOCAL',
        },
        role: {
          type: DataTypes.ENUM('CUSTOMER', 'ADMIN'),
          defaultValue: 'CUSTOMER',
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        resetPasswordOtp: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resetPasswordExpires: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
    this.hasOne(models.Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
    this.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
    this.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
  }
}

module.exports = User;
