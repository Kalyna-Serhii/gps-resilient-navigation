import UserService from '../services/userService.js';

const UserController = {
  async getUser(req, res, next) {
    try {
      const userDto = await UserService.getUser(req);
      return res.status(200).json(userDto);
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
