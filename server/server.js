require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/db');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    console.log('⏳ Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    logger.info('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 API base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
      logger.info(`📡 API base URL: http://localhost:${PORT}/api/v1`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    logger.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// ─── Graceful shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
  logger.info(`\n${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
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
