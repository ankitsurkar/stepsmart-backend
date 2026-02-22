import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shows a loading state while AuthContext is checking for a persisted session.
// Without this, the app briefly redirects to /login on every page refresh.
function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontSize: '1rem', color: '#666',
    }}>
      Loading…
    </div>
  );
}

// Wraps any route that requires authentication.
// If the user is not logged in, redirects to /login.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Wraps any route that requires the admin group.
// Layer 1 of admin enforcement (UI gate only — the real security is in Lambda).
// A non-admin who somehow navigates here is redirected to the student dashboard.
export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
