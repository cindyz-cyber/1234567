import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)',
            color: '#EBC862',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ maxWidth: '500px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</h1>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '600' }}>
              能量波动异常
            </h2>
            <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '24px', lineHeight: '1.6' }}>
              系统正在重新校准能量场，请刷新页面重试
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                background: 'linear-gradient(135deg, #EBC862 0%, #D4AF37 100%)',
                color: '#0A0A0F',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(235, 200, 98, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(235, 200, 98, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(235, 200, 98, 0.3)';
              }}
            >
              重新连接
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '32px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', opacity: 0.6, fontSize: '14px' }}>
                  错误详情（开发模式）
                </summary>
                <pre
                  style={{
                    marginTop: '12px',
                    padding: '16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    overflow: 'auto',
                    maxWidth: '100%',
                    color: '#ff6b6b'
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
