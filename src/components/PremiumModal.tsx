import { X, Sparkles, Zap, Heart } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export default function PremiumModal({ onClose, onSubscribe }: PremiumModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div
        className="relative w-full max-w-md p-8 rounded-3xl"
        style={{
          backgroundColor: 'rgba(2, 10, 9, 0.95)',
          border: '1px solid #EBC862',
          boxShadow: '0 20px 60px rgba(235, 200, 98, 0.3)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110"
          style={{
            border: '0.5px solid rgba(235, 200, 98, 0.5)',
            color: '#EBC862',
          }}
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-light" style={{ color: '#EBC862', letterSpacing: '0.1em' }}>
              植本人专属能量空间
            </h2>
            <p className="text-sm font-light" style={{ color: '#E0E0D0', opacity: 0.8, letterSpacing: '0.04em' }}>
              成为核心植本人，开启深层疗愈之旅
            </p>
          </div>

          <div className="space-y-4 text-left">
            {[
              { icon: Sparkles, text: '全频段脑波音频' },
              { icon: Zap, text: '脑内关机深度放空' },
              { icon: Heart, text: '答案之书智慧指引' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(235, 200, 98, 0.05)',
                  border: '0.5px solid rgba(235, 200, 98, 0.2)',
                }}
              >
                <feature.icon size={20} style={{ color: '#EBC862' }} />
                <p className="font-light" style={{ color: '#E0E0D0', letterSpacing: '0.03em' }}>
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={onSubscribe}
              className="w-full py-4 rounded-full font-light transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(235, 200, 98, 0.15)',
                border: '1.5px solid #EBC862',
                color: '#EBC862',
                letterSpacing: '0.08em',
                boxShadow: '0 0 30px rgba(235, 200, 98, 0.3), inset 0 0 20px rgba(235, 200, 98, 0.1)',
              }}
            >
              立即订阅
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full font-light transition-all hover:opacity-100"
              style={{
                border: '0.5px solid rgba(235, 200, 98, 0.3)',
                color: '#E0E0D0',
                opacity: 0.6,
                letterSpacing: '0.04em',
              }}
            >
              稍后再说
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
