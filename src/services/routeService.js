import axios from 'axios';
import { BadRequestError, InternalServerError, AppError } from '../utils/httpErrors.js';
import { errors } from '../utils/appErrors.js';

const OSRM_BASE_URL = 'https://router.project-osrm.org';

function formatStep(step) {
  const { maneuver } = step;

  return {
    instruction: maneuver.type + (maneuver.modifier ? ` ${maneuver.modifier}` : ''),
    name: step.name || '',
    distance: step.distance,
    duration: step.duration,
    maneuver: {
      type: maneuver.type,
      modifier: maneuver.modifier || null,
      location: maneuver.location,
    },
  };
}

function formatRoute(route) {
  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry,
    steps: route.legs.flatMap(leg => leg.steps.map(formatStep)),
  };
}

const RouteService = {
  async getRoute(req) {
    try {
      const { originLat, originLng, destLat, destLng, alternatives } = req.query;

      if (!originLat || !originLng || !destLat || !destLng) {
        throw new BadRequestError('Missing required query parameters: originLat, originLng, destLat, destLng');
      }

      const origin = { lat: parseFloat(originLat), lng: parseFloat(originLng) };
      const destination = { lat: parseFloat(destLat), lng: parseFloat(destLng) };

      if ([origin.lat, origin.lng, destination.lat, destination.lng].some(isNaN)) {
        throw new BadRequestError('All coordinate parameters must be valid numbers');
      }

      const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

      const { data } = await axios.get(`${OSRM_BASE_URL}/route/v1/driving/${coordinates}`, {
        params: { overview: 'full', geometries: 'geojson', steps: 'true', alternatives: String(alternatives === 'true') },
      });

      if (data.code !== 'Ok') {
        throw new BadRequestError(`OSRM error: ${data.code} - ${data.message || 'Unable to build route'}`);
      }

      return data.routes.map(formatRoute);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },
};

export default RouteService;
