import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface EmotionScanProps {
  onNext: (emotions: string[], bodyStates: string[]) => void;
  onBack?: () => void;
}

const EMOTIONS = [
  { label: '喜悦', hue: 45, angle: 0 },
  { label: '平和', hue: 120, angle: 45 },
  { label: '焦虑', hue: 210, angle: 90 },
  { label: '迷茫', hue: 270, angle: 135 },
  { label: '愤怒', hue: 0, angle: 180 },
  { label: '悲伤', hue: 200, angle: 225 },
  { label: '丰盛', hue: 50, angle: 270 },
  { label: '其他', hue: 180, angle: 315 },
];

const BODY_STATES = [
  { label: '紧绷', angle: 0 },
  { label: '松弛', angle: 60 },
  { label: '温热', angle: 120 },
  { label: '空洞', angle: 180 },
  { label: '沉重', angle: 240 },
  { label: '其他', angle: 300 },
];

const getCircularPosition = (angle: number, radius: number, radiusVariation: number, index: number) => {
  const rad = (angle * Math.PI) / 180;
  const seed = index * 0.123;
  const actualRadius = radius + (Math.sin(seed * 100) * radiusVariation);
  return {
    x: 50 + actualRadius * Math.cos(rad),
    y: 50 + actualRadius * Math.sin(rad),
  };
};

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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [poppedBubbles, setPoppedBubbles] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundDarkness, setBackgroundDarkness] = useState(0.25);

  const emotionPositions = useMemo(() =>
    EMOTIONS.map((emotion, index) => ({
      ...emotion,
      position: getCircularPosition(emotion.angle, 28, 4, index)
    })),
    []
  );

  const bodyPositions = useMemo(() =>
    BODY_STATES.map((state, index) => ({
      ...state,
      position: getCircularPosition(state.angle, 22, 3, index)
    })),
    []
  );

  const hasAnySelection = selectedEmotions.length > 0 || selectedBodyStates.length > 0;

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => p.life > 0).map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.2,
        vx: p.vx * 0.98,
        life: p.life - 0.016,
      })));
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  const createParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 2;
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const toggleEmotion = (emotion: string, hue: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (emotion === '其他') {
      setShowEmotionInput(true);
      return;
    }

    const isSelected = selectedEmotions.includes(emotion);

    if (isSelected) {
      setSelectedEmotions(prev => prev.filter(e => e !== emotion));
      setPoppedBubbles(prev => {
        const next = new Set(prev);
        next.delete(emotion);
        return next;
      });
      setActiveHue(0);
    } else {
      triggerHaptic();
      createParticles(x, y);
      setPoppedBubbles(prev => new Set([...prev, emotion]));

      setTimeout(() => {
        setSelectedEmotions(prev => [...prev, emotion]);
        setActiveHue(hue);
      }, 150);
    }
  };

  const toggleBodyState = (state: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (state === '其他') {
      setShowBodyStateInput(true);
      return;
    }

    const isSelected = selectedBodyStates.includes(state);

    if (isSelected) {
      setSelectedBodyStates(prev => prev.filter(s => s !== state));
      setPoppedBubbles(prev => {
        const next = new Set(prev);
        next.delete(state);
        return next;
      });
    } else {
      triggerHaptic();
      createParticles(x, y);
      setPoppedBubbles(prev => new Set([...prev, state]));

      setTimeout(() => {
        setSelectedBodyStates(prev => [...prev, state]);
      }, 150);
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
    if (selectedEmotions.length > 0 && selectedBodyStates.length > 0) {
      setIsTransitioning(true);

      const darknessInterval = setInterval(() => {
        setBackgroundDarkness(prev => {
          if (prev >= 0.6) {
            clearInterval(darknessInterval);
            return 0.6;
          }
          return prev + 0.015;
        });
      }, 30);

      setTimeout(() => {
        setStep('writing');
        setIsTransitioning(false);
      }, 1200);
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

  const titleText = selectedBodyStates.length > 0 ? '身体的反馈是？' : '此刻，你的情绪是？';

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade relative">
      <div className="forest-background-layer" />
      <div className="background-overlay" style={{ opacity: backgroundDarkness }} />

      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life,
            transform: `translate(-50%, -50%) scale(${particle.life})`,
          }}
        />
      ))}

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
        <div className="flex-1 flex flex-col justify-center items-center max-w-6xl mx-auto w-full relative" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
          <div className="mb-16 text-center transition-all duration-500">
            <p className="text-sm title-text" style={{
              color: '#FFFFFF',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.8)',
              position: 'relative',
              zIndex: 100
            }}>
              {titleText}
            </p>
          </div>

          <div className="mandala-container relative w-full" style={{ height: '400px', marginBottom: '80px' }}>
            {emotionPositions.map((emotion, index) => (
              <button
                key={emotion.label}
                onClick={(e) => toggleEmotion(emotion.label, emotion.hue, e)}
                className={`glass-bubble emotion-bubble mandala-bubble ${poppedBubbles.has(emotion.label) ? 'popping' : ''} ${selectedEmotions.includes(emotion.label) ? 'selected' : ''} ${hasAnySelection && !selectedEmotions.includes(emotion.label) && !poppedBubbles.has(emotion.label) ? 'dimmed' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${emotion.position.x}%`,
                  top: `${emotion.position.y}%`,
                  transform: 'translate(-50%, -50%)',
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

          <div className="mandala-container relative w-full" style={{ height: '350px', marginBottom: '50px' }}>
            {bodyPositions.map((state, index) => (
              <button
                key={state.label}
                onClick={(e) => toggleBodyState(state.label, e)}
                className={`glass-bubble body-bubble mandala-bubble ${poppedBubbles.has(state.label) ? 'popping' : ''} ${selectedBodyStates.includes(state.label) ? 'selected' : ''} ${hasAnySelection && !selectedBodyStates.includes(state.label) && !poppedBubbles.has(state.label) ? 'dimmed' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${state.position.x}%`,
                  top: `${state.position.y}%`,
                  transform: 'translate(-50%, -50%)',
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
              className="w-full golden-breath"
            >
              继续
            </GoldButton>
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full ${isTransitioning ? 'transitioning' : 'active'}`}>
          <div className="w-full mb-8 relative">
            <div className={`consciousness-line ${step === 'writing' && !isTransitioning ? 'line-grow' : ''}`} />
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
        .particle {
          position: fixed;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247, 231, 206, 1) 0%, rgba(235, 200, 98, 0.9) 40%, transparent 100%);
          pointer-events: none;
          z-index: 1000;
          box-shadow: 0 0 6px rgba(247, 231, 206, 0.9), 0 0 10px rgba(235, 200, 98, 0.7);
          will-change: transform, opacity;
        }

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
          z-index: 1;
          pointer-events: none;
          animation: cameraBreath 20s ease-in-out infinite;
          will-change: transform;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.25);
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes cameraBreath {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          33% {
            transform: scale(1.05) translate(-1%, -0.5%);
          }
          66% {
            transform: scale(1.03) translate(0.5%, 1%);
          }
        }

        .mandala-container {
          position: relative;
          z-index: 10;
        }

        .glass-bubble {
          background: transparent;
          backdrop-filter: none;
          border: 0.5px solid rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          box-shadow:
            0 0 20px rgba(255, 255, 255, 0.5),
            0 0 40px rgba(247, 231, 206, 0.2),
            inset 0 0 10px rgba(255, 255, 255, 0.3);
          position: absolute;
          overflow: hidden;
          flex-shrink: 0;
          border-radius: 48% 52% 53% 47% / 51% 49% 51% 49%;
          animation: liquidMorph 6s ease-in-out infinite;
          will-change: transform, opacity, border-radius;
        }

        @keyframes liquidMorph {
          0%, 100% {
            border-radius: 48% 52% 53% 47% / 51% 49% 51% 49%;
          }
          25% {
            border-radius: 52% 48% 47% 53% / 49% 51% 49% 51%;
          }
          50% {
            border-radius: 47% 53% 52% 48% / 53% 47% 53% 47%;
          }
          75% {
            border-radius: 53% 47% 48% 52% / 47% 53% 47% 53%;
          }
        }

        .emotion-bubble {
          width: 75px;
          height: 75px;
        }

        .body-bubble {
          width: 60px;
          height: 60px;
        }

        .mandala-bubble {
          animation: bubbleFloat 1.2s ease-out forwards;
        }

        .mandala-bubble:nth-child(1) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat1 6s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(2) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat2 6.5s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(3) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat3 7s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(4) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat1 6.8s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(5) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat2 6.2s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(6) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat3 6.6s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(7) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat1 7.2s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(8) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat2 6.4s ease-in-out infinite;
        }

        @keyframes waveFloat1 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-5px);
          }
        }

        @keyframes waveFloat2 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-4px);
          }
        }

        @keyframes waveFloat3 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-6px);
          }
        }

        .glass-bubble.dimmed {
          opacity: 0.2 !important;
          transform: translate(-50%, -50%) scale(0.95) !important;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }


        .glass-bubble::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 60%);
          pointer-events: none;
          z-index: 1;
          animation: specularFlow 4s ease-in-out infinite;
        }

        @keyframes specularFlow {
          0%, 100% {
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 60%);
          }
          50% {
            background: radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.5), transparent 65%);
          }
        }

        .glass-bubble.popping {
          animation: popExpand 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
          pointer-events: none;
        }

        @keyframes popExpand {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          40% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
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
          transform: translate(-50%, -50%) scale(1.15) !important;
          animation: bubbleFloat 1.2s ease-out forwards, selectedTremor 0.15s ease-in-out infinite, selectedGlow 2.5s ease-in-out infinite !important;
        }

        .glass-bubble.selected::before {
          transform: scale(1.15);
        }

        .glass-bubble.selected .golden-halo {
          border-color: rgba(247, 231, 206, 0.85);
          opacity: 1;
          box-shadow:
            0 0 30px rgba(247, 231, 206, 0.75),
            0 0 55px rgba(247, 231, 206, 0.45);
          animation: haloBreath 4s ease-in-out infinite, haloTremor 0.15s ease-in-out infinite;
        }

        @keyframes selectedTremor {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(247, 231, 206, 0.6),
              0 0 40px rgba(247, 231, 206, 0.4),
              0 0 60px rgba(235, 200, 98, 0.25),
              inset 0 0 30px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 0 24px rgba(247, 231, 206, 0.65),
              0 0 45px rgba(247, 231, 206, 0.45),
              0 0 65px rgba(235, 200, 98, 0.3),
              inset 0 0 35px rgba(255, 255, 255, 0.22);
          }
        }

        @keyframes haloTremor {
          0%, 100% {
            box-shadow:
              0 0 30px rgba(247, 231, 206, 0.75),
              0 0 55px rgba(247, 231, 206, 0.45);
          }
          50% {
            box-shadow:
              0 0 35px rgba(247, 231, 206, 0.8),
              0 0 60px rgba(247, 231, 206, 0.5);
          }
        }

        .bubble-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #FFFFFF;
          text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.5),
            0 1px 2px rgba(0, 0, 0, 0.8);
          position: relative;
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease, text-shadow 0.3s ease;
          filter: none !important;
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

        .golden-breath {
          animation: goldenBreathPulse 2s ease-in-out infinite;
        }

        @keyframes goldenBreathPulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(247, 231, 206, 0.5),
              0 0 40px rgba(247, 231, 206, 0.3),
              0 0 60px rgba(235, 200, 98, 0.2);
          }
          50% {
            box-shadow:
              0 0 30px rgba(247, 231, 206, 0.7),
              0 0 60px rgba(247, 231, 206, 0.5),
              0 0 90px rgba(235, 200, 98, 0.3);
          }
        }

        .consciousness-line {
          position: absolute;
          left: 50%;
          right: 50%;
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
          transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, right 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .consciousness-line.line-grow {
          left: 0;
          right: 0;
        }

        .transitioning {
          opacity: 0;
          pointer-events: none;
        }

        .active {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
            transform: translate(-50%, -50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
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

        .title-text {
          position: relative;
          z-index: 100;
        }

        .continue-button-wrapper {
          position: relative;
          z-index: 100;
        }
      `}</style>
    </div>
  );
}
