'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#0a0a0a',
        color: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'rgba(239,68,68,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Error inesperado
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Ocurrió un error al cargar la página. Esto no debería afectar tus datos.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0e384e',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Reintentar
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#a1a1aa',
              border: '1px solid #27272a',
              borderRadius: 12,
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Ir al inicio
          </button>
        </div>
      </body>
    </html>
  );
}