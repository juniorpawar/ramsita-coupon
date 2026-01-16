import * as adminService from './admin.service.js';

/**
 * Get dashboard statistics
 */
export async function getStats(req, res, next) {
    try {
        const stats = await adminService.getStats();
        res.status(200).json({
            success: true,
            ...stats
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get recent scans
 */
export async function getRecentScans(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const scans = await adminService.getRecentScans(limit);

        res.status(200).json({
            success: true,
            scans
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Export to Excel
 */
export async function exportExcel(req, res, next) {
    try {
        const buffer = await adminService.exportExcel();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=teams-export-${Date.now()}.xlsx`);
        res.status(200).send(buffer);
    } catch (error) {
        next(error);
    }
}

/**
 * Export to CSV
 */
export async function exportCSV(req, res, next) {
    try {
        const csv = await adminService.exportCSV();

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=teams-export-${Date.now()}.csv`);
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
}

/**
 * Get all users
 */
export async function getUsers(req, res, next) {
    try {
        const users = await adminService.getUsers();

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Create new user
 */
export async function createUser(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(422).json({
                success: false,
                errorCode: 'VALIDATION_422',
                message: 'Name, email, and password are required'
            });
        }

        const user = await adminService.createUser({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update user role
 */
export async function updateUserRole(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(422).json({
                success: false,
                errorCode: 'VALIDATION_422',
                message: 'Role is required'
            });
        }

        const user = await adminService.updateUserRole(id, role);

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}
