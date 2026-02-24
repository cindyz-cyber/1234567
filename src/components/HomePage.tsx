import { useState } from 'react';

interface HomePageProps {
  userName: string;
  higherSelfName: string;
  onStartJourney: () => void;
}

export default function HomePage({ userName, higherSelfName, onStartJourney }: HomePageProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleCircleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);

    setTimeout(() => {
      onStartJourney();
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 breathing-fade relative">
      <div className="flex flex-col items-center gap-12">
        <button
          onClick={handleCircleClick}
          className="relative flex items-center justify-center cursor-pointer outline-none border-none bg-transparent p-0 touch-manipulation z-10"
          aria-label="开始对话"
        >
          <div className="absolute divine-aura pointer-events-none" />
          <div className="divine-golden-tree">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="golden-particle pointer-events-none"
                style={{
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${6 + (i % 3)}s`,
                }}
              />
            ))}
          </div>
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="absolute rounded-full pointer-events-none ripple-effect"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: '20px',
                height: '20px',
                marginLeft: '-10px',
                marginTop: '-10px',
              }}
            />
          ))}
        </button>

        <p
          className="text-center serif-text"
          style={{
            color: '#F7E7CE',
            fontSize: '15px',
            fontWeight: 200,
            letterSpacing: '0.4em',
            textShadow: '0 2px 12px rgba(247, 231, 206, 0.3)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            opacity: 0.8,
          }}
        >
          想和「{higherSelfName}」聊一聊吗
        </p>
      </div>

      <style>{`
        .divine-golden-tree {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.95) 8%,
              rgba(255, 240, 180, 0.4) 15%,
              rgba(255, 215, 100, 0.25) 35%,
              rgba(240, 200, 80, 0.15) 55%,
              rgba(220, 180, 60, 0.08) 75%,
              transparent 100%
            );
          backdrop-filter: blur(1px);
          border: 2px solid rgba(255, 220, 100, 0.6);
          animation: crystalBreathe 7s ease-in-out infinite, energyPulse 3s ease-in-out infinite;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 40px rgba(255, 220, 100, 0.8),
            0 0 80px rgba(255, 200, 80, 0.6),
            0 0 120px rgba(255, 180, 60, 0.4),
            0 0 160px rgba(240, 160, 40, 0.3),
            inset 0 0 60px rgba(255, 240, 180, 0.3),
            inset 0 0 30px rgba(255, 255, 255, 0.4);
          transition: all 0.5s ease;
          overflow: hidden;
        }

        .divine-golden-tree::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            transparent 60%,
            rgba(255, 220, 100, 0.1) 70%,
            rgba(255, 200, 80, 0.15) 80%,
            rgba(255, 180, 60, 0.1) 90%,
            transparent 100%
          );
          animation: innerGlow 4s ease-in-out infinite;
        }

        .divine-golden-tree::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 240, 180, 0.9);
          box-shadow:
            0 0 10px rgba(255, 220, 100, 0.8),
            0 0 20px rgba(255, 200, 80, 0.6);
          top: 50%;
          left: 50%;
          animation: particleFloat 8s ease-in-out infinite;
        }

        .divine-golden-tree:hover {
          transform: scale(1.05);
          box-shadow:
            0 0 50px rgba(255, 220, 100, 0.9),
            0 0 100px rgba(255, 200, 80, 0.7),
            0 0 150px rgba(255, 180, 60, 0.5),
            0 0 200px rgba(240, 160, 40, 0.4),
            inset 0 0 70px rgba(255, 240, 180, 0.4),
            inset 0 0 40px rgba(255, 255, 255, 0.5);
          border-color: rgba(255, 220, 100, 0.8);
        }

        .golden-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 240, 180, 0.9);
          box-shadow:
            0 0 8px rgba(255, 220, 100, 0.8),
            0 0 15px rgba(255, 200, 80, 0.5);
          animation: particleFloat 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
        }

        .tree-icon {
          animation: treeGlow 10s ease-in-out infinite;
        }

        .divine-aura {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 240, 180, 0.4) 0%,
            rgba(255, 220, 100, 0.35) 20%,
            rgba(255, 200, 80, 0.25) 40%,
            rgba(240, 180, 60, 0.15) 60%,
            transparent 80%
          );
          animation: auraPulse 7s ease-in-out infinite, auraRotate 20s linear infinite;
          z-index: 1;
          filter: blur(80px);
        }

        .ripple-effect {
          background: radial-gradient(circle, rgba(235, 200, 98, 0.8) 0%, rgba(235, 200, 98, 0.4) 50%, transparent 100%);
          animation: ripple 1s cubic-bezier(0.4, 0, 0.2, 1) forwards, particleSpread 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          box-shadow: 0 0 30px rgba(235, 200, 98, 0.6);
          filter: blur(2px);
        }

        .golden-name {
          position: relative;
          color: #EBC862;
          font-weight: 400;
          text-shadow: 0 0 20px rgba(235, 200, 98, 0.5);
        }

        @keyframes crystalBreathe {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 40px rgba(255, 220, 100, 0.8),
              0 0 80px rgba(255, 200, 80, 0.6),
              0 0 120px rgba(255, 180, 60, 0.4),
              0 0 160px rgba(240, 160, 40, 0.3),
              inset 0 0 60px rgba(255, 240, 180, 0.3),
              inset 0 0 30px rgba(255, 255, 255, 0.4);
          }
          50% {
            transform: scale(1.02);
            box-shadow:
              0 0 50px rgba(255, 220, 100, 0.9),
              0 0 100px rgba(255, 200, 80, 0.7),
              0 0 150px rgba(255, 180, 60, 0.5),
              0 0 200px rgba(240, 160, 40, 0.4),
              inset 0 0 70px rgba(255, 240, 180, 0.4),
              inset 0 0 40px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes energyPulse {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }

        @keyframes innerGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          25% {
            transform: translate(-50%, -50%) translate(40px, -30px);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) translate(-35px, 45px);
            opacity: 0.7;
          }
          75% {
            transform: translate(-50%, -50%) translate(50px, 35px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) translate(-40px, -40px);
            opacity: 0;
          }
        }

        @keyframes auraRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes treeGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(235, 200, 98, 0.8));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(235, 200, 98, 1));
          }
        }

        @keyframes auraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes particleSpread {
          0% {
            filter: blur(2px);
          }
          100% {
            filter: blur(8px);
          }
        }
      `}</style>
    </div>
  );
}
