require('dotenv').config();

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const config = {
  url: dbUrl,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
};

module.exports = {
  development: config,
  test: config,
  production: config
};
