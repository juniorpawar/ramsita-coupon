import api from './axios.config.js';

/**
 * Login user
 */
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

/**
 * Register new user (admin only)
 */
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};
