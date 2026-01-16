import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, getCurrentUser as getCurrentUserApi } from '../api/auth.api.js';
import { getToken, setToken, removeToken, getUser, setUser, clearAuth } from '../utils/token.js';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(getUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = getToken();
        if (token) {
            getCurrentUserApi()
                .then((response) => {
                    setUserState(response.user);
                    setUser(response.user);
                })
                .catch(() => {
                    clearAuth();
                    setUserState(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await loginApi(email, password);
        setToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        return response;
    };

    const logout = () => {
        clearAuth();
        setUserState(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isViewer: user?.role === 'viewer' || user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
