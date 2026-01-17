/**
 * Email Service - Using Brevo API
 * 
 * This implementation uses Brevo's HTTP API instead of SMTP to bypass
 * port restrictions on cloud hosting platforms like Render.
 * 
 * To switch back to SMTP, replace this file's contents with email.service.smtp.js
 */

export { sendCouponEmail } from './email.service.brevo-api.js';
