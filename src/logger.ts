import pino from 'pino';

const logger: pino.Logger = pino({
  name: 'plots-monitor',
  level: 'debug',
  prettyPrint: {
    ignore: 'pid,hostname',
    translateTime: true,
  },
});

console.log = logger.info.bind(logger);
console.warn = logger.warn.bind(logger);
console.debug = logger.debug.bind(logger);
console.info = logger.info.bind(logger);
console.error = logger.error.bind(logger);

export { logger };
