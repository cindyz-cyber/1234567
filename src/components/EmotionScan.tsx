import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';

interface EmotionScanProps {
  onNext: (emotions: string[], bodyStates: string[]) => void;
  onBack?: () => void;
}

const EMOTIONS = [
  { label: '焦虑', hue: 210 },
  { label: '平和', hue: 120 },
  { label: '愤怒', hue: 0 },
  { label: '喜悦', hue: 45 },
  { label: '迷茫', hue: 270 },
];

export default function EmotionScan({ onNext, onBack }: EmotionScanProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
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

  const handleContinueToWriting = () => {
    if (selectedEmotions.length > 0) {
      setStep('writing');
    }
  };

  const handleSubmit = () => {
    if (journalContent.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onNext(selectedEmotions, [journalContent]);
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
      <div className="absolute top-0 left-0 w-full h-[30vh] z-20 pointer-events-none top-vignette" />

      <div className="absolute top-[8vh] left-0 w-full z-30 flex justify-center pointer-events-none">
        <h1 className="brand-title">
          <span className="brand-letter" style={{ animationDelay: '0s' }}>植</span>
          <span className="brand-letter" style={{ animationDelay: '0.5s' }}>本</span>
          <span className="brand-letter" style={{ animationDelay: '1s' }}>觉</span>
          <span className="brand-letter" style={{ animationDelay: '1.5s' }}>察</span>
        </h1>
      </div>

      {step === 'emotion' ? (
        <div className="flex-1 flex flex-col justify-center items-center max-w-lg mx-auto w-full">
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {EMOTIONS.map((emotion, index) => (
              <button
                key={emotion.label}
                onClick={() => toggleEmotion(emotion.label, emotion.hue)}
                className="glass-bubble"
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div className="bubble-content">
                  {emotion.label}
                </div>
              </button>
            ))}
          </div>

          <div className="w-full">
            <GoldButton
              onClick={handleContinueToWriting}
              disabled={selectedEmotions.length === 0}
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
        .top-vignette {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.95) 25%,
            rgba(0, 0, 0, 0.8) 50%,
            rgba(0, 0, 0, 0.4) 75%,
            transparent 100%
          );
        }

        .brand-title {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.6em;
          color: #F7E7CE;
          display: flex;
          padding-left: 0.6em;
        }

        .brand-letter {
          display: inline-block;
          opacity: 0;
          animation: letterFadeIn 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards,
                     breathe 4s ease-in-out infinite;
        }

        @keyframes letterFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 0.85;
            transform: translateY(0);
          }
        }

        @keyframes breathe {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.95;
          }
        }

        .glass-bubble {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: bubbleFloat 1s ease-out forwards;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.05);
        }

        .glass-bubble:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-5px) scale(1.05);
          box-shadow:
            0 12px 48px rgba(235, 200, 98, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .glass-bubble:active {
          animation: hueShift 2s ease-in-out forwards;
        }

        .bubble-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 18px;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: rgba(247, 231, 206, 0.9);
          text-shadow: 0 2px 8px rgba(247, 231, 206, 0.2);
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
