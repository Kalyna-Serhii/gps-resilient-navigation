import express from 'express';
import geocodeController from '../controllers/geocodeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/search', authMiddleware.onlyAuthorized, geocodeController.search);
router.get('/reverse', authMiddleware.onlyAuthorized, geocodeController.reverse);

export default router;
