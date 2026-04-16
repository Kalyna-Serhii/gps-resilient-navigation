import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';

import geocodeController from '../controllers/geocodeController.js';

const router = express.Router();

router.get('/search', authMiddleware.onlyAuthorized, geocodeController.search);
router.get('/reverse', authMiddleware.onlyAuthorized, geocodeController.reverse);

export default router;
