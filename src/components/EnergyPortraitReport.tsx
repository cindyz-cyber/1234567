import { useState } from 'react';
import { KinEnergyReport } from '../types/energyPortrait';
import { Sparkles, Heart, Radio, Eye, Zap, Users } from 'lucide-react';

interface Props {
  report: KinEnergyReport;
  onBack: () => void;
}

export default function EnergyPortraitReport({ report, onBack }: Props) {
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);
  const hasQuantumResonance = report.quantumResonances.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
        >
          ← 返回
        </button>

        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-sm font-bold mb-4">
            Kin {report.kin}
          </div>
          <h1 className="text-4xl font-bold mb-2">能量画像报告</h1>
          <p className="text-gray-400">量子层面的灵魂解析</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold">能量画像</h2>
          </div>

          <div className="space-y-4 text-lg">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-semibold min-w-24">模式：</span>
              <span className="text-white">{report.portrait.mode}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-semibold min-w-24">视角：</span>
              <span className="text-white">{report.portrait.perspective}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-semibold min-w-24">本质：</span>
              <span className="text-white leading-relaxed">{report.portrait.essence}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/10 relative overflow-hidden">
          {hasQuantumResonance && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 via-transparent to-transparent animate-pulse-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-ripple"></div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-8 relative z-10">
            <Radio className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-bold">能量雷达图</h2>
            {hasQuantumResonance && (
              <span className="ml-auto text-xs px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                检测到家族共振
              </span>
            )}
          </div>

          <div className="relative w-full aspect-square max-w-md mx-auto mb-8">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <radialGradient id="glowGradient">
                  <stop offset="0%" stopColor="rgba(147, 51, 234, 0.4)" />
                  <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
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
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
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
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                );
              })}

              <path
                d={generateRadarPath(report.portrait.centers)}
                fill="url(#glowGradient)"
                stroke="#a78bfa"
                strokeWidth="3"
                filter="url(#glow)"
                className="transition-all duration-300"
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
                      r={isHovered ? "8" : "6"}
                      fill="#8b5cf6"
                      stroke="#fff"
                      strokeWidth="2"
                      filter="url(#glow)"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredCenter(i)}
                      onMouseLeave={() => setHoveredCenter(null)}
                    />
                    {isHovered && (
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {center.percentage}%
                      </text>
                    )}
                  </g>
                );
              })}

              {report.portrait.centers.map((center, i) => {
                const angle = (i * 120 - 90) * (Math.PI / 180);
                const labelRadius = 180;
                const x = 200 + Math.cos(angle) * labelRadius;
                const y = 200 + Math.sin(angle) * labelRadius;

                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="16"
                    fontWeight="600"
                  >
                    {center.icon} {center.name}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="grid gap-4 relative z-10">
            {report.portrait.centers.map((center, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors"
                onMouseEnter={() => setHoveredCenter(i)}
                onMouseLeave={() => setHoveredCenter(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{center.icon}</span>
                    <span className="font-bold text-lg">{center.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{center.percentage}%</div>
                    <div className="text-xs text-gray-400">{center.mode}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{center.description}</p>
              </div>
            ))}
          </div>
        </div>

        {hasQuantumResonance && (
          <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-yellow-400" size={24} />
              <h2 className="text-2xl font-bold">量子信息共振</h2>
            </div>

            <div className="space-y-4">
              {report.quantumResonances.map((resonance, i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {resonance.relationName.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-bold">{resonance.relationName}</div>
                        <div className="text-sm text-gray-400">Kin {resonance.kin}</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs border border-yellow-500/30">
                      {resonance.typeLabel}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{resonance.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-bold">2026 白风年显化建议</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-semibold min-w-32">年度主题：</span>
              <span className="text-white">{report.yearGuidance.theme} - {report.yearGuidance.mainEnergy}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-semibold min-w-32">实修建议：</span>
              <span className="text-white leading-relaxed">{report.yearGuidance.advice}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-lg rounded-3xl p-8 border border-red-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="text-red-400" size={24} />
            <h2 className="text-2xl font-bold">核心卡点与突破路径</h2>
          </div>

          <div className="bg-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-red-400" size={20} />
              <span className="font-bold text-lg">当前卡点：{report.weakestCenter}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">{report.challengeAdvice}</p>
          </div>
        </div>
      </div>
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
