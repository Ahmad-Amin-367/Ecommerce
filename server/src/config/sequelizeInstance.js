const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!dbUrl) {
  throw new Error('Database connection URL (DATABASE_URL or DIRECT_URL) is missing in environment variables');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
