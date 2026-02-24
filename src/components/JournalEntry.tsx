import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import GoldButton from './GoldButton';

interface JournalEntryProps {
  onNext: (content: string) => void;
  userName?: string;
  onBack?: () => void;
}

export default function JournalEntry({ onNext, userName = '朋友', onBack }: JournalEntryProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onNext(content.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade relative">
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
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2
          className="text-2xl font-light mb-8 text-center"
          style={{ color: '#EBC862', letterSpacing: '0.05em' }}
        >
          此刻你想记录什么？
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 resize-none outline-none font-light text-lg p-6 rounded-lg journal-textarea"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#E0E0D0',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            letterSpacing: '0.02em',
            lineHeight: '1.7',
          }}
          placeholder={`亲爱的 ${userName}，我想告诉你：`}
          autoFocus
        />
      </div>

      <div className="w-full mt-8">
        <GoldButton onClick={handleSubmit} disabled={!content.trim()} className="w-full">
          写好了
        </GoldButton>
      </div>

      <style>{`
        .journal-textarea::placeholder {
          color: rgba(224, 224, 208, 0.3);
        }

        .journal-textarea:focus {
          border-color: rgba(235, 200, 98, 0.5);
          box-shadow: 0 0 20px rgba(235, 200, 98, 0.2);
        }
      `}</style>
    </div>
  );
}
