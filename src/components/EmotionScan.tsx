import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';

interface EmotionScanProps {
  onNext: (emotions: string[], bodyStates: string[]) => void;
  onBack?: () => void;
}

const EMOTIONS = [
  { label: '喜悦', hue: 45, x: 15, y: 20 },
  { label: '平和', hue: 120, x: 45, y: 10 },
  { label: '焦虑', hue: 210, x: 75, y: 25 },
  { label: '迷茫', hue: 270, x: 25, y: 55 },
  { label: '愤怒', hue: 0, x: 60, y: 50 },
  { label: '悲伤', hue: 200, x: 85, y: 60 },
  { label: '恐惧', hue: 280, x: 10, y: 80 },
  { label: '丰盛', hue: 50, x: 50, y: 85 },
];

const BODY_STATES = [
  { label: '紧绷', x: 20, y: 35 },
  { label: '松弛', x: 55, y: 30 },
  { label: '温热', x: 80, y: 45 },
  { label: '空洞', x: 35, y: 70 },
  { label: '沉重', x: 70, y: 75 },
  { label: '轻盈', x: 90, y: 85 },
];

export default function EmotionScan({ onNext, onBack }: EmotionScanProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedBodyStates, setSelectedBodyStates] = useState<string[]>([]);
  const [journalContent, setJournalContent] = useState('');
  const [step, setStep] = useState<'emotion' | 'writing'>('emotion');
  const [activeHue, setActiveHue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEmotion = (emotion: string, hue: number) => {
    const isSelected = selectedEmotions.includes(emotion);

    if (isSelected) {
      setSelectedEmotions(prev => prev.filter(e => e !== emotion));
      setActiveHue(0);
    } else {
      setSelectedEmotions(prev => [...prev, emotion]);
      setActiveHue(hue);
    }
  };

  const toggleBodyState = (state: string) => {
    const isSelected = selectedBodyStates.includes(state);

    if (isSelected) {
      setSelectedBodyStates(prev => prev.filter(s => s !== state));
    } else {
      setSelectedBodyStates(prev => [...prev, state]);
    }
  };

  const handleContinueToWriting = () => {
    if (selectedEmotions.length > 0 || selectedBodyStates.length > 0) {
      setStep('writing');
    }
  };

  const handleSubmit = () => {
    if (journalContent.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onNext(selectedEmotions, selectedBodyStates);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade relative">
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
      {step === 'emotion' ? (
        <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full relative" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
          <div className="mb-8 text-center">
            <p className="text-sm" style={{
              color: '#FFFFFF',
              fontWeight: 400,
              letterSpacing: '0.25em',
              textShadow: '0 2px 8px rgba(255, 255, 255, 0.6), 0 0 20px rgba(247, 231, 206, 0.4)',
              position: 'relative',
              zIndex: 100
            }}>
              此刻，你的情绪是
            </p>
          </div>

          <div className="bubble-universe relative w-full" style={{ height: '350px', marginBottom: '40px' }}>
            {EMOTIONS.map((emotion, index) => (
              <button
                key={emotion.label}
                onClick={() => toggleEmotion(emotion.label, emotion.hue)}
                className={`glass-bubble ${selectedEmotions.includes(emotion.label) ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${emotion.x}%`,
                  top: `${emotion.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="golden-halo" />
                <div className="core-light" />
                <div className="bubble-content">
                  {emotion.label}
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6 text-center">
            <p className="text-base" style={{
              color: '#FFFFFF',
              fontWeight: 400,
              letterSpacing: '0.25em',
              textShadow: '0 2px 8px rgba(255, 255, 255, 0.6), 0 0 20px rgba(247, 231, 206, 0.4)',
              position: 'relative',
              zIndex: 100
            }}>
              你的身体感受到
            </p>
          </div>

          <div className="bubble-universe relative w-full" style={{ height: '240px', marginBottom: '50px' }}>
            {BODY_STATES.map((state, index) => (
              <button
                key={state.label}
                onClick={() => toggleBodyState(state.label)}
                className={`glass-bubble body-bubble ${selectedBodyStates.includes(state.label) ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${state.x}%`,
                  top: `${state.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${(index + EMOTIONS.length) * 0.1}s`,
                }}
              >
                <div className="golden-halo" />
                <div className="core-light" />
                <div className="bubble-content">
                  {state.label}
                </div>
              </button>
            ))}
          </div>

          <div className="w-full max-w-md mx-auto">
            <GoldButton
              onClick={handleContinueToWriting}
              disabled={selectedEmotions.length === 0 && selectedBodyStates.length === 0}
              className="w-full"
            >
              继续
            </GoldButton>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full">
          <div className="w-full mb-8 relative">
            <div className="consciousness-line" />
            <textarea
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              placeholder="在此书写你的感受..."
              className={`conscious-writing ${isSubmitting ? 'submitting' : ''}`}
              rows={1}
              autoFocus
            />
            <div className="text-reflection" aria-hidden="true">
              {journalContent}
            </div>
          </div>

          <div className="w-full">
            <GoldButton
              onClick={handleSubmit}
              disabled={!journalContent.trim()}
              className="w-full"
            >
              完成
            </GoldButton>
          </div>
        </div>
      )}

      <style>{`
        .bubble-universe {
          position: relative;
        }

        .glass-bubble {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: bubbleFloat 1.2s ease-out forwards;
          box-shadow:
            0 0 15px rgba(247, 231, 206, 0.6),
            0 0 40px rgba(247, 231, 206, 0.2),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .body-bubble {
          width: 80px;
          height: 80px;
        }

        .golden-halo {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: transparent;
          border: 2px solid rgba(247, 231, 206, 0.5);
          opacity: 0.8;
          animation: haloBreath 4s ease-in-out infinite;
          pointer-events: none;
          box-shadow:
            0 0 20px rgba(247, 231, 206, 0.6),
            0 0 40px rgba(247, 231, 206, 0.3);
        }

        .core-light {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(247, 231, 206, 0.9) 40%, rgba(235, 200, 98, 0.6) 70%, transparent 100%);
          box-shadow:
            0 0 12px rgba(255, 255, 255, 0.9),
            0 0 20px rgba(247, 231, 206, 0.8);
          animation: corePulse 3s ease-in-out infinite;
          pointer-events: none;
          opacity: 0.8;
        }

        .glass-bubble:hover .golden-halo {
          border-color: rgba(247, 231, 206, 0.8);
          opacity: 1;
          transform: scale(1.12);
          box-shadow:
            0 0 30px rgba(247, 231, 206, 0.8),
            0 0 60px rgba(247, 231, 206, 0.4);
        }

        .glass-bubble:hover .bubble-content {
          transform: scale(1.08);
          color: #FFFFFF;
        }

        .glass-bubble:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(247, 231, 206, 0.6);
          box-shadow:
            0 0 20px rgba(247, 231, 206, 0.8),
            0 0 50px rgba(247, 231, 206, 0.4),
            0 8px 32px rgba(235, 200, 98, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.2);
        }

        .glass-bubble.selected {
          background: rgba(247, 231, 206, 0.2);
          border-color: rgba(247, 231, 206, 0.8);
          box-shadow:
            0 0 30px rgba(247, 231, 206, 0.9),
            0 0 60px rgba(247, 231, 206, 0.5),
            0 0 90px rgba(235, 200, 98, 0.3),
            inset 0 2px 8px rgba(255, 255, 255, 0.3);
          animation: bubbleFloat 1.2s ease-out forwards, selectedGlow 2s ease-in-out infinite;
        }

        .glass-bubble.selected .golden-halo {
          border-color: rgba(247, 231, 206, 1);
          opacity: 1;
          box-shadow:
            0 0 35px rgba(247, 231, 206, 0.9),
            0 0 70px rgba(247, 231, 206, 0.5);
        }

        .glass-bubble.selected .core-light {
          box-shadow:
            0 0 20px rgba(255, 255, 255, 1),
            0 0 35px rgba(247, 231, 206, 1);
          opacity: 1;
        }

        .bubble-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #FFFFFF;
          text-shadow:
            0 2px 10px rgba(255, 255, 255, 0.9),
            0 0 25px rgba(255, 255, 255, 0.7),
            0 0 35px rgba(247, 231, 206, 0.6);
          position: relative;
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: none;
        }

        .body-bubble .bubble-content {
          font-size: 13px;
          font-weight: 500;
        }

        @keyframes haloBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes corePulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes selectedGlow {
          0%, 100% {
            box-shadow:
              0 0 30px rgba(247, 231, 206, 0.9),
              0 0 60px rgba(247, 231, 206, 0.5),
              0 0 90px rgba(235, 200, 98, 0.3),
              inset 0 2px 8px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow:
              0 0 40px rgba(247, 231, 206, 1),
              0 0 80px rgba(247, 231, 206, 0.6),
              0 0 120px rgba(235, 200, 98, 0.4),
              inset 0 2px 10px rgba(255, 255, 255, 0.4);
          }
        }

        .consciousness-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 0.5px;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(235, 200, 98, 0.3) 20%,
            rgba(235, 200, 98, 0.6) 50%,
            rgba(235, 200, 98, 0.3) 80%,
            transparent 100%
          );
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 1;
        }

        .conscious-writing {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: #EBC862;
          text-align: center;
          padding: 40px 20px;
          resize: none;
          overflow: hidden;
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 12px rgba(235, 200, 98, 0.4);
          line-height: 1.8;
          min-height: 120px;
        }

        .conscious-writing::placeholder {
          color: rgba(235, 200, 98, 0.35);
          letter-spacing: 0.2em;
        }

        .conscious-writing.submitting {
          animation: fadeOutUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                     particleDispersal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .text-reflection {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          width: 100%;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(235, 200, 98, 0.15);
          text-align: center;
          padding: 40px 20px;
          pointer-events: none;
          z-index: 0;
          transform: scaleY(-1) translateY(50%);
          opacity: 0.3;
          filter: blur(1px);
          line-height: 1.8;
        }

        @keyframes bubbleFloat {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hueShift {
          0% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(${activeHue}deg);
          }
          100% {
            filter: hue-rotate(0deg);
          }
        }

        @keyframes fadeOutUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }

        @keyframes particleDispersal {
          0% {
            text-shadow:
              0 2px 12px rgba(235, 200, 98, 0.4);
          }
          100% {
            text-shadow:
              0 -20px 40px rgba(235, 200, 98, 0.8),
              10px -25px 45px rgba(235, 200, 98, 0.6),
              -10px -30px 50px rgba(235, 200, 98, 0.6),
              15px -35px 55px rgba(235, 200, 98, 0.4),
              -15px -40px 60px rgba(235, 200, 98, 0.4);
          }
        }

        video {
          transition: filter 2s ease-in-out;
        }

        video.hue-shifted {
          filter: hue-rotate(${activeHue}deg) contrast(1.2) brightness(1.1) saturate(1.1);
        }
      `}</style>
    </div>
  );
}
