import geocodeService from '../services/geocodeService.js';

const GeocodeController = {
  async search(req, res, next) {
    try {
      const results = await geocodeService.search(req);

      return res.status(200).json({ results });
    } catch (error) {
      next(error);
    }
  },

  async reverse(req, res, next) {
    try {
      const result = await geocodeService.reverse(req);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default GeocodeController;
