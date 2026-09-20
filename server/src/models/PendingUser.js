const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class PendingUser extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        otp: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'PendingUser',
        tableName: 'pending_users',
        timestamps: true,
        createdAt: true,
        updatedAt: false,
      }
    );
  }

  static associate() {}
}

module.exports = PendingUser;
