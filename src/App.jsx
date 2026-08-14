import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { ServicesPage } from './pages/public/ServicesPage';
import { Consultation } from './pages/public/Consultation';
import { FAQ } from './pages/public/FAQ';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { ForgotPassword } from './pages/public/ForgotPassword';

// Portals
import { LawyerDashboard } from './pages/lawyer/LawyerDashboard';
import { ClientPortal } from './pages/client/ClientPortal';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CasesList } from './pages/admin/CasesList';
import { HearingsSchedule } from './pages/admin/HearingsSchedule';
import { LawyersPage } from './pages/admin/LawyersPage';
import { ClientsPage } from './pages/admin/ClientsPage';
import { TaskDelegation } from './pages/admin/TaskDelegation';
import { DocumentArchive } from './pages/admin/DocumentArchive';
import { AttendanceLog } from './pages/admin/AttendanceLog';
import { SystemSettings } from './pages/admin/SystemSettings';
import { AdminChat } from './pages/admin/AdminChat';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-amber-500 gap-3" dir="rtl">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">جاري التحقق من الصلاحيات...</span>
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Lawyer Dashboard Route */}
          <Route
            path="/lawyer"
            element={
              <ProtectedRoute allowedRoles={['LAWYER', 'ADMIN']}>
                <LawyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Client Portal Route */}
          <Route
            path="/client-portal"
            element={
              <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                <ClientPortal />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="cases" element={<CasesList />} />
            <Route path="hearings" element={<HearingsSchedule />} />
            <Route path="lawyers" element={<LawyersPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="tasks" element={<TaskDelegation />} />
            <Route path="documents" element={<DocumentArchive />} />
            <Route path="attendance" element={<AttendanceLog />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;