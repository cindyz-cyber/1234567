import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, MessageCircle, Eye, Zap, Calendar } from 'lucide-react';
import type { KinEnergyReport } from '../types/kinReport';
import { generateKnowledgeBaseDrivenReport, validateKin66Report } from '../utils/knowledgeBaseDrivenReportEngine';
import { ResonanceTypeDescriptions } from '../types/kinReport';

interface UniversalKinReportProps {
  kin: number;
  familyData?: Array<{ kin: number; name: string }>;
  onClose?: () => void;
}

export default function UniversalKinReport({ kin, familyData, onClose }: UniversalKinReportProps) {
  const [report, setReport] = useState<KinEnergyReport | null>(null);
  const [showQuantumEffect, setShowQuantumEffect] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadReport() {
      try {
        const generatedReport = await generateKnowledgeBaseDrivenReport(kin);

        // Kin 66 自我纠错断言
        await validateKin66Report(generatedReport);

        if (mounted) {
          setReport(generatedReport);

          // 如果有量子共振数据，显示金色涟漪特效
          if (generatedReport.quantumResonances && generatedReport.quantumResonances.length > 0) {
            setShowQuantumEffect(true);
          }
        }
      } catch (error) {
        console.error('报告生成失败:', error);
        if (mounted) {
          setReport(null);
        }
      }
    }

    loadReport();

    return () => {
      mounted = false;
    };
  }, [kin, familyData]);

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-amber-300 animate-pulse">生成能量报告中...</div>
      </div>
    );
  }

  const getCenterIcon = (center: string) => {
    switch (center) {
      case 'heart':
        return <Heart className="w-5 h-5" />;
      case 'throat':
        return <MessageCircle className="w-5 h-5" />;
      case 'pineal':
        return <Eye className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getCenterColor = (center: string) => {
    switch (center) {
      case 'heart':
        return '#EF4444'; // 红色
      case 'throat':
        return '#3B82F6'; // 蓝色
      case 'pineal':
        return '#8B5CF6'; // 紫色
      default:
        return '#EBC862';
    }
  };

  // 版本标识 - 用于调试
  console.log('🔄 UniversalKinReport 渲染 - Kin:', kin, '引擎版本: 2.1.0-gemini-calibrated');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* 金色涟漪特效背景 */}
      {showQuantumEffect && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-400/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-300/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
        </div>
      )}

      {/* 关闭按钮 */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 text-amber-300 hover:text-amber-200 transition-colors"
        >
          <div className="text-2xl">×</div>
        </button>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-light text-amber-300">Kin {kin} 能量报告</h1>
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <div className="text-sm text-amber-200/60 tracking-widest">
            UNIVERSAL ENERGY REPORT
          </div>
        </div>

        {/* 能量画像 - 横向布局 */}
        <section className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20">
          <h2 className="text-2xl font-light text-amber-300 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            能量画像
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-xl border border-amber-500/10">
              <span className="text-amber-200/60 text-sm block mb-2">模式</span>
              <span className="text-lg text-amber-100">{report.profile.mode}</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-amber-500/10">
              <span className="text-amber-200/60 text-sm block mb-2">视角</span>
              <span className="text-lg text-amber-100">{report.profile.perspective}</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-amber-500/10">
              <span className="text-amber-200/60 text-sm block mb-2">波符</span>
              <span className="text-lg text-amber-100">{report.wavespellName || '计算中'}</span>
            </div>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <span className="text-amber-200/80 text-sm block mb-2">本质</span>
            <p className="text-amber-100 leading-relaxed">{report.profile.essence}</p>
          </div>
          {report.wavespellInfluence && (
            <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <span className="text-purple-200/80 text-sm block mb-2">生命底色</span>
              <p className="text-purple-100 leading-relaxed">{report.wavespellInfluence}</p>
            </div>
          )}
        </section>

        {/* 能量中心雷达图 */}
        <section className="mb-12">
          <h2 className="text-2xl font-light text-amber-300 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            能量中心解析
          </h2>

          {/* 雷达图 */}
          <div className="relative h-80 mb-8 flex items-center justify-center">
            <svg width="300" height="300" viewBox="0 0 300 300" className="absolute">
              {/* 背景圆圈 */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(235, 200, 98, 0.1)" strokeWidth="1" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(235, 200, 98, 0.1)" strokeWidth="1" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(235, 200, 98, 0.1)" strokeWidth="1" />
              <circle cx="150" cy="150" r="30" fill="none" stroke="rgba(235, 200, 98, 0.1)" strokeWidth="1" />

              {/* 分割线 */}
              <line x1="150" y1="30" x2="150" y2="270" stroke="rgba(235, 200, 98, 0.1)" strokeWidth="1" />
              <line x1="253.92" y1="210" x2="46.08" y2="90" stroke="rgba(235, 200, 98, 0.1)" strokeWidth="1" />
              <line x1="253.92" y1="90" x2="46.08" y2="210" stroke="rgba(235, 200, 98, 0.1)" strokeWidth="1" />

              {/* 能量数据多边形 */}
              {(() => {
                const heartScore = report.energyCenters.find(c => c.center === 'heart')!.score;
                const throatScore = report.energyCenters.find(c => c.center === 'throat')!.score;
                const pinealScore = report.energyCenters.find(c => c.center === 'pineal')!.score;

                // 计算三个点的坐标（顶部、右下、左下）
                const radius = 120;
                const scale = (score: number) => (score / 100) * radius;

                const heartR = scale(heartScore);
                const throatR = scale(throatScore);
                const pinealR = scale(pinealScore);

                const heartX = 150;
                const heartY = 150 - heartR;

                const throatX = 150 + throatR * Math.cos(Math.PI / 6);
                const throatY = 150 + throatR * Math.sin(Math.PI / 6);

                const pinealX = 150 - pinealR * Math.cos(Math.PI / 6);
                const pinealY = 150 + pinealR * Math.sin(Math.PI / 6);

                const points = `${heartX},${heartY} ${throatX},${throatY} ${pinealX},${pinealY}`;

                return (
                  <>
                    <polygon
                      points={points}
                      fill="rgba(235, 200, 98, 0.2)"
                      stroke="#EBC862"
                      strokeWidth="2"
                    />
                    {/* 顶点 */}
                    <circle cx={heartX} cy={heartY} r="6" fill="#EF4444" className="animate-pulse" />
                    <circle cx={throatX} cy={throatY} r="6" fill="#3B82F6" className="animate-pulse" />
                    <circle cx={pinealX} cy={pinealY} r="6" fill="#8B5CF6" className="animate-pulse" />
                  </>
                );
              })()}

              {/* 标签 */}
              <text x="150" y="20" textAnchor="middle" fill="#EF4444" fontSize="14" fontWeight="300">
                ❤️ 心轮
              </text>
              <text x="270" y="215" textAnchor="start" fill="#3B82F6" fontSize="14" fontWeight="300">
                💎 喉轮
              </text>
              <text x="30" y="215" textAnchor="end" fill="#8B5CF6" fontSize="14" fontWeight="300">
                👁️ 松果体
              </text>
            </svg>
          </div>

          {/* 详细解析 */}
          <div className="space-y-6">
            {report.energyCenters.map((center) => (
              <div
                key={center.center}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div style={{ color: getCenterColor(center.center) }}>
                      {getCenterIcon(center.center)}
                    </div>
                    <span className="text-xl text-amber-100">{center.name}</span>
                  </div>
                  <div className="text-3xl font-light" style={{ color: getCenterColor(center.center) }}>
                    {center.score}%
                  </div>
                </div>
                <p className="text-amber-200/80 leading-relaxed mb-3">{center.description}</p>
                <p className="text-amber-200/60 text-sm italic">{center.reasoning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 量子信息共振模块（仅在有家人数据时显示） */}
        {report.quantumResonances && report.quantumResonances.length > 0 && (
          <section className="mb-12 bg-gradient-to-br from-amber-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-400/30">
            <h2 className="text-2xl font-light text-amber-300 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 animate-pulse" />
              量子信息共振 · 动态修正
            </h2>
            <div className="space-y-6">
              {report.quantumResonances.map((resonance, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6 border border-amber-400/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-amber-100">{resonance.relationName}</span>
                      <span className="text-sm text-amber-200/60">Kin {resonance.relationKin}</span>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">
                      {ResonanceTypeDescriptions[resonance.resonanceType]}
                    </span>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed mb-4">{resonance.impact}</p>

                  {/* 修正值显示 */}
                  {resonance.modifier.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                      {resonance.modifier.map((mod, i) => (
                        <div
                          key={i}
                          className="px-3 py-1 bg-white/10 rounded-lg text-sm flex items-center gap-2"
                        >
                          {getCenterIcon(mod.center)}
                          <span className={mod.delta > 0 ? 'text-green-400' : 'text-orange-400'}>
                            {mod.delta > 0 ? '+' : ''}{mod.delta}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2026 白风年显化建议 - 横向布局 */}
        <section className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-400/30">
          <h2 className="text-2xl font-light text-blue-300 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            2026 白风年显化建议
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <span className="text-blue-200/60 text-sm block mb-2">核心卡点</span>
              <span className="text-blue-100 text-lg">{report.year2026Advice.coreWeakness}</span>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <span className="text-blue-200/60 text-sm block mb-2">白风年能量</span>
              <p className="text-blue-100 leading-relaxed text-sm">{report.year2026Advice.whiteWindEnergy}</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-xl border-2 border-amber-400/40">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-amber-300 font-light">实操建议</span>
            </div>
            <p className="text-amber-100 leading-relaxed">
              {report.year2026Advice.practicalAdvice}
            </p>
          </div>
        </section>

        {/* 底部时间戳 */}
        <div className="mt-12 text-center text-amber-200/40 text-sm">
          报告生成时间：{report.generatedAt.toLocaleString('zh-CN')}
        </div>
      </div>
    </div>
  );
}
