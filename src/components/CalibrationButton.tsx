import { useState } from 'react';

interface CalibrationButtonProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}

export default function CalibrationButton({ onClick, label, icon }: CalibrationButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden group"
      style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(235, 200, 98, 0.2) 0%, rgba(212, 175, 55, 0.15) 100%)',
        border: '2px solid rgba(235, 200, 98, 0.4)',
        color: '#EBC862',
        fontSize: '1.1rem',
        fontWeight: 400,
        letterSpacing: '0.15em',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        boxShadow: '0 8px 32px rgba(235, 200, 98, 0.2), inset 0 0 60px rgba(235, 200, 98, 0.05)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 12px 48px rgba(235, 200, 98, 0.35), inset 0 0 80px rgba(235, 200, 98, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(235, 200, 98, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(235, 200, 98, 0.2), inset 0 0 60px rgba(235, 200, 98, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(235, 200, 98, 0.4)';
      }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '0px',
            height: '0px',
            background: 'radial-gradient(circle, rgba(235, 200, 98, 0.6) 0%, rgba(235, 200, 98, 0) 70%)',
            animation: 'rippleExpand 1s ease-out',
            pointerEvents: 'none'
          }}
        />
      ))}

      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(235, 200, 98, 0.1) 0%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        {icon && <div style={{ filter: 'drop-shadow(0 0 8px rgba(235, 200, 98, 0.6))' }}>{icon}</div>}
        <span
          style={{
            textShadow: '0 0 20px rgba(235, 200, 98, 0.5)'
          }}
        >
          {label}
        </span>
      </div>

      <style>{`
        @keyframes rippleExpand {
          0% {
            width: 0px;
            height: 0px;
            opacity: 1;
            transform: translate(-50%, -50%);
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </button>
  );
}
