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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 breathing-fade">
      <div className="golden-particles" />
      <button
        onClick={handleCircleClick}
        className="relative flex items-center justify-center mb-16 cursor-pointer outline-none border-none bg-transparent p-0 touch-manipulation"
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
        className="text-xl text-center font-light leading-loose"
        style={{ color: '#E0E0D0', letterSpacing: '0.05em', opacity: 0.95 }}
      >
        <span className="golden-name">{userName}</span>，想和 <span className="golden-name">{higherSelfName}</span> 聊聊吗？
      </p>

      <style>{`
        .divine-golden-tree {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247, 231, 206, 0.9) 0%, rgba(235, 200, 98, 0.7) 40%, rgba(235, 200, 98, 0.4) 70%, transparent 100%);
          animation: breathe 10s ease-in-out infinite;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 50px 25px rgba(247, 231, 206, 0.5),
            0 0 100px 50px rgba(235, 200, 98, 0.4),
            0 0 150px 75px rgba(235, 200, 98, 0.3),
            inset 0 0 60px rgba(247, 231, 206, 0.6);
          transition: all 0.5s ease;
        }

        .divine-golden-tree:hover {
          transform: scale(1.05);
          box-shadow:
            0 0 60px 30px rgba(247, 231, 206, 0.6),
            0 0 120px 60px rgba(235, 200, 98, 0.5),
            0 0 180px 90px rgba(235, 200, 98, 0.4),
            inset 0 0 80px rgba(247, 231, 206, 0.7);
        }

        .tree-icon {
          animation: treeGlow 10s ease-in-out infinite;
        }

        .divine-aura {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(235, 200, 98, 0.6) 0%, rgba(235, 200, 98, 0.3) 30%, transparent 70%);
          animation: auraPulse 10s ease-in-out infinite;
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

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
            box-shadow:
              0 0 40px 20px rgba(235, 200, 98, 0.4),
              0 0 80px 40px rgba(235, 200, 98, 0.3),
              0 0 120px 60px rgba(235, 200, 98, 0.2),
              inset 0 0 60px rgba(235, 200, 98, 0.5);
            transition: transform 4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
            box-shadow:
              0 0 60px 30px rgba(235, 200, 98, 0.6),
              0 0 120px 60px rgba(235, 200, 98, 0.4),
              0 0 180px 90px rgba(235, 200, 98, 0.3),
              inset 0 0 80px rgba(235, 200, 98, 0.7);
            transition: transform 4s cubic-bezier(0.4, 0, 0.2, 1);
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
            opacity: 0.4;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
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
