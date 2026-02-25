import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  heart: { bg: 'rgba(34, 197, 94, 0.08)', text: '#22C55E', name: '心轮' },
  throat: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3B82F6', name: '喉轮' },
  thirdEye: { bg: 'rgba(99, 102, 241, 0.08)', text: '#6366F1', name: '眉心轮' },
  crown: { bg: 'rgba(168, 85, 247, 0.08)', text: '#A855F7', name: '顶轮' }
};

export default function VoiceResults({ result, onPlayAudio, onBack }: VoiceResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const dominantChakra = CHAKRA_COLORS[result.dominantChakra];
  const gapChakra = CHAKRA_COLORS[result.gapChakras[0]];
  const gapOrgans = result.organMapping[result.gapChakras[0]].join('、');

  const statusMessage = `您正处于${dominantChakra.name}通达的状态`;
  const suggestionMessage = `关注${gapOrgans}的受纳平衡`;
  const benefitMessage = `建议补充${gapChakra.name}能量以固本，补足后您将获得更稳固的显化力量`;

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 relative">
      <div className="forest-background-layer" />
      <div
        className="background-overlay"
        style={{
          opacity: 0.3,
          backgroundColor: gapChakra.bg
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative z-10 space-y-6">
        <div
          className="w-full p-8 rounded-3xl backdrop-blur-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(247, 231, 206, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <p
            className="text-2xl font-bold text-center mb-2"
            style={{
              color: dominantChakra.text,
              letterSpacing: '0.1em'
            }}
          >
            {result.profileName}
          </p>
          <p
            className="text-center text-sm"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.15em'
            }}
          >
            {statusMessage}
          </p>
        </div>

        <div
          className="w-full p-8 rounded-3xl backdrop-blur-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(247, 231, 206, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <p
            className="text-center text-lg"
            style={{
              color: '#EBC862',
              letterSpacing: '0.15em',
              lineHeight: 1.8
            }}
          >
            {suggestionMessage}
          </p>
          <p
            className="text-center text-sm mt-4"
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.1em',
              lineHeight: 1.6
            }}
          >
            {benefitMessage}
          </p>
        </div>

        <div
          className="w-full p-8 rounded-3xl backdrop-blur-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(247, 231, 206, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <GoldButton
            onClick={() => onPlayAudio(result.recommendedFrequency.hz)}
            className="w-full mb-4"
          >
            一键调频
          </GoldButton>
          <p
            className="text-center text-sm"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.2em'
            }}
          >
            {result.recommendedFrequency.hz}Hz
          </p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 mt-6 transition-all hover:scale-105"
          style={{
            color: '#EBC862',
            letterSpacing: '0.2em',
            fontSize: '14px'
          }}
        >
          <span>查看深度报告</span>
          {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showDetails && (
          <div
            className="w-full p-8 rounded-3xl backdrop-blur-xl animate-fadeIn"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(247, 231, 206, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3
              className="text-xl font-bold mb-6 text-center"
              style={{
                color: '#EBC862',
                letterSpacing: '0.2em'
              }}
            >
              详细分析报告
            </h3>

            <div className="space-y-6">
              <div>
                <h4
                  className="text-sm font-bold mb-3"
                  style={{
                    color: 'rgba(235, 200, 98, 0.8)',
                    letterSpacing: '0.2em'
                  }}
                >
                  【频率检测结果】
                </h4>
                {result.detectionDetails.slice(0, 3).map((detail, index) => (
                  <p
                    key={index}
                    className="text-sm mb-2"
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      letterSpacing: '0.1em',
                      lineHeight: 1.6
                    }}
                  >
                    • 检测值: {detail.detectedFrequency}Hz → 判定: {detail.organSystem}
                  </p>
                ))}
              </div>

              <div>
                <h4
                  className="text-sm font-bold mb-3"
                  style={{
                    color: 'rgba(235, 200, 98, 0.8)',
                    letterSpacing: '0.2em'
                  }}
                >
                  【核心频率坐标】
                </h4>
                <div className="space-y-1">
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', letterSpacing: '0.1em' }}>
                    心轮: 342-343Hz (核心)
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', letterSpacing: '0.1em' }}>
                    喉轮: 384Hz (核心)
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', letterSpacing: '0.1em' }}>
                    眉心轮: 432Hz (核心)
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', letterSpacing: '0.1em' }}>
                    太阳神经丛: 528Hz (转化频)
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', letterSpacing: '0.1em' }}>
                    海底轮: &lt;200Hz (纯低频)
                  </p>
                </div>
              </div>

              <div>
                <h4
                  className="text-sm font-bold mb-3"
                  style={{
                    color: 'rgba(235, 200, 98, 0.8)',
                    letterSpacing: '0.2em'
                  }}
                >
                  【能量分布】
                </h4>
                {Object.entries(result.chakraDistribution).map(([chakra, percentage]) => {
                  const chakraKey = chakra as keyof typeof CHAKRA_COLORS;
                  const chakraColor = CHAKRA_COLORS[chakraKey];
                  return (
                    <div key={chakra} className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs"
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          width: '80px',
                          letterSpacing: '0.1em'
                        }}
                      >
                        {chakraColor.name}
                      </span>
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <div
                          className="h-full transition-all duration-1000"
                          style={{
                            width: `${percentage}%`,
                            background: chakraColor.text
                          }}
                        />
                      </div>
                      <span
                        className="text-xs"
                        style={{
                          color: chakraColor.text,
                          width: '40px',
                          textAlign: 'right'
                        }}
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

        <button
          onClick={onBack}
          className="mt-8 px-8 py-3 rounded-xl transition-all hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(247, 231, 206, 0.3)',
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.2em'
          }}
        >
          返回
        </button>
      </div>

      <style>{`
        .forest-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-image: url('/src/assets/blade_grass_field_top-down_ground_texture_map_stylized_hand-pai_276b4e68-d309-4f57-93db-69dfdc5d39d1.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: 1;
          pointer-events: none;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 2;
          pointer-events: none;
          transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
