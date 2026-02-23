import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import GoldButton from './GoldButton';
import { getRandomGuidanceMessages } from '../utils/voiceGuidance';
import { playBackgroundMusicLoop } from '../utils/audioManager';
import { supabase } from '../lib/supabase';

interface HigherSelfDialogueProps {
  userName: string;
  higherSelfName: string;
  journalContent: string;
  onComplete: (response: string, audio: HTMLAudioElement | null) => void;
}

const floatingPrompts = [
  '别思考，去感受',
  '写下第一个跳出的词',
  '他在听你说话',
  '让情绪自然流淌',
  '你的内在智慧正在回应',
  '深呼吸，感受此刻',
];

export default function HigherSelfDialogue({ userName, higherSelfName, journalContent, onComplete }: HigherSelfDialogueProps) {
  const [response, setResponse] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(floatingPrompts[0]);
  const [guidanceMessages, setGuidanceMessages] = useState<string[]>([]);
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    setGuidanceMessages(getRandomGuidanceMessages(4));

    let audioInstance: HTMLAudioElement | null = null;

    playBackgroundMusicLoop().then(audio => {
      if (audio) {
        audioInstance = audio;
        setBackgroundMusic(audio);
        setIsMusicPlaying(true);
      }
    });

    const transitionTimer = setTimeout(() => {
      setShowTransition(false);
      setIsReady(true);
    }, 35000);

    return () => {
      clearTimeout(transitionTimer);
      if (audioInstance) {
        audioInstance.loop = false;
        audioInstance.pause();
        audioInstance.currentTime = 0;
        audioInstance.volume = 0;
        audioInstance.src = '';
        audioInstance.load();
      }
    };
  }, []);


  useEffect(() => {
    if (guidanceMessages.length > 0 && showTransition) {
      const guidanceTimeline = [
        { delay: 2000, index: 0 },
        { delay: 8000, index: 1 },
        { delay: 15000, index: 2 },
        { delay: 22000, index: 3 },
      ];

      const timers = guidanceTimeline.map(({ delay, index }) =>
        setTimeout(() => {
          if (index < guidanceMessages.length) {
            setCurrentGuidanceIndex(index);
          }
        }, delay)
      );

      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [guidanceMessages, showTransition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => {
        const currentIndex = floatingPrompts.indexOf(prev);
        return floatingPrompts[(currentIndex + 1) % floatingPrompts.length];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleBackgroundMusic = () => {
    if (backgroundMusic) {
      if (isMusicPlaying) {
        backgroundMusic.pause();
        setIsMusicPlaying(false);
      } else {
        backgroundMusic.play().catch(err => console.error('Audio play error:', err));
        setIsMusicPlaying(true);
      }
    }
  };

  const handleSubmit = () => {
    if (response.trim()) {
      onComplete(response.trim(), backgroundMusic);
    }
  };

  if (showTransition) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1A352F 0%, #0D1814 100%)',
          opacity: 1,
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
          {guidanceMessages.length > 0 && (
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
              {guidanceMessages[currentGuidanceIndex]}
            </p>
          )}
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

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade" style={{ position: 'relative' }}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div
          className="mb-8 p-6 rounded-lg glassmorphic-card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(235, 200, 98, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(235, 200, 98, 0.1)',
          }}
        >
          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: '#E0E0D0', letterSpacing: '0.02em', opacity: 0.9 }}
          >
            {journalContent}
          </p>
        </div>

        {isReady && (
          <>
            <div
              className="floating-prompt"
              style={{
                textAlign: 'center',
                marginBottom: '40px',
                marginTop: '32px',
                minHeight: '32px',
              }}
            >
              <span
                className="prompt-text"
                style={{
                  color: '#C9A85F',
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.08em',
                  textShadow: '0 0 14px rgba(201, 168, 95, 0.4)',
                  display: 'inline-block',
                }}
              >
                {currentPrompt}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2
                className="text-lg font-light mb-6 text-center leading-relaxed"
                style={{ color: '#EBC862', letterSpacing: '0.05em', textShadow: '0 0 20px rgba(235, 200, 98, 0.3)' }}
              >
                亲爱的 <span className="golden-name-highlight">{userName}</span>，<br />
                下面是我想和你说的话：
              </h2>

              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full h-64 resize-none outline-none font-light text-lg p-6 rounded-lg dialogue-textarea"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#E0E0D0',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  letterSpacing: '0.02em',
                  lineHeight: '1.7',
                }}
                placeholder="以智慧之声回应..."
                autoFocus
              />
            </div>
          </>
        )}
      </div>

      {isReady && (
        <div className="w-full mt-8">
          <GoldButton onClick={handleSubmit} disabled={!response.trim()} className="w-full">
            完成
          </GoldButton>
        </div>
      )}

      {!showTransition && (
        <button
          onClick={toggleBackgroundMusic}
          className="audio-toggle"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isMusicPlaying ? 'rgba(235, 200, 98, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isMusicPlaying ? 'rgba(235, 200, 98, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isMusicPlaying ? '0 0 24px rgba(235, 200, 98, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
          title={isMusicPlaying ? '关闭背景音乐' : '开启背景音乐'}
        >
          {isMusicPlaying ? (
            <Volume2 size={24} color="#EBC862" />
          ) : (
            <VolumeX size={24} color="rgba(224, 224, 208, 0.6)" />
          )}
        </button>
      )}

      <style>{`
        .glassmorphic-card {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glassmorphic-card:hover {
          box-shadow: 0 6px 24px rgba(235, 200, 98, 0.2);
          border-color: rgba(235, 200, 98, 0.3);
        }

        .golden-name-highlight {
          font-weight: 500;
          color: #EBC862;
          text-shadow: 0 0 20px rgba(235, 200, 98, 0.4);
        }

        .dialogue-textarea::placeholder {
          color: rgba(224, 224, 208, 0.3);
        }

        .dialogue-textarea:focus {
          border-color: rgba(235, 200, 98, 0.5);
          box-shadow: 0 0 20px rgba(235, 200, 98, 0.2);
        }

        .guidance-overlay {
          position: relative;
          width: 100%;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .guidance-content {
          position: relative;
          width: 100%;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guidance-message {
          animation: gentlePulse 3s ease-in-out infinite;
        }

        @keyframes gentlePulse {
          0%, 100% {
            text-shadow: 0 0 20px rgba(235, 200, 98, 0.4);
          }
          50% {
            text-shadow: 0 0 30px rgba(235, 200, 98, 0.6);
          }
        }

        .floating-prompt {
          animation: floatUpDown 4s ease-in-out infinite;
        }

        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .prompt-text {
          animation: promptGlow 3s ease-in-out infinite;
        }

        @keyframes promptGlow {
          0%, 100% {
            opacity: 0.7;
            text-shadow: 0 0 14px rgba(201, 168, 95, 0.4);
          }
          50% {
            opacity: 0.9;
            text-shadow: 0 0 20px rgba(201, 168, 95, 0.6);
          }
        }

        .audio-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(235, 200, 98, 0.4);
        }

        .audio-toggle:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
