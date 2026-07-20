import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signOut,
  confirmSignIn,
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
  updateUserAttributes,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import awsConfig from '../config/aws-config';

// Configure Amplify once at module load time.
Amplify.configure(awsConfig);

function getFriendlyErrorMessage(err) {
  if (!err) return 'An unexpected error occurred.';
  
  const name = err.name || err.code || '';
  const message = err.message || '';
  
  switch (name) {
    case 'NotAuthorizedException':
      return 'Incorrect username or password.';
    case 'UserNotFoundException':
      return 'User does not exist.';
    case 'ResourceNotFoundException':
      return 'Authentication service configuration error (User Pool not found). Please verify your User Pool and Client configuration.';
    case 'PasswordResetRequiredException':
      return 'Your password must be reset before you can sign in.';
    case 'UserNotConfirmedException':
      return 'Your account is not confirmed yet. Please verify your email.';
    case 'LimitExceededException':
      return 'Too many failed login attempts. Please try again later.';
    case 'InvalidPasswordException':
      return 'The password does not meet the security requirements.';
    case 'UsernameExistsException':
      return 'An account with this email already exists.';
    case 'CodeMismatchException':
      return 'The verification code is incorrect or has expired.';
    case 'ExpiredCodeException':
      return 'The verification code has expired. Please request a new one.';
    case 'TooManyFailedAttemptsException':
      return 'Too many failed attempts. Please try again later.';
    case 'InvalidParameterException':
      if (message.includes('validation constraints')) {
        return 'Please ensure all fields are filled out correctly.';
      }
      break;
    default:
      break;
  }
  
  if (message) {
    if (message === 'An unknown error has occurred' || message === 'Unknown error') {
      return 'A connection or configuration error occurred. Please check your internet connection or user pool configuration and try again.';
    }
    return message;
  }
  
  return 'Authentication failed. Please try again.';
}

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
      website: attributes?.website || '',
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
      return { error: getFriendlyErrorMessage(err) };
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
      return { error: getFriendlyErrorMessage(err) };
    }
  }

  // Triggers the password reset code sending.
  async function triggerResetPassword(email) {
    try {
      const result = await resetPassword({ username: email });
      return { success: true, result };
    } catch (err) {
      return { error: getFriendlyErrorMessage(err) };
    }
  }

  // Completes the password reset using the verification code.
  async function completeResetPassword(email, code, newPassword) {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      return { success: true };
    } catch (err) {
      return { error: getFriendlyErrorMessage(err) };
    }
  }

  async function updateDisplayName(name) {
    return updateProfile(name, user?.website || '');
  }

  async function updateProfile(name, linkedinUrl) {
    const nextName = name.trim();
    if (!nextName) {
      return { error: 'Display name cannot be empty.' };
    }

    try {
      await updateUserAttributes({
        userAttributes: {
          name: nextName,
          website: (linkedinUrl || '').trim(),
        },
      });
      await loadAuthenticatedUser();
      return { success: true };
    } catch (err) {
      return { error: getFriendlyErrorMessage(err) };
    }
  }

  async function logout() {
    await signOut();
    setUser(null);
    setIsAdmin(false);
  }

  // Registers a new user with Cognito
  async function register(email, password, fullName) {
    try {
      const result = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: fullName,
          },
        },
      });
      return { success: true, isSignUpComplete: result.isSignUpComplete, nextStep: result.nextStep };
    } catch (err) {
      return { error: getFriendlyErrorMessage(err) };
    }
  }

  // Confirms user registration with confirmation code
  async function confirmRegister(email, code) {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return { success: true };
    } catch (err) {
      return { error: getFriendlyErrorMessage(err) };
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, completeNewPassword, triggerResetPassword, completeResetPassword, register, confirmRegister, updateDisplayName, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
