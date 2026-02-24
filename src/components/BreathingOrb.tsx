import React from 'react';

interface BreathingOrbProps {
  label: string;
  onClick: () => void;
  size?: 'large' | 'small';
}

export default function BreathingOrb({ label, onClick, size = 'large' }: BreathingOrbProps) {
  const labelSize = size === 'large' ? 'text-3xl' : 'text-base';

  return (
    <button
      onClick={onClick}
      className="relative group focus:outline-none breathing-light-body"
      aria-label={label}
      style={{ padding: '32px' }}
    >
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-[80px] animate-pulse-slow group-hover:blur-[120px] transition-all duration-1000 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(247, 231, 206, 0.4) 0%, rgba(235, 200, 98, 0.2) 40%, transparent 70%)',
            transform: 'scale(1.8)',
          }}
        />

        <div
          className="absolute inset-0 rounded-full blur-[60px] animate-breath transition-all duration-700 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(247, 231, 206, 0.3) 0%, rgba(235, 200, 98, 0.15) 60%, transparent 90%)',
            transform: 'scale(1.4)',
          }}
        />

        <span
          className={`${labelSize} font-light relative z-10 block transition-all duration-500 group-hover:scale-105`}
          style={{
            color: '#F7E7CE',
            letterSpacing: '0.25em',
            filter: 'drop-shadow(0 0 20px rgba(247, 231, 206, 0.8))',
            textShadow: '0 0 30px rgba(247, 231, 206, 0.6)',
          }}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
