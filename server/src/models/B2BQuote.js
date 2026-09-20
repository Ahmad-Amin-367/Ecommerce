const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class B2BQuote extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        quoteNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        companyName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        contactName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        eventDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        eventType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        guestCount: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        budgetRange: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        serviceType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM('PENDING', 'REVIEWED', 'QUOTED', 'APPROVED', 'FULFILLED', 'REJECTED'),
          defaultValue: 'PENDING',
        },
        adminNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        estimatedAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'B2BQuote',
        tableName: 'b2b_quotes',
      }
    );
  }

  static associate() {}
}

module.exports = B2BQuote;
