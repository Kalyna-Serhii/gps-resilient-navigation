import alertService from '../services/alertService.js';

const AlertController = {
  getActiveAlerts(req, res, next) {
    try {
      const response = alertService.getActiveAlerts();

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  getStatusByLocation(req, res, next) {
    try {
      const response = alertService.getStatusByLocation(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default AlertController;
