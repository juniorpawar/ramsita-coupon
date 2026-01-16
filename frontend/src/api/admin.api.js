import api from './axios.config.js';

/**
 * Get dashboard statistics
 */
export const getStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

/**
 * Get recent scans
 */
export const getRecentScans = async (limit = 50) => {
    const response = await api.get('/admin/recent-scans', { params: { limit } });
    return response.data;
};

/**
 * Export to Excel
 */
export const exportToExcel = async () => {
    const response = await api.get('/admin/export-excel', {
        responseType: 'blob'
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `teams-export-${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
};

/**
 * Export to CSV
 */
export const exportToCSV = async () => {
    const response = await api.get('/admin/export-csv', {
        responseType: 'blob'
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `teams-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
};

/**
 * Get all users
 */
export const getUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

/**
 * Create user
 */
export const createUser = async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
};

/**
 * Update user role
 */
export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
};
