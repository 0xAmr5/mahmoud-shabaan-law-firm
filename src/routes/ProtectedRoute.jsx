import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500 gap-3" dir="rtl">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-xs font-bold">جاري التحقق من الحساب والصلاحيات...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // فحص الصلاحيات حسب الرتبة
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'LAWYER') return <Navigate to="/lawyer" replace />;
    return <Navigate to="/client-portal" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;