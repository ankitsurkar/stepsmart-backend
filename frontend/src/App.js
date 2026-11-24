import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardErrorBoundary from './components/DashboardErrorBoundary';
import LearnPage from './pages/LearnPage';
import AdminPage from './pages/AdminPage';
import { Toaster } from 'sonner';

// basename="/learn" strips the /learn prefix from all URLs before React Router processes them.
// A request to stepsmart.net/learn/dashboard is seen by React Router as /dashboard.
// React Router also prepends /learn to any links it generates (e.g. <Navigate to="/dashboard">
// becomes a navigation to /learn/dashboard in the real URL).
// Automatic redirect for direct root access on localhost (e.g. http://localhost:3000 -> http://localhost:3000/learn/dashboard)
if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/learn')) {
  const currentPath = window.location.pathname;
  const search = window.location.search || '';
  const hash = window.location.hash || '';
  const target = '/learn' + (currentPath === '/' ? '/dashboard' : currentPath) + search + hash;
  window.location.replace(target);
}

export default function App() {
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/learn')) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading StepSmart...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <BrowserRouter basename="/learn">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardErrorBoundary>
                  <DashboardPage />
                </DashboardErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:courseId/:weekId"
            element={
              <ProtectedRoute>
                <LearnPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Default redirect — unknown paths go to dashboard (which redirects to login if unauth) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
