import * as authService from './auth.service.js';

/**
 * Register new user
 */
export async function register(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(422).json({
                success: false,
                errorCode: 'VALIDATION_422',
                message: 'Name, email, and password are required'
            });
        }

        const user = await authService.registerUser({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: user.id
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Login user
 */
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(422).json({
                success: false,
                errorCode: 'VALIDATION_422',
                message: 'Email and password are required'
            });
        }

        const result = await authService.loginUser({ email, password });

        res.status(200).json({
            success: true,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get current user
 */
export async function me(req, res, next) {
    try {
        const user = await authService.getCurrentUser(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
}
