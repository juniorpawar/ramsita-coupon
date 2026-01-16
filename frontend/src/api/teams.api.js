import api from './axios.config.js';

/**
 * Scan coupon
 */
export const scanCoupon = async (couponId, scanLocation = 'Canteen Counter') => {
    const response = await api.post('/teams/scan', { couponId, scanLocation });
    return response.data;
};

/**
 * Get all teams
 */
export const getTeams = async (params = {}) => {
    const response = await api.get('/teams', { params });
    return response.data;
};

/**
 * Get team by coupon ID
 */
export const getTeamByCoupon = async (couponId) => {
    const response = await api.get(`/teams/${couponId}`);
    return response.data;
};

/**
 * Register team (for testing)
 */
export const registerTeam = async (teamData) => {
    const response = await api.post('/teams/register', teamData);
    return response.data;
};
