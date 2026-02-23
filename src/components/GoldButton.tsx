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
      className={`gold-outline-btn ${className}`}
      style={{
        padding: '16px 32px',
        borderRadius: '24px',
        background: 'transparent',
        border: '1px solid #EBC862',
        color: '#EBC862',
        fontSize: '16px',
        fontWeight: '300',
        letterSpacing: '0.05em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {children}

      <style>{`
        .gold-outline-btn:not(:disabled):hover {
          box-shadow:
            0 0 20px rgba(235, 200, 98, 0.3),
            inset 0 0 20px rgba(235, 200, 98, 0.1);
          transform: translateY(-2px);
        }

        .gold-outline-btn:not(:disabled):active {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
}
