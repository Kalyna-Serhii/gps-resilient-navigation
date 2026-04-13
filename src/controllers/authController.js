import authService from '../services/authService.js';

const AuthController = {
  async register(req, res, next) {
    try {
      const newUserData = await authService.register(req);

      return res.status(201).json(newUserData);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const userData = await authService.login(req);

      return res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      await authService.logout(req);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const tokens = await authService.refresh(req);

      return res.status(200).send(tokens);
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
