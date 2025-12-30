import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    if (requiredRole && currentUser.role !== 'admin' && !currentUser.permissions?.includes(requiredRole)) {
        // Rediriger vers la première page autorisée ou vers POS par défaut
        const defaultPath = currentUser.permissions?.includes('pos') ? '/pos' :
            currentUser.permissions?.includes('inventory') ? '/inventory' : '/auth';
        return <Navigate to={defaultPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
