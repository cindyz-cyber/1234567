import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';

interface EmotionScanProps {
  onNext: (emotions: string[], bodyStates: string[]) => void;
  onBack?: () => void;
}

const EMOTIONS = [
  { label: '喜悦', hue: 45 },
  { label: '平和', hue: 120 },
  { label: '焦虑', hue: 210 },
  { label: '迷茫', hue: 270 },
  { label: '愤怒', hue: 0 },
  { label: '悲伤', hue: 200 },
  { label: '丰盛', hue: 50 },
  { label: '其他', hue: 180 },
];

const BODY_STATES = [
  { label: '紧绷' },
  { label: '松弛' },
  { label: '温热' },
  { label: '空洞' },
  { label: '沉重' },
  { label: '其他' },
];

export default function EmotionScan({ onNext, onBack }: EmotionScanProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedBodyStates, setSelectedBodyStates] = useState<string[]>([]);
  const [journalContent, setJournalContent] = useState('');
  const [step, setStep] = useState<'emotion' | 'writing'>('emotion');
  const [activeHue, setActiveHue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customEmotion, setCustomEmotion] = useState('');
  const [customBodyState, setCustomBodyState] = useState('');
  const [showEmotionInput, setShowEmotionInput] = useState(false);
  const [showBodyStateInput, setShowBodyStateInput] = useState(false);

  const toggleEmotion = (emotion: string, hue: number) => {
    if (emotion === '其他') {
      setShowEmotionInput(true);
      return;
    }

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
    if (state === '其他') {
      setShowBodyStateInput(true);
      return;
    }

    const isSelected = selectedBodyStates.includes(state);

    if (isSelected) {
      setSelectedBodyStates(prev => prev.filter(s => s !== state));
    } else {
      setSelectedBodyStates(prev => [...prev, state]);
    }
  };

  const handleCustomEmotionSubmit = () => {
    if (customEmotion.trim()) {
      setSelectedEmotions(prev => [...prev, customEmotion.trim()]);
      setCustomEmotion('');
      setShowEmotionInput(false);
    }
  };

  const handleCustomBodyStateSubmit = () => {
    if (customBodyState.trim()) {
      setSelectedBodyStates(prev => [...prev, customBodyState.trim()]);
      setCustomBodyState('');
      setShowBodyStateInput(false);
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
      <div className="forest-background-layer" />

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
        <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full relative" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="mb-10 text-center">
            <p className="text-sm title-text" style={{
              color: '#FFFFFF',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.8)',
              position: 'relative',
              zIndex: 100
            }}>
              此刻，你的情绪是
            </p>
          </div>

          <div className="emotion-cluster w-full flex flex-wrap justify-center items-center gap-5 mb-16 px-6" style={{ maxWidth: '800px' }}>
            {EMOTIONS.map((emotion, index) => (
              <button
                key={emotion.label}
                onClick={() => toggleEmotion(emotion.label, emotion.hue)}
                className={`glass-bubble emotion-bubble ${selectedEmotions.includes(emotion.label) ? 'selected' : ''}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="golden-halo" />
                <div className="bubble-content">
                  {emotion.label}
                </div>
              </button>
            ))}
          </div>

          {showEmotionInput && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
              <div className="relative w-full max-w-md mx-6 p-8 rounded-3xl" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(247, 231, 206, 0.3)',
                boxShadow: '0 0 30px rgba(247, 231, 206, 0.5), 0 0 60px rgba(247, 231, 206, 0.2)'
              }}>
                <p className="text-center mb-6" style={{
                  color: '#FFF9E5',
                  fontWeight: 400,
                  letterSpacing: '0.25em',
                  fontSize: '16px',
                  textShadow: '0 0 10px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(255, 255, 255, 0.6)'
                }}>
                  请输入你的情绪
                </p>
                <input
                  type="text"
                  value={customEmotion}
                  onChange={(e) => setCustomEmotion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomEmotionSubmit()}
                  placeholder="例如: 期待、感恩..."
                  autoFocus
                  className="w-full mb-6 px-6 py-4 rounded-2xl text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(247, 231, 206, 0.4)',
                    outline: 'none',
                    color: '#EBC862',
                    fontSize: '18px',
                    letterSpacing: '0.15em',
                    fontFamily: 'Georgia, Times New Roman, serif'
                  }}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowEmotionInput(false);
                      setCustomEmotion('');
                    }}
                    className="flex-1 py-3 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(247, 231, 206, 0.3)',
                      color: '#FFFFFF',
                      letterSpacing: '0.2em'
                    }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCustomEmotionSubmit}
                    disabled={!customEmotion.trim()}
                    className="flex-1 py-3 rounded-xl transition-all"
                    style={{
                      background: customEmotion.trim() ? 'rgba(247, 231, 206, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(247, 231, 206, 0.5)',
                      color: customEmotion.trim() ? '#EBC862' : 'rgba(255, 255, 255, 0.3)',
                      letterSpacing: '0.2em',
                      cursor: customEmotion.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="section-divider mb-10 text-center" style={{
            borderTop: '0.5px solid rgba(235, 200, 98, 0.25)',
            paddingTop: '50px',
            width: '100%',
            maxWidth: '600px'
          }}>
            <p className="text-sm body-section-title" style={{
              color: '#FFFFFF',
              fontWeight: 400,
              letterSpacing: '0.3em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.8)',
              position: 'relative',
              zIndex: 100,
              fontFamily: 'Georgia, Times New Roman, serif',
              fontSize: '13px'
            }}>
              你的身体感受是？
            </p>
          </div>

          <div className="body-cluster w-full flex flex-wrap justify-center items-center gap-4 mb-12 px-6" style={{ maxWidth: '700px' }}>
            {BODY_STATES.map((state, index) => (
              <button
                key={state.label}
                onClick={() => toggleBodyState(state.label)}
                className={`glass-bubble body-bubble ${selectedBodyStates.includes(state.label) ? 'selected' : ''}`}
                style={{
                  animationDelay: `${(index + EMOTIONS.length) * 0.1}s`,
                }}
              >
                <div className="golden-halo" />
                <div className="bubble-content">
                  {state.label}
                </div>
              </button>
            ))}
          </div>

          {showBodyStateInput && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
              <div className="relative w-full max-w-md mx-6 p-8 rounded-3xl" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(247, 231, 206, 0.3)',
                boxShadow: '0 0 30px rgba(247, 231, 206, 0.5), 0 0 60px rgba(247, 231, 206, 0.2)'
              }}>
                <p className="text-center mb-6" style={{
                  color: '#FFF9E5',
                  fontWeight: 400,
                  letterSpacing: '0.25em',
                  fontSize: '16px',
                  textShadow: '0 0 10px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(255, 255, 255, 0.6)'
                }}>
                  请输入你的身体感受
                </p>
                <input
                  type="text"
                  value={customBodyState}
                  onChange={(e) => setCustomBodyState(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomBodyStateSubmit()}
                  placeholder="例如: 麻木、刺痛..."
                  autoFocus
                  className="w-full mb-6 px-6 py-4 rounded-2xl text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(247, 231, 206, 0.4)',
                    outline: 'none',
                    color: '#EBC862',
                    fontSize: '18px',
                    letterSpacing: '0.15em',
                    fontFamily: 'Georgia, Times New Roman, serif'
                  }}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowBodyStateInput(false);
                      setCustomBodyState('');
                    }}
                    className="flex-1 py-3 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(247, 231, 206, 0.3)',
                      color: '#FFFFFF',
                      letterSpacing: '0.2em'
                    }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCustomBodyStateSubmit}
                    disabled={!customBodyState.trim()}
                    className="flex-1 py-3 rounded-xl transition-all"
                    style={{
                      background: customBodyState.trim() ? 'rgba(247, 231, 206, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(247, 231, 206, 0.5)',
                      color: customBodyState.trim() ? '#EBC862' : 'rgba(255, 255, 255, 0.3)',
                      letterSpacing: '0.2em',
                      cursor: customBodyState.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={`w-full max-w-md mx-auto continue-button-wrapper transition-all duration-700 ${selectedEmotions.length > 0 && selectedBodyStates.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <GoldButton
              onClick={handleContinueToWriting}
              disabled={selectedEmotions.length === 0 || selectedBodyStates.length === 0}
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
        .forest-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-image: url('/src/assets/blade_grass_field_top-down_ground_texture_map_stylized_hand-pai_276b4e68-d309-4f57-93db-69dfdc5d39d1.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          filter: blur(13px);
          opacity: 0.65;
          z-index: 1;
          pointer-events: none;
          animation: forestBreath 8s ease-in-out infinite;
        }

        @keyframes forestBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.75;
          }
        }

        .emotion-cluster,
        .body-cluster {
          position: relative;
          z-index: 20;
        }

        .glass-bubble {
          border-radius: 50%;
          background: transparent;
          backdrop-filter: none;
          border: 0.5px solid rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat 6s ease-in-out infinite;
          box-shadow:
            0 0 20px rgba(255, 255, 255, 0.5),
            0 0 40px rgba(247, 231, 206, 0.2),
            inset 0 0 10px rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .emotion-bubble {
          width: 75px;
          height: 75px;
        }

        .glass-bubble::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          background-image: url('/src/assets/blade_grass_field_top-down_ground_texture_map_stylized_hand-pai_276b4e68-d309-4f57-93db-69dfdc5d39d1.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          filter: none;
          opacity: 1;
          pointer-events: none;
          z-index: -2;
        }

        .glass-bubble::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .body-bubble {
          width: 60px;
          height: 60px;
        }

        .emotion-bubble:nth-child(1) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat1 6s ease-in-out infinite;
        }

        .emotion-bubble:nth-child(2) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat2 6.5s ease-in-out infinite;
        }

        .emotion-bubble:nth-child(3) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat3 7s ease-in-out infinite;
        }

        .emotion-bubble:nth-child(4) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat1 6.8s ease-in-out infinite;
        }

        .emotion-bubble:nth-child(5) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat2 6.2s ease-in-out infinite;
        }

        .emotion-bubble:nth-child(6) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat3 6.6s ease-in-out infinite;
        }

        .emotion-bubble:nth-child(7) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat1 7.2s ease-in-out infinite;
        }

        .emotion-bubble:nth-child(8) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat2 6.4s ease-in-out infinite;
        }

        .body-bubble:nth-child(1) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat3 5.8s ease-in-out infinite;
        }

        .body-bubble:nth-child(2) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat1 6.1s ease-in-out infinite;
        }

        .body-bubble:nth-child(3) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat2 5.5s ease-in-out infinite;
        }

        .body-bubble:nth-child(4) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat3 6.3s ease-in-out infinite;
        }

        .body-bubble:nth-child(5) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat1 5.9s ease-in-out infinite;
        }

        .body-bubble:nth-child(6) {
          animation: bubbleFloat 1.2s ease-out forwards, subtleFloat2 6.7s ease-in-out infinite;
        }

        @keyframes subtleFloat1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes subtleFloat2 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes subtleFloat3 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes subtleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .golden-halo {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(247, 231, 206, 0.35);
          opacity: 0.6;
          animation: haloBreath 4s ease-in-out infinite;
          pointer-events: none;
          box-shadow:
            0 0 20px rgba(247, 231, 206, 0.4),
            0 0 35px rgba(247, 231, 206, 0.2);
        }

        .glass-bubble:hover .golden-halo {
          border-color: rgba(247, 231, 206, 0.65);
          opacity: 0.9;
          transform: scale(1.08);
          box-shadow:
            0 0 28px rgba(247, 231, 206, 0.6),
            0 0 50px rgba(247, 231, 206, 0.35);
        }

        .glass-bubble:hover .bubble-content {
          transform: scale(1.08);
          color: #FFFFFF;
          text-shadow:
            0 1px 3px rgba(0, 0, 0, 1),
            0 2px 10px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(255, 255, 255, 0.6);
        }

        .glass-bubble:hover {
          background: transparent;
          border-color: rgba(255, 255, 255, 0.7);
          box-shadow:
            0 0 25px rgba(247, 231, 206, 0.6),
            0 0 50px rgba(247, 231, 206, 0.3),
            inset 0 0 40px rgba(255, 255, 255, 0.1);
        }

        .glass-bubble.selected {
          background: rgba(247, 231, 206, 0.1);
          border-color: rgba(247, 231, 206, 0.95);
          box-shadow:
            0 0 20px rgba(247, 231, 206, 0.6),
            0 0 40px rgba(247, 231, 206, 0.4),
            0 0 60px rgba(235, 200, 98, 0.25),
            inset 0 0 30px rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .emotion-bubble.selected:nth-child(1),
        .emotion-bubble.selected:nth-child(2),
        .emotion-bubble.selected:nth-child(3),
        .emotion-bubble.selected:nth-child(4),
        .emotion-bubble.selected:nth-child(5),
        .emotion-bubble.selected:nth-child(6),
        .emotion-bubble.selected:nth-child(7),
        .emotion-bubble.selected:nth-child(8) {
          animation: bubbleFloat 1.2s ease-out forwards, selectedGlow 2.5s ease-in-out infinite;
        }

        .body-bubble.selected:nth-child(1),
        .body-bubble.selected:nth-child(2),
        .body-bubble.selected:nth-child(3),
        .body-bubble.selected:nth-child(4),
        .body-bubble.selected:nth-child(5),
        .body-bubble.selected:nth-child(6) {
          animation: bubbleFloat 1.2s ease-out forwards, selectedGlow 2.5s ease-in-out infinite;
        }

        .glass-bubble.selected .golden-halo {
          border-color: rgba(247, 231, 206, 0.85);
          opacity: 1;
          box-shadow:
            0 0 30px rgba(247, 231, 206, 0.75),
            0 0 55px rgba(247, 231, 206, 0.45);
        }


        .bubble-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #FFFFFF;
          text-shadow:
            0 1px 2px rgba(0, 0, 0, 0.9),
            0 2px 8px rgba(0, 0, 0, 0.7);
          position: relative;
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease, text-shadow 0.3s ease;
          filter: none;
        }

        .emotion-bubble .bubble-content {
          font-size: 13px;
        }

        .body-bubble .bubble-content {
          font-size: 11px;
          font-weight: 500;
        }

        @keyframes haloBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.85;
          }
        }


        @keyframes selectedGlow {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(247, 231, 206, 0.6),
              0 0 40px rgba(247, 231, 206, 0.4),
              0 0 60px rgba(235, 200, 98, 0.25),
              inset 0 0 30px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 0 28px rgba(247, 231, 206, 0.75),
              0 0 55px rgba(247, 231, 206, 0.5),
              0 0 80px rgba(235, 200, 98, 0.35),
              inset 0 0 40px rgba(255, 255, 255, 0.25);
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

        @keyframes bubbleExpand {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        video {
          transition: filter 2s ease-in-out;
        }

        video.hue-shifted {
          filter: hue-rotate(${activeHue}deg) contrast(1.2) brightness(1.1) saturate(1.1);
        }

        .title-text {
          position: relative;
          z-index: 100;
        }

        .body-section-title {
          position: relative;
          z-index: 100;
        }

        .body-section-title p {
          color: #FFFFFF !important;
          text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.95),
            0 4px 12px rgba(0, 0, 0, 0.8) !important;
        }

        .continue-button-wrapper {
          position: relative;
          z-index: 100;
        }
      `}</style>
    </div>
  );
}
