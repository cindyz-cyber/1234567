import { useEffect, useState } from 'react';
import { getRandomActiveAudio, registerAudio, unregisterAudio } from '../utils/audioManager';

interface GoldenTransitionProps {
  userName: string;
  higherSelfName: string;
  onComplete: () => void;
}

export default function GoldenTransition({ userName, higherSelfName, onComplete }: GoldenTransitionProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    let fadeOutTimer: number | undefined;
    let completeTimer: number | undefined;
    const transitionDuration = 30000;

    const initializeAudio = async () => {
      const audioUrl = await getRandomActiveAudio();

      if (audioUrl) {
        try {
          audio = new Audio(audioUrl);
          audio.volume = 0.5;
          registerAudio(audio);

          audio.addEventListener('loadedmetadata', () => {
            console.log('Audio loaded, duration:', audio!.duration);
          });

          audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
          });

          await audio.play();
          console.log('Audio playing successfully');
        } catch (err) {
          console.error('Audio play error:', err);
        }
      } else {
        console.log('No audio URL available');
      }

      fadeOutTimer = window.setTimeout(() => {
        setFadeOut(true);
        if (audio) {
          const fadeInterval = setInterval(() => {
            if (audio && audio.volume > 0.05) {
              audio.volume = Math.max(0, audio.volume - 0.05);
            } else {
              clearInterval(fadeInterval);
              if (audio) {
                audio.volume = 0;
              }
            }
          }, 100);
        }
      }, transitionDuration - 2000);

      completeTimer = window.setTimeout(() => {
        onComplete();
      }, transitionDuration);
    };

    initializeAudio();

    return () => {
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
      if (completeTimer) clearTimeout(completeTimer);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
        audio.src = '';
        audio.load();
        unregisterAudio(audio);
        audio = null;
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
