import { X, Sparkles, Zap, Heart } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export default function PremiumModal({ onClose, onSubscribe }: PremiumModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md p-10 rounded-3xl ultra-glass">
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
            <h2
              className="text-3xl font-light"
              style={{
                background: 'linear-gradient(135deg, #F7E7CE 0%, #EBC862 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.1em',
                filter: 'drop-shadow(0 2px 12px rgba(247, 231, 206, 0.5))',
              }}
            >
              植本人专属能量空间
            </h2>
            <p className="text-sm font-light" style={{ color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.12em' }}>
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
                className="flex items-center gap-4 p-5 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '0.5px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <feature.icon size={20} style={{ color: '#F7E7CE' }} />
                <p className="font-light" style={{ color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.12em' }}>
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={onSubscribe}
              className="w-full py-4 rounded-full font-light subscribe-button"
              style={{
                backgroundColor: 'rgba(247, 231, 206, 0.1)',
                border: '1px solid rgba(247, 231, 206, 0.3)',
                color: '#F7E7CE',
                letterSpacing: '0.15em',
                boxShadow: '0 0 30px rgba(247, 231, 206, 0.3)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              立即订阅
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full font-light later-button"
              style={{
                border: '0.5px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
                letterSpacing: '0.12em',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              稍后再说
            </button>
          </div>
          <style>{`
            .subscribe-button:hover {
              transform: scale(1.02);
              box-shadow: 0 0 50px rgba(247, 231, 206, 0.5);
              background-color: rgba(247, 231, 206, 0.15);
            }

            .later-button:hover {
              color: rgba(255, 255, 255, 0.8) !important;
              border-color: rgba(255, 255, 255, 0.2);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
