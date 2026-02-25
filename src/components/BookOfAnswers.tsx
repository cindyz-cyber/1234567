import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { stopAllAudio } from '../utils/audioManager';

interface BookOfAnswersProps {
  onComplete: () => void;
  backgroundAudio?: HTMLAudioElement | null;
  onBack?: () => void;
}

const WISDOMS = [
  '向东，在黎明前启程',
  '停止，当下即是转折点',
  '继续前行，答案在第三次尝试中',
  '向左转，你忽略的选项才是正解',
  '等待七天，时机未至',
  '立即行动，犹豫会错失良机',
  '回到起点，重新审视第一步',
  '寻找水的方向，流动带来答案',
  '在静默中决策，喧嚣会误导你',
  '选择困难的路，它通往你要去的地方',
  '放弃当前方案，另辟蹊径',
  '坚持到底，最后一刻见分晓',
];

export default function BookOfAnswers({ onComplete, backgroundAudio, onBack }: BookOfAnswersProps) {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [selectedWisdom] = useState(WISDOMS[Math.floor(Math.random() * WISDOMS.length)]);

  const handleCardClick = (index: number) => {
    if (flippedCard === null) {
      setFlippedCard(index);
    }
  };

  const handleComplete = () => {
    onComplete();
    setTimeout(() => {
      stopAllAudio();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 book-of-answers-container">
      <div className="home-background-layer">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="home-background-video"
        >
          <source src="https://cdn.midjourney.com/video/48fc39c6-3c66-4f02-a3e2-3445b7fec438/1.mp4" type="video/mp4" />
        </video>
        <div className="home-background-overlay" />
      </div>

      <div className="portal-video-container">
        <video
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
      <div className="w-full max-w-md flex flex-col" style={{ height: '100vh', justifyContent: 'space-between', paddingTop: '80px', paddingBottom: '40px', position: 'relative', zIndex: 10 }}>
        <div className="space-y-4 text-center">
          <h2 className="book-title">
            答案之书
          </h2>
          <p className="book-subtitle">
            {flippedCard === null ? '选择一张卡片，接收指引' : '这是你的方向'}
          </p>
        </div>

        <div className="flex justify-center gap-4" style={{ marginTop: '40px' }}>
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              disabled={flippedCard !== null && flippedCard !== index}
              className={`card-container ${flippedCard === index ? 'flipped' : ''}`}
              style={{
                width: '90px',
                height: '140px',
                perspective: '1000px',
                opacity: flippedCard !== null && flippedCard !== index ? 0.3 : 1,
                transition: 'opacity 0.5s ease',
              }}
            >
              <div className="card">
                {/* Back */}
                <div
                  className="card-face card-back"
                  style={{
                    backgroundColor: 'rgba(2, 10, 9, 0.95)',
                    border: '1px solid #EBC862',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    className="card-back-image"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'url(/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: 0,
                      filter: 'brightness(0.85) contrast(1.15)',
                    }}
                  />
                  <div
                    className="golden-glow-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at center, transparent 25%, rgba(2, 10, 9, 0.4) 100%)',
                      zIndex: 1,
                      boxShadow: 'inset 0 0 40px rgba(235, 200, 98, 0.15), inset 0 0 60px rgba(235, 200, 98, 0.1)',
                    }}
                  />
                </div>

                {/* Front */}
                <div
                  className="card-face card-front"
                  style={{
                    background: 'rgba(5, 10, 20, 0.95)',
                    border: '0.5px solid rgba(200, 220, 255, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 16px',
                    boxShadow: '0 0 40px rgba(180, 200, 255, 0.3), 0 0 60px rgba(180, 200, 255, 0.2)',
                    position: 'relative',
                    backdropFilter: 'blur(40px)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '12px',
                      background: 'radial-gradient(circle at center, rgba(200, 220, 255, 0.08) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <p
                    className="wisdom-text"
                  >
                    {selectedWisdom}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {flippedCard !== null && (
          <div className="text-center">
            <button
              onClick={handleComplete}
              className="complete-button"
            >
              我已接收
            </button>
          </div>
        )}
      </div>

      <style>{`
        .book-of-answers-container {
          position: relative;
        }

        .book-title {
          color: rgba(200, 220, 255, 0.95);
          font-size: 28px;
          font-weight: 200;
          letter-spacing: 0.25em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 30px rgba(200, 220, 255, 0.4);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .book-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          font-weight: 200;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .complete-button {
          padding: 12px 36px;
          border-radius: 4px;
          font-weight: 200;
          font-size: 15px;
          letter-spacing: 0.2em;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px) saturate(120%);
          -webkit-backdrop-filter: blur(40px) saturate(120%);
          border: 0.5px solid rgba(200, 220, 255, 0.15);
          color: rgba(200, 220, 255, 0.9);
          font-family: 'Noto Serif SC', serif;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            inset 0 0 20px rgba(180, 200, 255, 0.03),
            0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .complete-button:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(200, 220, 255, 0.25);
          transform: scale(1.05);
          box-shadow:
            inset 0 0 30px rgba(180, 200, 255, 0.05),
            0 6px 30px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(200, 220, 255, 0.15);
        }

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
          filter: brightness(0.7) contrast(1.15) saturate(0.9);
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
        }

        .portal-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.95) contrast(1.05) saturate(1.15);
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

        .card-container {
          cursor: pointer;
          perspective: 1200px;
        }

        .card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-container.flipped .card {
          transform: rotateY(180deg);
          transition: transform 1.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }

        .card-front {
          transform: rotateY(180deg);
        }

        .card-container:not(.flipped):hover .card {
          transform: translateY(-6px) scale(1.05);
        }

        .card-back-image {
          animation: goldenPulseGlow 3.42s ease-in-out infinite;
        }

        @keyframes goldenPulseGlow {
          0%, 100% {
            filter: brightness(0.85) contrast(1.15) drop-shadow(0 0 8px rgba(235, 200, 98, 0.2));
          }
          50% {
            filter: brightness(0.95) contrast(1.2) drop-shadow(0 0 16px rgba(235, 200, 98, 0.4));
          }
        }

        .golden-glow-overlay {
          animation: glowPulse 3.42s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: inset 0 0 40px rgba(235, 200, 98, 0.15), inset 0 0 60px rgba(235, 200, 98, 0.1);
          }
          50% {
            box-shadow: inset 0 0 50px rgba(235, 200, 98, 0.2), inset 0 0 70px rgba(235, 200, 98, 0.15);
          }
        }

        .wisdom-text {
          color: rgba(200, 220, 255, 0.95);
          font-size: 13px;
          font-weight: 200;
          line-height: 1.8;
          text-align: center;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 20px rgba(200, 220, 255, 0.5);
          position: relative;
          z-index: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          animation: wisdomGlow 3s ease-in-out infinite;
        }

        @keyframes wisdomGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(200, 220, 255, 0.5), 0 0 30px rgba(180, 200, 240, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(200, 220, 255, 0.7), 0 0 45px rgba(180, 200, 240, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
