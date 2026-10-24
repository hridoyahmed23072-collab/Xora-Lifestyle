import React from 'react';

interface State {
  error: Error | null;
}

// Shows the real error on screen instead of a blank page, so problems can be diagnosed quickly.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Page crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const msg = String(this.state.error?.message || this.state.error);
    const stack = String(this.state.error?.stack || '').split('\n').slice(0, 6).join('\n');
    return (
      <div style={{ minHeight: '100vh', background: '#F5F2EB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ maxWidth: 640, width: '100%', background: '#fff', border: '1px solid #E5DDD0', borderRadius: 16, padding: 24, fontFamily: 'sans-serif' }}>
          <h2 style={{ margin: 0, fontSize: 18, color: '#962D3E' }}>Something went wrong on this page</h2>
          <p style={{ fontSize: 13, color: '#4A433A' }}>Please take a screenshot of this box and send it to support.</p>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, background: '#FAF7F2', padding: 12, borderRadius: 8, color: '#B42318' }}>{msg}{'\n\n'}{stack}</pre>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 14px', background: '#962D3E', color: '#fff', border: 0, borderRadius: 10, cursor: 'pointer' }}>Reload</button>
            <a href="/" style={{ padding: '8px 14px', background: '#FAF7F2', color: '#2D2A26', border: '1px solid #DDD4C5', borderRadius: 10, textDecoration: 'none' }}>Back to store</a>
          </div>
        </div>
      </div>
    );
  }
}
