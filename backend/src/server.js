const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');
const { ensureDefaultAdminUser } = require('./config/defaultAdmin');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;
const REQUIRED_ENV_VARS = ['MONGODB_URI', 'JWT_SECRET'];
let server;

const startServer = async () => {
  try {
    const missingVars = REQUIRED_ENV_VARS.filter((envVar) => !process.env[envVar]);
    if (missingVars.length) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    await connectDB();
    await ensureDefaultAdminUser();

    server = app.listen(PORT, () => {
      logger.info('Server started', {
        port: Number(PORT),
        nodeEnv: process.env.NODE_ENV || 'development'
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      errorMessage: error.message
    });
    process.exit(1);
  }
};

startServer();

const shutdown = (signal) => {
  logger.info('Shutdown signal received', { signal });

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
