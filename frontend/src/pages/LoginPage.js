import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#f0f4f8', padding: '1rem',
  },
  card: {
    background: '#fff', borderRadius: '12px', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  logo: { fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.25rem' },
  subtitle: { fontSize: '0.9rem', color: '#666', marginBottom: '2rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.4rem' },
  input: {
    width: '100%', padding: '0.75rem 1rem', fontSize: '1rem',
    border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none',
    transition: 'border-color 0.2s', marginBottom: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 600,
    background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', transition: 'background 0.2s', marginTop: '0.5rem',
  },
  error: {
    background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
    borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.875rem',
    marginBottom: '1rem',
  },
  info: {
    background: '#eff6ff', border: '1px solid #93c5fd', color: '#1d4ed8',
    borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.875rem',
    marginBottom: '1rem',
  },
};

// mode: 'login' | 'newPassword'
export default function LoginPage() {
  const { login, completeNewPassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.requiresNewPassword) {
      // Cognito wants the student to set a permanent password before continuing.
      setMode('newPassword');
      return;
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/dashboard', { replace: true });
  }

  async function handleNewPassword(e) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    const result = await completeNewPassword(newPassword);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/dashboard', { replace: true });
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>CourseLab</div>
        <div style={styles.subtitle}>
          {mode === 'login' ? 'Sign in to your course portal' : 'Set your permanent password'}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button style={styles.button} type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleNewPassword}>
            <div style={styles.info}>
              Your account requires a new password. Choose something secure that you'll remember.
            </div>

            <label style={styles.label}>New Password</label>
            <input
              style={styles.input}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              autoFocus
            />

            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Same as above"
              required
            />

            <button style={styles.button} type="submit" disabled={submitting}>
              {submitting ? 'Setting password…' : 'Set Password & Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
