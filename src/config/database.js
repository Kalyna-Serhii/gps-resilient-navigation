import mongoose from 'mongoose';

import logger from '../utils/logger.js';

import config from './index.js';

const MONGODB_URI = config.mongodbUri;

export default async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 15,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });

    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }

  mongoose.connection.on('error', err => {
    logger.error('MongoDB error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
}
