import jwt from 'jsonwebtoken';
import User from './user.model.js';
import { config } from '../../config/env.js';
import { createError } from '../../utils/error.handler.js';

/**
 * Register new user (admin only)
 */
export async function registerUser({ name, email, password, role = 'viewer' }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError.validationError('User with this email already exists');
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

/**
 * Login user
 */
export async function loginUser({ email, password }) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw createError.unauthorized('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw createError.unauthorized('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

/**
 * Get current user
 */
export async function getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw createError.unauthorized('User not found');
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
    };
}
