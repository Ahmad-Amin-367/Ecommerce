const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class DeliverySetting extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        pickupEnabled: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        pickupLocationName: {
          type: DataTypes.STRING,
          defaultValue: 'Milton, ON',
        },
        pickupAddress: {
          type: DataTypes.TEXT,
          defaultValue: 'Milton, Ontario (Exact address provided upon order confirmation)',
        },
        unservicedAreaMessage: {
          type: DataTypes.TEXT,
          defaultValue:
            'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
        },
        eventSetupMessage: {
          type: DataTypes.TEXT,
          defaultValue:
            'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
        },
      },
      {
        sequelize,
        modelName: 'DeliverySetting',
        tableName: 'delivery_settings',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updatedAt',
      }
    );
  }

  static associate() {}
}

module.exports = DeliverySetting;
