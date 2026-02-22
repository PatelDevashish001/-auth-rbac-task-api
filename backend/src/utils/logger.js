const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const defaultLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const configuredLevel = (process.env.LOG_LEVEL || defaultLevel).toLowerCase();
const currentLevel = Object.prototype.hasOwnProperty.call(LEVELS, configuredLevel)
  ? configuredLevel
  : defaultLevel;

const shouldLog = (level) => LEVELS[level] <= LEVELS[currentLevel];

const writeLog = (level, message, meta = {}) => {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };

  const line = `${JSON.stringify(payload)}\n`;
  if (level === 'error' || level === 'warn') {
    process.stderr.write(line);
    return;
  }

  process.stdout.write(line);
};

module.exports = {
  error: (message, meta) => writeLog('error', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  info: (message, meta) => writeLog('info', message, meta),
  debug: (message, meta) => writeLog('debug', message, meta)
};
