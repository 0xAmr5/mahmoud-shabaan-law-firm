import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { AdminLayout } from '../components/layout/AdminLayout';
import { PublicLayout } from '../components/layout/PublicLayout';

// Public Pages
import { Home } from '../pages/public/Home';
import { About } from '../pages/public/About';
import { ServicesPage } from '../pages/public/ServicesPage';
import { Consultation } from '../pages/public/Consultation';
import { Contact } from '../pages/public/Contact';
import { FAQ } from '../pages/public/FAQ';
import { Privacy } from '../pages/public/Privacy';
import { Terms } from '../pages/public/Terms';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { NotFound } from '../pages/public/NotFound';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { CasesPage } from '../pages/admin/CasesPage';
import { ClientsPage } from '../pages/admin/ClientsPage';
import { LawyersPage } from '../pages/admin/LawyersPage';
import { AttendancePage } from '../pages/admin/AttendancePage';
import { HearingsPage } from '../pages/admin/HearingsPage';
import { TasksPage } from '../pages/admin/TasksPage';
import { DocumentsPage } from '../pages/admin/DocumentsPage';
import { ConsultationsPage } from '../pages/admin/ConsultationsPage';
import { AdminChatPage } from '../pages/admin/AdminChatPage';
import { AuditPage } from '../pages/admin/AuditPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

// Lawyer & Client Pages
import { LawyerDashboard } from '../pages/lawyer/LawyerDashboard';
import { ClientPortal } from '../pages/client/ClientPortal';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. الصفحات العامة */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 2. لوحة تحكم الإدارة (ADMIN فقط) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="consultations" element={<ConsultationsPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="lawyers" element={<LawyersPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="hearings" element={<HearingsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 3. لوحة تحكم المحامي (LAWYER فقط) */}
      <Route element={<ProtectedRoute allowedRoles={['LAWYER']} />}>
        <Route path="/lawyer" element={<LawyerDashboard />} />
      </Route>

      {/* 4. بوابة الموكل (CLIENT فقط) */}
      <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
        <Route path="/client-portal" element={<ClientPortal />} />
      </Route>

      {/* 5. صفحة 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;