import express from 'express';
import * as authController from './auth.controller.js';
import { requireAuth, requireAdmin } from './auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', authController.login);

// Protected routes
router.post('/register', requireAuth, requireAdmin, authController.register);
router.get('/me', requireAuth, authController.me);

export default router;
