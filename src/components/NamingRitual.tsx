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
    <div className="min-h-screen flex items-center justify-center px-6 breathing-fade relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(247, 231, 206, 0.15) 0%, rgba(235, 200, 98, 0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <div className="golden-particles" />
      <div className="w-full max-w-md relative z-10">
        {step === 1 ? (
          <form onSubmit={handleFirstSubmit} className="space-y-12">
            <div className="space-y-8 mb-12 soulful-intro">
              <p
                className="text-base text-center leading-loose font-light fade-in-text"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  letterSpacing: '0.15em',
                  lineHeight: '2.2',
                  animation: 'fadeInGlow 2s ease-in-out'
                }}
              >
                万物生长，皆有逻辑。<br />
                在开启这段向内生长的旅程前，<br />
                我们需要建立连接。
              </p>
              <p
                className="text-sm text-center leading-loose font-light fade-in-text-delayed"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.15em',
                  lineHeight: '2',
                  animation: 'fadeInGlow 2s ease-in-out 0.8s both'
                }}
              >
                请赋予"自己"一个名字，<br />
                那是你当下的存在；<br />
                再赋予你的"高我"（老师）一个名字，<br />
                那是你智慧的指引。
              </p>
            </div>
            <h1
              className="text-2xl text-center leading-loose font-light"
              style={{
                background: 'linear-gradient(135deg, #F7E7CE 0%, #EBC862 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.06em',
                textShadow: '0 0 30px rgba(247, 231, 206, 0.3)',
                filter: 'drop-shadow(0 2px 12px rgba(247, 231, 206, 0.4))',
              }}
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
              style={{
                background: 'linear-gradient(135deg, #F7E7CE 0%, #EBC862 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.15em',
                textShadow: '0 0 30px rgba(247, 231, 206, 0.3)',
                filter: 'drop-shadow(0 2px 12px rgba(247, 231, 206, 0.4))',
              }}
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
              开启植本人之旅
            </GoldButton>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeInGlow {
          0% {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .soulful-intro p {
          text-shadow: 0 0 15px rgba(245, 245, 232, 0.2);
        }

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
