import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 100%)',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <h2 style={{
              fontSize: '24px',
              color: '#F7E7CE',
              marginBottom: '16px',
              fontWeight: 300,
              letterSpacing: '0.2em'
            }}>
              页面加载中，请稍候...
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.8',
              marginBottom: '24px'
            }}>
              如果持续出现此页面，请尝试刷新
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #F7E7CE 0%, #EBC862 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#1a1a2e',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '0.1em'
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
