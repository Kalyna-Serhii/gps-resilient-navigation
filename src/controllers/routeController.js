import routeService from '../services/routeService.js';

const RouteController = {
  async getRoutes(req, res, next) {
    try {
      const response = await routeService.getRoutes(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  async getRouteById(req, res, next) {
    try {
      const response = await routeService.getRouteById(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  async createRoute(req, res, next) {
    try {
      const response = await routeService.createRoute(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  async deleteRoute(req, res, next) {
    try {
      const response = await routeService.deleteRoute(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default RouteController;
