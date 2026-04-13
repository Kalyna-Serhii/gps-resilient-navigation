import { AppError, InternalServerError, NotFoundError } from '../utils/httpErrors.js';
import UserModel from '../models/userModel.js';
import { errors } from '../utils/appErrors.js';

const UserService = {
  async getUser(req) {
    try {
      const { userId } = req;

      const user = await UserModel.findById(userId).select('-passwordHash').lean();
      if (!user) {
        throw new NotFoundError('No user found');
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },
};

export default UserService;
