import UserService from '../services/userService.js';

const UserController = {
  async getUser(req, res, next) {
    try {
      const response = await UserService.getUser(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
