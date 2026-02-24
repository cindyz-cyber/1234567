import React from 'react';

interface BreathingOrbProps {
  label: string;
  onClick: () => void;
  size?: 'large' | 'small';
}

export default function BreathingOrb({ label, onClick, size = 'large' }: BreathingOrbProps) {
  const orbSize = size === 'large' ? 'w-64 h-64' : 'w-16 h-16';
  const labelSize = size === 'large' ? 'text-2xl' : 'text-sm';

  return (
    <button
      onClick={onClick}
      className="relative group focus:outline-none"
      aria-label={label}
    >
      <div className={`${orbSize} relative`}>
        <div
          className="absolute inset-0 rounded-full blur-3xl animate-pulse-slow group-hover:blur-[60px] transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(247, 231, 206, 0.5) 0%, rgba(235, 200, 98, 0.3) 40%, transparent 70%)',
            transform: 'scale(1.4)',
          }}
        />

        <div
          className="absolute inset-0 rounded-full blur-2xl animate-pulse-slow-delayed group-hover:scale-125 transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(247, 231, 206, 0.4) 0%, rgba(235, 200, 98, 0.3) 50%, transparent 80%)',
            transform: 'scale(1.2)',
          }}
        />

        <div
          className="absolute inset-0 rounded-full blur-xl animate-breath group-hover:scale-110 transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(247, 231, 206, 0.6) 0%, rgba(235, 200, 98, 0.4) 60%, transparent 90%)',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative z-10 rounded-full backdrop-blur-sm w-4/5 h-4/5 flex items-center justify-center transition-all duration-500 group-hover:scale-105"
            style={{
              background: 'radial-gradient(circle, rgba(247, 231, 206, 0.7) 0%, rgba(235, 200, 98, 0.5) 60%, rgba(212, 175, 55, 0.4) 100%)',
              border: '1px solid rgba(247, 231, 206, 0.4)',
              boxShadow: '0 0 40px rgba(247, 231, 206, 0.6), inset 0 0 30px rgba(247, 231, 206, 0.3)',
            }}
          >
            <span
              className={`${labelSize} font-light tracking-wider`}
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F7E7CE 50%, #EBC862 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 8px rgba(247, 231, 206, 0.6))',
              }}
            >
              {label}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-yellow-100/10 to-yellow-50/20 animate-shimmer pointer-events-none" />
      </div>
    </button>
  );
}
