import { useEffect, useState } from 'react';
import { getRandomActiveAudio, registerAudio, unregisterAudio, playBackgroundMusicLoop } from '../utils/audioManager';

interface GoldenTransitionProps {
  userName: string;
  higherSelfName: string;
  onComplete: (backgroundMusic: HTMLAudioElement | null) => void;
}

export default function GoldenTransition({ userName, higherSelfName, onComplete }: GoldenTransitionProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let transitionAudio: HTMLAudioElement | null = null;
    let backgroundMusic: HTMLAudioElement | null = null;
    let fadeOutTimer: number | undefined;
    let completeTimer: number | undefined;
    const transitionDuration = 30000;

    const initializeAudio = async () => {
      const audioUrl = await getRandomActiveAudio();

      if (audioUrl) {
        try {
          transitionAudio = new Audio(audioUrl);
          transitionAudio.volume = 0.5;
          registerAudio(transitionAudio);

          transitionAudio.addEventListener('loadedmetadata', () => {
            console.log('Transition audio loaded, duration:', transitionAudio!.duration);
          });

          transitionAudio.addEventListener('error', (e) => {
            console.error('Transition audio error:', e);
          });

          await transitionAudio.play();
          console.log('Transition audio playing successfully');
        } catch (err) {
          console.error('Transition audio play error:', err);
        }
      } else {
        console.log('No transition audio URL available');
      }

      const bgMusic = await playBackgroundMusicLoop();
      if (bgMusic) {
        backgroundMusic = bgMusic;
        console.log('Background music started');
      }

      fadeOutTimer = window.setTimeout(() => {
        setFadeOut(true);
        if (transitionAudio) {
          const fadeInterval = setInterval(() => {
            if (transitionAudio && transitionAudio.volume > 0.05) {
              transitionAudio.volume = Math.max(0, transitionAudio.volume - 0.05);
            } else {
              clearInterval(fadeInterval);
              if (transitionAudio) {
                transitionAudio.volume = 0;
              }
            }
          }, 100);
        }
      }, transitionDuration - 2000);

      completeTimer = window.setTimeout(() => {
        onComplete(backgroundMusic);
      }, transitionDuration);
    };

    initializeAudio();

    return () => {
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
      if (completeTimer) clearTimeout(completeTimer);
      if (transitionAudio) {
        transitionAudio.pause();
        transitionAudio.currentTime = 0;
        transitionAudio.volume = 0;
        transitionAudio.src = '';
        transitionAudio.load();
        unregisterAudio(transitionAudio);
        transitionAudio = null;
      }
    };
  }, [onComplete]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden hypnosis-container"
      style={{
        background: 'linear-gradient(180deg, #1A352F 0%, #0D1814 100%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute divine-aura-outer" />
        <div className="absolute divine-aura-middle" />
        <div className="absolute divine-logo-glow" />
        <div className="divine-logo-core" />
      </div>

      <div
        className="guidance-text-container"
        style={{
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 20px',
          position: 'relative',
        }}
      >
        <p
          className="guidance-text"
          style={{
            color: '#D4AF37',
            fontSize: '1.125rem',
            fontWeight: '300',
            letterSpacing: '0.08em',
            lineHeight: '1.8',
            textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 0 35px rgba(212, 175, 55, 0.4)',
            opacity: 1,
            maxWidth: '400px',
          }}
        >
          闭上眼，打开心，智慧自显。。。
        </p>
      </div>

      <p
        className="connection-subtitle"
        style={{
          color: '#E0E0D0',
          fontSize: '0.875rem',
          fontWeight: '300',
          letterSpacing: '0.06em',
          opacity: 0.6,
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        正在连接你的 <span className="highlight-name">{higherSelfName}</span>
      </p>

      <style>{`
        .divine-logo-core {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.85) 0%, rgba(212, 175, 55, 0.55) 40%, rgba(212, 175, 55, 0.25) 70%, transparent 100%);
          animation: deepBreath 6s ease-in-out infinite;
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 40px 20px rgba(212, 175, 55, 0.5),
            0 0 80px 40px rgba(212, 175, 55, 0.35),
            0 0 120px 60px rgba(212, 175, 55, 0.25),
            inset 0 0 60px rgba(212, 175, 55, 0.6);
        }

        .divine-logo-glow {
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.5) 0%, rgba(212, 175, 55, 0.25) 50%, transparent 100%);
          animation: slowPulse 8s ease-in-out infinite, shimmer 4s ease-in-out infinite;
          position: absolute;
          z-index: 3;
          filter: blur(30px);
        }

        .divine-aura-middle {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, rgba(212, 175, 55, 0.2) 30%, transparent 70%);
          animation: auraPulse 10s ease-in-out infinite;
          z-index: 2;
          filter: blur(50px);
        }

        .divine-aura-outer {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.15) 30%, transparent 70%);
          animation: auraPulse 12s ease-in-out infinite reverse;
          z-index: 1;
          filter: blur(70px);
        }

        @keyframes deepBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.85;
            box-shadow:
              0 0 40px 20px rgba(212, 175, 55, 0.5),
              0 0 80px 40px rgba(212, 175, 55, 0.35),
              0 0 120px 60px rgba(212, 175, 55, 0.25),
              inset 0 0 60px rgba(212, 175, 55, 0.6);
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
            box-shadow:
              0 0 50px 25px rgba(212, 175, 55, 0.65),
              0 0 100px 50px rgba(212, 175, 55, 0.45),
              0 0 150px 75px rgba(212, 175, 55, 0.35),
              inset 0 0 80px rgba(212, 175, 55, 0.75);
          }
        }

        @keyframes slowPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.15);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            filter: blur(30px) brightness(1);
          }
          25% {
            filter: blur(35px) brightness(1.15);
          }
          50% {
            filter: blur(25px) brightness(0.95);
          }
          75% {
            filter: blur(40px) brightness(1.1);
          }
        }

        @keyframes auraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
        }

        .guidance-text {
          animation: textFadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .highlight-name {
          font-weight: 400;
          color: #D4AF37;
          text-shadow: 0 0 25px rgba(212, 175, 55, 0.7);
          letter-spacing: 0.1em;
        }

        .connection-subtitle {
          animation: subtlePulse 3s ease-in-out infinite;
        }

        @keyframes subtlePulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
