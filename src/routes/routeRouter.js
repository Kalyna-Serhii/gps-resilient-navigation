import express from 'express';
import routeController from '../controllers/routeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware.onlyAuthorized, routeController.getRoute);

export default router;
