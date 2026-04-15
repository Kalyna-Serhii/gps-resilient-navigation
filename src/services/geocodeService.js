import axios from 'axios';
import { BadRequestError, InternalServerError, AppError } from '../utils/httpErrors.js';
import { errors } from '../utils/appErrors.js';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const nominatimClient = axios.create({
  baseURL: NOMINATIM_BASE_URL,
  headers: { 'User-Agent': 'gps-resilient-navigation/1.0' },
});

function formatPlace(item) {
  return {
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName: item.display_name,
    type: item.type,
    address: item.address || {},
  };
}

const GeocodeService = {
  async search(req) {
    try {
      const { q, limit } = req.query;

      if (!q || !q.trim()) {
        throw new BadRequestError('Missing required query parameter: q');
      }

      const parsedLimit = limit ? parseInt(limit, 10) : 5;
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
        throw new BadRequestError('Limit must be a number between 1 and 50');
      }

      const { data } = await nominatimClient.get('/search', {
        params: { q: q.trim(), format: 'json', limit: parsedLimit, addressdetails: 1 },
      });

      return data.map(formatPlace);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },

  async reverse(req) {
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

      const { data } = await nominatimClient.get('/reverse', {
        params: { lat: parsedLat, lon: parsedLng, format: 'json', addressdetails: 1 },
      });

      if (data.error) {
        throw new BadRequestError(`Geocoding error: ${data.error}`);
      }

      return formatPlace(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },
};

export default GeocodeService;
