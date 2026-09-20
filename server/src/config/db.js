const { exec } = require('child_process');
const path = require('path');
const sequelize = require('./sequelizeInstance');
const models = require('../models');
const { seedDelivery } = require('../seeders/seedDelivery');

// Function to run migrations using Sequelize CLI (modeled after IFBC)
async function runMigrations() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Checking and applying pending migrations...');
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const cliConfig = path.resolve(__dirname, 'sequelize-cli-config.cjs');
    const projectRoot = path.resolve(__dirname, '../../');

    exec(
      `${npxCmd} sequelize-cli db:migrate --config "${cliConfig}"`,
      { cwd: projectRoot },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error executing migration: ${stderr || error.message}`);
          reject(error);
        } else {
          console.log(`✅ Migrations up to date:\n${stdout.trim()}`);
          resolve(stdout);
        }
      }
    );
  });
}

// Connect to PostgreSQL database, run migrations, and ensure delivery data is seeded
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully via Sequelize');

    // Automatically run migrations if needed
    await runMigrations();

    // Automatically seed delivery data if not present in DB
    await seedDelivery(models);

    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    throw error;
  }
}

module.exports = {
  sequelize,
  connectDB,
  runMigrations,
  ...models,
};
