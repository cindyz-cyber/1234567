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
            0 0 30px rgba(247, 231, 206, 0.5),
            0 0 60px rgba(235, 200, 98, 0.3),
            inset 0 0 25px rgba(247, 231, 206, 0.2);
          transform: translateY(-2px) scale(1.02);
          border-color: #F7E7CE;
          color: #F7E7CE;
        }

        .gold-outline-btn:not(:disabled):active {
          transform: translateY(0) scale(1);
        }
      `}</style>
    </button>
  );
}
