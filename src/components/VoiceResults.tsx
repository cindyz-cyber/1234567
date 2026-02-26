import { useState } from 'react';
import { ChevronDown, ChevronUp, Shuffle } from 'lucide-react';
import GoldButton from './GoldButton';
import { VoiceAnalysisResult } from '../utils/voiceAnalysis';

interface VoiceResultsProps {
  result: VoiceAnalysisResult;
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

export default function VoiceResults({ result, onPlayAudio, onBack }: VoiceResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const dominantChakra = CHAKRA_COLORS[result.dominantChakra];
  const gapChakra = CHAKRA_COLORS[result.gapChakras[0]];
  const gapOrgans = result.organMapping[result.gapChakras[0]].join('、');

  const prototypeColor = result.prototypeMatch?.color;
  const displayColor = prototypeColor || dominantChakra.text;

  const tagName = result.prototypeMatch?.tagName || result.profileName;

  const statusMessage = result.prototypeMatch
    ? result.prototypeMatch.description.split('。')[0]
    : `您正处于${dominantChakra.name}通达的状态`;

  const suggestionMessage = result.prototypeMatch?.advice || `关注${gapOrgans}的滋养平衡`;
  const benefitMessage = `建议补充${gapChakra.name}能量，补足后您将获得更完整的生命力`;

  const overlayColor = prototypeColor
    ? `${prototypeColor}33`
    : gapChakra.bg.replace('0.08', '0.15');

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 relative overflow-y-auto">
      <div className="portal-background-layer">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="portal-background-video"
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

        <div className="zen-card suggestion-card">
          <p
            className="text-center text-base mb-4"
            style={{
              color: '#FFD966',
              letterSpacing: '0.25em',
              lineHeight: 2,
              fontFamily: 'Georgia, Times New Roman, serif',
              textShadow: '0 0 20px rgba(255, 217, 102, 0.8), 0 2px 10px rgba(0, 0, 0, 0.95)',
              filter: 'brightness(1.2)',
              fontWeight: 400
            }}
          >
            {suggestionMessage}
          </p>
          <p
            className="text-center text-xs"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.15em',
              lineHeight: 1.8,
              fontFamily: 'Georgia, Times New Roman, serif',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)',
              fontWeight: 400
            }}
          >
            {benefitMessage}
          </p>
        </div>

        <div className="zen-card frequency-card">
          {result.prototypeMatch?.organs && (
            <div className="mb-4 text-center">
              <p className="text-xs" style={{ color: 'rgba(247, 231, 206, 0.8)', letterSpacing: '0.15em' }}>
                脏腑对应：{result.prototypeMatch.organs}
              </p>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 mb-4">
            <p
              className="text-center text-sm"
              style={{
                color: displayColor,
                letterSpacing: '0.25em',
                fontFamily: 'Georgia, Times New Roman, serif',
                textShadow: `0 0 20px ${displayColor}80, 0 2px 8px rgba(0, 0, 0, 0.95)`,
                fontWeight: 400,
                filter: 'brightness(1.3)'
              }}
            >
              {result.prototypeMatch?.rechargeHz
                ? `充电频率·${result.prototypeMatch.rechargeHz}Hz`
                : `${gapChakra.name}·${result.recommendedFrequency.hz}Hz`}
            </p>
            <button
              onClick={() => {
                const frequencies = [194, 417, 528, 343, 384, 432, 963];
                const randomHz = frequencies[Math.floor(Math.random() * frequencies.length)];
                onPlayAudio(randomHz);
              }}
              className="shuffle-button"
            >
              <Shuffle size={16} />
            </button>
          </div>
          <GoldButton
            onClick={() => {
              const hz = result.prototypeMatch?.rechargeHz || result.recommendedFrequency.hz;
              onPlayAudio(hz);
            }}
            className="w-full py-5"
          >
            <span style={{ letterSpacing: '0.3em', fontSize: '16px' }}>播放调频音频</span>
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

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="zen-toggle-button"
          style={{
            color: 'rgba(255, 255, 255, 0.98)',
            letterSpacing: '0.25em',
            fontSize: '13px',
            fontFamily: 'Georgia, Times New Roman, serif',
            textShadow: '0 0 12px rgba(247, 231, 206, 0.6), 0 2px 8px rgba(0, 0, 0, 0.95)',
            fontWeight: 400
          }}
        >
          <span>{showDetails ? '收起报告' : '查看深度报告'}</span>
          {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showDetails && (
          <div className="zen-report-container">
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
                <h4 className="zen-section-title">频率检测结果</h4>
                {result.detectionDetails.slice(0, 3).map((detail, index) => (
                  <p key={index} className="zen-detail-text">
                    {detail.detectedFrequency}Hz → {detail.organSystem}
                  </p>
                ))}
              </div>

              <div className="zen-report-section">
                <h4 className="zen-section-title">核心频率坐标</h4>
                <div className="space-y-2">
                  <p className="zen-detail-text-sm">心轮: 342-343Hz</p>
                  <p className="zen-detail-text-sm">喉轮: 384Hz</p>
                  <p className="zen-detail-text-sm">眉心轮: 432Hz</p>
                  <p className="zen-detail-text-sm">太阳神经丛: 528Hz</p>
                  <p className="zen-detail-text-sm">海底轮: &lt;200Hz</p>
                </div>
              </div>

              <div className="zen-report-section">
                <h4 className="zen-section-title">能量分布</h4>
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
        }

        .portal-background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.3) contrast(1.15) saturate(1.1);
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
      `}</style>
    </div>
  );
}
