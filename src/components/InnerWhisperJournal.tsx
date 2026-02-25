import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mic, MicOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import GoldButton from './GoldButton';

interface InnerWhisperJournalProps {
  emotions?: string[];
  bodyStates?: string[];
  onBack?: () => void;
  onNext?: () => void;
}

export default function InnerWhisperJournal({ emotions = [], bodyStates = [], onBack, onNext }: InnerWhisperJournalProps) {
  const [journalText, setJournalText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setJournalText(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.5 + 0.5);
      }, 100);
    } else {
      setPulseIntensity(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音输入功能');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSave = async () => {
    if (!journalText.trim()) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content: journalText,
            emotions: emotions,
            body_states: bodyStates
          });

        if (error) throw error;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onNext) {
          onNext();
        }
      }, 1500);
    } catch (error) {
      console.error('Error saving journal:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, rgba(20, 25, 20, 1) 0%, rgba(35, 40, 30, 1) 50%, rgba(25, 30, 25, 1) 100%)'
    }}>
      <div className="cave-background" />
      <div className="light-rays" />

      <div className="absolute top-6 left-6 z-50">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-200/80 hover:text-amber-100 transition-colors"
            style={{
              textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
            }}
          >
            <ChevronLeft size={24} />
            <span style={{ letterSpacing: '0.2em' }}>返回</span>
          </button>
        )}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <h1 className="journal-title mb-4" style={{
          color: '#F7E7CE',
          fontSize: '28px',
          fontWeight: 300,
          letterSpacing: '0.5em',
          textAlign: 'center',
          textShadow: '0 0 20px rgba(247, 231, 206, 0.6), 0 0 40px rgba(235, 200, 98, 0.3)',
          marginBottom: '48px'
        }}>
          内在的低语
        </h1>

        <div className="journal-container max-w-3xl w-full relative">
          <div className="jade-tablet">
            <textarea
              ref={textareaRef}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="在此记录你内心深处的声音..."
              className="journal-textarea"
              rows={12}
            />

            <div className="inner-glow" />
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={toggleVoiceInput}
              className={`voice-button ${isListening ? 'listening' : ''}`}
              disabled={isSaving}
            >
              <div className="voice-button-ring" style={{
                opacity: pulseIntensity,
                transform: `scale(${1 + pulseIntensity * 0.3})`
              }} />
              <div className="voice-button-inner">
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </div>
              {isListening && (
                <div className="listening-indicator">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="sound-wave" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
            </button>
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <GoldButton
              onClick={handleSave}
              disabled={!journalText.trim() || isSaving}
              className="w-full"
            >
              {isSaving ? '保存中...' : '完成书写'}
            </GoldButton>
          </div>
        </div>

        {showSuccess && (
          <div className="success-overlay">
            <div className="success-message">
              已保存
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cave-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(ellipse at center top, rgba(80, 70, 50, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 40%, rgba(60, 50, 40, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(50, 60, 45, 0.3) 0%, transparent 50%);
          animation: caveBreath 15s ease-in-out infinite;
        }

        @keyframes caveBreath {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .light-rays {
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 200%;
          height: 140%;
          background:
            conic-gradient(
              from 0deg at 50% 0%,
              transparent 0deg,
              rgba(247, 231, 206, 0.03) 45deg,
              transparent 90deg,
              rgba(235, 200, 98, 0.02) 135deg,
              transparent 180deg,
              rgba(247, 231, 206, 0.03) 225deg,
              transparent 270deg,
              rgba(235, 200, 98, 0.02) 315deg,
              transparent 360deg
            );
          animation: rayRotate 60s linear infinite;
          pointer-events: none;
        }

        @keyframes rayRotate {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }

        .journal-title {
          animation: titleGlow 4s ease-in-out infinite;
        }

        @keyframes titleGlow {
          0%, 100% {
            text-shadow:
              0 0 20px rgba(247, 231, 206, 0.6),
              0 0 40px rgba(235, 200, 98, 0.3);
          }
          50% {
            text-shadow:
              0 0 30px rgba(247, 231, 206, 0.8),
              0 0 60px rgba(235, 200, 98, 0.5),
              0 0 90px rgba(235, 200, 98, 0.2);
          }
        }

        .journal-container {
          animation: containerFloat 6s ease-in-out infinite;
        }

        @keyframes containerFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .jade-tablet {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(240, 240, 235, 0.12) 0%,
            rgba(230, 235, 230, 0.15) 50%,
            rgba(235, 235, 230, 0.12) 100%
          );
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(247, 231, 206, 0.15);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 0 60px rgba(255, 255, 255, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 80px rgba(247, 231, 206, 0.1);
          overflow: hidden;
        }

        .inner-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          background: radial-gradient(
            circle at center,
            rgba(247, 231, 206, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
          animation: innerPulse 5s ease-in-out infinite;
        }

        @keyframes innerPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .journal-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.95);
          font-size: 18px;
          line-height: 1.8;
          letter-spacing: 0.02em;
          resize: none;
          font-weight: 300;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }

        .journal-textarea::placeholder {
          color: rgba(247, 231, 206, 0.4);
          font-style: italic;
        }

        .journal-textarea::-webkit-scrollbar {
          width: 6px;
        }

        .journal-textarea::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .journal-textarea::-webkit-scrollbar-thumb {
          background: rgba(247, 231, 206, 0.3);
          border-radius: 3px;
        }

        .journal-textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(247, 231, 206, 0.5);
        }

        .voice-button {
          position: relative;
          width: 80px;
          height: 80px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .voice-button-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(247, 231, 206, 0.6);
          box-shadow:
            0 0 20px rgba(247, 231, 206, 0.5),
            0 0 40px rgba(235, 200, 98, 0.3),
            inset 0 0 20px rgba(247, 231, 206, 0.2);
          transition: all 0.15s ease;
        }

        .voice-button.listening .voice-button-ring {
          animation: pulseRing 1.5s ease-in-out infinite;
        }

        @keyframes pulseRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        .voice-button-inner {
          position: relative;
          z-index: 2;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.25) 0%,
            rgba(235, 200, 98, 0.15) 100%
          );
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F7E7CE;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .voice-button:hover .voice-button-inner {
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.35) 0%,
            rgba(235, 200, 98, 0.25) 100%
          );
          box-shadow:
            0 6px 25px rgba(247, 231, 206, 0.3),
            inset 0 0 25px rgba(255, 255, 255, 0.15);
        }

        .voice-button.listening .voice-button-inner {
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.45) 0%,
            rgba(235, 200, 98, 0.35) 100%
          );
          animation: innerGlow 2s ease-in-out infinite;
        }

        @keyframes innerGlow {
          0%, 100% {
            box-shadow:
              0 4px 20px rgba(247, 231, 206, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 6px 30px rgba(247, 231, 206, 0.6),
              inset 0 0 30px rgba(255, 255, 255, 0.3);
          }
        }

        .listening-indicator {
          position: absolute;
          bottom: -30px;
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .sound-wave {
          width: 3px;
          height: 16px;
          background: linear-gradient(
            to top,
            rgba(247, 231, 206, 0.8),
            rgba(235, 200, 98, 0.4)
          );
          border-radius: 2px;
          animation: soundWave 0.8s ease-in-out infinite;
        }

        @keyframes soundWave {
          0%, 100% {
            height: 8px;
            opacity: 0.5;
          }
          50% {
            height: 20px;
            opacity: 1;
          }
        }

        .success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .success-message {
          padding: 32px 64px;
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.2) 0%,
            rgba(235, 200, 98, 0.15) 100%
          );
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(247, 231, 206, 0.3);
          color: #F7E7CE;
          font-size: 24px;
          letter-spacing: 0.3em;
          text-shadow: 0 0 20px rgba(247, 231, 206, 0.8);
          box-shadow:
            0 0 40px rgba(247, 231, 206, 0.4),
            0 0 80px rgba(235, 200, 98, 0.2);
          animation: successPulse 1.5s ease-in-out;
        }

        @keyframes successPulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
