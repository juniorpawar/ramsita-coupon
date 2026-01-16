export class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Standard error codes as per TRD
export const ErrorCodes = {
    AUTH_401: 'AUTH_401',
    AUTH_403: 'AUTH_403',
    COUPON_404: 'COUPON_404',
    COUPON_409: 'COUPON_409',
    VALIDATION_422: 'VALIDATION_422',
    SERVER_500: 'SERVER_500'
};

// Helper functions for common errors
export const createError = {
    unauthorized: (message = 'Unauthorized access') =>
        new AppError(message, 401, ErrorCodes.AUTH_401),

    forbidden: (message = 'Access forbidden') =>
        new AppError(message, 403, ErrorCodes.AUTH_403),

    couponNotFound: (message = 'Coupon not found') =>
        new AppError(message, 404, ErrorCodes.COUPON_404),

    couponAlreadyUsed: (scannedAt) =>
        new AppError(
            `This coupon was already redeemed at ${new Date(scannedAt).toLocaleString()}`,
            409,
            ErrorCodes.COUPON_409
        ),

    validationError: (message = 'Invalid input data') =>
        new AppError(message, 422, ErrorCodes.VALIDATION_422),

    serverError: (message = 'Internal server error') =>
        new AppError(message, 500, ErrorCodes.SERVER_500)
};
