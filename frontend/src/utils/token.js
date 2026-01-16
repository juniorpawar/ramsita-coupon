/**
 * Get token from localStorage
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Set token in localStorage
 */
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('token');
};

/**
 * Get user from localStorage
 */
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Set user in localStorage
 */
export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove user from localStorage
 */
export const removeUser = () => {
    localStorage.removeItem('user');
};

/**
 * Clear all auth data
 */
export const clearAuth = () => {
    removeToken();
    removeUser();
};
