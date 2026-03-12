import { useEffect, useState, lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import NamingRitual from './components/NamingRitual';
import HomePage from './components/HomePage';
import Navigation from './components/Navigation';
import EnergyCenter from './components/EnergyCenter';
import EnergyPerson from './components/EnergyPerson';
import Profile from './components/Profile';
import PremiumModal from './components/PremiumModal';
import AdminPanel from './components/AdminPanel';
import SampleUploadPanel from './components/SampleUploadPanel';
import VideoUploader from './components/VideoUploader';
import GoldenDust from './components/GoldenDust';
import VideoBackground from './components/VideoBackground';
import { supabase } from './lib/supabase';
import { stopAllAudio } from './utils/audioManager';
import { preloadCoreBackgrounds } from './utils/backgroundAssets';

// 🚀 代码分割：懒加载非首屏组件
const EmotionScan = lazy(() => import('./components/EmotionScan'));
const InnerWhisperJournal = lazy(() => import('./components/InnerWhisperJournal'));
const GoldenTransition = lazy(() => import('./components/GoldenTransition'));
const HigherSelfDialogue = lazy(() => import('./components/HigherSelfDialogue'));
const BookOfAnswers = lazy(() => import('./components/BookOfAnswers'));

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
  const [transitionAudioUrl, setTransitionAudioUrl] = useState<string | null>(null);
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

      // 加载 GoldenTransition 的音频文件
      try {
        const { data: audioFiles, error: audioError } = await supabase
          .from('audio_files')
          .select('file_path')
          .eq('is_active', true)
          .eq('file_type', 'guidance')
          .limit(1)
          .maybeSingle();

        if (!audioError && audioFiles?.file_path) {
          const audioUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/audio-files/${audioFiles.file_path}`;
          console.log('🎵 加载 GoldenTransition 音频:', audioUrl);
          setTransitionAudioUrl(audioUrl);
        }
      } catch (audioError) {
        console.warn('加载音频文件失败 (non-critical):', audioError);
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
    setIsAdmin(false);
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
      return (
        <Suspense fallback={<div className="loading-screen">加载中...</div>}>
          <EmotionScan onNext={handleEmotionComplete} onBack={handleBackToHome} />
        </Suspense>
      );
    }

    if (currentStep === 'energy') {
      return <EnergyCenter isPremium={isPremium} onPremiumRequired={handlePremiumRequired} />;
    }

    if (currentStep === 'innerWhisper') {
      return (
        <Suspense fallback={<div className="loading-screen">加载中...</div>}>
          <InnerWhisperJournal
            emotions={journeyData.emotions}
            bodyStates={journeyData.bodyStates}
            onBack={handleBackToEmotion}
            onNext={handleInnerWhisperComplete}
          />
        </Suspense>
      );
    }

    if (currentStep === 'transition') {
      console.group('🎵 [App.tsx] 进入 GoldenTransition - 音频实例管理');
      console.log('📡 transitionAudioUrl:', transitionAudioUrl);
      console.log('🔍 backgroundAudio 状态:', backgroundAudio ? '存在实例' : '无实例');

      // 🔥 清理可能存在的旧音频实例，防止污染
      if (backgroundAudio) {
        console.warn('⚠️ 检测到旧音频实例，执行清理防止污染');
        try {
          backgroundAudio.pause();
          backgroundAudio.currentTime = 0;
          backgroundAudio.src = '';
          backgroundAudio.load();
          console.log('✅ 旧音频实例已清理');
        } catch (cleanupErr) {
          console.warn('⚠️ 音频清理失败（非致命）:', cleanupErr);
        }
        setBackgroundAudio(null);
      }
      console.groupEnd();

      return (
        <Suspense fallback={<div className="loading-screen">加载中...</div>}>
          <GoldenTransition
            userName={userNames.userName}
            higherSelfName={userNames.higherSelfName}
            onComplete={handleTransitionComplete}
            backgroundMusicUrl={transitionAudioUrl}
          />
        </Suspense>
      );
    }

    if (currentStep === 'dialogue') {
      return (
        <Suspense fallback={<div className="loading-screen">加载中...</div>}>
          <HigherSelfDialogue
            userName={userNames.userName}
            higherSelfName={userNames.higherSelfName}
            journalContent={journeyData.journalContent}
            backgroundMusic={backgroundAudio}
            onComplete={handleDialogueComplete}
            onBack={handleBackToInnerWhisper}
          />
        </Suspense>
      );
    }

    if (currentStep === 'answers') {
      console.group('📖 [App.tsx] 渲染答案之书');
      console.log('✅ 传递给 BookOfAnswers 的 higherSelfAdvice:', journeyData.higherSelfResponse);
      console.log('📊 长度:', journeyData.higherSelfResponse?.length || 0);
      console.log('🔍 是否为空:', !journeyData.higherSelfResponse || journeyData.higherSelfResponse.trim() === '');
      console.groupEnd();

      return (
        <Suspense fallback={<div className="loading-screen">加载中...</div>}>
          <BookOfAnswers
            onComplete={handleAnswersComplete}
            backgroundAudio={backgroundAudio}
            onBack={handleBackToDialogue}
            higherSelfAdvice={journeyData.higherSelfResponse}
            userName={userNames?.userName}
          />
        </Suspense>
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
