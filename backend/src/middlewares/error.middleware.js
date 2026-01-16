import { AppError } from '../utils/error.handler.js';

/**
 * Global error handler middleware
 * Formats errors according to TRD specifications
 */
export function errorHandler(err, req, res, next) {
    // Generate unique debug ID for server-side logging
    const debugId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Log full error details server-side
    console.error(`[${debugId}] Error:`, {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        user: req.user?.email
    });

    // Handle operational errors (AppError instances)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            errorCode: err.errorCode,
            message: err.message,
            debugId
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            success: false,
            errorCode: 'VALIDATION_422',
            message: Object.values(err.errors).map(e => e.message).join(', '),
            debugId
        });
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(422).json({
            success: false,
            errorCode: 'VALIDATION_422',
            message: `${field} already exists`,
            debugId
        });
    }

    // Handle Mongoose cast errors
    if (err.name === 'CastError') {
        return res.status(422).json({
            success: false,
            errorCode: 'VALIDATION_422',
            message: 'Invalid data format',
            debugId
        });
    }

    // Handle unknown errors (don't leak stack trace)
    return res.status(500).json({
        success: false,
        errorCode: 'SERVER_500',
        message: 'An unexpected error occurred',
        debugId
    });
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`
    });
}
