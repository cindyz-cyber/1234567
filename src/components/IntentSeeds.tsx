import { useState, useEffect } from 'react';

interface IntentSeedsProps {
  onSelectIntent: (intent: string) => void;
  onBack: () => void;
}

const INTENT_SEEDS = [
  { id: 'uplift', name: '当下提频', color: 'rgba(255, 215, 0, 0.15)' },
  { id: 'abundance', name: '丰盛显化', color: 'rgba(255, 200, 0, 0.15)' },
  { id: 'joy', name: '喜悦关系', color: 'rgba(255, 190, 0, 0.15)' },
  { id: 'healing', name: '深层修复', color: 'rgba(255, 180, 0, 0.15)' },
  { id: 'connection', name: '高维连接', color: 'rgba(255, 170, 0, 0.15)' },
];

export default function IntentSeeds({ onSelectIntent, onBack }: IntentSeedsProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-6 transition-opacity duration-800"
      style={{
        background: 'linear-gradient(180deg, #0a0f0e 0%, #020a09 100%)',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      <div className="max-w-md w-full space-y-8">
        <div
          className="text-center space-y-4 transition-all duration-800"
          style={{
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
            opacity: fadeIn ? 1 : 0,
          }}
        >
          <h2
            className="text-2xl font-light tracking-widest"
            style={{ color: '#EBC862' }}
          >
            意图种子
          </h2>
          <p
            className="text-sm font-light tracking-wide"
            style={{ color: '#E0E0D0', opacity: 0.7 }}
          >
            选择一个意图，开启能量流动
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 py-8">
          {INTENT_SEEDS.map((seed, index) => (
            <button
              key={seed.id}
              onClick={() => onSelectIntent(seed.id)}
              className="intent-seed-sphere relative h-24 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:scale-105"
              style={{
                backgroundColor: seed.color,
                border: '1px solid rgba(235, 200, 98, 0.3)',
                boxShadow: '0 8px 32px rgba(235, 200, 98, 0.1)',
                transitionDelay: `${index * 100}ms`,
                opacity: fadeIn ? 1 : 0,
                transform: fadeIn ? 'scale(1)' : 'scale(0.9)',
              }}
            >
              <div className="breathing-glow absolute inset-0 rounded-3xl" style={{
                boxShadow: '0 0 40px rgba(235, 200, 98, 0.3)',
              }} />
              <div className="relative h-full flex items-center justify-center">
                <span
                  className="text-xl font-light tracking-widest"
                  style={{ color: '#EBC862' }}
                >
                  {seed.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="w-full py-3 text-sm font-light tracking-widest transition-all duration-300 hover:opacity-80"
          style={{ color: '#EBC862', opacity: 0.6 }}
        >
          返回
        </button>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        .breathing-glow {
          animation: breathe 4s ease-in-out infinite;
        }

        .intent-seed-sphere:hover .breathing-glow {
          animation: breathe 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
