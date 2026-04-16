import alertService from '../services/alertService.js';

const AlertController = {
  getActiveAlerts(req, res, next) {
    try {
      const result = alertService.getActiveAlerts();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getStatusByLocation(req, res, next) {
    try {
      const result = alertService.getStatusByLocation(req);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default AlertController;
