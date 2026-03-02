import { useState } from 'react';
import { Home, FileText, User, Settings, Upload, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentTab: 'breath' | 'person' | 'profile' | 'admin' | 'samples';
  onTabChange: (tab: 'breath' | 'person' | 'profile' | 'admin' | 'samples') => void;
  isAdmin?: boolean;
}

export default function Navigation({ currentTab, onTabChange, isAdmin = false }: NavigationProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const baseTabs = [
    { id: 'breath' as const, label: '觉察日记', icon: Home },
    { id: 'person' as const, label: '能量自测', icon: Sparkles },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  const tabs = isAdmin
    ? [...baseTabs, { id: 'admin' as const, label: '后台', icon: Settings }, { id: 'samples' as const, label: '样本', icon: Upload }]
    : baseTabs;

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full ethereal-transition floating-dock"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '0.5px solid rgba(247, 231, 206, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(247, 231, 206, 0.03) inset',
        padding: '12px 24px',
        zIndex: 50,
        opacity: 0.9,
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
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
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
              {hoveredTab === tab.id && (
                <div
                  className="tooltip-label"
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-8px)',
                    whiteSpace: 'nowrap',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(247, 231, 206, 0.95)',
                    color: '#1a1a1a',
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(247, 231, 206, 0.4)',
                    pointerEvents: 'none',
                    animation: 'tooltipFadeIn 0.2s ease-out forwards',
                  }}
                >
                  {tab.label}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid rgba(247, 231, 206, 0.95)',
                    }}
                  />
                </div>
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

        @keyframes tooltipFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-8px);
          }
        }
      `}</style>
    </nav>
  );
}
