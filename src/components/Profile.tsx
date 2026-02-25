import { Crown, FileText, Settings, LogOut, RotateCcw } from 'lucide-react';

interface ProfileProps {
  userName: string;
  higherSelfName: string;
  isPremium: boolean;
  onShowPremium: () => void;
  onNavigateArchive: () => void;
  onResetIdentity: () => void;
}

export default function Profile({ userName, higherSelfName, isPremium, onShowPremium, onNavigateArchive, onResetIdentity }: ProfileProps) {
  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="mb-6 text-center privacy-notice" style={{ animation: 'fadeInPrivacy 1.5s ease-in-out' }}>
          <p
            className="text-sm font-light leading-relaxed"
            style={{
              color: '#D4AF37',
              letterSpacing: '0.06em',
              textShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
              lineHeight: '1.8',
            }}
          >
            植本人 <span style={{ color: '#EBC862', fontWeight: 400 }}>{userName}</span>，<br />
            这是你的私人能量信道，仅你可见。
          </p>
        </div>
        <div
          className="p-8 rounded-3xl text-center glassmorphic-profile"
          style={{
            backgroundColor: 'rgba(2, 10, 9, 0.6)',
            border: '0.5px solid #EBC862',
            boxShadow: '0 8px 32px rgba(235, 200, 98, 0.15)',
            backdropFilter: 'blur(15px)',
          }}
        >
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-light profile-avatar"
            style={{
              border: '2px solid #EBC862',
              color: '#EBC862',
              boxShadow: '0 0 40px rgba(235, 200, 98, 0.3)',
              backgroundColor: 'rgba(235, 200, 98, 0.1)',
            }}
          >
            {userName.charAt(0)}
          </div>
          <h2 className="text-2xl font-light mb-2 profile-name" style={{ color: '#EBC862', letterSpacing: '0.06em' }}>
            {userName}
          </h2>
          <p className="text-sm font-light" style={{ color: '#E0E0D0', opacity: 0.8, letterSpacing: '0.03em' }}>
            与 <span className="golden-companion">{higherSelfName}</span> 同行
          </p>

          {isPremium && (
            <div
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                border: '0.5px solid #EBC862',
                backgroundColor: 'rgba(235, 200, 98, 0.1)',
              }}
            >
              <Crown size={16} style={{ color: '#EBC862' }} />
              <span className="text-xs font-light" style={{ color: '#EBC862', letterSpacing: '0.04em' }}>
                植本人
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!isPremium && (
            <button
              onClick={onShowPremium}
              className="w-full p-5 rounded-2xl flex items-center justify-between transition-all active:scale-98 premium-button"
              style={{
                backgroundColor: 'rgba(235, 200, 98, 0.15)',
                border: '1px solid #EBC862',
                boxShadow: '0 8px 24px rgba(235, 200, 98, 0.2), inset 0 0 20px rgba(235, 200, 98, 0.05)',
                backdropFilter: 'blur(15px)',
              }}
            >
              <div className="flex items-center gap-3">
                <Crown size={22} style={{ color: '#EBC862' }} />
                <div className="text-left">
                  <p className="font-light" style={{ color: '#EBC862', letterSpacing: '0.04em' }}>
                    成为核心植本人
                  </p>
                  <p className="text-xs font-light mt-1" style={{ color: '#E0E0D0', opacity: 0.7, letterSpacing: '0.02em' }}>
                    植本人专属能量空间
                  </p>
                </div>
              </div>
            </button>
          )}

          <button
            onClick={onNavigateArchive}
            className="w-full p-4 rounded-2xl flex items-center justify-between transition-all active:scale-98 glassmorphic-button"
            style={{
              backgroundColor: 'rgba(2, 10, 9, 0.6)',
              border: '0.5px solid rgba(235, 200, 98, 0.3)',
              backdropFilter: 'blur(15px)',
            }}
          >
            <div className="flex items-center gap-3">
              <FileText size={20} style={{ color: '#EBC862', opacity: 0.8 }} />
              <span className="font-light" style={{ color: '#E0E0D0', letterSpacing: '0.03em' }}>
                情绪档案
              </span>
            </div>
          </button>

          <button
            className="w-full p-4 rounded-2xl flex items-center justify-between transition-all active:scale-98 glassmorphic-button"
            style={{
              backgroundColor: 'rgba(2, 10, 9, 0.6)',
              border: '0.5px solid rgba(235, 200, 98, 0.3)',
              backdropFilter: 'blur(15px)',
            }}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} style={{ color: '#EBC862', opacity: 0.8 }} />
              <span className="font-light" style={{ color: '#E0E0D0', letterSpacing: '0.03em' }}>
                设置
              </span>
            </div>
          </button>

          <button
            className="w-full p-4 rounded-2xl flex items-center justify-between transition-all active:scale-98 glassmorphic-button"
            style={{
              backgroundColor: 'rgba(2, 10, 9, 0.6)',
              border: '0.5px solid rgba(235, 200, 98, 0.3)',
              backdropFilter: 'blur(15px)',
            }}
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} style={{ color: '#EBC862', opacity: 0.8 }} />
              <span className="font-light" style={{ color: '#E0E0D0', letterSpacing: '0.03em' }}>
                退出登录
              </span>
            </div>
          </button>
        </div>

        <div className="pt-8 text-center space-y-4">
          <button
            onClick={onResetIdentity}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 reset-button"
            style={{
              backgroundColor: 'rgba(235, 200, 98, 0.05)',
              border: '0.5px solid rgba(235, 200, 98, 0.15)',
            }}
          >
            <RotateCcw size={10} style={{ color: '#EBC862', opacity: 0.5 }} />
            <span className="text-[10px] font-light" style={{ color: '#EBC862', opacity: 0.5, letterSpacing: '0.02em' }}>
              重置身份
            </span>
          </button>
          <p className="text-xs font-light" style={{ color: '#E0E0D0', opacity: 0.5, letterSpacing: '0.02em' }}>
            植本逻辑 v1.0.0
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInPrivacy {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .privacy-notice {
          padding: 12px 20px;
          border-radius: 16px;
          background: rgba(212, 175, 55, 0.05);
          border: 0.5px solid rgba(212, 175, 55, 0.2);
        }

        .glassmorphic-profile {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glassmorphic-profile:hover {
          box-shadow: 0 12px 40px rgba(235, 200, 98, 0.2);
        }

        .profile-avatar {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .profile-avatar:hover {
          box-shadow: 0 0 50px rgba(235, 200, 98, 0.5);
        }

        .glassmorphic-button {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glassmorphic-button:hover {
          box-shadow: 0 6px 20px rgba(235, 200, 98, 0.15);
          transform: translateY(-1px);
        }

        .premium-button {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-button:hover {
          box-shadow: 0 12px 32px rgba(235, 200, 98, 0.3), inset 0 0 25px rgba(235, 200, 98, 0.1);
          transform: translateY(-2px);
        }

        .profile-name {
          text-shadow: 0 2px 20px rgba(235, 200, 98, 0.3);
        }

        .golden-companion {
          color: #EBC862;
          font-weight: 400;
          text-shadow: 0 1px 10px rgba(235, 200, 98, 0.4);
        }

        .reset-button:hover {
          background-color: rgba(235, 200, 98, 0.1);
          border-color: rgba(235, 200, 98, 0.3);
        }

        .reset-button:hover span,
        .reset-button:hover svg {
          opacity: 0.7 !important;
        }
      `}</style>
    </div>
  );
}
