/**
 * Dashboard loading UI — shown instantly while the server-side dashboard
 * data is being fetched. Gives users instant visual feedback instead of a blank page.
 */
export default function DashboardLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>
          Loading dashboard…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
