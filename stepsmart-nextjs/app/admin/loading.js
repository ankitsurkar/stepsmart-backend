/**
 * Admin page loading UI — shown instantly while the server-side admin
 * session guard and course data are being processed.
 */
export default function AdminLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
    }}>
      {/* Nav skeleton */}
      <div style={{
        height: '60px',
        background: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        gap: '1rem',
      }}>
        <div style={{ height: '1.2rem', width: '160px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }} />
      </div>

      {/* Tab bar skeleton */}
      <div style={{ display: 'flex', gap: '0.25rem', padding: '0.75rem 2rem', borderBottom: '1px solid var(--border)' }}>
        {['Manage Weeks','Students','Progress','Submissions','Leads'].map(label => (
          <div key={label} style={{ height: '2rem', width: '100px', background: 'var(--muted)', borderRadius: '6px' }} />
        ))}
      </div>

      {/* Content skeleton */}
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>Loading admin panel…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
