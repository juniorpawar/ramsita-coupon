import app from './app.js';
import { connectDB } from './config/db.js';
import { validateEnv, config } from './config/env.js';

// Validate environment variables
try {
    validateEnv();
} catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    process.exit(1);
}

// Connect to database
await connectDB();

// Start server
const server = app.listen(config.port,'0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🎟️  Food Coupon Management System - Backend        ║
║                                                        ║
║   Server: http://localhost:${config.port}                     ║
║   Environment: ${config.nodeEnv}                           ║
║   Database: Connected                                  ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});
