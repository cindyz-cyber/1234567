import { useState } from 'react';
import GoldButton from './GoldButton';

interface HigherSelfDialogueProps {
  userName: string;
  higherSelfName: string;
  journalContent: string;
  onComplete: (response: string) => void;
}

export default function HigherSelfDialogue({ userName, higherSelfName, journalContent, onComplete }: HigherSelfDialogueProps) {
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (response.trim()) {
      onComplete(response.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade">
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
      `}</style>
    </div>
  );
}
