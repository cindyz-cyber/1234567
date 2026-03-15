import { useState } from 'react';
import { ChevronDown, ChevronUp, Shuffle } from 'lucide-react';
import GoldButton from './GoldButton';
import { VoiceAnalysisResult } from '../utils/voiceAnalysis';
import { ReportData } from '../utils/reportGenerator';

interface VoiceResultsProps {
  result: VoiceAnalysisResult;
  reportData: ReportData;
  onPlayAudio: (frequency: number) => void;
  onBack: () => void;
}

const CHAKRA_COLORS = {
  root: { bg: 'rgba(220, 38, 38, 0.08)', text: '#DC2626', name: '海底轮' },
  sacral: { bg: 'rgba(249, 115, 22, 0.08)', text: '#F97316', name: '脐轮' },
  solar: { bg: 'rgba(234, 179, 8, 0.08)', text: '#EAB308', name: '太阳轮' },
  heart: { bg: 'rgba(236, 72, 153, 0.08)', text: '#EC4899', name: '心轮' },
  throat: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3B82F6', name: '喉轮' },
  thirdEye: { bg: 'rgba(99, 102, 241, 0.08)', text: '#6366F1', name: '眉心轮' },
  crown: { bg: 'rgba(168, 85, 247, 0.08)', text: '#A855F7', name: '顶轮' }
};

