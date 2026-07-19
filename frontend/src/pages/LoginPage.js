import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithRedirect } from 'aws-amplify/auth';

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

  // Hover states for Neobrutalist buttons
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const [googleHover, setGoogleHover] = useState(false);
  const [googleActive, setGoogleActive] = useState(false);

  // Input focus tracking
  const [focusedInput, setFocusedInput] = useState(null);

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

  // Helper for input styling
  const getInputStyle = (inputKey) => ({
    width: '100%',
    padding: '0.85rem 1rem',
    fontSize: '0.95rem',
    fontWeight: 700,
    border: '3px solid #111111',
    backgroundColor: '#FFFFFF',
    color: '#111111',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '1.25rem',
    boxShadow: focusedInput === inputKey ? '4px 4px 0px 0px #188ab2' : 'none',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: 'Inter, -apple-system, sans-serif',
      backgroundImage: 'radial-gradient(#111111 0.75px, transparent 0.75px)',
      backgroundSize: '24px 24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        boxShadow: '8px 8px 0px 0px #111111',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box',
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <img 
            src="/stepsmart-logo.png" 
            alt="StepSmart Logo" 
            style={{ height: '38px', width: 'auto', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111111', letterSpacing: '-0.03em' }}>
            StepSmart
          </span>
        </div>

        {/* Dynamic Title */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111111', textAlign: 'center', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          {mode === 'login' && (
            <>
              Welcome <span style={{
                backgroundColor: '#FFF3A7',
                border: '2.5px solid #111111',
                padding: '0.1rem 0.5rem',
                display: 'inline-block',
                transform: 'rotate(-1.5deg)',
                boxShadow: '3px 3px 0px 0px #111111',
              }}>Back</span>
            </>
          )}
          {mode === 'newPassword' && 'Set Permanent Password'}
          {mode === 'forgotPassword' && 'Reset Password'}
          {mode === 'confirmReset' && 'Confirm Password'}
        </h1>

        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111', textAlign: 'center', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {mode === 'login' && 'Sign in to access your PM-X learning portal.'}
          {mode === 'newPassword' && 'First time logging in? Create your permanent account password below.'}
          {mode === 'forgotPassword' && "Enter your email to receive a verification code."}
          {mode === 'confirmReset' && 'Enter your verification code and new password.'}
        </p>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#FFD1D1',
            border: '3px solid #111111',
            boxShadow: '4px 4px 0px 0px #111111',
            padding: '0.85rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 800,
            color: '#111111',
            marginBottom: '1.25rem',
            lineHeight: 1.4,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <>
            <form onSubmit={handleLogin}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#111111', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email Address
              </label>
              <input
                style={getInputStyle('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                placeholder="you@example.com"
                required
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('forgotPassword');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#188ab2',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                style={getInputStyle('password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                placeholder="••••••••"
                required
              />

              <button
                type="submit"
                disabled={submitting}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => { setBtnHover(false); setBtnActive(false); }}
                onMouseDown={() => setBtnActive(true)}
                onMouseUp={() => setBtnActive(false)}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  backgroundColor: btnHover ? '#188ab2' : '#0f6f8f',
                  color: '#FFFFFF',
                  border: '3px solid #111111',
                  boxShadow: btnActive ? '2px 2px 0px 0px #111111' : (btnHover ? '6px 6px 0px 0px #111111' : '4px 4px 0px 0px #111111'),
                  transform: btnActive ? 'translate(2px, 2px)' : (btnHover ? 'translate(-2px, -2px)' : 'none'),
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.65 : 1,
                  transition: 'all 0.15s ease',
                  marginTop: '0.25rem',
                }}
              >
                {submitting ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            {/* Neobrutalist Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0 1.25rem 0' }}>
              <div style={{ flex: 1, height: '3px', backgroundColor: '#111111' }} />
              <span style={{ padding: '0 0.85rem', fontSize: '0.75rem', fontWeight: 900, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                OR CONTINUE WITH
              </span>
              <div style={{ flex: 1, height: '3px', backgroundColor: '#111111' }} />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleGoogleSignIn}
              onMouseEnter={() => setGoogleHover(true)}
              onMouseLeave={() => { setGoogleHover(false); setGoogleActive(false); }}
              onMouseDown={() => setGoogleActive(true)}
              onMouseUp={() => setGoogleActive(false)}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                backgroundColor: googleHover ? '#FFF3A7' : '#FFFFFF',
                color: '#111111',
                border: '3px solid #111111',
                boxShadow: googleActive ? '2px 2px 0px 0px #111111' : (googleHover ? '6px 6px 0px 0px #111111' : '4px 4px 0px 0px #111111'),
                transform: googleActive ? 'translate(2px, 2px)' : (googleHover ? 'translate(-2px, -2px)' : 'none'),
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.964 10.707a5.416 5.416 0 0 1 0-3.414V4.961H.957a8.997 8.997 0 0 0 0 8.078l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.507.454 3.44 1.345l2.582-2.58C13.463.886 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" />
              </svg>
              Sign in with Google
            </button>
          </>
        ) : mode === 'forgotPassword' ? (
          <form onSubmit={handleForgotPasswordTrigger}>
            <div style={{
              backgroundColor: '#FFF3A7',
              border: '3px solid #111111',
              boxShadow: '4px 4px 0px 0px #111111',
              padding: '0.85rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 800,
              color: '#111111',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}>
              💡 Enter your email address below, and we will send you a verification code to reset your password.
            </div>

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#111111', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input
              style={getInputStyle('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholder="you@example.com"
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: 900,
                backgroundColor: '#0f6f8f',
                color: '#FFFFFF',
                border: '3px solid #111111',
                boxShadow: '4px 4px 0px 0px #111111',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.65 : 1,
              }}
            >
              {submitting ? 'Sending code…' : 'Send Reset Code →'}
            </button>

            <button
              type="button"
              onClick={() => { setError(''); setMode('login'); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#111111',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                width: '100%',
                marginTop: '1.25rem',
                textAlign: 'center',
                textDecoration: 'underline',
              }}
            >
              ← Back to Sign In
            </button>
          </form>
        ) : mode === 'confirmReset' ? (
          <form onSubmit={handleForgotPasswordConfirm}>
            <div style={{
              backgroundColor: '#FFF3A7',
              border: '3px solid #111111',
              boxShadow: '4px 4px 0px 0px #111111',
              padding: '0.85rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 800,
              color: '#111111',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}>
              ✉️ A verification code has been sent to your email. Enter it below along with your new password.
            </div>

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#111111', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verification Code
            </label>
            <input
              style={getInputStyle('resetCode')}
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              onFocus={() => setFocusedInput('resetCode')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter 6-digit code"
              required
              autoFocus
            />

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#111111', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New Password
            </label>
            <input
              style={getInputStyle('newPassword')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setFocusedInput('newPassword')}
              onBlur={() => setFocusedInput(null)}
              placeholder="At least 8 characters"
              required
            />

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#111111', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Confirm Password
            </label>
            <input
              style={getInputStyle('confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Repeat new password"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: 900,
                backgroundColor: '#0f6f8f',
                color: '#FFFFFF',
                border: '3px solid #111111',
                boxShadow: '4px 4px 0px 0px #111111',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.65 : 1,
              }}
            >
              {submitting ? 'Resetting password…' : 'Reset Password & Sign In'}
            </button>

            <button
              type="button"
              onClick={() => { setError(''); setMode('forgotPassword'); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#111111',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                width: '100%',
                marginTop: '1.25rem',
                textAlign: 'center',
                textDecoration: 'underline',
              }}
            >
              Resend Code / Change Email
            </button>
          </form>
        ) : (
          <form onSubmit={handleNewPassword}>
            <div style={{
              backgroundColor: '#FFF3A7',
              border: '3px solid #111111',
              boxShadow: '4px 4px 0px 0px #111111',
              padding: '0.85rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 800,
              color: '#111111',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}>
              🔒 Welcome! As a new student created by the admin, please set your permanent password to complete your first login.
            </div>

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#111111', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New Permanent Password
            </label>
            <input
              style={getInputStyle('newPassword')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setFocusedInput('newPassword')}
              onBlur={() => setFocusedInput(null)}
              placeholder="At least 8 characters"
              required
              autoFocus
            />

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#111111', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Confirm Password
            </label>
            <input
              style={getInputStyle('confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Repeat new password"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: 900,
                backgroundColor: '#0f6f8f',
                color: '#FFFFFF',
                border: '3px solid #111111',
                boxShadow: '4px 4px 0px 0px #111111',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.65 : 1,
              }}
            >
              {submitting ? 'Setting password…' : 'Set Password & Access Portal →'}
            </button>
          </form>
        )}

        {/* Footer Brand */}
        <div style={{
          textAlign: 'center',
          color: '#111111',
          fontSize: '0.8rem',
          fontWeight: 800,
          marginTop: '2rem',
          letterSpacing: '0.04em',
        }}>
          StepSmart · Product Management Career Accelerator
        </div>
      </div>
    </div>
  );
}
