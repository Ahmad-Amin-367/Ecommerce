const { DataTypes, Model } = require('sequelize');

class BaseEntity extends Model {
  static init(attributes, options = {}) {
    const {
      timestamps = true,
      createdAt = true,
      updatedAt = true,
      ...restOptions
    } = options;

    const defaultAttributes = {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    };

    if (timestamps && createdAt !== false) {
      defaultAttributes.createdAt = {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      };
    }

    if (timestamps && updatedAt !== false) {
      defaultAttributes.updatedAt = {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      };
    }

    super.init(
      {
        ...defaultAttributes,
        ...attributes,
      },
      {
        timestamps,
        createdAt: timestamps && createdAt !== false,
        updatedAt: timestamps && updatedAt !== false,
        ...restOptions,
      }
    );
  }
}

module.exports = BaseEntity;