export default function VoiceResults({ result, reportData, onPlayAudio, onBack }: VoiceResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const dominantChakra = CHAKRA_COLORS[result.dominantChakra];
  const prototypeColor = result.prototypeMatch?.color;
  const displayColor = prototypeColor || dominantChakra.text;

  const tagName = result.prototypeMatch?.tagName || result.profileName;

  // 【视觉重构】只显示当前状态的定性描述，不生成补足建议
  const statusMessage = result.prototypeMatch
    ? result.prototypeMatch.description
    : `您正处于${dominantChakra.name}通达的状态`;

  const overlayColor = prototypeColor
    ? `${prototypeColor}33`
    : dominantChakra.bg.replace('0.08', '0.15');

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 relative overflow-y-auto">
      <div className="portal-background-layer">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="portal-background-video"
          style={{
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
          }}
        >
          <source src="https://cdn.midjourney.com/video/661ffc10-0d89-43d1-b8f9-83e67d0421ae/2.mp4" type="video/mp4" />
        </video>
      </div>
      <div
        className="chakra-overlay"
        style={{
          background: `radial-gradient(circle at center, ${overlayColor} 0%, rgba(0, 0, 0, 0.6) 100%)`
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative z-10 space-y-6">
        <div className="zen-card status-card">
          <p
            className="text-2xl font-light text-center mb-4"
            style={{
              color: displayColor,
              letterSpacing: '0.3em',
              fontFamily: 'Georgia, Times New Roman, serif',
              textShadow: `0 0 25px ${displayColor}, 0 2px 10px rgba(0, 0, 0, 0.95)`,
              filter: 'brightness(1.4)'
            }}
          >
            {tagName}
          </p>
          {result.prototypeMatch && (
            <div
              className="text-center text-xs mb-2"
              style={{
                color: 'rgba(247, 231, 206, 0.7)',
                letterSpacing: '0.1em'
              }}
            >
              原型锚点 {result.prototypeMatch.id} · 匹配度：{result.prototypeMatch.similarity.toFixed(1)}%
            </div>
          )}
          <p
            className="text-center text-sm"
            style={{
              color: 'rgba(255, 255, 255, 0.98)',
              letterSpacing: '0.2em',
              fontFamily: 'Georgia, Times New Roman, serif',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)',
              fontWeight: 400
            }}
          >
            {statusMessage}
          </p>
        </div>

        {/* 【视觉降噪】折叠式深度报告按钮 */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="zen-card suggestion-card transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 217, 102, 0.08) 0%, rgba(251, 191, 36, 0.08) 100%)',
            border: '1px solid rgba(255, 217, 102, 0.3)',
            padding: '16px 24px'
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <p
              className="text-sm"
              style={{
                color: '#FFD966',
                letterSpacing: '0.25em',
                fontFamily: 'Georgia, Times New Roman, serif',
                textShadow: '0 0 15px rgba(255, 217, 102, 0.6)',
                fontWeight: 400
              }}
            >
              深度报告
            </p>
            {showDetails ? <ChevronUp size={18} color="#FFD966" /> : <ChevronDown size={18} color="#FFD966" />}
          </div>
        </button>

        {/* 健康预警卡片 - 当粗糙度 > 60% 时显示 */}
        {result.healthWarning && result.healthWarning.hasWarning && (
          <div
            className="zen-card"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(238, 90, 111, 0.15) 100%)',
              border: '1px solid rgba(255, 107, 107, 0.4)',
              boxShadow: '0 0 30px rgba(255, 107, 107, 0.2)',
              padding: '20px'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FF6B6B',
                  boxShadow: '0 0 15px rgba(255, 107, 107, 0.8)',
                  animation: 'pulse 2s infinite'
                }}
              />
              <p
                className="text-sm"
                style={{
                  color: '#FFB8B8',
                  letterSpacing: '0.25em',
                  fontFamily: 'Georgia, Times New Roman, serif',
                  textShadow: '0 0 15px rgba(255, 107, 107, 0.6)',
                  fontWeight: 500
                }}
              >
                身心预警
              </p>
            </div>
            <p
              className="text-center text-sm mb-3"
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                letterSpacing: '0.15em',
                lineHeight: 1.8,
                fontFamily: 'Georgia, Times New Roman, serif',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)'
              }}
            >
              {result.healthWarning.message}
            </p>
            <p
              className="text-center text-xs"
              style={{
                color: 'rgba(247, 231, 206, 0.85)',
                letterSpacing: '0.1em',
                lineHeight: 1.6,
                fontFamily: 'Georgia, Times New Roman, serif',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)'
              }}
            >
              {result.healthWarning.recommendation}
            </p>
            {result.acousticFeatures && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.1em' }}>
                  粗糙度: {result.acousticFeatures.roughness.toFixed(1)}% ·
                  应激指数: {result.acousticFeatures.stressIndicator.toFixed(1)}% ·
                  防御级别: {result.acousticFeatures.defenseLevel.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        )}

        <div className="zen-card frequency-card">
          <GoldButton
            onClick={() => {
              const hz = result.prototypeMatch?.rechargeHz || result.recommendedFrequency.hz;
              onPlayAudio(hz);
            }}
            className="w-full py-5"
          >
            <span style={{ letterSpacing: '0.3em', fontSize: '16px' }}>播放共振音频</span>
          </GoldButton>
        </div>

        {result.prototypeMatch && (result.prototypeMatch.doList || result.prototypeMatch.dontList) && (
          <div className="zen-card suggestion-card">
            {result.prototypeMatch.doList && result.prototypeMatch.doList.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-center mb-2" style={{ color: '#00FF7F', letterSpacing: '0.2em' }}>
                  建议做
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.prototypeMatch.doList.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs"
                      style={{
                        background: 'rgba(0, 255, 127, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 255, 127, 0.3)',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.prototypeMatch.dontList && result.prototypeMatch.dontList.length > 0 && (
              <div>
                <p className="text-xs text-center mb-2" style={{ color: '#FF6B6B', letterSpacing: '0.2em' }}>
                  避免做
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.prototypeMatch.dontList.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs"
                      style={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 【物理数值隐藏】所有 Hz 数值、脉轮百分比等放在深度报告中 */}
        {showDetails && (
          <div className="zen-report-container" style={{ width: '100%', maxWidth: '600px' }}>
            <h3
              className="text-lg font-light mb-8 text-center"
              style={{
                color: 'rgba(255, 255, 255, 0.98)',
                letterSpacing: '0.4em',
                fontFamily: 'Georgia, Times New Roman, serif',
                textShadow: '0 0 18px rgba(247, 231, 206, 0.7), 0 2px 10px rgba(0, 0, 0, 0.95)',
                fontWeight: 400
              }}
            >
              深度报告
            </h3>

            <div className="zen-report-section-wrapper">
              <div className="zen-report-section">
                <h4 className="zen-section-title">核心总结</h4>
                <p className="zen-detail-text" style={{ lineHeight: '2.2' }}>
                  {reportData.coreSummary.summary}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="zen-detail-text-sm" style={{ color: 'rgba(255, 200, 150, 0.9)' }}>
                    发声来源：{reportData.coreSummary.details.sourceAnalysis}
                  </p>
                  <p className="zen-detail-text-sm" style={{ color: 'rgba(255, 200, 150, 0.9)' }}>
                    质地分析：{reportData.coreSummary.details.qualityAnalysis}
                  </p>
                  <p className="zen-detail-text-sm" style={{ color: 'rgba(255, 200, 150, 0.9)' }}>
                    相位特征：{reportData.coreSummary.details.phaseAnalysis}
                  </p>
                </div>
              </div>

              <div className="zen-report-section">
                <h4 className="zen-section-title">脉轮能量分析</h4>
                <p className="zen-detail-text" style={{ lineHeight: '2.2', marginBottom: '16px' }}>
                  {reportData.chakraAnalysis.summary}
                </p>
                <div className="zen-formula">
                  {reportData.chakraAnalysis.details.formula}
                </div>
                <div className="mt-4">
                  <p className="zen-detail-text-sm" style={{ marginBottom: '8px' }}>
                    {reportData.chakraAnalysis.details.dominantChakra}
                  </p>
                  <p className="zen-detail-text-sm" style={{ marginBottom: '8px' }}>
                    {reportData.chakraAnalysis.details.gapChakras}
                  </p>
                  <p className="zen-detail-text-sm" style={{ lineHeight: '2', marginTop: '12px' }}>
                    {reportData.chakraAnalysis.details.energyFlow}
                  </p>
                </div>
              </div>

              <div className="zen-report-section">
                <h4 className="zen-section-title">能量分布详情</h4>
                {Object.entries(result.chakraDistribution).map(([chakra, percentage]) => {
                  const chakraKey = chakra as keyof typeof CHAKRA_COLORS;
                  const chakraColor = CHAKRA_COLORS[chakraKey];
                  return (
                    <div key={chakra} className="flex items-center gap-3 mb-3">
                      <span className="zen-chakra-label">
                        {chakraColor.name}
                      </span>
                      <div className="zen-energy-bar-track">
                        <div
                          className="zen-energy-bar-fill"
                          style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${chakraColor.text}80, ${chakraColor.text})`,
                            boxShadow: `0 0 10px ${chakraColor.text}60`
                          }}
                        />
                      </div>
                      <span
                        className="zen-percentage"
                        style={{ color: chakraColor.text }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 声学特征分析 - 新增部分 */}
              {result.acousticFeatures && (
                <div className="zen-report-section">
                  <h4 className="zen-section-title">声学特征分析</h4>
                  <p className="zen-detail-text-sm mb-4" style={{ color: 'rgba(247, 231, 206, 0.8)', lineHeight: '2' }}>
                    通过多维度声学指纹分析，识别声音中的细微特征与心理状态
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <span className="zen-detail-text-sm">粗糙度（刺耳感）</span>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${result.acousticFeatures.roughness}%`,
                              height: '100%',
                              background: result.acousticFeatures.roughness > 60
                                ? 'linear-gradient(90deg, #ff6b6b, #ee5a6f)'
                                : 'linear-gradient(90deg, #4ade80, #22c55e)',
                              transition: 'width 0.3s'
                            }}
                          />
                        </div>
                        <span className="zen-detail-text-sm" style={{
                          color: result.acousticFeatures.roughness > 60 ? '#ff6b6b' : '#4ade80',
                          minWidth: '45px'
                        }}>
                          {result.acousticFeatures.roughness.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <span className="zen-detail-text-sm">谐波清晰度</span>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${result.acousticFeatures.harmonicClarity}%`, height: '100%', background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' }} />
                        </div>
                        <span className="zen-detail-text-sm" style={{ color: '#60a5fa', minWidth: '45px' }}>
                          {result.acousticFeatures.harmonicClarity.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <span className="zen-detail-text-sm">应激指数</span>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${result.acousticFeatures.stressIndicator}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)' }} />
                        </div>
                        <span className="zen-detail-text-sm" style={{ color: '#f59e0b', minWidth: '45px' }}>
                          {result.acousticFeatures.stressIndicator.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <span className="zen-detail-text-sm">防御级别</span>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${result.acousticFeatures.defenseLevel}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #9333ea)' }} />
                        </div>
                        <span className="zen-detail-text-sm" style={{ color: '#a855f7', minWidth: '45px' }}>
                          {result.acousticFeatures.defenseLevel.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <span className="zen-detail-text-sm">音色亮度</span>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${result.acousticFeatures.brightness}%`, height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }} />
                        </div>
                        <span className="zen-detail-text-sm" style={{ color: '#fbbf24', minWidth: '45px' }}>
                          {result.acousticFeatures.brightness.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <span className="zen-detail-text-sm">音色温暖度</span>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${result.acousticFeatures.warmth}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)' }} />
                        </div>
                        <span className="zen-detail-text-sm" style={{ color: '#f97316', minWidth: '45px' }}>
                          {result.acousticFeatures.warmth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="zen-detail-text-sm mt-4 pt-3 border-t border-white/10" style={{ color: 'rgba(247, 231, 206, 0.7)', lineHeight: '2' }}>
                    ✨ 多维审计协议已启用：通过粗糙度、谐波清晰度、应激指数等多维指标交叉验证，防止单一频率误判，确保诊断准确性。
                  </p>
                </div>
              )}

              <div className="zen-report-section">
                <h4 className="zen-section-title">脏腑调理方案</h4>
                <p className="zen-detail-text" style={{ lineHeight: '2.2', marginBottom: '16px' }}>
                  {reportData.organTherapy.summary}
                </p>
                <div className="space-y-3">
                  <div className="zen-organ-box">
                    <p className="zen-detail-text-sm" style={{ lineHeight: '2' }}>
                      {reportData.organTherapy.details.primaryOrgan}
                    </p>
                  </div>
                  <div className="zen-organ-box">
                    <p className="zen-detail-text-sm" style={{ lineHeight: '2' }}>
                      {reportData.organTherapy.details.secondaryOrgan}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="zen-detail-text-sm" style={{ color: 'rgba(255, 217, 102, 0.9)', marginBottom: '8px' }}>
                      调理建议：
                    </p>
                    {reportData.organTherapy.details.recommendations.map((rec, idx) => (
                      <p key={idx} className="zen-detail-text-sm" style={{ marginBottom: '6px', paddingLeft: '12px' }}>
                        • {rec}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="zen-report-section">
                <h4 className="zen-section-title">行动指南</h4>
                <p className="zen-detail-text" style={{ lineHeight: '2.2', marginBottom: '16px' }}>
                  {reportData.actionPlan.summary}
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="zen-subsection-title" style={{ color: 'rgba(100, 220, 120, 0.95)' }}>
                      建议做的事：
                    </p>
                    {reportData.actionPlan.details.doList.map((item, idx) => (
                      <p key={idx} className="zen-detail-text-sm zen-action-item do-item">
                        {item}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="zen-subsection-title" style={{ color: 'rgba(255, 100, 100, 0.95)' }}>
                      需要避免的：
                    </p>
                    {reportData.actionPlan.details.avoidList.map((item, idx) => (
                      <p key={idx} className="zen-detail-text-sm zen-action-item avoid-item">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="zen-report-section">
                <h4 className="zen-section-title">疗愈电台使用指南</h4>
                <p className="zen-detail-text" style={{ lineHeight: '2.2', marginBottom: '16px' }}>
                  {reportData.healingStation.summary}
                </p>
                <div className="zen-healing-box">
                  <p className="zen-detail-text" style={{ color: 'rgba(255, 217, 102, 0.98)', marginBottom: '12px' }}>
                    推荐频率：{reportData.healingStation.details.recommendedFrequency}Hz
                  </p>
                  <p className="zen-detail-text-sm" style={{ lineHeight: '2', marginBottom: '12px' }}>
                    目标脉轮：{reportData.healingStation.details.chakraTarget}
                  </p>
                  <p className="zen-detail-text-sm" style={{ lineHeight: '2', marginBottom: '16px' }}>
                    {reportData.healingStation.details.reason}
                  </p>
                  <p className="zen-subsection-title" style={{ marginBottom: '8px' }}>
                    使用方法：
                  </p>
                  {reportData.healingStation.details.howToUse.map((step, idx) => (
                    <p key={idx} className="zen-detail-text-sm" style={{ marginBottom: '6px', paddingLeft: '12px' }}>
                      {idx + 1}. {step}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={onBack} className="zen-back-button">
          返回
        </button>
      </div>

      <style>{`
        .portal-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
          pointer-events: none;
          background-color: rgba(10, 20, 30, 0.5);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .portal-background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.3) contrast(1.15) saturate(1.1);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .chakra-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 2;
          pointer-events: none;
          transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.7;
        }

        .zen-card {
          position: relative;
          width: 100%;
          padding: 32px 24px;
          border-radius: 24px;
          backdrop-filter: blur(50px) saturate(180%);
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(247, 231, 206, 0.35);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: zenCardFadeIn 0.8s ease-out;
        }

        @keyframes zenCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .status-card {
          animation-delay: 0.1s;
        }

        .suggestion-card {
          animation-delay: 0.2s;
        }

        .frequency-card {
          animation-delay: 0.3s;
        }

        .zen-toggle-button {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(25px);
          border-radius: 20px;
          border: 1px solid rgba(247, 231, 206, 0.4);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .zen-toggle-button:hover {
          background: rgba(247, 231, 206, 0.15);
          border-color: rgba(247, 231, 206, 0.6);
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(247, 231, 206, 0.3);
        }

        .zen-report-container {
          width: 100%;
          margin-top: 24px;
          padding: 32px 24px;
          border-radius: 24px;
          backdrop-filter: blur(50px) saturate(180%);
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(247, 231, 206, 0.4);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          animation: zenReportExpand 0.5s ease-out;
          max-height: 70vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .zen-report-container::-webkit-scrollbar {
          width: 4px;
        }

        .zen-report-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 2px;
        }

        .zen-report-container::-webkit-scrollbar-thumb {
          background: rgba(247, 231, 206, 0.3);
          border-radius: 2px;
        }

        .zen-report-container::-webkit-scrollbar-thumb:hover {
          background: rgba(247, 231, 206, 0.5);
        }

        @keyframes zenReportExpand {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            max-height: 70vh;
            transform: translateY(0);
          }
        }

        .zen-report-section-wrapper {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .zen-report-section {
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(247, 231, 206, 0.1);
        }

        .zen-report-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .zen-section-title {
          color: rgba(255, 217, 102, 0.98);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.3em;
          font-family: Georgia, Times New Roman, serif;
          margin-bottom: 16px;
          text-shadow: 0 0 15px rgba(255, 217, 102, 0.7), 0 2px 8px rgba(0, 0, 0, 0.95);
        }

        .zen-detail-text {
          color: rgba(255, 255, 255, 0.95);
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.15em;
          line-height: 2;
          font-family: Georgia, Times New Roman, serif;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
          margin-bottom: 8px;
        }

        .zen-detail-text-sm {
          color: rgba(255, 255, 255, 0.93);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.15em;
          line-height: 1.8;
          font-family: Georgia, Times New Roman, serif;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
        }

        .zen-chakra-label {
          min-width: 80px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.15em;
          font-family: Georgia, Times New Roman, serif;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
        }

        .zen-energy-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .zen-energy-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .zen-percentage {
          min-width: 45px;
          text-align: right;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.1em;
          font-family: Georgia, Times New Roman, serif;
          text-shadow: 0 0 8px currentColor, 0 2px 6px rgba(0, 0, 0, 0.9);
        }

        .zen-back-button {
          margin-top: 32px;
          padding: 14px 48px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(25px);
          border-radius: 50px;
          border: 1px solid rgba(247, 231, 206, 0.4);
          color: rgba(255, 255, 255, 0.95);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.3em;
          font-family: Georgia, Times New Roman, serif;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .zen-back-button:hover {
          background: rgba(247, 231, 206, 0.12);
          border-color: rgba(247, 231, 206, 0.6);
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(247, 231, 206, 0.3);
        }

        .shuffle-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: rgba(247, 231, 206, 0.08);
          border: 1px solid rgba(247, 231, 206, 0.3);
          border-radius: 12px;
          color: rgba(247, 231, 206, 0.9);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .shuffle-button:hover {
          background: rgba(247, 231, 206, 0.15);
          border-color: rgba(247, 231, 206, 0.5);
          transform: scale(1.1) rotate(15deg);
          box-shadow: 0 2px 12px rgba(247, 231, 206, 0.3);
        }

        .zen-formula {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(100, 200, 255, 0.25);
          border-radius: 12px;
          padding: 16px 20px;
          font-family: 'Courier New', monospace;
          color: rgba(150, 220, 255, 0.95);
          font-size: 11px;
          letter-spacing: 0.05em;
          line-height: 2;
          white-space: pre-line;
        }

        .zen-organ-box {
          background: rgba(0, 0, 0, 0.3);
          border-left: 3px solid rgba(255, 217, 102, 0.6);
          border-radius: 8px;
          padding: 12px 16px;
        }

        .zen-subsection-title {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.2em;
          margin-bottom: 8px;
          font-family: Georgia, Times New Roman, serif;
        }

        .zen-action-item {
          padding: 8px 0 8px 16px;
          position: relative;
          line-height: 2;
        }

        .zen-action-item::before {
          content: '•';
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .do-item::before {
          color: rgba(100, 220, 120, 0.9);
        }

        .avoid-item::before {
          color: rgba(255, 100, 100, 0.9);
        }

        .zen-healing-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 217, 102, 0.3);
          border-radius: 12px;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
