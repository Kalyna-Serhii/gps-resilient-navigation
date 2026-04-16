import routeService from '../services/routeService.js';

const RouteController = {
  async getRoutes(req, res, next) {
    try {
      const routes = await routeService.getRoutes(req);

      return res.status(200).json(routes);
    } catch (error) {
      next(error);
    }
  },
  async createRoute(req, res, next) {
    try {
      const routes = await routeService.createRoute(req);

      return res.status(200).json(routes);
    } catch (error) {
      next(error);
    }
  },
};

export default RouteController;
