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
  const [rippleTriggered, setRippleTriggered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setRippleTriggered(true);
      setTimeout(() => {
        onComplete(response.trim(), backgroundMusic);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="home-background-layer">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="home-background-video"
        >
          <source src="https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4" type="video/mp4" />
        </video>
        <div className="home-background-overlay" />
      </div>

      <div className="portal-video-container">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="portal-video"
        >
          <source src="https://cdn.midjourney.com/video/7e901a1c-929f-466d-8def-ac47f9d0c15b/3.mp4" type="video/mp4" />
        </video>

        <div className="portal-glow-effect" />

        <div className="mesh-gradient-transition" />
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
          <h2 className="dialogue-greeting">
            亲爱的 <span className="user-name-highlight">{userName}</span>，下面是我想对你说的话：
          </h2>

          <div className="zen-dialogue-box">
            <textarea
              ref={textareaRef}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="dialogue-textarea-input"
              placeholder="倾听内在的声音..."
              autoFocus
            />
            <div className="breathing-cursor" />
          </div>

          <div className="mt-8">
            <GoldButton onClick={handleSubmit} disabled={!response.trim()} className="w-full">
              完成对话
            </GoldButton>
          </div>
        </div>
      </div>

      {rippleTriggered && <div className="completion-ripple" />}

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
        .home-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .home-background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9) contrast(1.1) saturate(1.05);
        }

        .home-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(10, 31, 28, 0.25) 66.666vh,
            rgba(4, 20, 18, 0.5) 100%
          );
        }

        .portal-video-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 33.333vh;
          overflow: hidden;
          z-index: 1;
        }

        .portal-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.95) contrast(1.05) saturate(1.15);
        }

        .portal-glow-effect {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: 120px;
          background: radial-gradient(
            ellipse at center,
            rgba(168, 218, 181, 0.25) 0%,
            rgba(144, 198, 149, 0.15) 30%,
            rgba(120, 178, 117, 0.08) 50%,
            transparent 70%
          );
          filter: blur(40px);
          pointer-events: none;
          animation: portalGlowPulse 4s ease-in-out infinite;
        }

        @keyframes portalGlowPulse {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.9;
            transform: translateX(-50%) scale(1.1);
          }
        }

        .mesh-gradient-transition {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(168, 218, 181, 0.03) 20%,
            rgba(144, 198, 149, 0.05) 40%,
            rgba(120, 178, 117, 0.06) 60%,
            rgba(96, 158, 93, 0.08) 80%,
            rgba(10, 31, 28, 0.3) 100%
          );
          pointer-events: none;
        }

        .dialogue-content-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          padding-top: 33.333vh;
        }

        .dialogue-inner {
          max-width: 600px;
          margin: 0 auto;
          padding: 80px 24px 100px;
        }

        .dialogue-greeting {
          color: #F7E7CE;
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 0.1em;
          line-height: 2;
          text-align: center;
          margin-bottom: 60px;
          text-shadow: 0 2px 30px rgba(247, 231, 206, 0.3);
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .user-name-highlight {
          color: #D4C5A0;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-shadow: 0 0 20px rgba(212, 197, 160, 0.4);
        }

        .zen-dialogue-box {
          position: relative;
          background: transparent;
          border: 0.5px solid rgba(168, 218, 181, 0.15);
          border-radius: 2px;
          padding: 40px;
          box-shadow: inset 0 0 60px rgba(168, 218, 181, 0.02);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .zen-dialogue-box::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 2px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(168, 218, 181, 0.2),
            rgba(144, 198, 149, 0.1),
            rgba(120, 178, 117, 0.05),
            transparent
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .zen-dialogue-box:focus-within::before {
          opacity: 1;
        }

        .dialogue-textarea-input {
          width: 100%;
          min-height: 320px;
          background: transparent;
          border: none;
          outline: none;
          color: #E8E8DC;
          font-size: 17px;
          font-weight: 300;
          line-height: 2;
          letter-spacing: 0.05em;
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', serif;
          resize: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          caret-color: transparent;
          text-shadow: 0 0 1px rgba(232, 232, 220, 0.1);
          animation: textAppear 0.3s ease-out;
        }

        @keyframes textAppear {
          0% {
            filter: blur(4px);
            opacity: 0;
          }
          100% {
            filter: blur(0);
            opacity: 1;
          }
        }

        .dialogue-textarea-input::placeholder {
          color: rgba(232, 232, 220, 0.2);
          letter-spacing: 0.08em;
        }

        .breathing-cursor {
          position: absolute;
          width: 2px;
          height: 20px;
          background: rgba(168, 218, 181, 0.6);
          bottom: 40px;
          left: 40px;
          animation: breathingCursor 2s ease-in-out infinite;
          pointer-events: none;
          filter: blur(0.5px);
        }

        @keyframes breathingCursor {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .completion-ripple {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(168, 218, 181, 0.15) 0%,
            rgba(144, 198, 149, 0.1) 30%,
            transparent 60%
          );
          animation: completionRippleExpand 1.2s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }

        @keyframes completionRippleExpand {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        .audio-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(235, 200, 98, 0.4);
        }

        .audio-toggle:active {
          transform: scale(0.95);
        }

        @media (max-width: 640px) {
          .dialogue-inner {
            padding: 60px 20px 80px;
          }

          .dialogue-greeting {
            font-size: 18px;
            padding: 0 12px;
            margin-bottom: 48px;
          }

          .zen-dialogue-box {
            padding: 28px 20px;
          }

          .dialogue-textarea-input {
            font-size: 16px;
            min-height: 280px;
          }

          .breathing-cursor {
            bottom: 28px;
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
}
