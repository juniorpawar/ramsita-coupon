import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB() {
    try {
        const conn = await mongoose.connect(config.mongodb.uri, {
            // Connection options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

export function closeDB() {
    return mongoose.connection.close();
}
