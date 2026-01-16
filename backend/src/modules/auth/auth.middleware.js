import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import { createError } from '../../utils/error.handler.js';

/**
 * Verify JWT token and attach user to request
 */
export function requireAuth(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError.unauthorized('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(createError.unauthorized('Invalid token'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(createError.unauthorized('Token expired'));
        }
        next(error);
    }
}

/**
 * Check if user has admin role
 */
export function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return next(createError.forbidden('Admin access required'));
    }
    next();
}

/**
 * Check if user has admin or viewer role
 */
export function requireViewer(req, res, next) {
    if (req.user.role !== 'admin' && req.user.role !== 'viewer') {
        return next(createError.forbidden('Viewer access required'));
    }
    next();
}
