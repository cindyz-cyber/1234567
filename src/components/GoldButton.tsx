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
        padding: '18px 48px',
        background: 'linear-gradient(135deg, rgba(247, 231, 206, 0.08) 0%, rgba(235, 200, 98, 0.12) 100%)',
        border: '1.5px solid rgba(247, 231, 206, 0.4)',
        borderRadius: '50px',
        color: '#FFF9E5',
        fontSize: '16px',
        fontWeight: '400',
        letterSpacing: '0.3em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.3 : 1,
        textShadow: '0 2px 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(247, 231, 206, 0.5)',
        boxShadow: disabled
          ? 'none'
          : '0 0 20px rgba(247, 231, 206, 0.3), 0 0 40px rgba(247, 231, 206, 0.15), inset 0 0 20px rgba(247, 231, 206, 0.1)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>

      <style>{`
        .gold-text-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(247, 231, 206, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .gold-text-btn:not(:disabled):hover::before {
          left: 100%;
        }

        .gold-text-btn:not(:disabled):hover {
          opacity: 1;
          background: linear-gradient(135deg, rgba(247, 231, 206, 0.15) 0%, rgba(235, 200, 98, 0.2) 100%);
          border-color: rgba(247, 231, 206, 0.7);
          text-shadow: 0 0 25px rgba(247, 231, 206, 0.9), 0 0 50px rgba(247, 231, 206, 0.5);
          box-shadow: 0 0 30px rgba(247, 231, 206, 0.5), 0 0 60px rgba(247, 231, 206, 0.25), inset 0 0 30px rgba(247, 231, 206, 0.15);
          transform: translateY(-2px);
        }

        .gold-text-btn:not(:disabled):active {
          transform: translateY(0);
          box-shadow: 0 0 20px rgba(247, 231, 206, 0.4), 0 0 40px rgba(247, 231, 206, 0.2), inset 0 0 25px rgba(247, 231, 206, 0.2);
        }
      `}</style>
    </button>
  );
}
