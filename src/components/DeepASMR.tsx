import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface DeepASMRProps {
  onBack: () => void;
}

export default function DeepASMR({ onBack }: DeepASMRProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleRefresh = () => {
    setRotation(rotation + 360);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 500);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-opacity duration-800"
      style={{
        background: 'transparent',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <button
          className="absolute top-8 left-8 text-xs font-light cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-110"
          style={{
            color: '#F7E7CE',
            opacity: 0.6,
            letterSpacing: '0.25em',
            background: 'transparent',
            border: 'none',
            textShadow: '0 0 20px rgba(247, 231, 206, 0.4)',
          }}
          onClick={onBack}
        >
          返回
        </button>

        <div
          className="text-center space-y-12 transition-all duration-1000"
          style={{
            transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
            opacity: fadeIn ? 1 : 0,
          }}
        >
          <div className="space-y-3">
            <h2
              className="text-3xl font-light tracking-widest"
              style={{ color: '#EBC862' }}
            >
              深海静默
            </h2>
            {isPlaying && (
              <p
                className="text-sm font-light tracking-wide animate-pulse"
                style={{ color: '#E0E0D0', opacity: 0.6 }}
              >
                正在播放...
              </p>
            )}
          </div>

          <button
            onClick={handleRefresh}
            className="energy-knob relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110"
            style={{
              background: 'radial-gradient(circle, rgba(235, 200, 98, 0.1) 0%, transparent 70%)',
              border: '2px solid rgba(235, 200, 98, 0.4)',
              boxShadow: '0 0 60px rgba(235, 200, 98, 0.2)',
            }}
          >
            <div
              className="breathing-ring absolute inset-0 rounded-full"
              style={{
                border: '1px solid rgba(235, 200, 98, 0.3)',
              }}
            />
            <RefreshCw
              size={36}
              style={{
                color: '#EBC862',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </button>

          <p
            className="text-xs font-light tracking-widest"
            style={{ color: '#E0E0D0', opacity: 0.5 }}
          >
            点击旋钮切换音频
          </p>
        </div>
      </div>

      <style>{`
        @keyframes breatheRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        .breathing-ring {
          animation: breatheRing 3s ease-in-out infinite;
        }

        .energy-knob:hover .breathing-ring {
          animation: breatheRing 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
