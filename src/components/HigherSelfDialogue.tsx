import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';

interface HigherSelfDialogueProps {
  userName: string;
  higherSelfName: string;
  journalContent: string;
  backgroundMusic?: HTMLAudioElement | null;
  onComplete: (response: string, audio: HTMLAudioElement | null) => void;
  onBack?: () => void;
}

export default function HigherSelfDialogue({ userName, higherSelfName, journalContent, backgroundMusic: incomingBackgroundMusic, onComplete, onBack }: HigherSelfDialogueProps) {
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(incomingBackgroundMusic || null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(!!incomingBackgroundMusic);
  const [showEntrance, setShowEntrance] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntrance(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (response.length > displayedResponse.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setDisplayedResponse(response.slice(0, displayedResponse.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    } else if (response.length < displayedResponse.length) {
      setDisplayedResponse(response);
    } else {
      setIsTyping(false);
    }
  }, [response, displayedResponse]);

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

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="portal-video-container">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="portal-video"
          style={{
            opacity: showEntrance ? 0 : 1,
            transform: showEntrance ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <source src="https://cdn.midjourney.com/video/7e901a1c-929f-466d-8def-ac47f9d0c15b/3.mp4" type="video/mp4" />
        </video>

        <div className="portal-particles" />

        <div className="video-gradient-mask" />
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
          style={{
            backgroundColor: 'rgba(235, 200, 98, 0.1)',
            border: '1px solid rgba(235, 200, 98, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ChevronLeft size={24} color="#EBC862" />
        </button>
      )}

      <div className="dialogue-content-container">
        <div className="dialogue-inner">
          <h2
            className="dialogue-greeting"
            style={{
              opacity: showEntrance ? 0 : 1,
            }}
          >
            亲爱的 <span className="user-name-highlight">{userName}</span>，下面是我想对你说的话：
          </h2>

          <div className="glassmorphic-dialogue-box">
            <textarea
              ref={textareaRef}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="dialogue-textarea-input"
              placeholder="倾听内在的声音..."
              autoFocus
            />
          </div>

          <div className="mt-8">
            <GoldButton onClick={handleSubmit} disabled={!response.trim()} className="w-full">
              完成对话
            </GoldButton>
          </div>
        </div>
      </div>

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
          zIndex: 100,
        }}
        title={isMusicPlaying ? '关闭背景音乐' : '开启背景音乐'}
      >
        {isMusicPlaying ? (
          <Volume2 size={24} color="#EBC862" />
        ) : (
          <VolumeX size={24} color="rgba(224, 224, 208, 0.6)" />
        )}
      </button>

      <style>{`
        .portal-video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 33.333vh;
          overflow: hidden;
          z-index: 0;
        }

        .portal-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
          filter: brightness(0.8) contrast(1.1) saturate(1.2);
        }

        .portal-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.03) 60%,
            rgba(255, 255, 255, 0.05) 80%,
            transparent 100%
          );
          animation: particleConverge 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes particleConverge {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(0.95);
            opacity: 0.6;
          }
        }

        .video-gradient-mask {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(10, 15, 25, 0.3) 20%,
            rgba(10, 15, 25, 0.7) 50%,
            rgba(10, 15, 25, 0.95) 80%,
            #0A0F19 100%
          );
          pointer-events: none;
        }

        .dialogue-content-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          padding-top: 33.333vh;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            #0A0F19 10%
          );
        }

        .dialogue-inner {
          max-width: 600px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .dialogue-greeting {
          color: #F7E7CE;
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 0.08em;
          line-height: 1.8;
          text-align: center;
          margin-bottom: 40px;
          text-shadow: 0 2px 20px rgba(247, 231, 206, 0.4);
          font-family: 'STSong', 'Songti SC', 'SimSun', serif;
          transition: opacity 1.5s ease-out;
          animation: greetingFadeIn 1.5s ease-out 0.5s both;
        }

        @keyframes greetingFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-name-highlight {
          color: #EBC862;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-shadow: 0 0 25px rgba(235, 200, 98, 0.5);
        }

        .glassmorphic-dialogue-box {
          background: rgba(15, 20, 35, 0.4);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(247, 231, 206, 0.1);
          border-radius: 16px;
          padding: 32px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glassmorphic-dialogue-box:focus-within {
          border-color: rgba(235, 200, 98, 0.3);
          box-shadow:
            0 8px 40px rgba(235, 200, 98, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .dialogue-textarea-input {
          width: 100%;
          min-height: 280px;
          background: transparent;
          border: none;
          outline: none;
          color: #E0E0D0;
          font-size: 17px;
          font-weight: 300;
          line-height: 1.9;
          letter-spacing: 0.03em;
          font-family: 'STSong', 'Songti SC', 'SimSun', serif;
          resize: none;
          transition: all 0.4s ease;
        }

        .dialogue-textarea-input::placeholder {
          color: rgba(224, 224, 208, 0.25);
          letter-spacing: 0.05em;
        }

        .audio-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(235, 200, 98, 0.4);
        }

        .audio-toggle:active {
          transform: scale(0.95);
        }

        @media (max-width: 640px) {
          .dialogue-greeting {
            font-size: 18px;
            padding: 0 16px;
          }

          .glassmorphic-dialogue-box {
            padding: 24px;
          }

          .dialogue-textarea-input {
            font-size: 16px;
            min-height: 240px;
          }
        }
      `}</style>
    </div>
  );
}
