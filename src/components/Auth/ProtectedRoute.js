import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Check if user needs password reset
        if (user?.needsPasswordReset && user?.role === 'student') {
            toast.loading('Please reset your password first');
            return;
        }
    }, [user]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login with return url
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    // Check if password reset needed
    if (user.needsPasswordReset && user.role === 'student') {
        return <Navigate to="/first-login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error('Access denied. Insufficient permissions.');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;