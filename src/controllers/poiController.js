import poiService from '../services/poiService.js';

const PoiController = {
  async getPoisAlongRoute(req, res, next) {
    try {
      const result = await poiService.getPoisAlongRoute(req);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default PoiController;
