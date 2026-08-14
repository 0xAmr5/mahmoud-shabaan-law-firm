import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500 gap-3" dir="rtl">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-300">جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = (userProfile?.role || 'CLIENT').toString().trim().toUpperCase();

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'LAWYER') return <Navigate to="/lawyer" replace />;
    return <Navigate to="/client-portal" replace />;
  }

  return children;
};

export default ProtectedRoute;