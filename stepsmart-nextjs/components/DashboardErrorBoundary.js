import React from 'react';

export default class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DashboardErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, hsl(214, 100%, 98%) 0%, hsl(205, 78%, 97%) 100%)',
          padding: '2rem',
          fontFamily: "'Inter', -apple-system, sans-serif"
        }}>
          <div style={{
            background: 'var(--card, #fff)',
            maxWidth: '500px',
            width: '100%',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg, 0 10px 30px rgba(15, 40, 80, 0.08))',
            border: '1px solid var(--border, rgba(0, 0, 0, 0.05))',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'hsl(195, 83%, 94%)',
              color: 'var(--primary, hsl(195, 83%, 38%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              color: 'var(--foreground, #1e293b)',
              marginBottom: '0.75rem',
              fontWeight: '700'
            }}>
              Something went wrong
            </h2>
            <p style={{
              color: 'var(--muted-foreground, #64748b)',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              We encountered an unexpected error loading your learning dashboard. We have logged the error and are working on a fix.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'var(--primary, hsl(195, 83%, 38%))',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background 0.15s, transform 0.1s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-dark, hsl(195, 83%, 30%))'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary, hsl(195, 83%, 38%))'}
              >
                Reload Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
