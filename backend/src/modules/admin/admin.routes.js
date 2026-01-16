import express from 'express';
import * as adminController from './admin.controller.js';
import { requireAuth, requireAdmin, requireViewer } from '../auth/auth.middleware.js';

const router = express.Router();

// Statistics (accessible by both admin and viewer)
router.get('/stats', requireAuth, requireViewer, adminController.getStats);
router.get('/recent-scans', requireAuth, requireViewer, adminController.getRecentScans);

// Export functions (accessible by both admin and viewer)
router.get('/export-excel', requireAuth, requireViewer, adminController.exportExcel);
router.get('/export-csv', requireAuth, requireViewer, adminController.exportCSV);

// User management (admin only)
router.get('/users', requireAuth, requireAdmin, adminController.getUsers);
router.post('/users', requireAuth, requireAdmin, adminController.createUser);
router.patch('/users/:id/role', requireAuth, requireAdmin, adminController.updateUserRole);

export default router;
