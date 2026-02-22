const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

const shouldLogHealthChecks = process.env.LOG_HEALTHCHECKS === 'true';

const requestLogger = (req, res, next) => {
  const isApiRequest = req.originalUrl.startsWith('/api/');
  const isHealthCheck = req.originalUrl === '/health';

  if (!isApiRequest && !isHealthCheck) {
    return next();
  }

  if (isHealthCheck && !shouldLogHealthChecks) {
    return next();
  }

  const startedAt = process.hrtime.bigint();
  const requestId = req.get('x-request-id') || randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    logger.info('HTTP request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userId: req.user ? req.user.id : null
    });
  });

  return next();
};

module.exports = requestLogger;
