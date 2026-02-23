import { useState } from 'react';

interface BookOfAnswersProps {
  onComplete: () => void;
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

export default function BookOfAnswers({ onComplete }: BookOfAnswersProps) {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [selectedWisdom] = useState(WISDOMS[Math.floor(Math.random() * WISDOMS.length)]);

  const handleCardClick = (index: number) => {
    if (flippedCard === null) {
      setFlippedCard(index);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, #1A352F 0%, #0D1814 100%)' }}>
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-light" style={{ color: '#EBC862', letterSpacing: '0.1em' }}>
            答案之书
          </h2>
          <p className="text-sm font-light" style={{ color: '#E0E0D0', opacity: 0.8, letterSpacing: '0.04em' }}>
            {flippedCard === null ? '选择一张卡片，接收智慧的指引' : ''}
          </p>
        </div>

        <div className="flex justify-center gap-4">
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
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'url(/src/assets/227c82c549f3edf64f327b2a617f0246.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.15,
                      zIndex: 0,
                    }}
                  />
                  <div
                    className="golden-tree-logo"
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      style={{
                        width: '100%',
                        height: '100%',
                        filter: `
                          drop-shadow(0 0 8px rgba(212, 175, 55, 0.8))
                          drop-shadow(0 0 16px rgba(212, 175, 55, 0.6))
                          drop-shadow(0 0 24px rgba(212, 175, 55, 0.4))
                          drop-shadow(0 0 32px rgba(212, 175, 55, 0.2))
                        `,
                      }}
                    >
                      <path
                        d="M50 10 L50 90 M30 30 Q40 25 50 30 Q60 25 70 30 M25 50 Q37.5 45 50 50 Q62.5 45 75 50 M30 70 Q40 65 50 70 Q60 65 70 70"
                        stroke="#D4AF37"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="15" r="3" fill="#D4AF37" />
                      <circle cx="30" cy="30" r="2" fill="#D4AF37" opacity="0.8" />
                      <circle cx="70" cy="30" r="2" fill="#D4AF37" opacity="0.8" />
                      <circle cx="25" cy="50" r="2" fill="#D4AF37" opacity="0.7" />
                      <circle cx="75" cy="50" r="2" fill="#D4AF37" opacity="0.7" />
                    </svg>
                  </div>
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
                    justifyContent: 'space-between',
                    padding: '16px 12px 12px 12px',
                    boxShadow: '0 0 30px rgba(235, 200, 98, 0.4)',
                  }}
                >
                  <p
                    className="text-xs font-light leading-relaxed text-center flex-1 flex items-center justify-center"
                    style={{
                      color: '#EBC862',
                      letterSpacing: '0.03em',
                      textShadow: '0 0 10px rgba(235, 200, 98, 0.5)',
                      paddingBottom: '8px',
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
          <button
            onClick={onComplete}
            className="mt-8 px-8 py-3 rounded-full font-light transition-all hover:scale-105"
            style={{
              border: '1px solid #EBC862',
              color: '#EBC862',
              backgroundColor: 'transparent',
              letterSpacing: '0.05em',
              boxShadow: '0 0 20px rgba(235, 200, 98, 0.2)',
            }}
          >
            我已接收
          </button>
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
          transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-container.flipped .card {
          transform: rotateY(180deg);
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

        .golden-tree-logo {
          animation: goldenPulse 3s ease-in-out infinite;
        }

        @keyframes goldenPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
