import geocodeService from '../services/geocodeService.js';

const GeocodeController = {
  async search(req, res, next) {
    try {
      const response = await geocodeService.search(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  async reverse(req, res, next) {
    try {
      const response = await geocodeService.reverse(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default GeocodeController;
