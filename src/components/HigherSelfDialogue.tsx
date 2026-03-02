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
          preload="auto"
          crossOrigin="anonymous"
          className="home-background-video"
          style={{
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
          }}
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
          preload="auto"
          crossOrigin="anonymous"
          className="portal-video"
          style={{
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
          }}
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
        className="portal-audio-toggle"
        title={isMusicPlaying ? '关闭背景音乐' : '开启背景音乐'}
      >
        <div className="audio-toggle-glow" />
        {isMusicPlaying ? (
          <Volume2 size={22} color="rgba(200, 220, 255, 0.9)" strokeWidth={1.5} />
        ) : (
          <VolumeX size={22} color="rgba(255, 255, 255, 0.3)" strokeWidth={1.5} />
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
          background-color: rgba(2, 13, 10, 0.8);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .home-background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) contrast(1.15) saturate(0.9);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
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
            rgba(5, 10, 20, 0.4) 66.666vh,
            rgba(2, 5, 12, 0.7) 100%
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
          background-color: rgba(5, 10, 20, 0.5);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .portal-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.95) contrast(1.05) saturate(1.15);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .portal-glow-effect {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 140%;
          height: 160px;
          background: radial-gradient(
            ellipse at center,
            rgba(180, 200, 255, 0.18) 0%,
            rgba(150, 170, 220, 0.12) 30%,
            rgba(120, 140, 180, 0.06) 50%,
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
          animation: portalGlowPulse 5s ease-in-out infinite;
        }

        @keyframes portalGlowPulse {
          0%, 100% {
            opacity: 0.5;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1.15);
          }
        }

        .mesh-gradient-transition {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(180, 200, 255, 0.02) 15%,
            rgba(150, 170, 220, 0.03) 30%,
            rgba(120, 140, 180, 0.04) 50%,
            rgba(90, 110, 140, 0.06) 70%,
            rgba(5, 10, 20, 0.4) 100%
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
          color: rgba(255, 255, 255, 0.85);
          font-size: 19px;
          font-weight: 200;
          letter-spacing: 0.2em;
          line-height: 2.4;
          text-align: center;
          margin-bottom: 70px;
          text-shadow: 0 0 40px rgba(180, 200, 255, 0.2);
          font-family: 'Noto Serif SC', serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          opacity: 0.9;
        }

        .user-name-highlight {
          color: rgba(200, 220, 255, 0.95);
          font-weight: 300;
          letter-spacing: 0.25em;
          text-shadow: 0 0 30px rgba(200, 220, 255, 0.3);
        }

        .zen-dialogue-box {
          position: relative;
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(60px) saturate(120%);
          -webkit-backdrop-filter: blur(60px) saturate(120%);
          border: 0.5px solid rgba(200, 220, 255, 0.08);
          border-radius: 4px;
          padding: 48px;
          box-shadow:
            inset 0 0 80px rgba(180, 200, 255, 0.01),
            0 8px 40px rgba(0, 0, 0, 0.4);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .zen-dialogue-box::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 4px;
          background: linear-gradient(
            135deg,
            rgba(200, 220, 255, 0.06) 0%,
            rgba(180, 200, 240, 0.03) 30%,
            rgba(160, 180, 220, 0.01) 60%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 1s ease;
          pointer-events: none;
        }

        .zen-dialogue-box:focus-within {
          background: rgba(255, 255, 255, 0.025);
          border-color: rgba(200, 220, 255, 0.15);
          box-shadow:
            inset 0 0 100px rgba(180, 200, 255, 0.02),
            0 12px 60px rgba(0, 0, 0, 0.5);
        }

        .zen-dialogue-box:focus-within::before {
          opacity: 1;
        }

        .dialogue-textarea-input {
          width: 100%;
          min-height: 360px;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.88);
          font-size: 16.5px;
          font-weight: 200;
          line-height: 2.3;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          resize: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          caret-color: transparent;
          text-shadow: 0 0 2px rgba(200, 220, 255, 0.1);
        }

        .dialogue-textarea-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
          letter-spacing: 0.2em;
          font-weight: 200;
        }

        .breathing-cursor {
          position: absolute;
          width: 1.5px;
          height: 22px;
          background: linear-gradient(
            to bottom,
            rgba(200, 220, 255, 0.7),
            rgba(180, 200, 240, 0.4)
          );
          bottom: 48px;
          left: 48px;
          animation: breathingCursor 3s ease-in-out infinite;
          pointer-events: none;
          filter: blur(0.3px);
          box-shadow: 0 0 8px rgba(200, 220, 255, 0.3);
        }

        @keyframes breathingCursor {
          0%, 100% {
            opacity: 0.2;
            transform: scaleY(0.9);
          }
          50% {
            opacity: 0.9;
            transform: scaleY(1);
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
            rgba(200, 220, 255, 0.12) 0%,
            rgba(180, 200, 240, 0.08) 30%,
            transparent 60%
          );
          animation: completionRippleExpand 1.5s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }

        @keyframes completionRippleExpand {
          0% {
            transform: scale(0);
            opacity: 0;
            filter: blur(0);
          }
          30% {
            opacity: 1;
            filter: blur(20px);
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
            filter: blur(40px);
          }
        }

        .portal-audio-toggle {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px) saturate(150%);
          -webkit-backdrop-filter: blur(40px) saturate(150%);
          border: 0.5px solid rgba(200, 220, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            inset 0 0 20px rgba(180, 200, 255, 0.03),
            0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 100;
          position: relative;
        }

        .audio-toggle-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(200, 220, 255, 0.15),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
          filter: blur(8px);
        }

        .portal-audio-toggle:hover {
          transform: scale(1.08);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(200, 220, 255, 0.2);
          box-shadow:
            inset 0 0 30px rgba(180, 200, 255, 0.05),
            0 6px 30px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(200, 220, 255, 0.15);
        }

        .portal-audio-toggle:hover .audio-toggle-glow {
          opacity: 1;
          animation: audioGlowPulse 2s ease-in-out infinite;
        }

        .portal-audio-toggle:active {
          transform: scale(0.96);
          transition: all 0.15s ease;
        }

        @keyframes audioGlowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
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
            padding: 32px 24px;
          }

          .dialogue-textarea-input {
            font-size: 15.5px;
            min-height: 320px;
          }

          .breathing-cursor {
            bottom: 32px;
            left: 24px;
          }

          .portal-audio-toggle {
            bottom: 28px;
            right: 28px;
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
}
