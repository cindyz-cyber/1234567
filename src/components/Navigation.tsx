import { Home, Sparkles, FileText, User, Settings } from 'lucide-react';

interface NavigationProps {
  currentTab: 'breath' | 'energy' | 'archive' | 'profile' | 'admin';
  onTabChange: (tab: 'breath' | 'energy' | 'archive' | 'profile' | 'admin') => void;
  isAdmin?: boolean;
}

export default function Navigation({ currentTab, onTabChange, isAdmin = false }: NavigationProps) {
  const baseTabs = [
    { id: 'breath' as const, label: '呼吸', icon: Home },
    { id: 'energy' as const, label: '能量', icon: Sparkles },
    { id: 'archive' as const, label: '档案', icon: FileText },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  const tabs = isAdmin
    ? [...baseTabs, { id: 'admin' as const, label: '后台', icon: Settings }]
    : baseTabs;

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full ethereal-transition floating-dock"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '0.5px solid rgba(247, 231, 206, 0.12)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(247, 231, 206, 0.05) inset',
        padding: '12px 24px',
        zIndex: 50,
      }}
    >
      <div className="flex items-center justify-center gap-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1.5 ethereal-transition nav-tab"
              style={{
                color: '#F7E7CE',
                opacity: isActive ? 1 : 0.4,
                position: 'relative',
                padding: '8px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Icon size={20} strokeWidth={1.5} />
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#F7E7CE',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    boxShadow: '0 0 12px 3px rgba(247, 231, 206, 0.8), 0 0 24px 6px rgba(247, 231, 206, 0.4)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .floating-dock {
          animation: dockFloat 4s ease-in-out infinite;
        }

        @keyframes dockFloat {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -4px);
          }
        }

        .nav-tab:hover {
          opacity: 1 !important;
          transform: scale(1.1);
        }
      `}</style>
    </nav>
  );
}
