import { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import WaveAnimation from './WaveAnimation';

interface FrequencyPlayerProps {
  frequency: {
    id: string;
    name: string;
    description: string;
    waveSpeed: number;
    waveAmplitude: number;
  };
  onClose: () => void;
}

export default function FrequencyPlayer({ frequency, onClose }: FrequencyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: number | undefined;

    if (isPlaying && remainingTime !== null && remainingTime > 0) {
      interval = window.setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 1) {
            setIsPlaying(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, remainingTime]);

  const handleTimerSelect = (minutes: number) => {
    setTimer(minutes);
    setRemainingTime(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center living-background">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center transition-all hover:scale-110 z-50"
        style={{
          backgroundColor: 'rgba(2, 10, 9, 0.6)',
          border: '1px solid #EBC862',
        }}
      >
        <X size={20} style={{ color: '#EBC862' }} />
      </button>

      <div className="w-full max-w-md px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-light" style={{ color: '#EBC862', letterSpacing: '0.06em' }}>
            {frequency.name}
          </h2>
          <p className="text-base font-light leading-relaxed" style={{ color: '#E0E0D0', letterSpacing: '0.03em', opacity: 0.85 }}>
            {frequency.description}
          </p>
        </div>

        <div className="relative h-64 flex items-center justify-center">
          <div className="absolute inset-0">
            <WaveAnimation
              waveSpeed={frequency.waveSpeed}
              waveAmplitude={frequency.waveAmplitude}
              isPlaying={isPlaying}
            />
          </div>
          {!isPlaying && (
            <div className="relative z-10 text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 pulse-ring"
                style={{
                  backgroundColor: 'rgba(235, 200, 98, 0.15)',
                  border: '1px solid #EBC862',
                  boxShadow: '0 0 30px rgba(235, 200, 98, 0.3)',
                }}
              >
                <div className="w-16 h-16 rounded-full" style={{
                  backgroundColor: 'rgba(235, 200, 98, 0.25)',
                  boxShadow: 'inset 0 0 20px rgba(235, 200, 98, 0.4)',
                }} />
              </div>
              <p className="text-sm font-light" style={{ color: '#E0E0D0', opacity: 0.8, letterSpacing: '0.05em' }}>
                准备开始
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #EBC862',
              boxShadow: '0 4px 16px rgba(235, 200, 98, 0.3)',
            }}
          >
            {isPlaying ? (
              <Pause size={24} style={{ color: '#EBC862' }} />
            ) : (
              <Play size={24} style={{ color: '#EBC862', marginLeft: '2px' }} />
            )}
          </button>
        </div>

        {remainingTime !== null && (
          <div className="text-center">
            <p className="text-2xl font-light golden-timer" style={{ letterSpacing: '0.08em' }}>
              {formatTime(remainingTime)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-light text-center" style={{ color: '#E0E0D0', opacity: 0.7, letterSpacing: '0.04em' }}>
            定时关闭
          </p>
          <div className="flex gap-3 justify-center">
            {[15, 30, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => handleTimerSelect(minutes)}
                className={`px-6 py-3 rounded-full font-light transition-all ${
                  timer === minutes ? 'timer-active' : 'timer-inactive'
                }`}
              >
                {minutes}分钟
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .living-background {
          background: linear-gradient(180deg, #1A352F 0%, #0D1814 100%);
          animation: ${isPlaying ? 'subtleBreath 8s ease-in-out infinite' : 'none'};
        }

        @keyframes subtleBreath {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.05);
          }
        }

        .pulse-ring {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 30px rgba(235, 200, 98, 0.3);
          }
          50% {
            transform: scale(1.08);
            opacity: 0.85;
            box-shadow: 0 0 50px rgba(235, 200, 98, 0.5);
          }
        }

        .golden-timer {
          color: #EBC862;
          text-shadow: 0 2px 20px rgba(235, 200, 98, 0.5);
        }

        .timer-active {
          background-color: transparent;
          border: 1.5px solid #EBC862;
          color: #EBC862;
          box-shadow: 0 0 20px rgba(235, 200, 98, 0.4), inset 0 0 15px rgba(235, 200, 98, 0.15);
        }

        .timer-inactive {
          background-color: transparent;
          color: #E0E0D0;
          opacity: 0.5;
          border: 0.5px solid rgba(235, 200, 98, 0.3);
        }

        .timer-inactive:hover {
          opacity: 0.8;
          border-color: rgba(235, 200, 98, 0.5);
        }
      `}</style>
    </div>
  );
}
