import bcrypt from 'bcrypt';

import UserDto from '../dtos/userDto.js';

import UserModel from '../models/userModel.js';

import { errors } from '../utils/appErrors.js';
import { SALT_ROUNDS } from '../utils/constants.js';
import { getToken } from '../utils/getToken.js';
import { AppError, BadRequestError, ConflictError, InternalServerError, NotFoundError, UnauthorizedError } from '../utils/httpErrors.js';

import tokenService from './tokenService.js';

const AuthService = {
  async register(req) {
    try {
      const { name, email, password } = req.body;

      const userWithSameEmailExists = await UserModel.exists({ email });
      if (userWithSameEmailExists) {
        throw new ConflictError(`User with email ${email} already exists`);
      }

      const hashedPassword = await this.hashPassword(password);

      const newUser = await UserModel.create({
        name,
        email,
        passwordHash: hashedPassword,
      });

      const userDto = new UserDto(newUser);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto._id, tokens.refreshToken);

      return { ...tokens, user: userDto };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },

  async login(req) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new NotFoundError(`No user found with email ${email}`);
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new BadRequestError(`Invalid password for user with ${email} email`);
      }

      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto._id, tokens.refreshToken);

      return { ...tokens, user: userDto };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },

  async logout(req) {
    try {
      const refreshToken = getToken(req);
      if (!refreshToken) {
        throw new UnauthorizedError('Token is missing');
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        throw new UnauthorizedError();
      }

      await tokenService.removeToken(refreshToken);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },

  async refresh(req) {
    try {
      const refreshToken = getToken(req);
      if (!refreshToken) {
        throw new UnauthorizedError('Token is missing');
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        throw new UnauthorizedError();
      }
      const user = await UserModel.findById(userData._id);
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto._id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },

  async hashPassword(password) {
    if (!password) {
      throw new Error('Password is required for hashing');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  },
};

export default AuthService;
