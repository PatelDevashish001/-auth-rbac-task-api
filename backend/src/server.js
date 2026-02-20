const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

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

    server = app.listen(PORT, () => {
      console.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

const shutdown = (signal) => {
  console.info(`${signal} received. Closing HTTP server.`);

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
