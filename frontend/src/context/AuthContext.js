import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signOut,
  confirmSignIn,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
  updateUserAttributes,
} from 'aws-amplify/auth';
import awsConfig from '../config/aws-config';

// Configure Amplify once at module load time.
Amplify.configure(awsConfig);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);   // true while checking persisted session

  async function loadAuthenticatedUser() {
    const currentUser = await getCurrentUser();
    const [session, attributes] = await Promise.all([
      fetchAuthSession(),
      fetchUserAttributes(),
    ]);
    const groups = session.tokens?.idToken?.payload?.['cognito:groups'] || [];
    const nextUser = {
      ...currentUser,
      profileName: attributes?.name || '',
      email: attributes?.email || '',
    };

    setUser(nextUser);
    setIsAdmin(Array.isArray(groups) ? groups.includes('admins') : groups === 'admins');

    return nextUser;
  }

  // On mount, check whether there's already a valid session (page refresh or tab reopen).
  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      await loadAuthenticatedUser();
    } catch {
      // No active session — user needs to log in.
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  // Returns:
  //   { success: true }                  — fully logged in
  //   { requiresNewPassword: true }      — Cognito FORCE_CHANGE_PASSWORD state
  //   { error: string }                  — login failure
  async function login(email, password) {
    try {
      const result = await signIn({ username: email, password });

      // Cognito sets new accounts to FORCE_CHANGE_PASSWORD.
      // The SRP challenge succeeds, but signIn is not yet complete.
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        return { requiresNewPassword: true };
      }

      await loadAuthenticatedUser();
      return { success: true };
    } catch (err) {
      return { error: err.message || 'Login failed' };
    }
  }

  // Called immediately after login() returns { requiresNewPassword: true }.
  // Completes the FORCE_CHANGE_PASSWORD challenge.
  async function completeNewPassword(newPassword) {
    try {
      await confirmSignIn({ challengeResponse: newPassword });
      await loadAuthenticatedUser();
      return { success: true };
    } catch (err) {
      return { error: err.message || 'Password reset failed' };
    }
  }

  async function updateDisplayName(name) {
    const nextName = name.trim();
    if (!nextName) {
      return { error: 'Display name cannot be empty.' };
    }

    try {
      await updateUserAttributes({
        userAttributes: {
          name: nextName,
        },
      });
      await loadAuthenticatedUser();
      return { success: true };
    } catch (err) {
      return { error: err.message || 'Failed to update display name.' };
    }
  }

  async function logout() {
    await signOut();
    setUser(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, completeNewPassword, updateDisplayName, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
