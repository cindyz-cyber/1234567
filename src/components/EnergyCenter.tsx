import { useState, useEffect } from 'react';
import IntentSeeds from './IntentSeeds';
import DeepASMR from './DeepASMR';
import UnifiedPlayer from './UnifiedPlayer';
import BreathingOrb from './BreathingOrb';
import { getTodaysRecommendation, getAudioUrl, type AudioFile } from '../utils/audioService';

type ViewState = 'sanctuary' | 'intent-seeds' | 'deep-asmr' | 'player' | 'today-recommendation';

interface EnergyCenterProps {
  isPremium?: boolean;
  onPremiumRequired?: () => void;
}

export default function EnergyCenter({ isPremium = false, onPremiumRequired }: EnergyCenterProps) {
  const [view, setView] = useState<ViewState>('sanctuary');
  const [selectedType, setSelectedType] = useState<string>('');
  const [fadeIn, setFadeIn] = useState(false);
  const [todayAudio, setTodayAudio] = useState<AudioFile | null>(null);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
    loadTodaysRecommendation();
  }, []);

  const loadTodaysRecommendation = async () => {
    const audio = await getTodaysRecommendation();
    setTodayAudio(audio);
  };

  const handleFeatureClick = (callback: () => void) => {
    if (!isPremium && onPremiumRequired) {
      onPremiumRequired();
    } else {
      callback();
    }
  };

  const handleOrbClick = (type: 'intent' | 'asmr') => {
    setTimeout(() => {
      if (type === 'intent') {
        setView('intent-seeds');
      } else {
        setView('deep-asmr');
      }
    }, 300);
  };

  const handleTodayClick = () => {
    if (todayAudio) {
      setSelectedType('today');
      setView('today-recommendation');
    }
  };

  const handleSelectIntent = (intent: string) => {
    setSelectedType(intent);
    setView('player');
  };

  const handleBackToSanctuary = () => {
    setView('sanctuary');
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 100);
  };

  if (view === 'intent-seeds') {
    return (
      <IntentSeeds
        onSelectIntent={handleSelectIntent}
        onBack={handleBackToSanctuary}
      />
    );
  }

  if (view === 'deep-asmr') {
    return (
      <DeepASMR onBack={handleBackToSanctuary} />
    );
  }

  if (view === 'player') {
    return (
      <UnifiedPlayer
        type={selectedType}
        onBack={() => setView('intent-seeds')}
      />
    );
  }

  if (view === 'today-recommendation' && todayAudio) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#020A09' }}>
        <UnifiedPlayer
          audioUrl={getAudioUrl(todayAudio.file_path)}
          title="今日推荐"
          description={todayAudio.description || '玛雅历能量处方'}
          onBack={handleBackToSanctuary}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-1000"
      style={{
        backgroundColor: '#020A09',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      {todayAudio && (
        <button
          onClick={() => handleFeatureClick(handleTodayClick)}
          className="absolute top-8 w-3 h-3 rounded-full transition-all duration-500 hover:scale-150 focus:outline-none"
          style={{
            backgroundColor: '#EBC862',
            boxShadow: '0 0 20px rgba(235, 200, 98, 0.6), 0 0 40px rgba(235, 200, 98, 0.3)',
            opacity: fadeIn ? 0.7 : 0,
            animation: 'pulse 2s ease-in-out infinite',
          }}
          aria-label="今日推荐"
        />
      )}

      <div className="flex flex-col items-center justify-center gap-32 w-full max-w-2xl">
        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 1s ease-out 0.2s',
          }}
        >
          <BreathingOrb
            label="意图引导"
            onClick={() => handleFeatureClick(() => handleOrbClick('intent'))}
          />
        </div>

        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 1s ease-out 0.4s',
          }}
        >
          <BreathingOrb
            label="深海静默"
            onClick={() => handleFeatureClick(() => handleOrbClick('asmr'))}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
