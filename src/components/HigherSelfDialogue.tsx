import { useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';

interface HigherSelfDialogueProps {
  userName: string;
  higherSelfName: string;
  journalContent: string;
  backgroundMusic?: HTMLAudioElement | null;
  onComplete: (response: string, audio: HTMLAudioElement | null) => void;
  onBack?: () => void;
}

const floatingPrompts = [
  '别思考，去感受',
  '写下第一个跳出的词',
  '他在听你说话',
  '让情绪自然流淌',
  '你的内在智慧正在回应',
  '深呼吸，感受此刻',
];

export default function HigherSelfDialogue({ userName, higherSelfName, journalContent, backgroundMusic: incomingBackgroundMusic, onComplete, onBack }: HigherSelfDialogueProps) {
  const [response, setResponse] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(floatingPrompts[0]);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(incomingBackgroundMusic || null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(!!incomingBackgroundMusic);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => {
        const currentIndex = floatingPrompts.indexOf(prev);
        return floatingPrompts[(currentIndex + 1) % floatingPrompts.length];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleBackgroundMusic = () => {
    if (backgroundMusic) {
      if (isMusicPlaying) {
        backgroundMusic.pause();
        setIsMusicPlaying(false);
      } else {
        backgroundMusic.play().catch(err => console.error('Audio play error:', err));
        setIsMusicPlaying(true);
      }
    }
  };

  const handleSubmit = () => {
    if (response.trim()) {
      onComplete(response.trim(), backgroundMusic);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade" style={{ position: 'relative' }}>
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
          style={{
            backgroundColor: 'rgba(235, 200, 98, 0.1)',
            border: '1px solid rgba(235, 200, 98, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ChevronLeft size={24} color="#EBC862" />
        </button>
      )}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div
          className="mb-8 p-6 rounded-lg glassmorphic-card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(235, 200, 98, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(235, 200, 98, 0.1)',
          }}
        >
          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: '#E0E0D0', letterSpacing: '0.02em', opacity: 0.9 }}
          >
            {journalContent}
          </p>
        </div>

        <div
          className="floating-prompt"
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            marginTop: '32px',
            minHeight: '32px',
          }}
        >
          <span
            className="prompt-text"
            style={{
              color: '#C9A85F',
              fontSize: '0.95rem',
              fontWeight: '300',
              letterSpacing: '0.08em',
              textShadow: '0 0 14px rgba(201, 168, 95, 0.4)',
              display: 'inline-block',
            }}
          >
            {currentPrompt}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2
            className="text-lg font-light mb-6 text-center leading-relaxed"
            style={{ color: '#EBC862', letterSpacing: '0.05em', textShadow: '0 0 20px rgba(235, 200, 98, 0.3)' }}
          >
            亲爱的 <span className="golden-name-highlight">{userName}</span>，<br />
            下面是我想和你说的话：
          </h2>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full h-64 resize-none outline-none font-light text-lg p-6 rounded-lg dialogue-textarea"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#E0E0D0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              letterSpacing: '0.02em',
              lineHeight: '1.7',
            }}
            placeholder="以智慧之声回应..."
            autoFocus
          />
        </div>
      </div>

      <div className="w-full mt-8">
        <GoldButton onClick={handleSubmit} disabled={!response.trim()} className="w-full">
          完成
        </GoldButton>
      </div>

      <button
        onClick={toggleBackgroundMusic}
        className="audio-toggle"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: isMusicPlaying ? 'rgba(235, 200, 98, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isMusicPlaying ? 'rgba(235, 200, 98, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isMusicPlaying ? '0 0 24px rgba(235, 200, 98, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
        title={isMusicPlaying ? '关闭背景音乐' : '开启背景音乐'}
      >
        {isMusicPlaying ? (
          <Volume2 size={24} color="#EBC862" />
        ) : (
          <VolumeX size={24} color="rgba(224, 224, 208, 0.6)" />
        )}
      </button>

      <style>{`
        .glassmorphic-card {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glassmorphic-card:hover {
          box-shadow: 0 6px 24px rgba(235, 200, 98, 0.2);
          border-color: rgba(235, 200, 98, 0.3);
        }

        .golden-name-highlight {
          font-weight: 500;
          color: #EBC862;
          text-shadow: 0 0 20px rgba(235, 200, 98, 0.4);
        }

        .dialogue-textarea::placeholder {
          color: rgba(224, 224, 208, 0.3);
        }

        .dialogue-textarea:focus {
          border-color: rgba(235, 200, 98, 0.5);
          box-shadow: 0 0 20px rgba(235, 200, 98, 0.2);
        }

        .guidance-overlay {
          position: relative;
          width: 100%;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .guidance-content {
          position: relative;
          width: 100%;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guidance-message {
          animation: gentlePulse 3s ease-in-out infinite;
        }

        @keyframes gentlePulse {
          0%, 100% {
            text-shadow: 0 0 20px rgba(235, 200, 98, 0.4);
          }
          50% {
            text-shadow: 0 0 30px rgba(235, 200, 98, 0.6);
          }
        }

        .floating-prompt {
          animation: floatUpDown 4s ease-in-out infinite;
        }

        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .prompt-text {
          animation: promptGlow 3s ease-in-out infinite;
        }

        @keyframes promptGlow {
          0%, 100% {
            opacity: 0.7;
            text-shadow: 0 0 14px rgba(201, 168, 95, 0.4);
          }
          50% {
            opacity: 0.9;
            text-shadow: 0 0 20px rgba(201, 168, 95, 0.6);
          }
        }

        .audio-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(235, 200, 98, 0.4);
        }

        .audio-toggle:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
