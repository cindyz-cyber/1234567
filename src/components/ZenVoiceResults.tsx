import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { VoiceAnalysisResult } from '../utils/voiceAnalysis';
import { ReportData } from '../utils/reportGenerator';

interface ZenVoiceResultsProps {
  result: VoiceAnalysisResult;
  reportData: ReportData;
  onPlayAudio: (frequency: number) => void;
  onBack: () => void;
}

export default function ZenVoiceResults({ result, reportData, onBack }: ZenVoiceResultsProps) {
  const [showSoulPrint, setShowSoulPrint] = useState(false);

  const prototypeColor = result.prototypeMatch?.color || '#A855F7';
  const tagName = result.prototypeMatch?.tagName || result.profileName;
  const statusMessage = result.prototypeMatch?.description || result.message;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景视频 */}
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

      {/* 磨砂玻璃叠加层 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${prototypeColor}15 0%, rgba(0, 0, 0, 0.7) 100%)`,
          backdropFilter: 'blur(80px)',
          WebkitBackdropFilter: 'blur(80px)',
          zIndex: 1
        }}
      />

      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 py-16">
        {/* 动态能量球 */}
        <div
          className="breathing-orb"
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${prototypeColor}40 0%, ${prototypeColor}10 70%, transparent 100%)`,
            boxShadow: `0 0 60px ${prototypeColor}, 0 0 120px ${prototypeColor}40`,
            animation: 'breathe 4s ease-in-out infinite',
            marginBottom: '48px'
          }}
        />

        {/* 能量身份标题 */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '300',
            color: '#FFFFFF',
            letterSpacing: '0.4em',
            textAlign: 'center',
            marginBottom: '16px',
            textShadow: `0 0 30px ${prototypeColor}, 0 2px 15px rgba(0, 0, 0, 0.8)`,
            fontFamily: 'Georgia, serif'
          }}
        >
          {tagName}
        </h1>

        {/* 状态描述 */}
        <p
          style={{
            fontSize: '16px',
            fontWeight: '300',
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '0.15em',
            textAlign: 'center',
            maxWidth: '500px',
            lineHeight: '1.8',
            marginBottom: '48px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
          }}
        >
          {statusMessage}
        </p>

        {/* 查看灵魂指纹抽屉 */}
        <button
          onClick={() => setShowSoulPrint(!showSoulPrint)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px 32px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          查看灵魂指纹
          <ChevronDown
            size={18}
            style={{
              transform: showSoulPrint ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          />
        </button>
      </div>

      {/* 灵魂指纹详情抽屉 */}
      {showSoulPrint && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '70vh',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 20,
            overflowY: 'auto',
            padding: '32px',
            animation: 'slideUp 0.4s ease-out'
          }}
        >
          {/* 脉轮分布 */}
          <h3 style={{
            fontSize: '18px',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '0.2em',
            marginBottom: '24px'
          }}>
            脉轮能量分布
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(result.chakraDistribution).map(([chakra, value]) => (
              <div key={chakra}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <span>{chakra}</span>
                  <span>{value}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${value}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${prototypeColor}80, ${prototypeColor})`,
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* 声学特征 */}
          {result.acousticFeatures && (
            <>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.2em',
                marginTop: '40px',
                marginBottom: '24px'
              }}>
                声学特征分析
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>粗糙度</div>
                  <div style={{ fontSize: '20px', color: '#fff' }}>{result.acousticFeatures.roughness.toFixed(1)}</div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>谐波清晰度</div>
                  <div style={{ fontSize: '20px', color: '#fff' }}>{result.acousticFeatures.harmonicClarity.toFixed(1)}</div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>亮度</div>
                  <div style={{ fontSize: '20px', color: '#fff' }}>{result.acousticFeatures.brightness.toFixed(1)}</div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>温暖度</div>
                  <div style={{ fontSize: '20px', color: '#fff' }}>{result.acousticFeatures.warmth.toFixed(1)}</div>
                </div>
              </div>
            </>
          )}

          {/* 返回按钮 */}
          <button
            onClick={onBack}
            style={{
              marginTop: '40px',
              width: '100%',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              letterSpacing: '0.2em',
              cursor: 'pointer'
            }}
          >
            返回
          </button>
        </div>
      )}

      {/* 动画样式 */}
      <style>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
