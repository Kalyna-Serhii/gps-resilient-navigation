import jwt from 'jsonwebtoken';
import TokenModel from '../models/tokenModel.js';
import config from '../config/index.js';

const TokenService = {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtl });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTtl });
    return { accessToken, refreshToken };
  },

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, config.jwt.accessSecret);
      return userData;
    } catch (e) {
      return null;
    }
  },

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, config.jwt.refreshSecret);
      return userData;
    } catch (e) {
      return null;
    }
  },

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ userId, refreshToken });
    return token;
  },

  async removeToken(refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    await tokenData.deleteOne();
  },

  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    return tokenData;
  },
};

export default TokenService;
