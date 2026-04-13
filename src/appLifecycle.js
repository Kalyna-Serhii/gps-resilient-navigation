import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import connectDB from './config/database.js';
import { InternalServerError, AppError } from './utils/httpErrors.js';
import { errors } from './utils/appErrors.js';

let server = null;
let signalsBound = false;
let boundHandlers = [];
let stopping = false; // guard to prevent double shutdown

export async function start() {
  if (server) {
    logger.warn('Server already started');
    return server;
  }
  try {
    await connectDB();
    logger.info('Successfully connected to MongoDB');

    const port = config.port || 8080;
    server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Server started on port ${port}`);
    });

    if (!signalsBound) {
      const graceful = async signal => {
        logger.warn(`Отримано сигнал ${signal}, починаємо процес завершення роботи...`);
        await stop({ exit: true });
      };
      boundHandlers = [
        ['SIGTERM', () => graceful('SIGTERM')],
        ['SIGINT', () => graceful('SIGINT')],
      ];
      // Bind OS signals once
      for (const [sig, handler] of boundHandlers) process.on(sig, handler);

      // Bind fatal error handlers once
      process.once('unhandledRejection', reason => {
        logger.error({ reason }, 'Unhandled Promise Rejection');
        void stop({ exit: true });
      });
      process.once('uncaughtException', err => {
        logger.error({ err }, 'Uncaught Exception');
        void stop({ exit: true });
      });

      signalsBound = true;
    }

    return server;
  } catch (err) {
    logger.error(`Error starting server: ${err.message}`);
    if (err instanceof AppError) throw err;
    throw new InternalServerError(`${errors.INTERNAL_ERROR}: Failed to start server.`, err);
  }
}

export async function stop({ exit = false } = {}) {
  try {
    if (stopping) {
      logger.warn('Stop already in progress, skipping duplicate call');
      return;
    }
    stopping = true;
    if (server) {
      await new Promise(resolve => server.close(resolve));
      logger.info('HTTP server closed');
      server = null;
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      logger.info('MongoDB connection closed');
    }

    if (signalsBound) {
      for (const [sig, handler] of boundHandlers) process.off(sig, handler);
      signalsBound = false;
      boundHandlers = [];
    }

    if (exit) process.exit(0);
    // if not exiting process, allow future stops
    stopping = false;
  } catch (error) {
    logger.error(`Error stopping server: ${error.message}`);
    if (exit) process.exit(1);
    stopping = false;
  }
}

export function getServer() {
  return server;
}
