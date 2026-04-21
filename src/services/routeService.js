import axios from 'axios';

import RouteModel from '../models/routeModel.js';

import { errors } from '../utils/appErrors.js';
import { MAX_SAVED_ROUTES } from '../utils/constants.js';
import { formatRoute } from '../utils/formatRoute.js';
import { AppError, BadRequestError, InternalServerError } from '../utils/httpErrors.js';

const OSRM_BASE_URL = 'https://router.project-osrm.org';

const RouteService = {
  async getRoutes(req) {
    try {
      const routes = await RouteModel.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();

      return routes;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },

  async createRoute(req) {
    try {
      const { name, origin, destination, alternatives } = req.body;

      if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
        throw new BadRequestError('Missing required fields: origin and destination with lat and lng');
      }

      if ([origin.lat, origin.lng, destination.lat, destination.lng].some(v => typeof v !== 'number' || isNaN(v))) {
        throw new BadRequestError('origin and destination lat/lng must be valid numbers');
      }

      const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

      const { data } = await axios.get(`${OSRM_BASE_URL}/route/v1/driving/${coordinates}`, {
        params: { overview: 'full', geometries: 'geojson', steps: 'true', alternatives: String(!!alternatives) },
      });

      if (data.code !== 'Ok') {
        throw new BadRequestError(`OSRM error: ${data.code} - ${data.message || 'Unable to build route'}`);
      }

      const routes = data.routes.map(formatRoute);

      const route = await this.saveRoute(req.userId, name, origin, destination, routes);

      return route;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },

  async saveRoute(userId, name, origin, destination, routes) {
    const count = await RouteModel.countDocuments({ userId });

    if (count >= MAX_SAVED_ROUTES) {
      const oldest = await RouteModel.findOne({ userId }).sort({ createdAt: 1 }).select('_id');
      if (oldest) await RouteModel.deleteOne({ _id: oldest._id });
    }

    const route = await RouteModel.create({ userId, name, origin, destination, routes });

    return route;
  },
};

export default RouteService;
