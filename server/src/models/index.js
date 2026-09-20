const { Sequelize } = require('sequelize');
const sequelize = require('../config/sequelizeInstance');

const User = require('./User');
const PendingUser = require('./PendingUser');
const Address = require('./Address');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Testimonial = require('./Testimonial');
const B2BQuote = require('./B2BQuote');
const DeliveryZone = require('./DeliveryZone');
const DeliverySetting = require('./DeliverySetting');

const models = {
  User,
  PendingUser,
  Address,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  Testimonial,
  B2BQuote,
  DeliveryZone,
  DeliverySetting,
};

// Initialize all models
Object.values(models).forEach((model) => {
  if (typeof model.init === 'function') {
    model.init(sequelize);
  }
});

// Run associations on all models
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
