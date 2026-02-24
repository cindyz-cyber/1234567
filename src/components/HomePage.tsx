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
          <div className="divine-golden-tree" />
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
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 220, 100, 0.25) 0%,
            rgba(235, 200, 98, 0.15) 30%,
            rgba(247, 231, 206, 0.08) 60%,
            transparent 100%
          );
          backdrop-filter: none;
          border: 2px solid rgba(255, 220, 100, 0.8);
          animation: crystalBreathe 7s ease-in-out infinite, energyPulse 3s ease-in-out infinite;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 30px rgba(255, 220, 100, 0.6),
            0 0 60px rgba(235, 200, 98, 0.4),
            0 0 100px rgba(247, 231, 206, 0.3),
            inset 0 0 40px rgba(255, 220, 100, 0.2);
          transition: all 0.5s ease;
        }

        .divine-golden-tree::before,
        .divine-golden-tree::after {
          content: '';
          position: absolute;
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 220, 100, 1), rgba(235, 200, 98, 0.8), transparent);
          border-radius: 50%;
          animation: electricArc 2s ease-in-out infinite;
          opacity: 0;
          box-shadow: 0 0 10px rgba(255, 220, 100, 0.8);
        }

        .divine-golden-tree::before {
          top: 15%;
          right: -5px;
          transform: rotate(45deg);
          animation-delay: 0.3s;
        }

        .divine-golden-tree::after {
          bottom: 20%;
          left: -5px;
          transform: rotate(-30deg);
          animation-delay: 1.2s;
        }

        .divine-golden-tree:hover {
          transform: scale(1.05);
          box-shadow:
            0 0 40px rgba(255, 220, 100, 0.7),
            0 0 80px rgba(235, 200, 98, 0.5),
            0 0 120px rgba(247, 231, 206, 0.4),
            inset 0 0 50px rgba(255, 220, 100, 0.3);
          border-color: rgba(255, 220, 100, 1);
        }

        .tree-icon {
          animation: treeGlow 10s ease-in-out infinite;
        }

        .divine-aura {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 220, 100, 0.5) 0%,
            rgba(235, 200, 98, 0.35) 20%,
            rgba(247, 231, 206, 0.25) 40%,
            transparent 70%
          );
          animation: auraPulse 7s ease-in-out infinite, auraRotate 20s linear infinite;
          z-index: 1;
          filter: blur(60px);
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
              0 0 30px rgba(255, 220, 100, 0.6),
              0 0 60px rgba(235, 200, 98, 0.4),
              0 0 100px rgba(247, 231, 206, 0.3),
              inset 0 0 40px rgba(255, 220, 100, 0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow:
              0 0 40px rgba(255, 220, 100, 0.7),
              0 0 80px rgba(235, 200, 98, 0.5),
              0 0 120px rgba(247, 231, 206, 0.4),
              inset 0 0 50px rgba(255, 220, 100, 0.25);
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

        @keyframes electricArc {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          5%, 15% {
            opacity: 1;
            transform: scale(1.2);
          }
          20% {
            opacity: 0;
            transform: scale(0.8);
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
            opacity: 0.3;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.6;
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
