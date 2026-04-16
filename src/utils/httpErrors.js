class AppError extends Error {
  constructor(message, statusCode, errorCode = 'GENERAL_ERROR', data = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Invalid request parameters.', errorCode = 'BAD_REQUEST', data = null) {
    super(message, 400, errorCode, data);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Authentication failed or token is invalid.', errorCode = 'UNAUTHORIZED', data = null) {
    super(message, 401, errorCode, data);
  }
}

class PaymentRequiredError extends AppError {
  constructor(message = 'Payment required to proceed.', errorCode = 'PAYMENT_REQUIRED', data = null) {
    super(message, 402, errorCode, data);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access to the resource is forbidden.', errorCode = 'FORBIDDEN', data = null) {
    super(message, 403, errorCode, data);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found.', errorCode = 'NOT_FOUND', data = null) {
    super(message, 404, errorCode, data);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict.', errorCode = 'CONFLICT', data = null) {
    super(message, 409, errorCode, data);
  }
}

class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests. Please try again later.', errorCode = 'TOO_MANY_REQUESTS', data = null) {
    super(message, 429, errorCode, data);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'An unexpected server error occurred.', errorCode = 'INTERNAL_SERVER_ERROR', data = null) {
    super(message, 500, errorCode, data);
  }
}

class ProviderError extends AppError {
  constructor(message, statusCode = 502, errorCode = 'PROVIDER_ERROR', data = null) {
    const userMessage = `[PROVIDER ERROR], status code: ${statusCode}, message: ${message}`;
    const fullMessage = `${userMessage}, data: ${JSON.stringify(data)}`;
    super(fullMessage, statusCode, errorCode, data, true);
    this.userMessage = userMessage;
  }
}

class ProviderAPIFailure extends ProviderError {
  constructor(message, originalStatusCode, data = {}) {
    super(message, 502, 'PROVIDER_API_FAILURE', { originalStatusCode, ...data });
  }
}

export {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  PaymentRequiredError,
  ProviderAPIFailure,
  TooManyRequestsError,
  UnauthorizedError,
};
