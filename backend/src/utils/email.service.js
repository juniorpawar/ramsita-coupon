import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

/**
 * Send coupon email to team participants
 * @param {Object} params - Email parameters
 */
export async function sendCouponEmail({ teamName, couponId, qrCodeDataUrl, participants, teamSize }) {
  const participantEmails = participants.map(p => p.email);

  // Convert Base64 data URL to buffer for attachment
  const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(base64Data, 'base64');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .qr-container {
          background: white;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .qr-code {
          max-width: 300px;
          height: auto;
          margin: 10px auto;
        }
        .coupon-id {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin: 15px 0;
          letter-spacing: 2px;
        }
        .info-box {
          background: #dbeafe;
          border-left: 4px solid #2563eb;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        .detail-row {
          margin: 10px 0;
          font-size: 16px;
        }
        .label {
          font-weight: bold;
          color: #1f2937;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎟️ Your Conference Food Coupon</h1>
        <p>${config.conference.name}</p>
      </div>
      
      <div class="content">
        <p>Dear <strong>${teamName}</strong>,</p>
        
        <p>Thank you for registering for the CSIT Department Conference! Your digital food coupon is ready.</p>
        
        <div class="qr-container">
          <h3>Your QR Code</h3>
          <img src="cid:qrcode" alt="QR Code for ${teamName}" class="qr-code" />
          <div class="coupon-id">${couponId}</div>
        </div>
        
        <div class="info-box">
          <div class="detail-row">
            <span class="label">Team Name:</span> ${teamName}
          </div>
          <div class="detail-row">
            <span class="label">Team Size:</span> ${teamSize} member${teamSize > 1 ? 's' : ''}
          </div>
          <div class="detail-row">
            <span class="label">Coupon ID:</span> ${couponId}
          </div>
        </div>
        
        <div class="warning">
          <strong>⚠️ IMPORTANT:</strong> This coupon can only be used <strong>once</strong>. Please keep this email safe and show the QR code at the <strong>Canteen Counter</strong> to receive your meal.
        </div>
        
        <h3>📅 Event Details</h3>
        <div class="detail-row">
          <span class="label">Date:</span> ${config.conference.date || 'TBA'}
        </div>
        <div class="detail-row">
          <span class="label">Venue:</span> ${config.conference.venue}
        </div>
        
        <p style="margin-top: 30px;">If you have any questions, please contact the event organizers.</p>
        
        <p>Best regards,<br><strong>CSIT Department</strong></p>
      </div>
      
      <div class="footer">
        <p>This is an automated email. Please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: config.email.from,
    to: participantEmails.join(', '),
    subject: `Your Conference Food Coupon - ${config.conference.name}`,
    html: emailHtml,
    attachments: [
      {
        filename: `qrcode-${couponId}.png`,
        content: qrBuffer,
        cid: 'qrcode'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${participantEmails.join(', ')}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw - email failure shouldn't block registration
    return { success: false, error: error.message };
  }
}
