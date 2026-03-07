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
  higherSelfResponse: string;
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
    higherSelfResponse: '',
  });

  useEffect(() => {
    console.log('🔄 currentStep changed to:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('Loading timeout - forcing app to render');
      setLoading(false);
    }, 5000);

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

  function handleInnerWhisperComplete(journalText: string) {
    console.log('📝 [App.tsx] 日记完成，内容长度:', journalText.length);

    setJourneyData(prev => ({
      ...prev,
      journalContent: journalText
    }));

    setCurrentStep('transition');
  }

  function handleTransitionComplete(backgroundMusic: HTMLAudioElement | null) {
    setBackgroundAudio(backgroundMusic);
    setCurrentStep('dialogue');
  }

  async function handleDialogueComplete(response: string, audio: HTMLAudioElement | null) {
    console.group('📝 [App.tsx] 高我对话完成');
    console.log('✅ 高我建议内容:', response);
    console.log('📊 建议长度:', response.length, '字符');
    console.log('🔍 建议是否为空:', response.trim() === '');
    console.groupEnd();

    if (!response || response.trim() === '') {
      console.error('❌ [App.tsx] 致命错误：高我建议为空！');
      alert('高我建议生成失败，请重新输入');
      return;
    }

    try {
      setJourneyData(prev => ({
        ...prev,
        higherSelfResponse: response
      }));

      console.log('💾 [App.tsx] 正在保存到数据库...');

      await supabase
        .from('journal_entries')
        .insert({
          emotions: journeyData.emotions,
          body_states: journeyData.bodyStates,
          journal_content: journeyData.journalContent,
          higher_self_response: response,
        });

      console.log('✅ [App.tsx] 数据库保存成功');
      console.log('🔍 [App.tsx] journeyData.higherSelfResponse 已更新为:', response);

      setBackgroundAudio(audio);
      setCurrentStep('answers');
    } catch (error) {
      console.error('❌ [App.tsx] 数据库保存失败:', error);
      setBackgroundAudio(audio);
      setCurrentStep('answers');
    }
  }

  function handleAnswersComplete() {
    console.group('🚨 [App.tsx] handleAnswersComplete 被调用');
    console.log('🔒 当前路径:', window.location.pathname);
    console.log('🔍 检测是否在引流页...');

    if (window.location.pathname.includes('share/journal')) {
      console.log('✅ 检测到引流页路径，拦截跳转');
      console.log('🔒 保持状态: currentStep 维持 "answers"');
      console.log('🎵 保持音频: 不停止背景音乐');
      console.log('💾 保持数据: 不清空 journeyData');
      console.groupEnd();
      return;
    }

    console.log('🏠 非引流页，执行正常返回主页逻辑');
    console.groupEnd();

    stopAllAudio();
    setJourneyData({
      emotions: [],
      bodyStates: [],
      journalContent: '',
      higherSelfResponse: '',
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
      higherSelfResponse: '',
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
      console.group('📖 [App.tsx] 渲染答案之书');
      console.log('✅ 传递给 BookOfAnswers 的 higherSelfAdvice:', journeyData.higherSelfResponse);
      console.log('📊 长度:', journeyData.higherSelfResponse?.length || 0);
      console.log('🔍 是否为空:', !journeyData.higherSelfResponse || journeyData.higherSelfResponse.trim() === '');
      console.groupEnd();

      return (
        <BookOfAnswers
          onComplete={handleAnswersComplete}
          backgroundAudio={backgroundAudio}
          onBack={handleBackToDialogue}
          higherSelfAdvice={journeyData.higherSelfResponse}
          userName={userNames?.userName}
        />
      );
    }

    console.warn('⚠️ Unknown step, resetting to home:', currentStep);
    setCurrentStep('home');
  }

  console.log('🏠 Rendering home tabs. currentStep:', currentStep, 'currentTab:', currentTab);

  return (
    <>
      {currentTab !== 'person' && <VideoBackground />}
      <GoldenDust />

      {!isAdmin && userNames && (
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
                alert('已设置为管理员，页面将刷新');
                window.location.reload();
              } catch (error) {
                console.error(error);
                alert('设置失败');
              }
            }
          }}
          className="fixed top-20 right-4 z-[999] px-6 py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/50 hover:to-emerald-500/50 border-2 border-green-400/60 text-white rounded-xl text-base font-medium backdrop-blur-xl transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-green-500/50"
          style={{
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4), 0 0 40px rgba(16, 185, 129, 0.3)',
            letterSpacing: '0.05em'
          }}
        >
          🔐 设为管理员
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
