const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class Category extends BaseEntity {
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
        parentId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Category, { foreignKey: 'parentId', as: 'parent' });
    this.hasMany(models.Category, { foreignKey: 'parentId', as: 'children' });
    this.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
  }
}

module.exports = Category;
