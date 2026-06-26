/**
 * Learn page loading UI — shown instantly while the server-side lesson data
 * is being fetched.
 */
export default function LearnLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
    }}>
      {/* Sidebar skeleton */}
      <div style={{
        background: 'linear-gradient(180deg, var(--primary-dark, #0f2850) 0%, var(--primary, #1a3a6e) 100%)',
        padding: '1.5rem 1rem',
      }}>
        <div style={{ height: '2rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', marginBottom: '2rem' }} />
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ height: '2.5rem', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', marginBottom: '0.5rem' }} />
        ))}
      </div>

      {/* Main content skeleton */}
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Video skeleton */}
        <div style={{
          width: '100%',
          paddingBottom: '56.25%',
          position: 'relative',
          background: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255,255,255,0.2)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        </div>
        <div style={{ height: '1.5rem', background: 'var(--muted)', borderRadius: '6px', width: '60%' }} />
        <div style={{ height: '1rem', background: 'var(--muted)', borderRadius: '6px', width: '80%' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
