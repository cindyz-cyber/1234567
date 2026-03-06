import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';
import NamingRitual from './NamingRitual';
import HomePage from './HomePage';
import EmotionScan from './EmotionScan';
import InnerWhisperJournal from './InnerWhisperJournal';
import HigherSelfDialogue from './HigherSelfDialogue';
import GoldenTransition from './GoldenTransition';
import BookOfAnswers from './BookOfAnswers';
import { playBackgroundMusicLoop } from '../utils/audioManager';

type JournalStep = 'naming' | 'home' | 'emotion' | 'journal' | 'dialogue' | 'transition' | 'answer' | 'card';

interface JournalState {
  userName: string;
  birthDate: Date | null;
  selectedEmotions: string[];
  journalContent: string;
  higherSelfMessage: string;
  kinData: any;
}

export default function ShareJournal() {
  const [currentStep, setCurrentStep] = useState<JournalStep>('naming');
  const [state, setState] = useState<JournalState>({
    userName: '',
    birthDate: null,
    selectedEmotions: [],
    journalContent: '',
    higherSelfMessage: '',
    kinData: null
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [backgroundMusic]);

  const updateState = (updates: Partial<JournalState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNamingComplete = (higherSelfName: string, userName: string) => {
    updateState({ userName, higherSelfMessage: higherSelfName });
    setCurrentStep('home');
  };

  const handleHomeStart = () => {
    setCurrentStep('emotion');
  };

  const handleEmotionComplete = (emotions: string[], bodyStates: string[]) => {
    updateState({ selectedEmotions: emotions });
    setCurrentStep('journal');
  };

  const handleJournalComplete = async (content: string) => {
    updateState({ journalContent: content });

    try {
      await supabase?.from('journal_entries')?.insert({
        journal_content: content,
        source: 'web_share',
        emotions: state.selectedEmotions,
        body_states: []
      });
    } catch (err) {
      console.warn('Database save failed (non-critical):', err);
    }

    setCurrentStep('transition');
  };

  const handleTransitionComplete = (transitionMusic: HTMLAudioElement | null) => {
    if (transitionMusic) {
      setBackgroundMusic(transitionMusic);
    }
    setCurrentStep('dialogue');
  };

  const handleDialogueComplete = (message: string, audio: HTMLAudioElement | null) => {
    updateState({ higherSelfMessage: message });
    setCurrentStep('answer');
  };

  const handleAnswerComplete = () => {
    setCurrentStep('card');
    generateEnergyCard();

    if (backgroundMusic) {
      setTimeout(() => {
        if (backgroundMusic) {
          backgroundMusic.volume = 0.5;
          const fadeOut = setInterval(() => {
            if (backgroundMusic && backgroundMusic.volume > 0.05) {
              backgroundMusic.volume = Math.max(0, backgroundMusic.volume - 0.05);
            } else {
              clearInterval(fadeOut);
              if (backgroundMusic) {
                backgroundMusic.pause();
              }
            }
          }, 200);
        }
      }, 2000);
    }
  };

  const generateEnergyCard = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (!cardRef.current) return;

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
        width: 750,
        height: 1334
      });

      const imageUrl = canvas.toDataURL('image/png', 1.0);
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
    } catch (err) {
      console.error('Card generation failed:', err);
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'naming':
        return (
          <NamingRitual
            onComplete={handleNamingComplete}
          />
        );

      case 'home':
        return (
          <HomePage
            userName={state.userName}
            higherSelfName={state.higherSelfMessage}
            onStartJourney={handleHomeStart}
          />
        );

      case 'emotion':
        return (
          <EmotionScan
            onNext={handleEmotionComplete}
          />
        );

      case 'journal':
        return (
          <InnerWhisperJournal
            emotions={state.selectedEmotions}
            onNext={handleJournalComplete}
          />
        );

      case 'dialogue':
        return (
          <HigherSelfDialogue
            userName={state.userName}
            higherSelfName={state.higherSelfMessage || '高我'}
            journalContent={state.journalContent}
            backgroundMusic={backgroundMusic}
            onComplete={handleDialogueComplete}
          />
        );

      case 'transition':
        return (
          <GoldenTransition
            userName={state.userName}
            higherSelfName={state.higherSelfMessage || '高我'}
            onComplete={handleTransitionComplete}
          />
        );

      case 'answer':
        return (
          <BookOfAnswers
            backgroundAudio={backgroundMusic}
            onComplete={handleAnswerComplete}
          />
        );

      case 'card':
        return (
          <div className="energy-card-display">
            {isGenerating && (
              <div className="generating-overlay">
                <div className="generating-spinner" />
                <p className="generating-text">正在生成你的专属能量卡...</p>
              </div>
            )}

            {generatedImage && (
              <div className="card-result">
                <div className="card-hint">
                  <span className="pulse-dot" />
                  <p className="hint-text">长按图片保存，分享到微信</p>
                </div>

                <img
                  src={generatedImage}
                  alt="专属能量卡"
                  className="energy-card-image"
                />

                <button
                  onClick={() => {
                    setCurrentStep('naming');
                    setState({
                      userName: '',
                      birthDate: null,
                      selectedEmotions: [],
                      journalContent: '',
                      higherSelfMessage: '',
                      kinData: null
                    });
                    setGeneratedImage(null);
                  }}
                  className="restart-button"
                >
                  开启新的觉察之旅
                </button>
              </div>
            )}

            <div
              ref={cardRef}
              className="energy-card-canvas"
              style={{
                position: 'fixed',
                top: '-9999px',
                left: '-9999px',
                width: '750px',
                height: '1334px',
                backgroundImage: 'url(/src/assets/0_0_640_N.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '80px 60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
              }}
            >
              <div>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '60px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
                  paddingBottom: '40px'
                }}>
                  <h1 style={{
                    fontSize: '56px',
                    color: '#FAFAFA',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    marginBottom: '20px',
                    textShadow: '0px 2px 6px rgba(0, 0, 0, 0.4), 0px 0px 20px rgba(255, 255, 255, 0.3)'
                  }}>
                    觉察时刻
                  </h1>
                  <p style={{
                    fontSize: '24px',
                    color: '#FAFAFA',
                    letterSpacing: '0.2em',
                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.35)'
                  }}>
                    {state.userName} 的内在之声
                  </p>
                </div>

                <div style={{
                  marginBottom: '50px',
                  padding: '40px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    color: '#2d5016',
                    marginBottom: '24px',
                    letterSpacing: '0.15em',
                    opacity: 0.9,
                    fontWeight: 500
                  }}>
                    我的觉察
                  </h3>
                  <p style={{
                    fontSize: '26px',
                    color: '#1a1a1a',
                    lineHeight: '1.8',
                    letterSpacing: '0.05em'
                  }}>
                    {state.journalContent.substring(0, 120)}
                    {state.journalContent.length > 120 ? '...' : ''}
                  </p>
                </div>

                <div style={{
                  padding: '40px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '24px',
                  border: '2px solid rgba(45, 80, 22, 0.3)',
                  boxShadow: '0 4px 24px rgba(45, 80, 22, 0.2)'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    color: '#2d5016',
                    marginBottom: '24px',
                    letterSpacing: '0.15em',
                    textAlign: 'center',
                    fontWeight: 500
                  }}>
                    高我的指引
                  </h3>
                  <p style={{
                    fontSize: '30px',
                    color: '#1a1a1a',
                    lineHeight: '1.9',
                    textAlign: 'center',
                    letterSpacing: '0.08em',
                    fontWeight: 400
                  }}>
                    {state.higherSelfMessage || '你的内在智慧正在被唤醒'}
                  </p>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                paddingTop: '40px',
                borderTop: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 30px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(45, 80, 22, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontSize: '48px',
                    color: '#2d5016'
                  }}>
                    ✨
                  </div>
                </div>
                <p style={{
                  fontSize: '32px',
                  color: '#FAFAFA',
                  letterSpacing: '0.25em',
                  fontWeight: 300,
                  marginBottom: '12px',
                  textShadow: '0px 2px 6px rgba(0, 0, 0, 0.4)'
                }}>
                  植本逻辑
                </p>
                <p style={{
                  fontSize: '20px',
                  color: '#FAFAFA',
                  letterSpacing: '0.2em',
                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.35)'
                }}>
                  觉察 · 疗愈 · 成长
                </p>
              </div>
            </div>

            <style>{`
              .energy-card-display {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
              }

              .generating-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
              }

              .generating-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(247, 231, 206, 0.2);
                border-top-color: #F7E7CE;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 24px;
              }

              @keyframes spin {
                to { transform: rotate(360deg); }
              }

              .generating-text {
                font-size: 18px;
                color: #F7E7CE;
                letter-spacing: 0.15em;
              }

              .card-result {
                width: 100%;
                max-width: 500px;
                text-align: center;
              }

              .card-hint {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin-bottom: 24px;
                padding: 16px 24px;
                background: rgba(247, 231, 206, 0.1);
                border: 1px solid rgba(247, 231, 206, 0.3);
                border-radius: 12px;
              }

              .pulse-dot {
                width: 10px;
                height: 10px;
                background: #EBC862;
                border-radius: 50%;
                animation: pulse 2s ease-in-out infinite;
              }

              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.2); }
              }

              .hint-text {
                font-size: 16px;
                color: #F7E7CE;
                letter-spacing: 0.15em;
              }

              .energy-card-image {
                width: 100%;
                max-width: 375px;
                height: auto;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                margin-bottom: 32px;
              }

              .restart-button {
                padding: 16px 40px;
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.15) 0%, rgba(235, 200, 98, 0.15) 100%);
                border: 1px solid rgba(247, 231, 206, 0.3);
                border-radius: 12px;
                color: #F7E7CE;
                font-size: 16px;
                letter-spacing: 0.2em;
                cursor: pointer;
                transition: all 0.3s ease;
              }

              .restart-button:hover {
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.25) 0%, rgba(235, 200, 98, 0.25) 100%);
                box-shadow: 0 4px 20px rgba(247, 231, 206, 0.3);
                transform: translateY(-2px);
              }
            `}</style>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="share-journal-flow">
      {renderStep()}

      <style>{`
        .share-journal-flow {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }
      `}</style>
    </div>
  );
}
