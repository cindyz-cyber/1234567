interface GoldButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function GoldButton({ onClick, disabled, children, className = '' }: GoldButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`gold-text-btn ${className}`}
      style={{
        padding: '16px 32px',
        background: 'transparent',
        border: 'none',
        color: '#F7E7CE',
        fontSize: '16px',
        fontWeight: '300',
        letterSpacing: '0.25em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.3 : 0.9,
        textShadow: '0 0 20px rgba(247, 231, 206, 0.4)',
      }}
    >
      {children}

      <style>{`
        .gold-text-btn:not(:disabled):hover {
          opacity: 1;
          text-shadow: 0 0 40px rgba(247, 231, 206, 0.9), 0 0 80px rgba(247, 231, 206, 0.6);
          transform: scale(1.05);
        }

        .gold-text-btn:not(:disabled):active {
          transform: scale(1);
          text-shadow: 0 0 60px rgba(247, 231, 206, 1), 0 0 100px rgba(247, 231, 206, 0.8);
        }
      `}</style>
    </button>
  );
}
