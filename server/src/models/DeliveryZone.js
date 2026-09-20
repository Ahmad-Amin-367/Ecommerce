const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class DeliveryZone extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fee: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        postalCodes: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          defaultValue: [],
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        sortOrder: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'DeliveryZone',
        tableName: 'delivery_zones',
      }
    );
  }

  static associate() {}
}

module.exports = DeliveryZone;
