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
import DynamicStepBackground from './DynamicStepBackground';
import { playBackgroundMusicLoop } from '../utils/audioManager';
import { shareBackgroundPreloader } from '../utils/shareBackgroundPreloader';

type JournalStep = 'blocked' | 'naming' | 'home' | 'emotion' | 'journal' | 'dialogue' | 'transition' | 'answer' | 'card';

interface H5ShareConfig {
  is_active: boolean;
  daily_token: string;
  bg_video_url: string;
  bg_music_url: string;
  card_bg_image_url: string;
  bg_naming_url: string;
  bg_emotion_url: string;
  bg_journal_url: string;
  bg_transition_url: string;
  bg_answer_book_url: string;
  card_inner_bg_url: string;
}

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
  const [config, setConfig] = useState<H5ShareConfig | null>(null);
  const [isValidating, setIsValidating] = useState(true);
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
    validateAccess();
  }, []);

  useEffect(() => {
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [backgroundMusic]);

  const validateAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('h5_share_config')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .maybeSingle();

      if (error) {
        console.error('❌ Config fetch error:', error);
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      if (!data) {
        console.warn('⚠️ No config found in database');
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      console.log('✅ Current Config from DB:', data);
      console.log('🎵 Background Music URL:', data.bg_music_url);
      console.log('🎬 Background Video URL:', data.bg_video_url);
      console.log('🖼️ Card Inner BG URL:', data.card_inner_bg_url);

      setConfig(data);

      if (!data.is_active) {
        console.warn('⚠️ H5 page is disabled');
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const pathSegments = window.location.pathname.split('/').filter(s => s);
      const queryToken = urlParams.get('token');
      const pathToken = pathSegments[pathSegments.length - 1];
      const urlToken = queryToken || (pathToken !== 'journal' ? pathToken : null);

      console.log('🔑 Token from URL:', urlToken);
      console.log('🔑 Required token:', data.daily_token);

      if (!urlToken || urlToken !== data.daily_token) {
        console.warn('⚠️ Token validation failed');
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      console.log('✅ Token validated successfully');
      await shareBackgroundPreloader.preloadAllAssets(data);

      setIsValidating(false);
    } catch (error) {
      console.error('❌ Validation error:', error);
      setCurrentStep('blocked');
      setIsValidating(false);
    }
  };

  const updateState = (updates: Partial<JournalState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNamingComplete = (higherSelfName: string, userName: string) => {
    updateState({ userName, higherSelfMessage: higherSelfName });
    setCurrentStep('home');
  };

  const handleHomeStart = async () => {
    console.log('🎯 User started journey from home page');
    if (config?.bg_music_url) {
      console.log('🎵 Background music will start at GoldenTransition:', config.bg_music_url);
    }
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
      console.log('✅ Background music received from GoldenTransition, continuing playback');
      console.log('🎵 Music playing:', !transitionMusic.paused);
      console.log('🎵 Music volume:', transitionMusic.volume);
      console.log('🎵 Music source:', transitionMusic.src);
      setBackgroundMusic(transitionMusic);
    } else {
      console.warn('⚠️ No background music from GoldenTransition');
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
    console.log('🎴 开始生成能量卡片...');
    console.log('🖼️ 卡片背景图 URL:', config?.card_inner_bg_url);

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (!cardRef.current) {
        console.error('❌ cardRef.current 不存在');
        return;
      }

      console.log('📸 准备捕获卡片 DOM...');
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: true,
        width: 750,
        height: 1334
      });

      console.log('✅ 卡片生成成功');
      const imageUrl = canvas.toDataURL('image/png', 1.0);
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
    } catch (err) {
      console.error('❌ 卡片生成失败:', err);
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    if (isValidating) {
      return (
        <div className="validation-screen">
          <div className="validation-spinner" />
          <p className="validation-text">验证访问权限...</p>
        </div>
      );
    }

    if (currentStep === 'blocked') {
      return (
        <div className="blocked-screen">
          <div className="zen-container">
            <div className="zen-icon">🌿</div>
            <h1 className="zen-title">链接已随时间流转而失效</h1>
            <p className="zen-message">
              请关注"植本逻辑"<br />
              获取最新能量场入口
            </p>
            <div className="zen-footer">
              <div className="zen-sparkle">✨</div>
              <p className="zen-brand">植本逻辑</p>
              <p className="zen-tagline">觉察 · 疗愈 · 成长</p>
            </div>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 'naming':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_naming_url}
            fallbackUrl={config?.bg_video_url}
          >
            <NamingRitual
              onComplete={handleNamingComplete}
            />
          </DynamicStepBackground>
        );

      case 'home':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_video_url}
          >
            <HomePage
              userName={state.userName}
              higherSelfName={state.higherSelfMessage}
              onStartJourney={handleHomeStart}
            />
          </DynamicStepBackground>
        );

      case 'emotion':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_emotion_url}
            fallbackUrl={config?.bg_video_url}
          >
            <EmotionScan
              onNext={handleEmotionComplete}
            />
          </DynamicStepBackground>
        );

      case 'journal':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_journal_url}
            fallbackUrl={config?.bg_video_url}
          >
            <InnerWhisperJournal
              emotions={state.selectedEmotions}
              onNext={handleJournalComplete}
            />
          </DynamicStepBackground>
        );

      case 'dialogue':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_video_url}
          >
            <HigherSelfDialogue
              userName={state.userName}
              higherSelfName={state.higherSelfMessage || '高我'}
              journalContent={state.journalContent}
              backgroundMusic={backgroundMusic}
              onComplete={handleDialogueComplete}
            />
          </DynamicStepBackground>
        );

      case 'transition':
        return (
          <GoldenTransition
            userName={state.userName}
            higherSelfName={state.higherSelfMessage || '高我'}
            onComplete={handleTransitionComplete}
            backgroundMusicUrl={config?.bg_music_url}
            backgroundVideoUrl={config?.bg_transition_url || config?.bg_video_url}
          />
        );

      case 'answer':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_answer_book_url}
            fallbackUrl={config?.bg_video_url}
          >
            <BookOfAnswers
              backgroundAudio={backgroundMusic}
              onComplete={handleAnswerComplete}
            />
          </DynamicStepBackground>
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
              <>
                <div className="fullscreen-card-overlay">
                  <div className="fullscreen-hint">
                    <span className="pulse-dot-large" />
                    <p className="fullscreen-hint-text">✨ 能量卡已生成，长按图片发送给朋友</p>
                  </div>

                  <img
                    src={generatedImage}
                    alt="专属能量卡"
                    className="fullscreen-card-image"
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'default'
                    }}
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
                    className="fullscreen-restart-button"
                  >
                    开启新的觉察之旅
                  </button>
                </div>
              </>
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
                backgroundImage: `url(${config?.card_inner_bg_url || config?.card_bg_image_url || '/0_0_640_N.webp'})`,
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
                background: rgba(0, 0, 0, 0.95);
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

              /* 全屏覆盖层样式 */
              .fullscreen-card-overlay {
                position: fixed;
                inset: 0;
                z-index: 10000;
                background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                overflow-y: auto;
              }

              .fullscreen-hint {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin-bottom: 24px;
                padding: 20px 32px;
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.15) 0%, rgba(235, 200, 98, 0.15) 100%);
                border: 1px solid rgba(247, 231, 206, 0.4);
                border-radius: 16px;
                backdrop-filter: blur(20px);
                animation: fadeInDown 0.6s ease-out;
              }

              @keyframes fadeInDown {
                from {
                  opacity: 0;
                  transform: translateY(-30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .pulse-dot-large {
                width: 14px;
                height: 14px;
                background: #EBC862;
                border-radius: 50%;
                animation: pulseLarge 2s ease-in-out infinite;
                box-shadow: 0 0 20px rgba(235, 200, 98, 0.6);
              }

              @keyframes pulseLarge {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                  box-shadow: 0 0 20px rgba(235, 200, 98, 0.6);
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.3);
                  box-shadow: 0 0 30px rgba(235, 200, 98, 0.8);
                }
              }

              .fullscreen-hint-text {
                font-size: 17px;
                color: #F7E7CE;
                letter-spacing: 0.15em;
                font-weight: 400;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
              }

              .fullscreen-card-image {
                width: 100%;
                max-width: 420px;
                height: auto;
                border-radius: 20px;
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
                margin-bottom: 40px;
                animation: scaleIn 0.8s ease-out 0.3s both;
                cursor: pointer;
                -webkit-user-select: none;
                user-select: none;
                -webkit-touch-callout: default;
              }

              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              .fullscreen-restart-button {
                padding: 18px 48px;
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.2) 0%, rgba(235, 200, 98, 0.2) 100%);
                border: 1.5px solid rgba(247, 231, 206, 0.4);
                border-radius: 14px;
                color: #F7E7CE;
                font-size: 17px;
                letter-spacing: 0.25em;
                cursor: pointer;
                transition: all 0.4s ease;
                backdrop-filter: blur(20px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                animation: fadeInUp 0.8s ease-out 0.6s both;
              }

              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .fullscreen-restart-button:hover {
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.3) 0%, rgba(235, 200, 98, 0.3) 100%);
                border-color: rgba(247, 231, 206, 0.6);
                box-shadow: 0 6px 30px rgba(247, 231, 206, 0.4);
                transform: translateY(-3px);
              }

              .fullscreen-restart-button:active {
                transform: translateY(-1px);
              }

              /* 支持移动端长按保存图片 */
              @media (max-width: 768px) {
                .fullscreen-card-image {
                  max-width: 90%;
                }
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

        .validation-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
        }

        .validation-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(247, 231, 206, 0.2);
          border-top-color: #F7E7CE;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .validation-text {
          font-size: 16px;
          color: #F7E7CE;
          letter-spacing: 0.15em;
        }

        .blocked-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
        }

        .zen-container {
          text-align: center;
          max-width: 500px;
          padding: 60px 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(247, 231, 206, 0.2);
        }

        .zen-icon {
          font-size: 80px;
          margin-bottom: 30px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .zen-title {
          font-size: 28px;
          color: #F7E7CE;
          font-weight: 300;
          letter-spacing: 0.15em;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .zen-message {
          font-size: 18px;
          color: rgba(247, 231, 206, 0.8);
          letter-spacing: 0.1em;
          line-height: 1.8;
          margin-bottom: 50px;
        }

        .zen-footer {
          padding-top: 40px;
          border-top: 1px solid rgba(247, 231, 206, 0.2);
        }

        .zen-sparkle {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .zen-brand {
          font-size: 24px;
          color: #F7E7CE;
          letter-spacing: 0.25em;
          font-weight: 300;
          margin-bottom: 8px;
        }

        .zen-tagline {
          font-size: 14px;
          color: rgba(247, 231, 206, 0.6);
          letter-spacing: 0.2em;
        }
      `}</style>
    </div>
  );
}
