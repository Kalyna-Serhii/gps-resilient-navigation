import config from '../config/index.js';
import { UnauthorizedError, ForbiddenError, InternalServerError } from '../utils/httpErrors.js';
import logger from '../utils/logger.js';
import { errors } from '../utils/appErrors.js';

export default function basicAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="API Docs"');
    throw new UnauthorizedError(errors.AUTHENTICATION_REQUIRED);
  }

  try {
    const base64 = auth.slice('Basic '.length);
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    const expectedUser = config.swaggerUser;
    const expectedPass = config.swaggerPass;

    if (!expectedUser || !expectedPass) {
      throw new ForbiddenError('Docs access is not configured');
    }

    if (username === expectedUser && password === expectedPass) {
      return next();
    }
  } catch (e) {
    logger.error(`Basic Auth parsing error: ${e.message}`);
    return next(new InternalServerError('Authentication parsing failed', e));
  }

  res.set('WWW-Authenticate', 'Basic realm="API Docs"');
  throw new UnauthorizedError('Invalid credentials');
}
