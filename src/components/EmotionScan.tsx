import { useState } from 'react';
import GoldButton from './GoldButton';

interface EmotionScanProps {
  onNext: (emotions: string[], bodyStates: string[]) => void;
}

const EMOTIONS = ['焦虑', '平和', '愤怒', '喜悦', '迷茫', '疲惫', '其他'];
const BODY_STATES = ['胸闷', '紧绷', '轻盈', '温热', '酸涩', '其他'];

export default function EmotionScan({ onNext }: EmotionScanProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedBodyStates, setSelectedBodyStates] = useState<string[]>([]);
  const [showEmotionInput, setShowEmotionInput] = useState(false);
  const [showBodyInput, setShowBodyInput] = useState(false);
  const [customEmotion, setCustomEmotion] = useState('');
  const [customBody, setCustomBody] = useState('');

  const toggleEmotion = (emotion: string) => {
    if (emotion === '其他') {
      setShowEmotionInput(!showEmotionInput);
      if (customEmotion && !showEmotionInput) {
        setSelectedEmotions(prev => [...prev.filter(e => e !== '其他'), customEmotion]);
        setCustomEmotion('');
      }
      return;
    }

    const newEmotions = selectedEmotions.includes(emotion)
      ? selectedEmotions.filter(e => e !== emotion)
      : [...selectedEmotions, emotion];

    setSelectedEmotions(newEmotions);
  };

  const toggleBodyState = (state: string) => {
    if (state === '其他') {
      setShowBodyInput(!showBodyInput);
      if (customBody && !showBodyInput) {
        setSelectedBodyStates(prev => [...prev.filter(s => s !== '其他'), customBody]);
        setCustomBody('');
      }
      return;
    }

    setSelectedBodyStates(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const handleCustomEmotionSubmit = () => {
    if (customEmotion.trim()) {
      setSelectedEmotions(prev => [...prev, customEmotion.trim()]);
      setCustomEmotion('');
      setShowEmotionInput(false);
    }
  };

  const handleCustomBodySubmit = () => {
    if (customBody.trim()) {
      setSelectedBodyStates(prev => [...prev, customBody.trim()]);
      setCustomBody('');
      setShowBodyInput(false);
    }
  };

  const handleNext = () => {
    if (selectedEmotions.length > 0 || selectedBodyStates.length > 0) {
      onNext(selectedEmotions, selectedBodyStates);
    }
  };

  const hasSelections = selectedEmotions.length > 0 || selectedBodyStates.length > 0;

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 breathing-fade">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-8">
            <div className="emotion-glow" />
            <div className="emotion-circle" />
          </div>
          <h2
            className="text-2xl font-light text-center"
            style={{ color: '#EBC862', letterSpacing: '0.05em' }}
          >
            情绪扫描
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <h3
              className="text-lg font-light mb-4"
              style={{ color: '#E0E0D0', letterSpacing: '0.03em', opacity: 0.8 }}
            >
              情绪
            </h3>
            <div className="flex flex-wrap gap-3">
              {EMOTIONS.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  className="glassmorphic-tag"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '24px',
                    backgroundColor: (selectedEmotions.includes(emotion) || (emotion === '其他' && showEmotionInput))
                      ? 'rgba(235, 200, 98, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: (selectedEmotions.includes(emotion) || (emotion === '其他' && showEmotionInput)) ? '#EBC862' : 'rgba(224, 224, 208, 0.7)',
                    border: (selectedEmotions.includes(emotion) || (emotion === '其他' && showEmotionInput))
                      ? '1px solid #EBC862'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: (selectedEmotions.includes(emotion) || (emotion === '其他' && showEmotionInput))
                      ? '0 0 20px rgba(235, 200, 98, 0.3)'
                      : 'none',
                    letterSpacing: '0.02em',
                    fontWeight: '300',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                >
                  {emotion}
                </button>
              ))}
            </div>
            {showEmotionInput && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={customEmotion}
                  onChange={(e) => setCustomEmotion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomEmotionSubmit()}
                  placeholder="输入自定义情绪"
                  className="flex-1 px-4 py-3 rounded-2xl font-light"
                  style={{
                    backgroundColor: 'rgba(2, 10, 9, 0.6)',
                    border: '0.5px solid #EBC862',
                    color: '#E0E0D0',
                    letterSpacing: '0.02em',
                    backdropFilter: 'blur(20px)',
                    outline: 'none',
                  }}
                  autoFocus
                />
                <button
                  onClick={handleCustomEmotionSubmit}
                  className="px-6 py-3 rounded-2xl font-light"
                  style={{
                    backgroundColor: 'rgba(235, 200, 98, 0.2)',
                    border: '1px solid #EBC862',
                    color: '#EBC862',
                    letterSpacing: '0.03em',
                  }}
                >
                  确认
                </button>
              </div>
            )}
          </div>

          <div>
            <h3
              className="text-lg font-light mb-4"
              style={{ color: '#E0E0D0', letterSpacing: '0.03em', opacity: 0.8 }}
            >
              身体
            </h3>
            <div className="flex flex-wrap gap-3">
              {BODY_STATES.map(state => (
                <button
                  key={state}
                  onClick={() => toggleBodyState(state)}
                  className="glassmorphic-tag"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '24px',
                    backgroundColor: (selectedBodyStates.includes(state) || (state === '其他' && showBodyInput))
                      ? 'rgba(235, 200, 98, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: (selectedBodyStates.includes(state) || (state === '其他' && showBodyInput)) ? '#EBC862' : 'rgba(224, 224, 208, 0.7)',
                    border: (selectedBodyStates.includes(state) || (state === '其他' && showBodyInput))
                      ? '1px solid #EBC862'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: (selectedBodyStates.includes(state) || (state === '其他' && showBodyInput))
                      ? '0 0 20px rgba(235, 200, 98, 0.3)'
                      : 'none',
                    letterSpacing: '0.02em',
                    fontWeight: '300',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                >
                  {state}
                </button>
              ))}
            </div>
            {showBodyInput && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomBodySubmit()}
                  placeholder="输入自定义身体状态"
                  className="flex-1 px-4 py-3 rounded-2xl font-light"
                  style={{
                    backgroundColor: 'rgba(2, 10, 9, 0.6)',
                    border: '0.5px solid #EBC862',
                    color: '#E0E0D0',
                    letterSpacing: '0.02em',
                    backdropFilter: 'blur(20px)',
                    outline: 'none',
                  }}
                  autoFocus
                />
                <button
                  onClick={handleCustomBodySubmit}
                  className="px-6 py-3 rounded-2xl font-light"
                  style={{
                    backgroundColor: 'rgba(235, 200, 98, 0.2)',
                    border: '1px solid #EBC862',
                    color: '#EBC862',
                    letterSpacing: '0.03em',
                  }}
                >
                  确认
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        <GoldButton onClick={handleNext} disabled={!hasSelections} className="w-full">
          下一步
        </GoldButton>
      </div>

      <style>{`
        .emotion-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(235, 200, 98, 0.7) 0%, rgba(235, 200, 98, 0.4) 60%, transparent 100%);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 0 40px 15px rgba(235, 200, 98, 0.3),
            inset 0 0 30px rgba(235, 200, 98, 0.4);
        }

        .emotion-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          top: 0;
          left: 0;
          background: radial-gradient(circle, rgba(235, 200, 98, 0.5) 0%, transparent 70%);
          filter: blur(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glassmorphic-tag:hover {
          transform: translateY(-2px);
          background-color: rgba(235, 200, 98, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
