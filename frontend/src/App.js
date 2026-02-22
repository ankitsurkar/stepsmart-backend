import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import AdminPage from './pages/AdminPage';

// basename="/learn" strips the /learn prefix from all URLs before React Router processes them.
// A request to stepsmart.net/learn/dashboard is seen by React Router as /dashboard.
// React Router also prepends /learn to any links it generates (e.g. <Navigate to="/dashboard">
// becomes a navigation to /learn/dashboard in the real URL).
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
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
