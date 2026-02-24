import { useState, useEffect } from 'react';
import IntentSeeds from './IntentSeeds';
import DeepASMR from './DeepASMR';
import UnifiedPlayer from './UnifiedPlayer';

type ViewState = 'sanctuary' | 'intent-seeds' | 'deep-asmr' | 'player';

interface EnergyCenterProps {
  isPremium?: boolean;
  onPremiumRequired?: () => void;
}

export default function EnergyCenter({ isPremium = false, onPremiumRequired }: EnergyCenterProps) {
  const [view, setView] = useState<ViewState>('sanctuary');
  const [selectedType, setSelectedType] = useState<string>('');
  const [fadeIn, setFadeIn] = useState(false);
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleFeatureClick = (callback: () => void) => {
    if (!isPremium && onPremiumRequired) {
      onPremiumRequired();
    } else {
      callback();
    }
  };

  const handleSphereClick = (type: 'intent' | 'asmr', event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setRippleEffect({ x, y });

    setTimeout(() => {
      if (type === 'intent') {
        setView('intent-seeds');
      } else {
        setView('deep-asmr');
      }
      setRippleEffect(null);
    }, 800);
  };

  const handleSelectIntent = (intent: string) => {
    setSelectedType(intent);
    setView('player');
  };

  const handleBackToSanctuary = () => {
    setView('sanctuary');
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 100);
  };

  if (view === 'intent-seeds') {
    return (
      <IntentSeeds
        onSelectIntent={handleSelectIntent}
        onBack={handleBackToSanctuary}
      />
    );
  }

  if (view === 'deep-asmr') {
    return (
      <DeepASMR onBack={handleBackToSanctuary} />
    );
  }

  if (view === 'player') {
    return (
      <UnifiedPlayer
        type={selectedType}
        onBack={() => setView('intent-seeds')}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-1000"
      style={{
        background: 'linear-gradient(180deg, #0a0f0e 0%, #020a09 50%, #051511 100%)',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      <div
        className="absolute top-6 text-xs font-light tracking-widest transition-all duration-1000"
        style={{
          color: '#EBC862',
          opacity: fadeIn ? 0.3 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        今日能量引力
      </div>

      <div className="flex flex-col items-center justify-center space-y-20 w-full max-w-md">
        <button
          onClick={(e) => handleFeatureClick(() => handleSphereClick('intent', e))}
          className="energy-sphere intent-sphere relative w-64 h-64 rounded-full transition-all duration-700 hover:scale-105"
          style={{
            background: 'radial-gradient(circle, rgba(235, 200, 98, 0.2) 0%, rgba(235, 200, 98, 0.05) 50%, transparent 100%)',
            border: '1px solid rgba(235, 200, 98, 0.3)',
            boxShadow: '0 0 80px rgba(235, 200, 98, 0.3), inset 0 0 60px rgba(235, 200, 98, 0.1)',
            transform: fadeIn ? 'scale(1)' : 'scale(0.8)',
            opacity: fadeIn ? 1 : 0,
            transitionDelay: '200ms',
          }}
        >
          <div className="breathing-ring-1 absolute inset-0 rounded-full" style={{
            border: '1px solid rgba(235, 200, 98, 0.2)',
          }} />
          <div className="breathing-ring-2 absolute inset-0 rounded-full" style={{
            border: '1px solid rgba(235, 200, 98, 0.15)',
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xl font-light tracking-widest"
              style={{ color: '#EBC862' }}
            >
              意图引导
            </span>
          </div>
        </button>

        <button
          onClick={(e) => handleFeatureClick(() => handleSphereClick('asmr', e))}
          className="energy-sphere asmr-sphere relative w-64 h-64 rounded-full transition-all duration-700 hover:scale-105"
          style={{
            background: 'radial-gradient(circle, rgba(235, 200, 98, 0.15) 0%, rgba(235, 200, 98, 0.03) 50%, transparent 100%)',
            border: '1px solid rgba(235, 200, 98, 0.25)',
            boxShadow: '0 0 80px rgba(235, 200, 98, 0.25), inset 0 0 60px rgba(235, 200, 98, 0.08)',
            transform: fadeIn ? 'scale(1)' : 'scale(0.8)',
            opacity: fadeIn ? 1 : 0,
            transitionDelay: '400ms',
          }}
        >
          <div className="breathing-ring-1 absolute inset-0 rounded-full" style={{
            border: '1px solid rgba(235, 200, 98, 0.2)',
          }} />
          <div className="breathing-ring-2 absolute inset-0 rounded-full" style={{
            border: '1px solid rgba(235, 200, 98, 0.15)',
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xl font-light tracking-widest"
              style={{ color: '#EBC862' }}
            >
              深海静默
            </span>
          </div>
        </button>
      </div>

      {rippleEffect && (
        <div
          className="water-ripple fixed pointer-events-none"
          style={{
            left: rippleEffect.x,
            top: rippleEffect.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid rgba(235, 200, 98, 0.6)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      <style>{`
        @keyframes breatheRing1 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.1;
          }
        }

        @keyframes breatheRing2 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes waterRipple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(50);
            opacity: 0;
          }
        }

        .breathing-ring-1 {
          animation: breatheRing1 4s ease-in-out infinite;
        }

        .breathing-ring-2 {
          animation: breatheRing2 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .energy-sphere:hover .breathing-ring-1 {
          animation: breatheRing1 2s ease-in-out infinite;
        }

        .energy-sphere:hover .breathing-ring-2 {
          animation: breatheRing2 2s ease-in-out infinite;
        }

        .water-ripple {
          animation: waterRipple 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .asmr-sphere {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
