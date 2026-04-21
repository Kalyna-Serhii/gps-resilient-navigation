import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { errors } from '../utils/appErrors.js';
import { HASC_TO_NAME } from '../utils/constants.js';
import { AppError, BadRequestError, InternalServerError, NotFoundError } from '../utils/httpErrors.js';

import { getCache } from './alertCache.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ukraineRegions = JSON.parse(readFileSync(path.join(__dirname, '../data/ukraine-regions.geojson'), 'utf-8'));

const validFeatures = ukraineRegions.features.filter(f => f.properties.GID_1 !== '?' && HASC_TO_NAME[f.properties.HASC_1]);

function findRegionByCoords(lat, lng) {
  const pt = point([lng, lat]);
  const feature = validFeatures.find(f => booleanPointInPolygon(pt, f));
  return feature ? HASC_TO_NAME[feature.properties.HASC_1] : null;
}

const AlertService = {
  getActiveAlerts() {
    const regions = [...getCache().keys()];
    return { activeRegions: regions, activeCount: regions.length };
  },

  getStatusByLocation(req) {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        throw new BadRequestError('Missing required query parameters: lat, lng');
      }

      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);

      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        throw new BadRequestError('lat and lng must be valid numbers');
      }

      const detectedRegion = findRegionByCoords(parsedLat, parsedLng);
      if (!detectedRegion) {
        throw new NotFoundError('Coordinates are outside Ukrainian territory');
      }

      const alertIsActive = getCache().has(detectedRegion);

      return {
        detectedRegion,
        alertIsActive,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },
};

export default AlertService;
