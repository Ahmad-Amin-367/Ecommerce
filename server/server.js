require('dotenv').config();
const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/db');
const logger = require('./src/config/logger');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('⏳ Connecting to database...');
    await connectDB();
    logger.info('✅ Database connected successfully via Sequelize');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 API base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
      logger.info(`📡 API base URL: http://localhost:${PORT}/api/v1`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Initialize WebSockets
    initSocket(server);
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    logger.error('❌ Failed to start server:', error);
    try {
      await sequelize.close();
    } catch (_) {}
    process.exit(1);
  }
};

// ─── Graceful shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
  logger.info(`\n${signal} received. Shutting down gracefully...`);
  try {
    await sequelize.close();
  } catch (_) {}
  logger.info('Database disconnected. Server closed.');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
