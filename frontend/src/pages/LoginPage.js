import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    display: 'flex', minHeight: '100vh', background: 'var(--background)',
  },
  // Left decorative panel
  panel: {
    display: 'none',
    flexDirection: 'column', justifyContent: 'center',
    padding: '3rem', width: '420px', flexShrink: 0,
    background: 'var(--primary)',
  },
  panelHeading: { fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' },
  panelSub: { color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6 },
  // Right login form area
  formArea: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
  },
  card: {
    background: 'var(--card)', borderRadius: '16px', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' },
  brandDot: {
    width: '28px', height: '28px', borderRadius: '8px',
    background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandDotInner: { width: '10px', height: '10px', borderRadius: '50%', background: '#fff' },
  logo: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--foreground)' },
  subtitle: {
    fontSize: '0.9rem', color: 'var(--muted-foreground)',
    marginBottom: '2rem', marginTop: '0.25rem',
  },
  label: {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    color: 'var(--foreground)', marginBottom: '0.4rem', letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%', padding: '0.7rem 1rem', fontSize: '0.95rem',
    border: '1.5px solid var(--border)', borderRadius: '8px', outline: 'none',
    background: 'var(--background)', color: 'var(--foreground)',
    marginBottom: '1rem', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 700,
    background: 'var(--primary)', color: 'var(--primary-foreground)',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    transition: 'background 0.2s', marginTop: '0.25rem', letterSpacing: '0.01em',
  },
  error: {
    background: 'hsl(0, 84%, 96%)', border: '1px solid var(--destructive)',
    color: 'var(--destructive)', borderRadius: '8px',
    padding: '0.7rem 1rem', fontSize: '0.875rem', marginBottom: '1rem',
  },
  info: {
    background: 'var(--accent)', border: '1px solid var(--primary)',
    color: 'var(--accent-foreground)', borderRadius: '8px',
    padding: '0.7rem 1rem', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5,
  },
  footerText: {
    textAlign: 'center', color: 'var(--muted-foreground)',
    fontSize: '0.78rem', marginTop: '1.75rem',
  },
};

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
    if (result.requiresNewPassword) { setMode('newPassword'); return; }
    if (result.error) { setError(result.error); return; }
    navigate('/dashboard', { replace: true });
  }

  async function handleNewPassword(e) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setSubmitting(true);
    const result = await completeNewPassword(newPassword);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    navigate('/dashboard', { replace: true });
  }

  return (
    <div style={styles.container}>
      <div style={styles.formArea}>
        <div style={styles.card}>
          {/* Brand */}
          <div style={styles.brandRow}>
            <div style={styles.brandDot}>
              <div style={styles.brandDotInner} />
            </div>
            <div style={styles.logo}>StepSmart</div>
          </div>
          <div style={styles.subtitle}>
            {mode === 'login' ? 'Sign in to your learning portal' : 'Create your permanent password'}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <label style={styles.label}>Email address</label>
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
              <button
                style={{ ...styles.button, opacity: submitting ? 0.65 : 1 }}
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleNewPassword}>
              <div style={styles.info}>
                Your account requires a new password before you can access the portal.
              </div>
              <label style={styles.label}>New password</label>
              <input
                style={styles.input}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoFocus
              />
              <label style={styles.label}>Confirm password</label>
              <input
                style={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
              />
              <button
                style={{ ...styles.button, opacity: submitting ? 0.65 : 1 }}
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Setting password…' : 'Set Password & Continue →'}
              </button>
            </form>
          )}

          <div style={styles.footerText}>StepSmart · Product Management</div>
        </div>
      </div>
    </div>
  );
}
