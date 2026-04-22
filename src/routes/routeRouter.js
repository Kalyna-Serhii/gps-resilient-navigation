import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';

import routeController from '../controllers/routeController.js';

const router = express.Router();

router.get('/', authMiddleware.onlyAuthorized, routeController.getRoutes);
router.post('/', authMiddleware.onlyAuthorized, routeController.createRoute);
router.delete('/:id', authMiddleware.onlyAuthorized, routeController.deleteRoute);

export default router;
