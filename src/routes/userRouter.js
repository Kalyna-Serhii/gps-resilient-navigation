import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';

import UserController from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authMiddleware.onlyAuthorized, UserController.getUser);

export default router;
