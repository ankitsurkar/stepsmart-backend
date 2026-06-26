import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithRedirect } from 'aws-amplify/auth';

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
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0 1rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--border)',
  },
  dividerText: {
    padding: '0 0.75rem',
    fontSize: '0.78rem',
    color: 'var(--muted-foreground)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  googleButton: {
    width: '100%',
    padding: '0.8rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    background: 'var(--card)',
    color: 'var(--foreground)',
    border: '1.5px solid var(--border)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '0.25rem',
    letterSpacing: '0.01em',
  },
};

export default function LoginPage() {
  const { login, completeNewPassword, triggerResetPassword, completeResetPassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'newPassword' | 'forgotPassword' | 'confirmReset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signInHovered, setSignInHovered] = useState(false);
  const [googleHovered, setGoogleHovered] = useState(false);

  async function handleGoogleSignIn() {
    setError('');
    setSubmitting(true);
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      console.error('Google Sign-In redirection failed:', err);
      setError(err.message || 'Google Sign-In redirection failed.');
      setSubmitting(false);
    }
  }

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

  async function handleForgotPasswordTrigger(e) {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    setSubmitting(true);
    const result = await triggerResetPassword(email);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    setMode('confirmReset');
  }

  async function handleForgotPasswordConfirm(e) {
    e.preventDefault();
    setError('');
    if (!resetCode) { setError('Please enter the verification code.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    
    setSubmitting(true);
    const result = await completeResetPassword(email, resetCode, newPassword);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    const loginResult = await login(email, newPassword);
    setSubmitting(false);
    if (loginResult.error) {
      setError('Password reset successfully! Please sign in with your new password.');
      setMode('login');
      setPassword('');
      return;
    }
    navigate('/dashboard', { replace: true });
  }

  return (
    <div style={styles.container}>
      <div className="login-form-area">
        <div className="login-card">
          {/* Brand */}
          <div style={styles.brandRow}>
            <div style={styles.brandDot}>
              <div style={styles.brandDotInner} />
            </div>
            <div style={styles.logo}>StepSmart</div>
          </div>
          <div style={styles.subtitle}>
            {mode === 'login' && 'Sign in to your learning portal'}
            {mode === 'newPassword' && 'Create your permanent password'}
            {mode === 'forgotPassword' && 'Reset your password'}
            {mode === 'confirmReset' && 'Confirm your new password'}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {mode === 'login' ? (
            <>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ ...styles.label, marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode('forgotPassword');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.78rem',
                      fontWeight: 650,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  style={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  style={{
                    ...styles.button,
                    opacity: submitting ? 0.65 : 1,
                    backgroundColor: signInHovered ? 'var(--primary-dark)' : 'var(--primary)',
                    transform: signInHovered ? 'translateY(-1px)' : 'none',
                    boxShadow: signInHovered ? 'var(--shadow-md)' : 'none',
                  }}
                  type="submit"
                  disabled={submitting}
                  onMouseEnter={() => setSignInHovered(true)}
                  onMouseLeave={() => setSignInHovered(false)}
                >
                  {submitting ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>

              <div style={styles.dividerContainer}>
                <div style={styles.dividerLine} />
                <span style={styles.dividerText}>or continue with</span>
                <div style={styles.dividerLine} />
              </div>

              <button
                type="button"
                style={{
                  ...styles.googleButton,
                  backgroundColor: googleHovered ? 'var(--background)' : 'var(--card)',
                  borderColor: googleHovered ? 'var(--primary-light)' : 'var(--border)',
                  boxShadow: googleHovered ? 'var(--shadow-sm)' : 'none',
                  transform: googleHovered ? 'translateY(-1px)' : 'none',
                }}
                onMouseEnter={() => setGoogleHovered(true)}
                onMouseLeave={() => setGoogleHovered(false)}
                onClick={handleGoogleSignIn}
                disabled={submitting}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.707a5.416 5.416 0 0 1 0-3.414V4.961H.957a8.997 8.997 0 0 0 0 8.078l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.507.454 3.44 1.345l2.582-2.58C13.463.886 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z"
                  />
                </svg>
                Sign in with Google
              </button>
            </>
          ) : mode === 'forgotPassword' ? (
            <form onSubmit={handleForgotPasswordTrigger}>
              <div style={styles.info}>
                Enter your email address below, and we'll send you a verification code to reset your password.
              </div>
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
              <button
                style={{ ...styles.button, opacity: submitting ? 0.65 : 1 }}
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Sending code…' : 'Send Reset Code →'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '1rem',
                  textAlign: 'center',
                }}
              >
                Back to Sign In
              </button>
            </form>
          ) : mode === 'confirmReset' ? (
            <form onSubmit={handleForgotPasswordConfirm}>
              <div style={styles.info}>
                A verification code has been sent to your email. Enter it below along with your new password.
              </div>
              <label style={styles.label}>Verification Code</label>
              <input
                style={styles.input}
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                autoFocus
              />
              <label style={styles.label}>New password</label>
              <input
                style={styles.input}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
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
                {submitting ? 'Resetting password…' : 'Reset Password & Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('forgotPassword');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '1rem',
                  textAlign: 'center',
                }}
              >
                Resend Code / Change Email
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
