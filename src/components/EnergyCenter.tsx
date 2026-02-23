import { useState } from 'react';
import { Play, Lock } from 'lucide-react';
import BrainShutdown from './BrainShutdown';
import FrequencyPlayer from './FrequencyPlayer';

const BRAINWAVE_FREQUENCIES = [
  {
    id: 'delta',
    name: '深度修复',
    type: 'Delta',
    description: '在空无中，找回身体最原始的修复力。',
    waveSpeed: 4,
    waveAmplitude: 10,
    color: 'rgba(184, 134, 11, 0.2)',
  },
  {
    id: 'theta',
    name: '高我连接',
    type: 'Theta',
    description: '直觉与冥想的共振，触碰潜意识的智慧。',
    waveSpeed: 3,
    waveAmplitude: 20,
    color: 'rgba(184, 134, 11, 0.25)',
  },
  {
    id: 'alpha',
    name: '压力释放',
    type: 'Alpha',
    description: '在平静中释放，让紧绷的神经回归柔软。',
    waveSpeed: 2.5,
    waveAmplitude: 25,
    color: 'rgba(184, 134, 11, 0.3)',
  },
  {
    id: 'beta',
    name: '高效专注',
    type: 'Beta',
    description: '逻辑与专注的频率，点亮清晰的思维之光。',
    waveSpeed: 1.5,
    waveAmplitude: 35,
    color: 'rgba(184, 134, 11, 0.35)',
  },
];

const AUDIO_CATEGORIES = [
  {
    id: 'energy',
    title: '正气补给',
    items: [
      { id: 1, name: '晨光能量', duration: '8分钟' },
      { id: 2, name: '午后充电', duration: '10分钟' },
    ],
  },
  {
    id: 'relax',
    title: '颅内放松',
    items: [
      { id: 3, name: '深度放松', duration: '15分钟' },
      { id: 4, name: '压力释放', duration: '12分钟' },
    ],
  },
  {
    id: 'meditation',
    title: '静心冥想',
    items: [
      { id: 5, name: '呼吸觉察', duration: '20分钟' },
      { id: 6, name: '身体扫描', duration: '18分钟' },
    ],
  },
];

interface EnergyCenterProps {
  isPremium?: boolean;
  onPremiumRequired?: () => void;
}

