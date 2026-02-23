import { useState, useEffect } from 'react';

interface BookOfAnswersProps {
  onComplete: () => void;
  backgroundAudio?: HTMLAudioElement | null;
}

const WISDOMS = [
  '在静默中，你会听见真实的答案',
  '放下执念，才能看见新的可能',
  '每一次呼吸，都是重生的机会',
  '你所寻找的，其实一直都在',
  '勇气不是没有恐惧，而是带着恐惧前行',
  '最深的智慧，来自内心的宁静',
  '接纳当下，才能创造未来',
  '你比你想象的更强大',
  '转变始于觉察',
];

export default function BookOfAnswers({ onComplete, backgroundAudio }: BookOfAnswersProps) {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [selectedWisdom] = useState(WISDOMS[Math.floor(Math.random() * WISDOMS.length)]);

  const handleCardClick = (index: number) => {
    if (flippedCard === null) {
      setFlippedCard(index);
    }
  };

  const handleComplete = () => {
    if (backgroundAudio) {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
      backgroundAudio.volume = 0;
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, #1A352F 0%, #0D1814 100%)' }}>
      <div className="w-full max-w-md flex flex-col" style={{ height: '100vh', justifyContent: 'space-between', paddingTop: '80px', paddingBottom: '40px' }}>
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-light" style={{ color: '#EBC862', letterSpacing: '0.1em' }}>
            答案之书
          </h2>
          <p className="text-sm font-light" style={{ color: '#E0E0D0', opacity: 0.8, letterSpacing: '0.04em' }}>
            {flippedCard === null ? '植本人，选择一张卡片，接收智慧的指引' : '植本人，请接收你的智慧回响'}
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
                    background: 'radial-gradient(circle at center, rgba(235, 200, 98, 0.15) 0%, rgba(2, 10, 9, 0.95) 100%)',
                    border: '1px solid #EBC862',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 16px',
                    boxShadow: '0 0 40px rgba(235, 200, 98, 0.5), 0 0 60px rgba(235, 200, 98, 0.3), 0 0 80px rgba(235, 200, 98, 0.2)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '12px',
                      background: 'radial-gradient(circle at center, transparent 40%, rgba(235, 200, 98, 0.05) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <p
                    className="text-xs font-light leading-relaxed text-center wisdom-text"
                    style={{
                      color: '#EBC862',
                      letterSpacing: '0.04em',
                      textShadow: '0 0 15px rgba(235, 200, 98, 0.6), 0 0 25px rgba(235, 200, 98, 0.4)',
                      position: 'relative',
                      zIndex: 1,
                    }}
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
              className="px-8 py-3 rounded-full font-light transition-all hover:scale-105"
              style={{
                border: '1px solid #EBC862',
                color: '#EBC862',
                backgroundColor: 'transparent',
                letterSpacing: '0.05em',
                boxShadow: '0 0 20px rgba(235, 200, 98, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              我已接收
            </button>
          </div>
        )}
      </div>

      <style>{`
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
          animation: wisdomGlow 2.5s ease-in-out infinite;
        }

        @keyframes wisdomGlow {
          0%, 100% {
            text-shadow: 0 0 15px rgba(235, 200, 98, 0.6), 0 0 25px rgba(235, 200, 98, 0.4);
          }
          50% {
            text-shadow: 0 0 20px rgba(235, 200, 98, 0.8), 0 0 35px rgba(235, 200, 98, 0.5), 0 0 45px rgba(235, 200, 98, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
