import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';
import PortalBackground from './PortalBackground';
import VideoBackground from './VideoBackground';
import posterImage from '../assets/0_1_640_N.webp';

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

  useEffect(() => {
    console.log('🎭 EmotionScan mounted');
    return () => console.log('🎭 EmotionScan unmounted');
  }, []);

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

  const handleContinue = () => {
    if (selectedEmotions.length > 0 && selectedBodyStates.length > 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        onNext(selectedEmotions, selectedBodyStates);
      }, 800);
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

  const handleUserInteraction = () => {
    // iOS需要用户交互才能播放音频/视频
  };

  console.log('🎨 EmotionScan rendering, step:', step);

  return (
    <>
      <VideoBackground />
      <PortalBackground
        videoSrc="https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/qg5emh46ebi-1772600045215.mp4"
        posterImg={posterImage}
        overlayGradient={`rgba(0, 0, 0, ${backgroundDarkness})`}
      />

      <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade relative" style={{ position: 'relative', zIndex: 1 }}>

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
                onTouchStart={handleUserInteraction}
                className={`glass-bubble emotion-bubble mandala-bubble ${emotion.label === '其他' ? 'other-bubble' : ''} ${poppedBubbles.has(emotion.label) ? 'popping' : ''} ${selectedEmotions.includes(emotion.label) ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${emotion.position.x}%`,
                  top: `${emotion.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.1}s`,
                  backgroundColor: 'transparent'
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`golden-particle-inner ${emotion.label === '其他' ? 'silver-particle' : ''}`}
                    style={{
                      animationDelay: `${i * 1.3}s`,
                      animationDuration: `${7 + (i % 3)}s`,
                    }}
                  />
                ))}
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
                onTouchStart={handleUserInteraction}
                className={`glass-bubble body-bubble mandala-bubble ${state.label === '其他' ? 'other-bubble' : ''} ${poppedBubbles.has(state.label) ? 'popping' : ''} ${selectedBodyStates.includes(state.label) ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${state.position.x}%`,
                  top: `${state.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${(index + EMOTIONS.length) * 0.1}s`,
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`golden-particle-inner ${state.label === '其他' ? 'silver-particle' : ''}`}
                    style={{
                      animationDelay: `${i * 1.5}s`,
                      animationDuration: `${6.5 + (i % 3)}s`,
                    }}
                  />
                ))}
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
              onClick={handleContinue}
              disabled={selectedEmotions.length === 0 || selectedBodyStates.length === 0 || isSubmitting}
              className="w-full golden-breath"
            >
              {isSubmitting ? '正在继续...' : '继续'}
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
          background: radial-gradient(circle at center, #001a0d 0%, #000000 100%);
          z-index: 1;
          pointer-events: none;
          -webkit-overflow-scrolling: touch;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          will-change: transform;
        }

        .forest-background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: contrast(1.15) brightness(0.95) saturate(1.05);
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          animation: cameraBreath 20s ease-in-out infinite;
          will-change: transform;
          background-color: transparent !important;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          opacity: 0;
          transition: opacity 0.8s ease-in;
        }

        .forest-background-video[data-loaded="true"] {
          opacity: 1;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0);
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
          border-radius: 50%;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.98) 10%,
              rgba(255, 245, 200, 0.5) 18%,
              rgba(255, 225, 120, 0.35) 35%,
              rgba(250, 210, 100, 0.2) 55%,
              rgba(240, 195, 80, 0.1) 75%,
              transparent 100%
            ) !important;
          backdrop-filter: blur(0.5px);
          background-color: rgba(0,0,0,0) !important;
          border: 2px solid rgba(255, 230, 120, 0.6);
          animation: crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          box-shadow:
            0 0 15px rgba(255, 240, 150, 0.5),
            0 0 30px rgba(255, 220, 100, 0.3),
            0 0 45px rgba(255, 200, 80, 0.15),
            inset 0 0 30px rgba(255, 245, 200, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.4);
          transition: all 0.5s ease;
          overflow: visible;
          will-change: transform, opacity;
        }

        .glass-bubble::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            transparent 55%,
            rgba(255, 230, 120, 0.15) 65%,
            rgba(255, 215, 100, 0.25) 75%,
            rgba(255, 200, 85, 0.2) 85%,
            rgba(255, 185, 70, 0.12) 92%,
            transparent 100%
          );
          animation: innerGlow 4s ease-in-out infinite;
        }

        .glass-bubble::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 1);
          box-shadow:
            0 0 10px rgba(255, 235, 140, 1),
            0 0 20px rgba(255, 215, 100, 0.7),
            0 0 30px rgba(255, 195, 80, 0.4);
          animation: particleFloat 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
        }

        @keyframes particleFloat {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          25% {
            transform: translate(-50%, -50%) translate(20px, -15px);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) translate(-18px, 22px);
            opacity: 0.7;
          }
          75% {
            transform: translate(-50%, -50%) translate(25px, 18px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) translate(-20px, -20px);
            opacity: 0;
          }
        }

        @keyframes crystalBreathe {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow:
              0 0 15px rgba(255, 240, 150, 0.5),
              0 0 30px rgba(255, 220, 100, 0.3),
              0 0 45px rgba(255, 200, 80, 0.15),
              inset 0 0 30px rgba(255, 245, 200, 0.3),
              inset 0 0 15px rgba(255, 255, 255, 0.4);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            box-shadow:
              0 0 20px rgba(255, 245, 180, 0.6),
              0 0 40px rgba(255, 230, 120, 0.4),
              0 0 60px rgba(255, 210, 95, 0.2),
              inset 0 0 35px rgba(255, 250, 220, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes energyPulse {
          0%, 100% {
            filter: brightness(1.05);
          }
          50% {
            filter: brightness(1.3);
          }
        }

        @keyframes innerGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .emotion-bubble {
          width: 100px;
          height: 100px;
        }

        .body-bubble {
          width: 80px;
          height: 80px;
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
          opacity: 0.3 !important;
          transform: translate(-50%, -50%) scale(0.9) !important;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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

        .glass-bubble:hover {
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow:
            0 0 20px rgba(255, 245, 180, 0.7),
            0 0 35px rgba(255, 225, 110, 0.4),
            0 0 50px rgba(255, 205, 90, 0.2),
            inset 0 0 35px rgba(255, 250, 220, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.5);
          border-color: rgba(255, 235, 130, 0.8);
        }

        .glass-bubble.selected {
          transform: translate(-50%, -50%) scale(1.12) !important;
          animation: bubbleFloat 1.2s ease-out forwards, crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite, selectedPulse 1s ease-in-out infinite !important;
        }

        @keyframes selectedPulse {
          0%, 100% {
            box-shadow:
              0 0 18px rgba(255, 245, 180, 0.6),
              0 0 35px rgba(255, 230, 120, 0.4),
              0 0 55px rgba(255, 210, 95, 0.25),
              inset 0 0 35px rgba(255, 250, 220, 0.4),
              inset 0 0 18px rgba(255, 255, 255, 0.5);
          }
          50% {
            box-shadow:
              0 0 25px rgba(255, 245, 180, 0.7),
              0 0 45px rgba(255, 230, 120, 0.5),
              0 0 70px rgba(255, 210, 95, 0.3),
              inset 0 0 40px rgba(255, 250, 220, 0.45),
              inset 0 0 22px rgba(255, 255, 255, 0.55);
          }
        }

        .bubble-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: #1a1a1a;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          position: relative;
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: none !important;
        }

        .emotion-bubble .bubble-content {
          font-size: 14px;
        }

        .body-bubble .bubble-content {
          font-size: 12px;
          font-weight: 400;
        }

        .golden-particle-inner {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 0.9);
          box-shadow:
            0 0 8px rgba(255, 235, 140, 0.8),
            0 0 15px rgba(255, 215, 100, 0.5);
          animation: particleFloatInner 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
          pointer-events: none;
        }

        @keyframes particleFloatInner {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          25% {
            transform: translate(-50%, -50%) translate(18px, -12px);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) translate(-15px, 20px);
            opacity: 0.6;
          }
          75% {
            transform: translate(-50%, -50%) translate(22px, 15px);
            opacity: 0.4;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translate(-50%, -50%) translate(-18px, -18px);
            opacity: 0;
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

        .other-bubble .golden-particle-inner,
        .silver-particle {
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(230, 245, 255, 0.7) 30%,
            rgba(200, 220, 240, 0.5) 60%,
            transparent 100%
          ) !important;
          box-shadow:
            0 0 8px rgba(200, 220, 255, 0.6),
            0 0 15px rgba(180, 200, 230, 0.4),
            0 0 25px rgba(160, 180, 210, 0.2) !important;
        }

        .other-bubble {
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(250, 252, 255, 0.98) 10%,
              rgba(230, 240, 250, 0.5) 18%,
              rgba(210, 230, 245, 0.35) 35%,
              rgba(190, 215, 235, 0.2) 55%,
              rgba(170, 200, 225, 0.1) 75%,
              transparent 100%
            ) !important;
          border: 2px solid rgba(200, 220, 255, 0.6) !important;
          box-shadow:
            0 0 15px rgba(220, 235, 255, 0.5),
            0 0 30px rgba(200, 220, 240, 0.3),
            0 0 45px rgba(180, 205, 225, 0.15),
            inset 0 0 30px rgba(240, 248, 255, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.4) !important;
        }

        .other-bubble::before {
          background: radial-gradient(
            circle at center,
            transparent 55%,
            rgba(210, 230, 255, 0.15) 65%,
            rgba(190, 215, 240, 0.25) 75%,
            rgba(170, 200, 225, 0.2) 85%,
            rgba(150, 185, 210, 0.12) 92%,
            transparent 100%
          ) !important;
        }

        .other-bubble::after {
          background: rgba(240, 248, 255, 1) !important;
          box-shadow:
            0 0 10px rgba(220, 235, 255, 1),
            0 0 20px rgba(200, 220, 240, 0.7),
            0 0 30px rgba(180, 205, 225, 0.4) !important;
        }

        .other-bubble:hover {
          box-shadow:
            0 0 20px rgba(225, 240, 255, 0.7),
            0 0 35px rgba(205, 225, 245, 0.4),
            0 0 50px rgba(185, 210, 235, 0.2),
            inset 0 0 35px rgba(245, 250, 255, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.5) !important;
          border-color: rgba(210, 230, 255, 0.8) !important;
        }

        .other-bubble.selected {
          box-shadow:
            0 0 25px rgba(230, 245, 255, 0.9),
            0 0 45px rgba(210, 230, 250, 0.6),
            0 0 65px rgba(190, 215, 240, 0.3),
            inset 0 0 40px rgba(245, 250, 255, 0.5),
            inset 0 0 25px rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>
      </div>
    </>
  );
}
