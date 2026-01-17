/**
 * Parse API error response into user-friendly message
 */
export const parseError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.response?.status === 404) {
        return 'Resource not found';
    }

    if (error.response?.status === 401) {
        return 'Unauthorized. Please login again.';
    }

    if (error.response?.status === 403) {
        return 'Access forbidden. You do not have permission.';
    }

    if (error.response?.status === 500) {
        return 'Server error. Please try again later.';
    }

    if (error.message === 'Network Error') {
        return 'Network error. Please check your connection.';
    }

    return error.message || 'An unexpected error occurred';
};
