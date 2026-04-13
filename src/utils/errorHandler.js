import { AppError } from './httpErrors.js';
import logger from './logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const success = false;
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred.';
  let data = null;

  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    data = err.data;
  }

  res.status(statusCode).json({
    success,
    statusCode,
    errorCode,
    message,
    data,
  });
};
