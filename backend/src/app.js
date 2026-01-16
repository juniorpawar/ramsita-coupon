import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import teamRoutes from './modules/teams/team.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Trust proxy (for rate limiting and IP detection)
app.set('trust proxy', 1);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files FIRST (before CORS)
// This ensures static assets are served without CORS checks
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// CORS configuration - ONLY for API routes
// Since frontend is served from same origin, we simplify this
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (same-origin requests, mobile apps, curl)
        if (!origin) return callback(null, true);

        // Allow common development origins
        const allowedOrigins = [
            config.frontend.url,
            'http://localhost:5173',
            'http://localhost:5174',
            /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/,  // LAN addresses
            /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/,  // Alternative LAN
            /^https:\/\/.*\.ngrok-free\.app$/  // ngrok URLs
        ];

        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') return allowed === origin;
            if (allowed instanceof RegExp) return allowed.test(origin);
            return false;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow anyway in development
        }
    },
    credentials: true
};

// Apply CORS only to API routes
app.use('/api', cors(corsOptions));

// Apply rate limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', adminRoutes);

// SPA fallback - serve index.html for all non-API, non-static routes
app.get('*', (req, res, next) => {
    // Skip API routes and let them hit 404 if not found
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 404 handler (only for API routes now)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
