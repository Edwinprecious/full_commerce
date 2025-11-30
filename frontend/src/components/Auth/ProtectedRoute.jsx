import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

const ProtectedRoute = ({ children, requireVendor = false  }) => {
    const { user, loading, isAuthenticated } = useAuth()
    const location = useLocation()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireVendor && !user.user_type !== 'vendor') {
        return <Navigate to="/"  replace />;
    }

    return children
    
}

export default ProtectedRoute