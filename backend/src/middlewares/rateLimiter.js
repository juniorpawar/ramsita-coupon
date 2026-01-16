import rateLimit from 'express-rate-limit';

/**
 * Rate limiter: 100 requests per 15 minutes per IP
 * As specified in TRD security requirements
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        errorCode: 'RATE_LIMIT',
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Stricter rate limiter for authentication endpoints
 * 10 requests per 15 minutes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        errorCode: 'RATE_LIMIT',
        message: 'Too many authentication attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
