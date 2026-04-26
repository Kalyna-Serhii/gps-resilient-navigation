import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';

import poiController from '../controllers/poiController.js';
import routeController from '../controllers/routeController.js';

const router = express.Router();

router.get('/', authMiddleware.onlyAuthorized, routeController.getRoutes);
router.get('/:id', authMiddleware.onlyAuthorized, routeController.getRouteById);
router.post('/', authMiddleware.onlyAuthorized, routeController.createRoute);
router.delete('/:id', authMiddleware.onlyAuthorized, routeController.deleteRoute);
router.get('/:id/pois', authMiddleware.onlyAuthorized, poiController.getPoisAlongRoute);

export default router;
