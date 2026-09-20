const { DataTypes } = require('sequelize');
const BaseEntity = require('./baseEntity');

class Testimonial extends BaseEntity {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          defaultValue: 5,
        },
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'Testimonial',
        tableName: 'testimonials',
      }
    );
  }

  static associate() {}
}

module.exports = Testimonial;
