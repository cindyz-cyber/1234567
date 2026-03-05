import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';
import ZenBackground from './ZenBackground';

export default function ShareJournal() {
  const [journalText, setJournalText] = useState('');
  const [energyFeedback, setEnergyFeedback] = useState('');
  const [showPoster, setShowPoster] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const generateEnergyFeedback = (text: string): string => {
    const length = text.length;
    const feedbacks = [
      '你的觉察力正在唤醒，内在的光开始闪耀',
      '每一次书写都是灵魂的自我疗愈',
      '你的文字中蕴含着深邃的智慧',
      '继续保持这份觉知，宇宙会给你回应',
      '你正在通往真实自我的路上',
      '这份诚实与勇气值得被看见',
      '你的内在声音越来越清晰',
      '感受到了吗？你的能量在流动'
    ];

    if (length < 20) return '深呼吸，让更多的觉察流淌出来';
    if (length < 50) return feedbacks[Math.floor(Math.random() * 3)];
    if (length < 100) return feedbacks[Math.floor(Math.random() * 5) + 3];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const handleSubmit = async () => {
    if (!journalText.trim()) return;

    const feedback = generateEnergyFeedback(journalText);
    setEnergyFeedback(feedback);

    try {
      await supabase.from('journal_entries').insert({
        journal_content: journalText,
        source: 'web_share',
        emotions: [],
        body_states: []
      });
    } catch (error) {
      console.warn('Database insert failed (non-critical):', error);
    }
  };

  const generatePoster = async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);
    setShowPoster(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const canvas = await html2canvas(posterRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000',
        scale: 2,
        logging: false
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `植本逻辑-觉察时刻-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
        setIsGenerating(false);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Poster generation failed:', error);
      setIsGenerating(false);
      alert('生成失败，请重试');
    }
  };

  return (
    <div className="share-journal-page">
      <ZenBackground assetId="journal" overlay="rgba(0, 0, 0, 0.3)" />

      <div className="share-container">
        <h1 className="share-title">觉察日记</h1>
        <p className="share-subtitle">记录你内心深处的声音</p>

        <div className="journal-input-wrapper">
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="在这里写下你的觉察..."
            className="journal-input"
            rows={8}
          />
        </div>

        {!energyFeedback && (
          <button
            onClick={handleSubmit}
            disabled={!journalText.trim()}
            className="submit-button"
          >
            提交
          </button>
        )}

        {energyFeedback && (
          <div className="energy-feedback">
            <p className="feedback-text">{energyFeedback}</p>

            <button onClick={generatePoster} disabled={isGenerating} className="poster-button">
              {isGenerating ? '生成中...' : '生成专属能量卡片'}
            </button>

            <p className="poster-hint">长按保存图片，分享你的觉察时刻</p>
          </div>
        )}
      </div>

      {showPoster && (
        <div
          ref={posterRef}
          className="poster-canvas"
          style={{
            position: 'fixed',
            top: '-9999px',
            left: '-9999px',
            width: '750px',
            height: '1334px',
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 100%)',
            padding: '80px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ fontSize: '48px', color: '#F7E7CE', textAlign: 'center', marginBottom: '40px', fontWeight: 300, letterSpacing: '0.2em' }}>
              觉察时刻
            </h2>
            <div style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8', marginBottom: '60px', padding: '40px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
              {journalText.substring(0, 150)}
              {journalText.length > 150 ? '...' : ''}
            </div>
            <div style={{ fontSize: '32px', color: '#EBC862', textAlign: 'center', lineHeight: '1.6', padding: '40px', background: 'rgba(235, 200, 98, 0.1)', borderRadius: '20px', border: '1px solid rgba(235, 200, 98, 0.3)' }}>
              {energyFeedback}
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '24px', color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.15em' }}>
            植本逻辑 · 觉察之旅
          </div>
        </div>
      )}

      <style>{`
        .share-journal-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          will-change: transform;
          -webkit-overflow-scrolling: touch;
        }

        .share-container {
          width: 100%;
          max-width: 600px;
          position: relative;
          z-index: 10;
          padding: 40px 30px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }

        .share-title {
          font-size: 32px;
          font-weight: 300;
          color: #F7E7CE;
          text-align: center;
          margin-bottom: 12px;
          letter-spacing: 0.3em;
          text-shadow: 0 0 20px rgba(247, 231, 206, 0.4);
        }

        .share-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: 0.15em;
        }

        .journal-input-wrapper {
          margin-bottom: 24px;
        }

        .journal-input {
          width: 100%;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 16px;
          line-height: 1.8;
          resize: none;
          outline: none;
          font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", STHeiti, "Microsoft Yahei", sans-serif;
          transition: all 0.3s ease;
        }

        .journal-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .journal-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(247, 231, 206, 0.3);
          box-shadow: 0 0 20px rgba(247, 231, 206, 0.15);
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, rgba(247, 231, 206, 0.15) 0%, rgba(235, 200, 98, 0.15) 100%);
          border: 1px solid rgba(247, 231, 206, 0.3);
          border-radius: 12px;
          color: #F7E7CE;
          font-size: 16px;
          font-weight: 300;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(247, 231, 206, 0.25) 0%, rgba(235, 200, 98, 0.25) 100%);
          box-shadow: 0 4px 20px rgba(247, 231, 206, 0.2);
          transform: translateY(-2px);
        }

        .submit-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .energy-feedback {
          margin-top: 32px;
          padding: 32px 24px;
          background: linear-gradient(135deg, rgba(235, 200, 98, 0.08) 0%, rgba(247, 231, 206, 0.08) 100%);
          border: 1px solid rgba(235, 200, 98, 0.2);
          border-radius: 20px;
          text-align: center;
        }

        .feedback-text {
          font-size: 18px;
          color: #F7E7CE;
          line-height: 1.8;
          margin-bottom: 24px;
          text-shadow: 0 0 15px rgba(247, 231, 206, 0.3);
        }

        .poster-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #F7E7CE 0%, #EBC862 100%);
          border: none;
          border-radius: 12px;
          color: #1a1a2e;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }

        .poster-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(247, 231, 206, 0.4);
        }

        .poster-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .poster-hint {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.1em;
        }

        @media (max-width: 640px) {
          .share-container {
            padding: 30px 20px;
          }

          .share-title {
            font-size: 28px;
          }

          .journal-input {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
