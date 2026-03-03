import { useState, useEffect } from 'react';
import { KinEnergyReport } from '../types/energyPortrait';

interface Props {
  report: KinEnergyReport;
  onBack: () => void;
}

export default function EnergyPortraitReport({ report, onBack }: Props) {
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);
  const [expandedCenter, setExpandedCenter] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasQuantumResonance = report.quantumResonances.length > 0;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const generateRadarPath = (centers: typeof report.portrait.centers) => {
    const points = centers.map((center, i) => {
      const angle = (i * 120 - 90) * (Math.PI / 180);
      const radius = (center.percentage / 100) * 140;
      const x = 200 + Math.cos(angle) * radius;
      const y = 200 + Math.sin(angle) * radius;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* 背景视频层 */}
      <div className="fixed inset-0" style={{ zIndex: 1 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'brightness(1.1) contrast(1.05)',
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
          }}
        >
          <source src="https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* 旋转玛雅历罗盘底纹 */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
        <div className="maya-compass-bg" />
      </div>

      {/* 内容层 */}
      <div className={`relative min-h-screen flex flex-col ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} style={{ zIndex: 10 }}>
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-50 flex items-center justify-center w-11 h-11 rounded-full transition-all hover:scale-110 hover:bg-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(247, 231, 206, 0.15)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="rgba(247, 231, 206, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 首屏：紧凑横向布局 */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
          <div className="w-full max-w-7xl">
            {/* 核心身份卡片 - Kin + 音调 + 图腾 + 波符 */}
            <div className="text-center mb-10">
              {/* 大标题：Kin */}
              <div className="mb-6">
                <h1 className="text-5xl font-light tracking-wide mb-4" style={{
                  color: '#F7E7CE',
                  textShadow: '0 0 40px rgba(247, 231, 206, 0.3)',
                  letterSpacing: '0.15em'
                }}>
                  Kin {report.kin}
                </h1>

                {/* 横向排版：调性图腾 | 波符 */}
                <div className="flex items-center justify-center gap-6 flex-wrap mb-2">
                  <div className="text-xl font-light tracking-widest" style={{
                    color: '#EBC862',
                    letterSpacing: '0.2em'
                  }}>
                    {extractToneAndSeal(report.portrait.essence).toneName}{extractToneAndSeal(report.portrait.essence).sealName}
                  </div>
                  {report.wavespellInfluence && (
                    <>
                      <div
                        className="w-px h-6"
                        style={{ background: 'rgba(247, 231, 206, 0.2)' }}
                      />
                      <div className="text-base font-light tracking-wide" style={{
                        color: '#F7E7CE',
                        opacity: 0.8,
                        letterSpacing: '0.15em'
                      }}>
                        {report.wavespellInfluence}波符
                      </div>
                    </>
                  )}
                </div>

                {/* Kin 199 特殊注解 */}
                {report.kin === 199 && (
                  <div
                    className="text-sm tracking-widest mt-2"
                    style={{
                      color: '#8AB4F8',
                      opacity: 0.7,
                      letterSpacing: '0.2em'
                    }}
                  >
                    自我存在的蓝风波
                  </div>
                )}

                {/* 子时双Kin标识 */}
                {report.midnightType && report.secondaryKin && (
                  <div className="mt-4 inline-block px-6 py-2 rounded-full" style={{
                    background: 'rgba(138, 180, 248, 0.15)',
                    border: '1px solid rgba(138, 180, 248, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div className="text-sm" style={{
                      color: '#8AB4F8',
                      letterSpacing: '0.1em'
                    }}>
                      ⦿ {report.midnightType === 'early' ? '前子时' : '后子时'}双Kin能量携带者
                    </div>
                    <div className="text-xs mt-1" style={{
                      color: '#8AB4F8',
                      opacity: 0.8,
                      letterSpacing: '0.05em'
                    }}>
                      主Kin {report.kin} ({report.midnightType === 'early' ? '40' : '60'}%) + 副Kin {report.secondaryKin} ({report.midnightType === 'early' ? '60' : '40'}%)
                    </div>
                  </div>
                )}
              </div>

              {/* 能量背景卡片 */}
              <div className="inline-block px-8 py-4 rounded-2xl mb-6" style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(247, 231, 206, 0.25)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div className="text-sm font-light leading-relaxed mb-3" style={{
                  color: '#F7E7CE',
                  letterSpacing: '0.08em',
                  lineHeight: '1.8',
                  opacity: 0.95
                }}>
                  {extractEssenceDescription(report.portrait.essence)}
                </div>
                <div className="flex items-center justify-center gap-6 text-xs" style={{
                  color: '#EBC862',
                  opacity: 0.8
                }}>
                  <span className="tracking-wider">{report.portrait.mode}</span>
                  <span>•</span>
                  <span className="tracking-wider">{report.portrait.perspective}</span>
                  <span>•</span>
                  <span className="tracking-wider">{report.wavespellInfluence}</span>
                </div>
              </div>
            </div>

            {/* 三大能量指标（横向卡片） */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.portrait.centers.map((center, i) => (
                <div
                  key={i}
                  className={`frosted-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${expandedCenter === i ? 'ring-2 ring-yellow-500/30' : ''}`}
                  onMouseEnter={() => setHoveredCenter(i)}
                  onMouseLeave={() => setHoveredCenter(null)}
                  onClick={() => setExpandedCenter(expandedCenter === i ? null : i)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{center.icon}</span>
                      <span className="text-sm font-light tracking-wider" style={{
                        color: '#F7E7CE',
                        letterSpacing: '0.1em'
                      }}>
                        {center.name}
                      </span>
                    </div>
                    <span className="text-2xl font-light" style={{
                      color: '#EBC862',
                      fontWeight: 300
                    }}>
                      {center.percentage}%
                    </span>
                  </div>

                  <div className="text-xs mb-3 tracking-wider" style={{
                    color: '#EBC862',
                    opacity: 0.8,
                    letterSpacing: '0.1em'
                  }}>
                    {center.mode}
                  </div>

                  <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{
                      width: `${center.percentage}%`,
                      background: 'linear-gradient(90deg, rgba(235, 200, 98, 0.4) 0%, rgba(235, 200, 98, 0.8) 100%)',
                      boxShadow: '0 0 20px rgba(235, 200, 98, 0.4)'
                    }} />
                  </div>

                  <p className="text-xs font-light leading-relaxed" style={{
                    color: '#F7E7CE',
                    opacity: 0.7,
                    lineHeight: '1.7',
                    letterSpacing: '0.05em'
                  }}>
                    {center.description}
                  </p>

                  {/* 灵性礼物与阴影 */}
                  {expandedCenter === i && center.name === '喉轮' && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-fade-in">
                      {report.soulGift && (
                        <div>
                          <div className="text-xs font-light opacity-60 mb-2 tracking-wider" style={{ color: '#EBC862' }}>
                            灵性礼物 (Soul Gift)
                          </div>
                          <p className="text-xs font-light leading-relaxed" style={{ color: '#F7E7CE', lineHeight: '1.8' }}>
                            {report.soulGift}
                          </p>
                        </div>
                      )}
                      {report.soulShadow && (
                        <div>
                          <div className="text-xs font-light opacity-60 mb-2 tracking-wider" style={{ color: '#EBC862' }}>
                            灵性阴影 (Soul Shadow)
                          </div>
                          <p className="text-xs font-light leading-relaxed" style={{ color: '#F7E7CE', lineHeight: '1.8' }}>
                            {report.soulShadow}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {expandedCenter === i && center.name !== '喉轮' && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2 animate-fade-in">
                      <div>
                        <div className="text-xs font-light opacity-60 mb-1" style={{ color: '#EBC862' }}>初始特质</div>
                        <p className="text-xs font-light leading-relaxed" style={{ color: '#F7E7CE' }}>
                          {center.traits || getDefaultTraits(center.name)}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-light opacity-60 mb-1" style={{ color: '#EBC862' }}>初始弱点</div>
                        <p className="text-xs font-light leading-relaxed" style={{ color: '#F7E7CE' }}>
                          {center.weaknesses || getDefaultWeaknesses(center.name)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 量子共振层 */}
        {hasQuantumResonance && (
          <div className="w-full px-6 py-16" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl font-light tracking-wider mb-1" style={{ color: '#F7E7CE' }}>量子信息共振</h2>
                <p className="text-xs font-light tracking-widest opacity-60" style={{ color: '#EBC862' }}>QUANTUM FAMILY ENTANGLEMENT</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.quantumResonances.map((resonance, i) => {
                  const isMatrixIrrigation = resonance.synergyStrength >= 0.99;
                  const isLifeWhetstone = resonance.typeLabel === '生命磨刀石';
                  const isHighSynergy = resonance.synergyStrength >= 0.8;

                  return (
                    <div
                      key={i}
                      className={`frosted-card p-6 ${isMatrixIrrigation ? 'animate-pulse' : ''}`}
                      style={{
                        background: isMatrixIrrigation
                          ? 'linear-gradient(135deg, rgba(235, 200, 98, 0.15), rgba(255, 215, 0, 0.1))'
                          : isLifeWhetstone
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1))'
                          : 'rgba(0, 0, 0, 0.3)',
                        border: isMatrixIrrigation
                          ? '2px solid rgba(255, 215, 0, 0.5)'
                          : isLifeWhetstone
                          ? '2px solid rgba(139, 92, 246, 0.5)'
                          : '1px solid rgba(247, 231, 206, 0.15)'
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isMatrixIrrigation || isLifeWhetstone ? 'animate-pulse' : ''}`}
                          style={{
                            background: isMatrixIrrigation
                              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(235, 200, 98, 0.3))'
                              : isLifeWhetstone
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))'
                              : 'rgba(235, 200, 98, 0.2)',
                            border: isMatrixIrrigation
                              ? '2px solid rgba(255, 215, 0, 0.6)'
                              : isLifeWhetstone
                              ? '2px solid rgba(139, 92, 246, 0.6)'
                              : '1px solid rgba(235, 200, 98, 0.3)',
                            boxShadow: isMatrixIrrigation
                              ? '0 0 20px rgba(255, 215, 0, 0.4)'
                              : isLifeWhetstone
                              ? '0 0 20px rgba(139, 92, 246, 0.4)'
                              : 'none'
                          }}
                        >
                          {isMatrixIrrigation ? '🌟' : isLifeWhetstone ? '⚡' : '✨'}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-light" style={{ color: '#F7E7CE' }}>
                            {resonance.familyMember}
                          </div>
                          <div
                            className="text-xs opacity-70"
                            style={{
                              color: isMatrixIrrigation
                                ? '#FFD700'
                                : isLifeWhetstone
                                ? '#8B5CF6'
                                : '#EBC862'
                            }}
                          >
                            {resonance.typeLabel}
                          </div>
                        </div>
                        <div
                          className="text-lg font-light"
                          style={{
                            color: isMatrixIrrigation
                              ? '#FFD700'
                              : isLifeWhetstone
                              ? '#8B5CF6'
                              : '#EBC862',
                            fontWeight: isMatrixIrrigation || isLifeWhetstone ? 500 : 300
                          }}
                        >
                          {Math.round(resonance.synergyStrength * 100)}%
                        </div>
                      </div>
                      <p
                        className="text-sm font-light leading-relaxed opacity-90"
                        style={{
                          color: '#F7E7CE',
                          lineHeight: '1.7'
                        }}
                      >
                        {resonance.description}
                      </p>
                      {resonance.synergyDescription && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs font-light opacity-70" style={{ color: '#EBC862' }}>
                            {resonance.synergyDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2026 白风年建议 */}
        <div className="w-full px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="frosted-card p-8 text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{
                background: 'rgba(235, 200, 98, 0.15)',
                border: '1px solid rgba(235, 200, 98, 0.3)'
              }}>
                <span className="text-lg">🌬️</span>
                <span className="text-sm font-light tracking-wider" style={{ color: '#EBC862' }}>
                  {report.yearGuidance.year} {report.yearGuidance.theme}
                </span>
              </div>
              <h3 className="text-lg font-light mb-4" style={{ color: '#F7E7CE' }}>
                {report.yearGuidance.mainEnergy}
              </h3>
              <p className="text-sm font-light leading-relaxed opacity-90" style={{ color: '#F7E7CE', lineHeight: '1.8' }}>
                {report.yearGuidance.advice}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .frosted-card {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(247, 231, 206, 0.15);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .frosted-card:hover {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(247, 231, 206, 0.25);
          transform: translateY(-2px);
        }

        .maya-compass-bg {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(235, 200, 98, 0.03) 0%, transparent 70%);
          border-radius: 50%;
          border: 1px solid rgba(235, 200, 98, 0.08);
          animation: rotate-slow 60s linear infinite;
          position: relative;
        }

        .maya-compass-bg::before,
        .maya-compass-bg::after {
          content: '';
          position: absolute;
          inset: 10%;
          border-radius: 50%;
          border: 1px solid rgba(235, 200, 98, 0.05);
        }

        .maya-compass-bg::after {
          inset: 20%;
          border-color: rgba(235, 200, 98, 0.03);
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes animate-breath {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .animate-breath {
          animation: animate-breath 3s ease-in-out infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function extractToneAndSeal(essence: string): { toneName: string; sealName: string } {
  // essence 格式: "宇宙黄太阳。你是宇宙光明的化身..."
  const match = essence.match(/^(.+?)。/);
  if (match) {
    return {
      toneName: match[1].slice(0, -3), // 提取"宇宙"
      sealName: match[1].slice(-3)      // 提取"黄太阳"
    };
  }
  return { toneName: '', sealName: '' };
}

function extractEssenceDescription(essence: string): string {
  // 提取句号之后的描述部分
  const parts = essence.split('。');
  return parts.slice(1).join('。');
}

function getDefaultTraits(centerName: string): string {
  const traits: Record<string, string> = {
    '喉轮': '天生具备强大的表达力和说服力，言语精准且有穿透力，能够快速将想法转化为行动指令',
    '心轮': '天生拥有强烈的同理心和正义感，能够感受他人情绪，天然的博爱与慈悲心驱使你帮助他人',
    '松果体': '直觉敏锐，逻辑思维强大，能够快速洞察事物本质，质疑精神让你不断追求真理'
  };
  return traits[centerName] || '具备该能量中心的天赋特质';
}

function getDefaultWeaknesses(centerName: string): string {
  const weaknesses: Record<string, string> = {
    '喉轮': '过度使用指令型沟通可能让他人感到压迫，需要学会倾听与温柔表达',
    '心轮': '容易陷入"救世主情结"，过度承担他人情绪负担，需要学会边界感',
    '松果体': '过度质疑可能导致分析瘫痪，需要学会信任直觉并放下控制'
  };
  return weaknesses[centerName] || '需要平衡该能量中心的使用';
}
