import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';
import NamingRitual from './NamingRitual';
import HomePage from './HomePage';
import EmotionScan from './EmotionScan';
import InnerWhisperJournal from './InnerWhisperJournal';
import HigherSelfDialogue from './HigherSelfDialogue';
import BookOfAnswers from './BookOfAnswers';

type JournalStep = 'naming' | 'home' | 'emotion' | 'journal' | 'dialogue' | 'answer' | 'card';

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
  const cardRef = useRef<HTMLDivElement>(null);

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

    setCurrentStep('dialogue');
  };

  const handleDialogueComplete = (message: string, audio: HTMLAudioElement | null) => {
    updateState({ higherSelfMessage: message });
    setCurrentStep('answer');
  };

  const handleAnswerComplete = () => {
    setCurrentStep('card');
    generateEnergyCard();
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
            onNext={(content) => {
              if (content) {
                updateState({ journalContent: content });
              }
              setCurrentStep('dialogue');
            }}
          />
        );

      case 'dialogue':
        return (
          <HigherSelfDialogue
            userName={state.userName}
            higherSelfName={state.higherSelfMessage || '高我'}
            journalContent={state.journalContent}
            onComplete={handleDialogueComplete}
          />
        );

      case 'answer':
        return (
          <BookOfAnswers
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
                background: 'linear-gradient(180deg, #0a0e27 0%, #1a1a2e 50%, #0a0e27 100%)',
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
                  borderBottom: '1px solid rgba(247, 231, 206, 0.2)',
                  paddingBottom: '40px'
                }}>
                  <h1 style={{
                    fontSize: '56px',
                    color: '#F7E7CE',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    marginBottom: '20px',
                    textShadow: '0 0 30px rgba(247, 231, 206, 0.5)'
                  }}>
                    觉察时刻
                  </h1>
                  <p style={{
                    fontSize: '24px',
                    color: 'rgba(235, 200, 98, 0.8)',
                    letterSpacing: '0.2em'
                  }}>
                    {state.userName} 的内在之声
                  </p>
                </div>

                <div style={{
                  marginBottom: '50px',
                  padding: '40px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    color: '#EBC862',
                    marginBottom: '24px',
                    letterSpacing: '0.15em',
                    opacity: 0.9
                  }}>
                    我的觉察
                  </h3>
                  <p style={{
                    fontSize: '26px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: '1.8',
                    letterSpacing: '0.05em'
                  }}>
                    {state.journalContent.substring(0, 120)}
                    {state.journalContent.length > 120 ? '...' : ''}
                  </p>
                </div>

                <div style={{
                  padding: '40px',
                  background: 'linear-gradient(135deg, rgba(235, 200, 98, 0.1) 0%, rgba(247, 231, 206, 0.1) 100%)',
                  borderRadius: '24px',
                  border: '1px solid rgba(235, 200, 98, 0.3)',
                  boxShadow: '0 0 40px rgba(235, 200, 98, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    color: '#F7E7CE',
                    marginBottom: '24px',
                    letterSpacing: '0.15em',
                    textAlign: 'center'
                  }}>
                    高我的指引
                  </h3>
                  <p style={{
                    fontSize: '30px',
                    color: '#EBC862',
                    lineHeight: '1.9',
                    textAlign: 'center',
                    letterSpacing: '0.08em',
                    textShadow: '0 0 20px rgba(235, 200, 98, 0.3)'
                  }}>
                    {state.higherSelfMessage || '你的内在智慧正在被唤醒'}
                  </p>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                paddingTop: '40px',
                borderTop: '1px solid rgba(247, 231, 206, 0.15)'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 30px',
                  background: 'radial-gradient(circle, rgba(247, 231, 206, 0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(247, 231, 206, 0.3)'
                }}>
                  <div style={{
                    fontSize: '48px',
                    color: '#F7E7CE'
                  }}>
                    ✨
                  </div>
                </div>
                <p style={{
                  fontSize: '32px',
                  color: '#F7E7CE',
                  letterSpacing: '0.25em',
                  fontWeight: 300,
                  marginBottom: '12px'
                }}>
                  植本逻辑
                </p>
                <p style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.2em'
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
