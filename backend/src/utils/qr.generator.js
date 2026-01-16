import QRCode from 'qrcode';

/**
 * Generate QR code as Base64 image
 * @param {Object} data - Data to encode in QR code
 * @returns {Promise<string>} Base64 encoded QR code image
 */
export async function generateQRCode(data) {
    try {
        const qrData = JSON.stringify(data);

        // Generate QR code as data URL (Base64)
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: 400,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return qrCodeDataUrl;
    } catch (error) {
        console.error('QR Code generation error:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Create QR code payload for coupon
 * @param {string} couponId - Unique coupon identifier
 * @param {string} teamName - Team name
 * @returns {Object} QR code payload
 */
export function createQRPayload(couponId, teamName) {
    return {
        couponId,
        teamName,
        timestamp: new Date().toISOString()
    };
}
