const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class Address extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        label: {
          type: DataTypes.STRING,
          defaultValue: 'Home',
        },
        street: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postalCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'Address',
        tableName: 'addresses',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    this.hasMany(models.Order, { foreignKey: 'addressId', as: 'orders' });
  }
}

module.exports = Address;
