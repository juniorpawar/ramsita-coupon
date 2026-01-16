import crypto from 'crypto';

/**
 * Generate unique coupon ID in format: CONF-{YEAR}-{RANDOM-6-DIGIT}
 * Example: CONF-2025-8A3F2D
 */
export function generateCouponId() {
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();

    return `CONF-${year}-${random}`;
}

/**
 * Validate coupon ID format
 */
export function isValidCouponIdFormat(couponId) {
    const pattern = /^CONF-\d{4}-[A-Z0-9]{6}$/;
    return pattern.test(couponId);
}
