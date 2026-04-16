import pino from 'pino';

import config from '../config/index.js';

const level = config.nodeEnv === 'test' ? 'silent' : 'info';

const logger = pino({
  level,
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard', messageFormat: '{msg} {status}' },
  },
});

export default logger;
