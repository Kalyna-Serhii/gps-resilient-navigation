import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';

import routeController from '../controllers/routeController.js';

const router = express.Router();

router.get('/', authMiddleware.onlyAuthorized, routeController.getRoute);

export default router;
