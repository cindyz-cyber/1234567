import { useEffect, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import NamingRitual from './components/NamingRitual';
import HomePage from './components/HomePage';
import EmotionScan from './components/EmotionScan';
import InnerWhisperJournal from './components/InnerWhisperJournal';
import GoldenTransition from './components/GoldenTransition';
import HigherSelfDialogue from './components/HigherSelfDialogue';
import Navigation from './components/Navigation';
import EnergyCenter from './components/EnergyCenter';
import EnergyPerson from './components/EnergyPerson';
import Profile from './components/Profile';
import BookOfAnswers from './components/BookOfAnswers';
import PremiumModal from './components/PremiumModal';
import AdminPanel from './components/AdminPanel';
import SampleUploadPanel from './components/SampleUploadPanel';
import VideoUploader from './components/VideoUploader';
import GoldenDust from './components/GoldenDust';
import VideoBackground from './components/VideoBackground';
import { supabase } from './lib/supabase';
import { stopAllAudio } from './utils/audioManager';
import { preloadCoreBackgrounds } from './utils/backgroundAssets';

type FlowStep = 'home' | 'emotion' | 'energy' | 'innerWhisper' | 'transition' | 'dialogue' | 'answers';
type TabType = 'breath' | 'person' | 'profile' | 'admin' | 'samples' | 'uploader';

interface JourneyData {
  emotions: string[];
  bodyStates: string[];
  journalContent: string;
}

interface UserNames {
  userName: string;
  higherSelfName: string;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<UserNames | null>(null);
  const [currentStep, setCurrentStep] = useState<FlowStep>('home');
  const [currentTab, setCurrentTab] = useState<TabType>('breath');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null);
  const [journeyData, setJourneyData] = useState<JourneyData>({
    emotions: [],
    bodyStates: [],
    journalContent: '',
  });

  useEffect(() => {
    console.log('🔄 currentStep changed to:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('Loading timeout - forcing app to render');
      setLoading(false);
    }, 5000);

    // 立即启动背景资源预加载（并行不阻塞）
    preloadCoreBackgrounds().catch(err => {
      console.warn('Background preload failed (non-critical):', err);
    });

    loadProfile();

    return () => clearTimeout(timeout);
  }, []);

  async function loadProfile() {
    try {
      const storedUserName = localStorage.getItem('userName');
      const storedHigherSelfName = localStorage.getItem('higherSelfName');

      if (storedUserName && storedHigherSelfName) {
        setUserNames({
          userName: storedUserName,
          higherSelfName: storedHigherSelfName,
        });

        try {
          const { data, error } = await supabase
            .from('user_profile')
            .select('is_admin')
            .eq('user_name', storedUserName)
            .eq('higher_self_name', storedHigherSelfName)
            .maybeSingle();

          if (error) {
            console.warn('Supabase query error (non-critical):', error);
          } else if (data?.is_admin) {
            setIsAdmin(true);
          }
        } catch (dbError) {
          console.warn('Database connection issue (non-critical):', dbError);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleNamingComplete(higherSelfName: string, userName: string) {
    try {
      localStorage.setItem('userName', userName);
      localStorage.setItem('higherSelfName', higherSelfName);

      setUserNames({
        userName,
        higherSelfName,
      });

      setCurrentStep('home');
      setCurrentTab('breath');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  function handleResetIdentity() {
    localStorage.removeItem('userName');
    localStorage.removeItem('higherSelfName');
    setUserNames(null);
    setCurrentStep('home');
    setCurrentTab('breath');
  }

  function handleStartJourney() {
    console.log('🚀 handleStartJourney called');
    setCurrentStep('emotion');
  }

  function handleEmotionComplete(emotions: string[], bodyStates: string[]) {
    setJourneyData(prev => ({
      ...prev,
      emotions,
      bodyStates,
    }));
    setCurrentStep('innerWhisper');
  }

  function handleInnerWhisperComplete() {
    setCurrentStep('transition');
  }

  function handleTransitionComplete(backgroundMusic: HTMLAudioElement | null) {
    setBackgroundAudio(backgroundMusic);
    setCurrentStep('dialogue');
  }

  async function handleDialogueComplete(response: string, audio: HTMLAudioElement | null) {
    try {
      await supabase
        .from('journal_entries')
        .insert({
          emotions: journeyData.emotions,
          body_states: journeyData.bodyStates,
          journal_content: journeyData.journalContent,
          higher_self_response: response,
        });

      setBackgroundAudio(audio);
      setCurrentStep('answers');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  }

  function handleAnswersComplete() {
    console.group('🚨 [App.tsx] handleAnswersComplete 被调用');
    console.log('🔒 当前路径:', window.location.pathname);
    console.log('🔍 检测是否在引流页...');

    // 🚫 强制拦截：如果在引流页，禁止跳转到 home
    if (window.location.pathname.includes('share/journal')) {
      console.log('✅ 检测到引流页路径，拦截跳转');
      console.log('🔒 保持状态: currentStep 维持 "answers"');
      console.log('🎵 保持音频: 不停止背景音乐');
      console.log('💾 保持数据: 不清空 journeyData');
      console.groupEnd();
      // 引流页不执行任何重置动作，保持在 answers 状态
      return;
    }

    console.log('🏠 非引流页，执行正常返回主页逻辑');
    console.groupEnd();

    stopAllAudio();
    setJourneyData({
      emotions: [],
      bodyStates: [],
      journalContent: '',
    });
    setBackgroundAudio(null);
    setCurrentStep('home');
  }

  function handleBackToHome() {
    stopAllAudio();
    setJourneyData({
      emotions: [],
      bodyStates: [],
      journalContent: '',
    });
    setBackgroundAudio(null);
    setCurrentStep('home');
  }

  function handleBackToEmotion() {
    setCurrentStep('emotion');
  }

  function handleBackToInnerWhisper() {
    setCurrentStep('innerWhisper');
  }

  function handleBackToDialogue() {
    setCurrentStep('dialogue');
  }

  function handlePremiumRequired() {
    setShowPremiumModal(true);
  }

  function handleSubscribe() {
    setIsPremium(true);
    setShowPremiumModal(false);
  }

  function handleTabChange(tab: TabType) {
    setCurrentTab(tab);
    if (tab === 'breath') {
      setCurrentStep('home');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'transparent' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#EBC862', borderTopColor: 'transparent', opacity: 0.8, boxShadow: '0 0 20px rgba(235, 200, 98, 0.4)' }} />
      </div>
    );
  }

  if (!userNames) {
    return <NamingRitual onComplete={handleNamingComplete} />;
  }

  // 旅程步骤优先于标签页渲染
  console.log('🔍 App render, currentStep:', currentStep, 'currentTab:', currentTab);

  if (currentStep !== 'home') {
    console.log('📍 Current step:', currentStep);

    if (currentStep === 'emotion') {
      console.log('✅ Rendering EmotionScan');
      return <EmotionScan onNext={handleEmotionComplete} onBack={handleBackToHome} />;
    }

    if (currentStep === 'energy') {
      return <EnergyCenter isPremium={isPremium} onPremiumRequired={handlePremiumRequired} />;
    }

    if (currentStep === 'innerWhisper') {
      return (
        <InnerWhisperJournal
          emotions={journeyData.emotions}
          bodyStates={journeyData.bodyStates}
          onBack={handleBackToEmotion}
          onNext={handleInnerWhisperComplete}
        />
      );
    }

    if (currentStep === 'transition') {
      return (
        <GoldenTransition
          userName={userNames.userName}
          higherSelfName={userNames.higherSelfName}
          onComplete={handleTransitionComplete}
        />
      );
    }

    if (currentStep === 'dialogue') {
      return (
        <HigherSelfDialogue
          userName={userNames.userName}
          higherSelfName={userNames.higherSelfName}
          journalContent={journeyData.journalContent}
          backgroundMusic={backgroundAudio}
          onComplete={handleDialogueComplete}
          onBack={handleBackToInnerWhisper}
        />
      );
    }

    if (currentStep === 'answers') {
      return <BookOfAnswers onComplete={handleAnswersComplete} backgroundAudio={backgroundAudio} onBack={handleBackToDialogue} />;
    }

    // 如果步骤不匹配任何已知步骤，回到首页
    console.warn('⚠️ Unknown step, resetting to home:', currentStep);
    setCurrentStep('home');
  }

  console.log('🏠 Rendering home tabs. currentStep:', currentStep, 'currentTab:', currentTab);

  return (
    <>
      {currentTab !== 'person' && <VideoBackground />}
      <GoldenDust />

      {false && userNames && (
        <button
          onClick={async () => {
            if (confirm('设置当前用户为管理员？')) {
              try {
                const { data: existing } = await supabase
                  .from('user_profile')
                  .select('id')
                  .eq('user_name', userNames.userName)
                  .eq('higher_self_name', userNames.higherSelfName)
                  .maybeSingle();

                if (existing) {
                  await supabase
                    .from('user_profile')
                    .update({ is_admin: true })
                    .eq('user_name', userNames.userName)
                    .eq('higher_self_name', userNames.higherSelfName);
                } else {
                  await supabase
                    .from('user_profile')
                    .insert({
                      user_name: userNames.userName,
                      higher_self_name: userNames.higherSelfName,
                      is_admin: true
                    });
                }
                alert('✅ 已设置为管理员！页面将刷新...');
                window.location.reload();
              } catch (error) {
                console.error(error);
                alert('❌ 设置失败');
              }
            }
          }}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-white rounded-lg text-sm backdrop-blur-lg transition-all"
          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}
        >
          ��️ 设为管理员
        </button>
      )}

      {currentTab === 'breath' && (
        <HomePage
          userName={userNames.userName}
          higherSelfName={userNames.higherSelfName}
          onStartJourney={handleStartJourney}
        />
      )}

      {currentTab === 'person' && <EnergyPerson />}

      {currentTab === 'profile' && (
        <Profile
          userName={userNames.userName}
          higherSelfName={userNames.higherSelfName}
          isPremium={isPremium}
          onShowPremium={() => setShowPremiumModal(true)}
          onNavigateArchive={() => {}}
          onResetIdentity={handleResetIdentity}
        />
      )}

      {currentTab === 'admin' && isAdmin && <AdminPanel />}

      {currentTab === 'samples' && isAdmin && <SampleUploadPanel />}

      {currentTab === 'uploader' && isAdmin && <VideoUploader />}

      <Navigation currentTab={currentTab} onTabChange={handleTabChange} isAdmin={isAdmin} />

      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </>
  );
}

function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;
