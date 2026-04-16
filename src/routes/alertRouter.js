import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';

import alertController from '../controllers/alertController.js';

const router = express.Router();

router.get('/', authMiddleware.onlyAuthorized, alertController.getActiveAlerts);
router.get('/by-location', authMiddleware.onlyAuthorized, alertController.getStatusByLocation);

export default router;
