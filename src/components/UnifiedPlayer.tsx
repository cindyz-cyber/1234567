import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import logo from '../assets/logo.png';

interface UnifiedPlayerProps {
  type?: string;
  audioUrl?: string;
  title?: string;
  description?: string;
  onBack: () => void;
}

export default function UnifiedPlayer({ type, audioUrl, title, description, onBack }: UnifiedPlayerProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);

    const timer = setTimeout(() => {
      setShowUI(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRotation(rotation + 360);
    setShowUI(true);
    setTimeout(() => setShowUI(false), 5000);
  };

  const handleInteraction = () => {
    setShowUI(true);
    setTimeout(() => setShowUI(false), 5000);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #020a09 0%, #0a0f0e 50%, #051511 100%)',
      }}
      onClick={handleInteraction}
    >
      <div
        className="absolute top-8 left-8 text-xs font-light tracking-widest cursor-pointer transition-all duration-500"
        style={{
          color: '#EBC862',
          opacity: showUI ? 0.4 : 0,
          pointerEvents: showUI ? 'auto' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onBack();
        }}
      >
        返回
      </div>

      <div
        className="flex flex-col items-center space-y-12 transition-opacity duration-1000"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        <div className="logo-container relative w-48 h-48">
          <div className="breathing-logo-glow absolute inset-0 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(235, 200, 98, 0.3) 0%, transparent 70%)',
          }} />
          <img
            src={logo}
            alt="植本神木"
            className="relative z-10 w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(235, 200, 98, 0.4))',
            }}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
          className="refresh-button transition-all duration-500"
          style={{
            opacity: showUI ? 0.8 : 0,
            pointerEvents: showUI ? 'auto' : 'none',
            transform: showUI ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          }}
        >
          <RefreshCw
            size={24}
            style={{
              color: '#EBC862',
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </button>
      </div>

      <style>{`
        @keyframes breatheLogo {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        .breathing-logo-glow {
          animation: breatheLogo 4s ease-in-out infinite;
        }

        .refresh-button:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
