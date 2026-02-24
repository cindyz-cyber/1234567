import { useEffect, useState } from 'react';
import NamingRitual from './components/NamingRitual';
import HomePage from './components/HomePage';
import EmotionScan from './components/EmotionScan';
import JournalEntry from './components/JournalEntry';
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
import GoldenDust from './components/GoldenDust';
import VideoBackground from './components/VideoBackground';
import { supabase } from './lib/supabase';
import { stopAllAudio } from './utils/audioManager';

type FlowStep = 'home' | 'emotion' | 'journal' | 'transition' | 'dialogue' | 'answers';
type TabType = 'breath' | 'energy' | 'archive' | 'profile' | 'admin';

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
    setJourneyData(prev => ({ ...prev, emotions, bodyStates }));
    setCurrentStep('journal');
  }

  function handleJournalComplete(content: string) {
    setJourneyData(prev => ({ ...prev, journalContent: content }));
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

  function handleBackToJournal() {
    setCurrentStep('journal');
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0A1F1C 0%, #020A09 100%)' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#EBC862', borderTopColor: 'transparent', opacity: 0.8, boxShadow: '0 0 20px rgba(235, 200, 98, 0.4)' }} />
      </div>
    );
  }

  if (!userNames) {
    return <NamingRitual onComplete={handleNamingComplete} />;
  }

  if (currentStep === 'emotion' || currentStep === 'journal' || currentStep === 'transition' || currentStep === 'dialogue' || currentStep === 'answers') {
    if (currentStep === 'emotion') {
      return (
        <>
          <VideoBackground />
          <EmotionScan onNext={handleEmotionComplete} onBack={handleBackToHome} />
        </>
      );
    }

    if (currentStep === 'journal') {
      return <JournalEntry onNext={handleJournalComplete} userName={userNames.userName} onBack={handleBackToEmotion} />;
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
          onBack={handleBackToJournal}
        />
      );
    }

    if (currentStep === 'answers') {
      return <BookOfAnswers onComplete={handleAnswersComplete} backgroundAudio={backgroundAudio} onBack={handleBackToDialogue} />;
    }
  }

  return (
    <>
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

      {currentTab === 'energy' && (
        <EnergyCenter
          isPremium={isPremium}
          onPremiumRequired={handlePremiumRequired}
        />
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
