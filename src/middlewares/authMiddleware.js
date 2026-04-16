import { Types } from 'mongoose';

import tokenService from '../services/tokenService.js';

import { getToken } from '../utils/getToken.js';
import { UnauthorizedError } from '../utils/httpErrors.js';

function authorizationCheck(req) {
  try {
    const accessToken = getToken(req);
    if (!accessToken) return;

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) return;

    req.userId = new Types.ObjectId(userData._id);

    return userData;
  } catch (e) {
    return null;
  }
}

const authMiddleware = {
  onlyAuthorized(req, res, next) {
    try {
      const user = authorizationCheck(req);
      if (!user) {
        return next(new UnauthorizedError());
      }
      next();
    } catch (e) {
      return next(new UnauthorizedError());
    }
  },
};

export default authMiddleware;
