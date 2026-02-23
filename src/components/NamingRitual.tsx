import { useState } from 'react';
import GoldButton from './GoldButton';

interface NamingRitualProps {
  onComplete: (higherSelfName: string, userName: string) => void;
}

export default function NamingRitual({ onComplete }: NamingRitualProps) {
  const [higherSelfName, setHigherSelfName] = useState('');
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState(1);

  const handleFirstSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (higherSelfName.trim()) {
      setStep(2);
    }
  };

  const handleSecondSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onComplete(higherSelfName.trim(), userName.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 breathing-fade">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <form onSubmit={handleFirstSubmit} className="space-y-16">
            <h1
              className="text-2xl text-center leading-loose font-light"
              style={{ color: '#EBC862', letterSpacing: '0.06em' }}
            >
              那个智慧的内在自我，<br />你如何称呼它？
            </h1>
            <div className="relative">
              <input
                type="text"
                value={higherSelfName}
                onChange={(e) => setHigherSelfName(e.target.value)}
                className="w-full bg-transparent text-center text-xl py-4 outline-none border-0 border-b font-light golden-input"
                style={{
                  borderBottomColor: 'rgba(235, 200, 98, 0.3)',
                  color: '#E0E0D0',
                  letterSpacing: '0.05em',
                }}
                autoFocus
              />
            </div>
            <GoldButton type="submit" disabled={!higherSelfName.trim()} className="w-full">
              继续
            </GoldButton>
          </form>
        ) : (
          <form onSubmit={handleSecondSubmit} className="space-y-16">
            <h1
              className="text-2xl text-center leading-loose font-light"
              style={{ color: '#EBC862', letterSpacing: '0.06em' }}
            >
              它该如何称呼你？
            </h1>
            <div className="relative">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-transparent text-center text-xl py-4 outline-none border-0 border-b font-light golden-input"
                style={{
                  borderBottomColor: 'rgba(235, 200, 98, 0.3)',
                  color: '#E0E0D0',
                  letterSpacing: '0.05em',
                }}
                autoFocus
              />
            </div>
            <GoldButton type="submit" disabled={!userName.trim()} className="w-full">
              开启植本之旅
            </GoldButton>
          </form>
        )}
      </div>

      <style>{`
        .golden-input {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .golden-input:focus {
          border-bottom-color: rgba(235, 200, 98, 0.7) !important;
          text-shadow: 0 0 20px rgba(235, 200, 98, 0.3);
        }
      `}</style>
    </div>
  );
}
