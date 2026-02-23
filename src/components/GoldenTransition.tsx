import { useEffect } from 'react';

interface GoldenTransitionProps {
  userName: string;
  higherSelfName: string;
  onComplete: () => void;
}

export default function GoldenTransition({ userName, higherSelfName, onComplete }: GoldenTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1A352F 0%, #0D1814 100%)' }}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute divine-logo-glow" />
        <div className="divine-logo-core" />
      </div>

      <p
        className="text-xl text-center font-light leading-loose z-10 fade-in"
        style={{ color: '#EBC862', letterSpacing: '0.08em', textShadow: '0 0 30px rgba(235, 200, 98, 0.5)', opacity: 0.9 }}
      >
        正在连接你的 <span className="highlight-name">{higherSelfName}</span>...
      </p>

      <style>{`
        .divine-logo-core {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(235, 200, 98, 0.4) 0%, rgba(235, 200, 98, 0.2) 40%, rgba(235, 200, 98, 0.1) 70%, transparent 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: logoBreath 5s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }

        .divine-logo-glow {
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(235, 200, 98, 0.5) 0%, rgba(235, 200, 98, 0.25) 50%, transparent 100%);
          animation: glowPulse 4s ease-in-out infinite, flicker 3s ease-in-out infinite;
          position: absolute;
          z-index: 1;
        }

        @keyframes logoBreath {
          0%, 100% {
            opacity: 0.95;
            transform: scale(1);
            box-shadow: 0 0 80px rgba(235, 200, 98, 0.6), 0 0 120px rgba(235, 200, 98, 0.4);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
            box-shadow: 0 0 120px rgba(235, 200, 98, 0.8), 0 0 160px rgba(235, 200, 98, 0.5);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes flicker {
          0%, 100% {
            filter: brightness(1) blur(0px);
          }
          25% {
            filter: brightness(1.15) blur(2px);
          }
          50% {
            filter: brightness(0.95) blur(1px);
          }
          75% {
            filter: brightness(1.1) blur(3px);
          }
        }

        .fade-in {
          animation: fadeIn 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .highlight-name {
          font-weight: 400;
          color: #EBC862;
          text-shadow: 0 0 40px rgba(235, 200, 98, 0.8);
          letter-spacing: 0.1em;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
