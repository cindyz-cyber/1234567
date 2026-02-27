import { useEffect, useState } from 'react';
import NamingRitual from './components/NamingRitual';
import HomePage from './components/HomePage';
import EmotionScan from './components/EmotionScan';
import EnergyLab from './components/EnergyLab';
import InnerWhisperJournal from './components/InnerWhisperJournal';
import GoldenTransition from './components/GoldenTransition';
import HigherSelfDialogue from './components/HigherSelfDialogue';
import Header from './components/Header';
import Navigation from './components/Navigation';
import EnergyCenter from './components/EnergyCenter';
import Archive from './components/Archive';
import Profile from './components/Profile';
import BookOfAnswers from './components/BookOfAnswers';
import PremiumModal from './components/PremiumModal';
import AdminPanel from './components/AdminPanel';
import SampleUploadPanel from './components/SampleUploadPanel';
import GoldenDust from './components/GoldenDust';
import VideoBackground from './components/VideoBackground';
import { supabase } from './lib/supabase';
import { stopAllAudio } from './utils/audioManager';

type FlowStep = 'home' | 'emotion' | 'energy' | 'voice' | 'innerWhisper' | 'transition' | 'dialogue' | 'answers';
type TabType = 'breath' | 'voice' | 'archive' | 'profile' | 'admin' | 'samples' | 'lab';

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
  const [isShowingVoiceResult, setIsShowingVoiceResult] = useState(false);
  const [journeyData, setJourneyData] = useState<JourneyData>({
    emotions: [],
    bodyStates: [],
    journalContent: '',
  });

  useEffect(() => {
    loadProfile();
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

        const { data } = await supabase
          .from('user_profile')
          .select('is_admin')
          .eq('user_name', storedUserName)
          .eq('higher_self_name', storedHigherSelfName)
          .maybeSingle();

        if (data?.is_admin) {
          setIsAdmin(true);
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

  function handleVoiceComplete() {
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

  function handleBackToVoice() {
    setCurrentStep('voice');
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
    console.log('[App] handleTabChange called with tab:', tab, 'isShowingVoiceResult:', isShowingVoiceResult);
    console.trace('[App] Stack trace for handleTabChange');
    if (isShowingVoiceResult) {
      console.log('[App] Blocked tab change because isShowingVoiceResult is true');
      return;
    }
    setCurrentTab(tab);
    if (tab === 'breath') {
      setCurrentStep('home');
    }
    // Don't set currentStep for voice tab - let VoiceRecognition manage its own state
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0A1F1C 0%, #020A09 100%)' }}>
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
    <div
      onClick={(e) => {
        if (isShowingVoiceResult) {
          e.stopPropagation();
        }
      }}
      onTouchStart={(e) => {
        if (isShowingVoiceResult) {
          e.stopPropagation();
        }
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <VideoBackground />
      <GoldenDust />
      {currentTab !== 'breath' && <Header />}

      {currentTab === 'breath' && (
        <HomePage
          userName={userNames.userName}
          higherSelfName={userNames.higherSelfName}
          onStartJourney={handleStartJourney}
        />
      )}

      {currentTab === 'lab' && <EnergyLab />}

      {currentTab === 'voice' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center text-white p-12">
            <h2 className="text-4xl font-bold mb-4">功能已迁移</h2>
            <p className="text-gray-400 text-lg mb-8">请使用"实验室"进行频率检测</p>
            <button
              onClick={() => setCurrentTab('lab')}
              className="px-8 py-4 bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors"
            >
              前往实验室
            </button>
          </div>
        </div>
      )}


      {currentTab === 'archive' && <Archive />}

      {currentTab === 'profile' && (
        <Profile
          userName={userNames.userName}
          higherSelfName={userNames.higherSelfName}
          isPremium={isPremium}
          onShowPremium={() => setShowPremiumModal(true)}
          onNavigateArchive={() => setCurrentTab('archive')}
          onResetIdentity={handleResetIdentity}
        />
      )}

      {currentTab === 'admin' && isAdmin && <AdminPanel />}

      {currentTab === 'samples' && isAdmin && <SampleUploadPanel />}

      <div style={{ pointerEvents: isShowingVoiceResult ? 'none' : 'auto' }}>
        {!isShowingVoiceResult && (
          <Navigation currentTab={currentTab} onTabChange={handleTabChange} isAdmin={isAdmin} />
        )}
      </div>

      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
}

export default App;
