import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;
