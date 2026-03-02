import { useState, useEffect } from 'react';
import { KinEnergyReport } from '../types/energyPortrait';

interface Props {
  report: KinEnergyReport;
  onBack: () => void;
}

export default function EnergyPortraitReport({ report, onBack }: Props) {
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hasQuantumResonance = report.quantumResonances.length > 0;

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="energy-portrait-container">
      <div className="portal-background-layer">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="portal-background-video"
        >
          <source src="https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={`energy-content-wrapper ${isVisible ? 'visible' : ''}`}>
        <button
          onClick={onBack}
          className="mb-12 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background: 'rgba(247, 231, 206, 0.05)',
            border: '1px solid rgba(247, 231, 206, 0.2)',
            color: '#F7E7CE',
            backdropFilter: 'blur(20px)',
            letterSpacing: '0.1em'
          }}
        >
          ← 返回
        </button>

        <div className="text-center mb-20" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <div
            className="inline-block px-8 py-3 rounded-full text-sm mb-6 animate-breath"
            style={{
              background: 'linear-gradient(135deg, rgba(235, 200, 98, 0.15) 0%, rgba(247, 231, 206, 0.15) 100%)',
              border: '1px solid rgba(235, 200, 98, 0.3)',
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            Kin {report.kin}
          </div>
          <h1
            className="text-5xl font-light mb-4"
            style={{
              color: '#F7E7CE',
              textShadow: '0 0 40px rgba(247, 231, 206, 0.2)',
              letterSpacing: '0.15em'
            }}
          >
            能量画像
          </h1>
          <p
            className="text-lg"
            style={{
              color: '#F7E7CE',
              opacity: 0.5,
              letterSpacing: '0.3em'
            }}
          >
            量子层面的灵魂解析
          </p>
        </div>

        <div
          className="mb-20 p-12 rounded-3xl transition-all duration-700 hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, rgba(247, 231, 206, 0.06) 0%, rgba(247, 231, 206, 0.02) 100%)',
            border: '1px solid rgba(247, 231, 206, 0.15)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2
            className="text-3xl font-light text-center mb-12"
            style={{
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            能量画像
          </h2>

          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-6 group">
              <span
                className="font-light min-w-32 transition-all duration-300 group-hover:text-amber-400"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.15em'
                }}
              >
                模式
              </span>
              <span
                className="font-light text-xl leading-relaxed"
                style={{
                  color: '#F7E7CE',
                  letterSpacing: '0.05em'
                }}
              >
                {report.portrait.mode}
              </span>
            </div>
            <div className="flex items-start gap-6 group">
              <span
                className="font-light min-w-32 transition-all duration-300 group-hover:text-amber-400"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.15em'
                }}
              >
                视角
              </span>
              <span
                className="font-light text-xl leading-relaxed"
                style={{
                  color: '#F7E7CE',
                  letterSpacing: '0.05em'
                }}
              >
                {report.portrait.perspective}
              </span>
            </div>
            <div className="flex items-start gap-6 group">
              <span
                className="font-light min-w-32 transition-all duration-300 group-hover:text-amber-400"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.15em'
                }}
              >
                本质
              </span>
              <span
                className="font-light text-xl leading-relaxed"
                style={{
                  color: '#F7E7CE',
                  letterSpacing: '0.05em',
                  lineHeight: '2'
                }}
              >
                {report.portrait.essence}
              </span>
            </div>
          </div>
        </div>

        <div
          className="mb-20 p-12 rounded-3xl relative overflow-hidden transition-all duration-700"
          style={{
            background: hasQuantumResonance
              ? 'linear-gradient(135deg, rgba(235, 200, 98, 0.08) 0%, rgba(247, 231, 206, 0.03) 100%)'
              : 'linear-gradient(135deg, rgba(247, 231, 206, 0.04) 0%, rgba(247, 231, 206, 0.01) 100%)',
            border: hasQuantumResonance
              ? '1px solid rgba(235, 200, 98, 0.25)'
              : '1px solid rgba(247, 231, 206, 0.12)',
            backdropFilter: 'blur(30px)',
            boxShadow: hasQuantumResonance
              ? '0 8px 32px rgba(235, 200, 98, 0.15), 0 0 80px rgba(235, 200, 98, 0.05)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          {hasQuantumResonance && (
            <>
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/3 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
              </div>
              <div className="absolute top-6 right-6 z-10">
                <div
                  className="px-4 py-2 rounded-full text-xs animate-breath"
                  style={{
                    background: 'rgba(235, 200, 98, 0.15)',
                    border: '1px solid rgba(235, 200, 98, 0.3)',
                    color: '#EBC862',
                    letterSpacing: '0.15em'
                  }}
                >
                  家族共振激活
                </div>
              </div>
            </>
          )}

          <h2
            className="text-3xl font-light text-center mb-4 relative z-10"
            style={{
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            能量中心解析
          </h2>
          <p
            className="text-center mb-12 relative z-10"
            style={{
              color: '#F7E7CE',
              opacity: 0.5,
              letterSpacing: '0.2em',
              fontSize: '0.875rem'
            }}
          >
            三维能量雷达图
          </p>

          <div className="relative w-full aspect-square max-w-lg mx-auto mb-16 relative z-10">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <radialGradient id="glowGradient">
                  <stop offset="0%" stopColor="rgba(235, 200, 98, 0.3)" />
                  <stop offset="50%" stopColor="rgba(247, 231, 206, 0.15)" />
                  <stop offset="100%" stopColor="rgba(235, 200, 98, 0)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {[1, 2, 3, 4, 5].map(level => (
                <circle
                  key={level}
                  cx="200"
                  cy="200"
                  r={level * 30}
                  fill="none"
                  stroke="rgba(247, 231, 206, 0.08)"
                  strokeWidth="0.5"
                  className="animate-pulse-slow"
                  style={{ animationDelay: `${level * 0.2}s` }}
                />
              ))}

              {[0, 1, 2].map(i => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const x2 = 200 + Math.cos(angle) * 150;
                const y2 = 200 + Math.sin(angle) * 150;
                return (
                  <line
                    key={i}
                    x1="200"
                    y1="200"
                    x2={x2}
                    y2={y2}
                    stroke="rgba(247, 231, 206, 0.1)"
                    strokeWidth="0.5"
                  />
                );
              })}

              <circle
                cx="200"
                cy="200"
                r="3"
                fill="rgba(235, 200, 98, 0.6)"
                filter="url(#softGlow)"
              />

              <path
                d={generateRadarPath(report.portrait.centers)}
                fill="url(#glowGradient)"
                stroke="rgba(235, 200, 98, 0.6)"
                strokeWidth="2"
                filter="url(#glow)"
                className="transition-all duration-700"
              />

              {report.portrait.centers.map((center, i) => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const radius = (center.percentage / 100) * 150;
                const x = 200 + Math.cos(angle) * radius;
                const y = 200 + Math.sin(angle) * radius;
                const isHovered = hoveredCenter === i;

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? "10" : "6"}
                      fill="rgba(235, 200, 98, 0.8)"
                      stroke="rgba(247, 231, 206, 0.9)"
                      strokeWidth={isHovered ? "3" : "2"}
                      filter="url(#softGlow)"
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredCenter(i)}
                      onMouseLeave={() => setHoveredCenter(null)}
                    />
                    {isHovered && (
                      <>
                        <circle
                          cx={x}
                          cy={y}
                          r="20"
                          fill="none"
                          stroke="rgba(235, 200, 98, 0.3)"
                          strokeWidth="1"
                          className="animate-pulse-slow"
                        />
                        <text
                          x={x}
                          y={y - 25}
                          textAnchor="middle"
                          fill="#EBC862"
                          fontSize="16"
                          fontWeight="300"
                          style={{ letterSpacing: '0.1em' }}
                        >
                          {center.percentage}%
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {report.portrait.centers.map((center, i) => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const labelRadius = 185;
                const x = 200 + Math.cos(angle) * labelRadius;
                const y = 200 + Math.sin(angle) * labelRadius;

                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="#F7E7CE"
                    fontSize="14"
                    fontWeight="300"
                    style={{ letterSpacing: '0.1em' }}
                    opacity="0.9"
                  >
                    {center.icon} {center.name}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="grid gap-6 relative z-10 max-w-3xl mx-auto">
            {report.portrait.centers.map((center, i) => (
              <div
                key={i}
                className="rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: hoveredCenter === i
                    ? 'linear-gradient(135deg, rgba(235, 200, 98, 0.1) 0%, rgba(247, 231, 206, 0.05) 100%)'
                    : 'rgba(247, 231, 206, 0.03)',
                  border: hoveredCenter === i
                    ? '1px solid rgba(235, 200, 98, 0.3)'
                    : '1px solid rgba(247, 231, 206, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}
                onMouseEnter={() => setHoveredCenter(i)}
                onMouseLeave={() => setHoveredCenter(null)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl opacity-80">{center.icon}</span>
                    <div>
                      <div
                        className="text-2xl font-light mb-1"
                        style={{
                          color: '#F7E7CE',
                          letterSpacing: '0.1em'
                        }}
                      >
                        {center.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          color: '#EBC862',
                          opacity: 0.7,
                          letterSpacing: '0.15em'
                        }}
                      >
                        {center.mode}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-4xl font-light mb-1"
                      style={{
                        color: '#EBC862',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {center.percentage}%
                    </div>
                  </div>
                </div>
                <p
                  className="leading-relaxed"
                  style={{
                    color: '#F7E7CE',
                    opacity: 0.8,
                    fontSize: '0.95rem',
                    lineHeight: '1.9',
                    letterSpacing: '0.03em'
                  }}
                >
                  {center.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {hasQuantumResonance && (
          <div
            className="mb-20 p-12 rounded-3xl relative overflow-hidden transition-all duration-700"
            style={{
              background: 'linear-gradient(135deg, rgba(235, 200, 98, 0.1) 0%, rgba(247, 231, 206, 0.04) 100%)',
              border: '1px solid rgba(235, 200, 98, 0.25)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 8px 32px rgba(235, 200, 98, 0.2)'
            }}
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
            </div>

            <h2
              className="text-3xl font-light text-center mb-4 relative z-10"
              style={{
                color: '#EBC862',
                letterSpacing: '0.2em'
              }}
            >
              量子信息共振
            </h2>
            <p
              className="text-center mb-12 relative z-10"
              style={{
                color: '#F7E7CE',
                opacity: 0.5,
                letterSpacing: '0.2em',
                fontSize: '0.875rem'
              }}
            >
              家族能量场的量子纠缠
            </p>

            <div className="space-y-6 max-w-3xl mx-auto relative z-10">
              {report.quantumResonances.map((resonance, i) => (
                <div
                  key={i}
                  className="rounded-3xl p-8 transition-all duration-500 hover:scale-[1.01]"
                  style={{
                    background: 'rgba(247, 231, 206, 0.04)',
                    border: '1px solid rgba(235, 200, 98, 0.2)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-light"
                        style={{
                          background: 'linear-gradient(135deg, rgba(235, 200, 98, 0.3) 0%, rgba(247, 231, 206, 0.2) 100%)',
                          border: '1px solid rgba(235, 200, 98, 0.4)',
                          color: '#EBC862',
                          letterSpacing: '0.1em'
                        }}
                      >
                        {resonance.relationName.slice(0, 1)}
                      </div>
                      <div>
                        <div
                          className="text-xl font-light mb-1"
                          style={{
                            color: '#F7E7CE',
                            letterSpacing: '0.1em'
                          }}
                        >
                          {resonance.relationName}
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            color: '#F7E7CE',
                            opacity: 0.5,
                            letterSpacing: '0.15em'
                          }}
                        >
                          Kin {resonance.kin}
                        </div>
                      </div>
                    </div>
                    <div
                      className="px-4 py-2 rounded-full text-xs"
                      style={{
                        background: 'rgba(235, 200, 98, 0.15)',
                        border: '1px solid rgba(235, 200, 98, 0.3)',
                        color: '#EBC862',
                        letterSpacing: '0.15em'
                      }}
                    >
                      {resonance.typeLabel}
                    </div>
                  </div>
                  <p
                    className="leading-relaxed"
                    style={{
                      color: '#F7E7CE',
                      opacity: 0.8,
                      fontSize: '0.95rem',
                      lineHeight: '1.9',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {resonance.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="mb-20 p-12 rounded-3xl transition-all duration-700"
          style={{
            background: 'linear-gradient(135deg, rgba(247, 231, 206, 0.06) 0%, rgba(247, 231, 206, 0.02) 100%)',
            border: '1px solid rgba(247, 231, 206, 0.15)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2
            className="text-3xl font-light text-center mb-4"
            style={{
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            2026 白风年显化建议
          </h2>
          <p
            className="text-center mb-12"
            style={{
              color: '#F7E7CE',
              opacity: 0.5,
              letterSpacing: '0.2em',
              fontSize: '0.875rem'
            }}
          >
            宇宙周期的实修指引
          </p>

          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-6">
              <span
                className="font-light min-w-32"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.15em'
                }}
              >
                年度主题
              </span>
              <span
                className="font-light text-xl leading-relaxed"
                style={{
                  color: '#F7E7CE',
                  letterSpacing: '0.05em'
                }}
              >
                {report.yearGuidance.theme} - {report.yearGuidance.mainEnergy}
              </span>
            </div>
            <div className="flex items-start gap-6">
              <span
                className="font-light min-w-32"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.15em'
                }}
              >
                实修建议
              </span>
              <span
                className="font-light text-lg leading-relaxed"
                style={{
                  color: '#F7E7CE',
                  letterSpacing: '0.03em',
                  lineHeight: '2'
                }}
              >
                {report.yearGuidance.advice}
              </span>
            </div>
          </div>
        </div>

        <div
          className="mb-12 p-12 rounded-3xl transition-all duration-700"
          style={{
            background: 'linear-gradient(135deg, rgba(247, 231, 206, 0.05) 0%, rgba(235, 200, 98, 0.02) 100%)',
            border: '1px solid rgba(247, 231, 206, 0.12)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2
            className="text-3xl font-light text-center mb-12"
            style={{
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            核心卡点与突破路径
          </h2>

          <div
            className="rounded-3xl p-8 max-w-2xl mx-auto"
            style={{
              background: 'rgba(247, 231, 206, 0.03)',
              border: '1px solid rgba(247, 231, 206, 0.15)'
            }}
          >
            <div className="mb-6">
              <span
                className="text-lg font-light"
                style={{
                  color: '#F7E7CE',
                  opacity: 0.6,
                  letterSpacing: '0.15em'
                }}
              >
                当前卡点
              </span>
              <div
                className="text-2xl font-light mt-2"
                style={{
                  color: '#EBC862',
                  letterSpacing: '0.1em'
                }}
              >
                {report.weakestCenter}
              </div>
            </div>
            <p
              className="leading-relaxed"
              style={{
                color: '#F7E7CE',
                opacity: 0.8,
                fontSize: '0.95rem',
                lineHeight: '2',
                letterSpacing: '0.03em'
              }}
            >
              {report.challengeAdvice}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .energy-portrait-container {
          position: fixed;
          inset: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .portal-background-layer {
          position: fixed;
          inset: 0;
          z-index: 1;
        }

        .portal-background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.1) contrast(1.05);
        }

        .energy-content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 1536px;
          margin: 0 auto;
          padding: 2rem 1.5rem 8rem;
          opacity: 0;
          transform: translateY(2rem);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .energy-content-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

function generateRadarPath(centers: Array<{ percentage: number }>): string {
  const points = centers.map((center, i) => {
    const angle = (i * 120 - 90) * (Math.PI / 180);
    const radius = (center.percentage / 100) * 150;
    const x = 200 + Math.cos(angle) * radius;
    const y = 200 + Math.sin(angle) * radius;
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')} Z`;
}