export default function EnergyCenter({ isPremium = false, onPremiumRequired }: EnergyCenterProps) {
  const [showBrainShutdown, setShowBrainShutdown] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<typeof BRAINWAVE_FREQUENCIES[0] | null>(null);

  const handleFeatureClick = (callback: () => void) => {
    if (!isPremium && onPremiumRequired) {
      onPremiumRequired();
    } else {
      callback();
    }
  };

  if (showBrainShutdown) {
    return <BrainShutdown onClose={() => setShowBrainShutdown(false)} />;
  }

  if (selectedFrequency) {
    return <FrequencyPlayer frequency={selectedFrequency} onClose={() => setSelectedFrequency(null)} />;
  }

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-4">
          <h3 className="text-xl font-light" style={{ color: '#EBC862', letterSpacing: '0.06em' }}>
            波频处方
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {BRAINWAVE_FREQUENCIES.map((freq) => (
              <button
                key={freq.id}
                onClick={() => handleFeatureClick(() => setSelectedFrequency(freq))}
                className="relative p-5 rounded-2xl backdrop-blur-xl ethereal-transition frequency-card text-left overflow-hidden"
                style={{
                  backgroundColor: 'rgba(2, 10, 9, 0.6)',
                  backdropFilter: 'blur(15px)',
                  border: '0.5px solid #EBC862',
                  boxShadow: '0 4px 20px rgba(235, 200, 98, 0.1)',
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400)',
                    opacity: 0.15,
                  }}
                />
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />

                <div className="relative z-10 space-y-2">
                  {!isPremium && (
                    <Lock size={14} className="absolute top-0 right-0" style={{ color: '#EBC862', opacity: 0.6 }} />
                  )}
                  <p className="text-xs font-light" style={{ color: '#EBC862', letterSpacing: '0.08em', opacity: 0.8 }}>
                    {freq.type}
                  </p>
                  <h4 className="text-base font-light" style={{ color: '#E0E0D0', letterSpacing: '0.04em' }}>
                    {freq.name}
                  </h4>
                  <p className="text-xs font-light leading-relaxed" style={{ color: '#E0E0D0', opacity: 0.7, letterSpacing: '0.02em' }}>
                    {freq.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleFeatureClick(() => setShowBrainShutdown(true))}
          className="relative w-full h-56 rounded-3xl backdrop-blur-xl ethereal-transition overflow-hidden glassmorphic-card"
          style={{
            backgroundColor: 'rgba(2, 10, 9, 0.6)',
            backdropFilter: 'blur(15px)',
            border: '0.5px solid #EBC862',
            boxShadow: '0 8px 32px rgba(235, 200, 98, 0.15)',
          }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800)',
                opacity: 0.25,
              }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />

            <div className="relative z-10 text-center">
              {!isPremium && (
                <Lock size={20} className="mx-auto mb-3" style={{ color: '#EBC862', opacity: 0.8 }} />
              )}
              <h2 className="text-3xl font-light mb-2" style={{ color: '#EBC862', letterSpacing: '0.08em' }}>
                脑内关机
              </h2>
              <p className="text-sm font-light" style={{ color: '#E0E0D0', letterSpacing: '0.05em', opacity: 0.8 }}>
                进入深层静默
              </p>
            </div>
          </div>
        </button>

        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-light" style={{ color: '#EBC862', letterSpacing: '0.06em' }}>
            声音补给
          </h3>

          {AUDIO_CATEGORIES.map(category => (
            <div key={category.id} className="space-y-3">
              <h4 className="text-base font-light" style={{ color: '#EBC862', letterSpacing: '0.05em', opacity: 0.85 }}>
                {category.title}
              </h4>
              <div className="space-y-3">
                {category.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleFeatureClick(() => {})}
                    className="relative w-full p-4 rounded-2xl backdrop-blur-xl ethereal-transition flex items-center justify-between glassmorphic-audio-card overflow-hidden"
                    style={{
                      backgroundColor: 'rgba(2, 10, 9, 0.6)',
                      backdropFilter: 'blur(15px)',
                      border: '0.5px solid #EBC862',
                      boxShadow: '0 4px 16px rgba(235, 200, 98, 0.08)',
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url(https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400)',
                        opacity: 0.1,
                      }}
                    />
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />

                    <div className="relative z-10 text-left">
                      <p className="font-light" style={{ color: '#E0E0D0', letterSpacing: '0.04em' }}>
                        {item.name}
                      </p>
                      <p className="text-xs font-light" style={{ color: '#E0E0D0', letterSpacing: '0.04em', opacity: 0.6 }}>
                        {item.duration}
                      </p>
                    </div>
                    <div
                      className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center ethereal-transition play-button"
                      style={{
                        border: '1px solid #EBC862',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {!isPremium ? (
                        <Lock size={14} style={{ color: '#EBC862', opacity: 0.8 }} />
                      ) : (
                        <Play size={14} style={{ color: '#EBC862' }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .glassmorphic-card:hover {
          box-shadow: 0 12px 40px rgba(235, 200, 98, 0.2);
          transform: translateY(-2px);
        }

        .glassmorphic-audio-card:hover {
          box-shadow: 0 6px 24px rgba(235, 200, 98, 0.15);
          transform: translateY(-1px);
        }

        .frequency-card:hover {
          box-shadow: 0 6px 28px rgba(235, 200, 98, 0.2);
          transform: translateY(-2px);
        }

        .play-button:hover {
          background-color: rgba(235, 200, 98, 0.1);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
