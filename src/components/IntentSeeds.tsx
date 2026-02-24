import { useState, useEffect } from 'react';
import BreathingOrb from './BreathingOrb';

interface IntentSeedsProps {
  onSelectIntent: (intent: string) => void;
  onBack: () => void;
}

const INTENT_SEEDS = [
  { id: 'instant_elevation', name: '当下提频', subtitle: '去烦恼 · 清负' },
  { id: 'abundance', name: '丰盛显化', subtitle: '钱 · 事业' },
  { id: 'relationships', name: '情绪修复', subtitle: '情感 · 社交' },
  { id: 'deep_healing', name: '身体修复', subtitle: '脉轮 · 脏腑' },
  { id: 'high_self', name: '高维连接', subtitle: '高我 · 直觉' },
];

export default function IntentSeeds({ onSelectIntent, onBack }: IntentSeedsProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6 py-8 transition-opacity duration-1000"
      style={{
        backgroundColor: 'transparent',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-xs font-light transition-all duration-300 hover:opacity-100 hover:scale-110 z-20"
        style={{
          color: '#F7E7CE',
          opacity: 0.6,
          letterSpacing: '0.25em',
          background: 'transparent',
          border: 'none',
          textShadow: '0 0 20px rgba(247, 231, 206, 0.4)',
        }}
      >
        返回
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl w-full items-center justify-items-center">
        {INTENT_SEEDS.slice(0, 2).map((seed, index) => (
          <div
            key={seed.id}
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'scale(1)' : 'scale(0.85)',
              transition: `all 1s ease-out ${(index + 1) * 150}ms`,
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <BreathingOrb
                label={seed.name}
                onClick={() => onSelectIntent(seed.id)}
              />
              <p
                className="text-xs font-light text-center"
                style={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.25em' }}
              >
                {seed.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 mb-20">
        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'scale(1)' : 'scale(0.85)',
            transition: 'all 1s ease-out 450ms',
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <BreathingOrb
              label={INTENT_SEEDS[2].name}
              onClick={() => onSelectIntent(INTENT_SEEDS[2].id)}
            />
            <p
              className="text-xs font-light tracking-widest text-center"
              style={{ color: '#EBC862', opacity: 0.5 }}
            >
              {INTENT_SEEDS[2].subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl w-full items-center justify-items-center">
        {INTENT_SEEDS.slice(3).map((seed, index) => (
          <div
            key={seed.id}
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'scale(1)' : 'scale(0.85)',
              transition: `all 1s ease-out ${(index + 4) * 150}ms`,
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <BreathingOrb
                label={seed.name}
                onClick={() => onSelectIntent(seed.id)}
              />
              <p
                className="text-xs font-light text-center"
                style={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.25em' }}
              >
                {seed.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
