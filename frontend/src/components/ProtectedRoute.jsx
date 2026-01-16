import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card text-center">
                    <h2 className="text-2xl font-bold text-error mb-4">Access Denied</h2>
                    <p className="text-gray-600">You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
