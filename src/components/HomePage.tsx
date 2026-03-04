import { useState } from 'react';
import PortalBackground from './PortalBackground';
import VideoBackground from './VideoBackground';
import posterImage from '../assets/0_1_640_N.webp';

interface HomePageProps {
  userName: string;
  higherSelfName: string;
  onStartJourney: () => void;
}

export default function HomePage({ userName, higherSelfName, onStartJourney }: HomePageProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleCircleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('🟡 Yellow ball clicked!');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);

    setTimeout(() => {
      console.log('🟡 Calling onStartJourney after delay');
      onStartJourney();
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 breathing-fade relative">
      <VideoBackground />
      <PortalBackground
        videoSrc="https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/2s48cs4awyy-1772595618844.mp4"
        posterImg={posterImage}
      />

      <div className="absolute top-0 left-0 w-full h-[30vh] z-20 pointer-events-none top-vignette" />

      <div className="absolute top-[8vh] left-0 w-full z-30 flex justify-center pointer-events-none">
        <h1 className="brand-title">
          <span className="brand-letter" style={{ animationDelay: '0s' }}>植</span>
          <span className="brand-letter" style={{ animationDelay: '0.5s' }}>本</span>
          <span className="brand-letter" style={{ animationDelay: '1s' }}>觉</span>
          <span className="brand-letter" style={{ animationDelay: '1.5s' }}>察</span>
        </h1>
      </div>

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
        .top-vignette {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.95) 25%,
            rgba(0, 0, 0, 0.8) 50%,
            rgba(0, 0, 0, 0.4) 75%,
            transparent 100%
          );
        }

        .brand-title {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.6em;
          color: #F7E7CE;
          display: flex;
          padding-left: 0.6em;
        }

        .brand-letter {
          display: inline-block;
          opacity: 0;
          animation: letterFadeIn 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }

        @keyframes letterFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .divine-golden-tree {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.98) 10%,
              rgba(255, 245, 200, 0.5) 18%,
              rgba(255, 225, 120, 0.35) 35%,
              rgba(250, 210, 100, 0.2) 55%,
              rgba(240, 195, 80, 0.1) 75%,
              transparent 100%
            );
          backdrop-filter: blur(0.5px);
          border: 2.5px solid rgba(255, 230, 120, 0.8);
          animation: crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 30px rgba(255, 240, 150, 0.9),
            0 0 50px rgba(255, 220, 100, 0.7),
            0 0 80px rgba(255, 200, 80, 0.5),
            0 0 120px rgba(240, 180, 60, 0.3),
            inset 0 0 50px rgba(255, 245, 200, 0.4),
            inset 0 0 25px rgba(255, 255, 255, 0.6);
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
            transparent 55%,
            rgba(255, 230, 120, 0.15) 65%,
            rgba(255, 215, 100, 0.25) 75%,
            rgba(255, 200, 85, 0.2) 85%,
            rgba(255, 185, 70, 0.12) 92%,
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
            0 0 40px rgba(255, 245, 180, 1),
            0 0 70px rgba(255, 225, 110, 0.8),
            0 0 110px rgba(255, 205, 90, 0.6),
            0 0 150px rgba(245, 185, 70, 0.4),
            inset 0 0 60px rgba(255, 250, 220, 0.5),
            inset 0 0 35px rgba(255, 255, 255, 0.7);
          border-color: rgba(255, 235, 130, 1);
        }

        .golden-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 1);
          box-shadow:
            0 0 10px rgba(255, 235, 140, 1),
            0 0 20px rgba(255, 215, 100, 0.7),
            0 0 30px rgba(255, 195, 80, 0.4);
          animation: particleFloat 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
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
            rgba(255, 245, 200, 0.5) 0%,
            rgba(255, 230, 130, 0.4) 20%,
            rgba(255, 215, 100, 0.3) 40%,
            rgba(245, 195, 80, 0.2) 60%,
            transparent 75%
          );
          animation: auraPulse 4s ease-in-out infinite, auraRotate 20s linear infinite;
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
              0 0 30px rgba(255, 240, 150, 0.9),
              0 0 50px rgba(255, 220, 100, 0.7),
              0 0 80px rgba(255, 200, 80, 0.5),
              0 0 120px rgba(240, 180, 60, 0.3),
              inset 0 0 50px rgba(255, 245, 200, 0.4),
              inset 0 0 25px rgba(255, 255, 255, 0.6);
          }
          50% {
            transform: scale(1.08);
            box-shadow:
              0 0 45px rgba(255, 245, 180, 1),
              0 0 75px rgba(255, 230, 120, 0.85),
              0 0 110px rgba(255, 210, 95, 0.65),
              0 0 160px rgba(245, 190, 75, 0.45),
              inset 0 0 65px rgba(255, 250, 220, 0.55),
              inset 0 0 35px rgba(255, 255, 255, 0.75);
          }
        }

        @keyframes energyPulse {
          0%, 100% {
            filter: brightness(1.05);
          }
          50% {
            filter: brightness(1.3);
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
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
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
