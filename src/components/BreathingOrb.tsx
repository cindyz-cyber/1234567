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
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/20 via-amber-300/30 to-yellow-500/20 blur-2xl animate-pulse-slow group-hover:blur-3xl transition-all duration-1000" />

        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/30 via-amber-400/40 to-yellow-600/30 blur-xl animate-pulse-slow-delayed group-hover:scale-110 transition-transform duration-1000" />

        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/40 via-amber-500/50 to-yellow-700/40 blur-lg animate-breath group-hover:scale-105 transition-all duration-700" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 rounded-full bg-gradient-to-br from-yellow-200/60 via-amber-300/70 to-yellow-500/60 backdrop-blur-sm border border-yellow-300/30 shadow-2xl w-4/5 h-4/5 flex items-center justify-center group-hover:border-yellow-200/50 transition-colors duration-500">
            <span className={`${labelSize} font-light tracking-wider text-yellow-50/90 drop-shadow-lg`}>
              {label}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-yellow-200/10 to-yellow-100/20 animate-shimmer pointer-events-none" />
      </div>
    </button>
  );
}
