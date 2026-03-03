import { useEffect, useState } from 'react';
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
import GoldenDust from './components/GoldenDust';
import VideoBackground from './components/VideoBackground';
import { supabase } from './lib/supabase';
import { stopAllAudio } from './utils/audioManager';
import { preloadCoreBackgrounds } from './utils/backgroundAssets';

type FlowStep = 'home' | 'emotion' | 'energy' | 'innerWhisper' | 'transition' | 'dialogue' | 'answers';
type TabType = 'breath' | 'person' | 'profile' | 'admin' | 'samples';

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

  if (currentStep === 'emotion' || currentStep === 'energy' || currentStep === 'innerWhisper' || currentStep === 'transition' || currentStep === 'dialogue' || currentStep === 'answers') {
    if (currentStep === 'emotion') {
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
  }

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

export default App;
