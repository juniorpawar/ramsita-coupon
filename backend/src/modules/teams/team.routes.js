import express from 'express';
import * as teamController from './team.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = express.Router();

// Public route for Google Form webhook
router.post('/register', teamController.register);

// Protected routes
router.get('/', requireAuth, teamController.getTeams);
router.get('/:couponId', requireAuth, teamController.getTeamByCoupon);
router.post('/scan', requireAuth, teamController.scanCoupon);

export default router;
