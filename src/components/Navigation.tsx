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
      className="fixed bottom-0 left-0 right-0 border-t ethereal-transition transparent-nav"
      style={{
        backgroundColor: 'transparent',
        borderTopColor: 'rgba(235, 200, 98, 0.1)',
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-6 py-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-4 ethereal-transition nav-tab"
              style={{
                color: '#EBC862',
                opacity: isActive ? 1 : 0.5,
                position: 'relative',
              }}
            >
              <Icon size={22} strokeWidth={1} />
              <span className="text-xs font-light" style={{ letterSpacing: '0.04em' }}>{tab.label}</span>
              {isActive && <div className="golden-glow" />}
            </button>
          );
        })}
      </div>

      <style>{`
        .transparent-nav {
          backdrop-filter: none;
        }

        .nav-tab:hover {
          opacity: 1 !important;
        }

        .golden-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #EBC862;
          box-shadow:
            0 0 8px 2px rgba(235, 200, 98, 0.8),
            0 0 16px 4px rgba(235, 200, 98, 0.4);
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.8;
            box-shadow:
              0 0 8px 2px rgba(235, 200, 98, 0.8),
              0 0 16px 4px rgba(235, 200, 98, 0.4);
          }
          50% {
            opacity: 1;
            box-shadow:
              0 0 12px 3px rgba(235, 200, 98, 1),
              0 0 24px 6px rgba(235, 200, 98, 0.6);
          }
        }
      `}</style>
    </nav>
  );
}
