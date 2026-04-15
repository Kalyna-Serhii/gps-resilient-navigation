import routeService from '../services/routeService.js';

const RouteController = {
  async getRoute(req, res, next) {
    try {
      const routes = await routeService.getRoute(req);

      return res.status(200).json({ routes });
    } catch (error) {
      next(error);
    }
  },
};

export default RouteController;
