import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'BREVO_API_KEY', // Required for API-based email sending
  'FRONTEND_URL'
];

// Validate that all required environment variables are present
export function validateEnv() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    brevoApiKey: process.env.BREVO_API_KEY // Optional: for API-based sending
  },
  frontend: {
    url: process.env.FRONTEND_URL
  },
  googleSheets: {
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  conference: {
    name: process.env.CONFERENCE_NAME || 'CSIT Department Conference',
    date: process.env.CONFERENCE_DATE,
    venue: process.env.CONFERENCE_VENUE || 'College Canteen'
  }
};
