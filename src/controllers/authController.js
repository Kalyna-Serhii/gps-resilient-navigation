import authService from '../services/authService.js';

const AuthController = {
  async register(req, res, next) {
    try {
      const response = await authService.register(req);

      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const response = await authService.login(req);

      return res.status(200).json(response);
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
      const response = await authService.refresh(req);

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
