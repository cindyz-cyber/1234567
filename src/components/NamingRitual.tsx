import { useState, useRef, useEffect } from 'react';
import GoldButton from './GoldButton';

interface NamingRitualProps {
  onComplete: (higherSelfName: string, userName: string) => void;
}

export default function NamingRitual({ onComplete }: NamingRitualProps) {
  const [higherSelfName, setHigherSelfName] = useState('');
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState(1);

  const handleFirstSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (higherSelfName.trim()) {
      setStep(2);
    }
  };

  const handleSecondSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onComplete(higherSelfName.trim(), userName.trim());
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 breathing-fade relative overflow-hidden"
      style={{
        backgroundColor: 'transparent !important',
        background: 'transparent !important'
      }}
    >
      {/* 深空宇宙高画质 MP4 背景 - 移动端优先优化 */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: -1,
          // 初始底色：匹配深空宇宙主色调（深绿蓝色 + 金色光晕）
          backgroundColor: '#0a1e1a',
          background: 'linear-gradient(135deg, #0a1e1a 0%, #1a2f2a 50%, #0f2520 100%)'
        }}
      >
        {/* MP4 视频层 - 高画质自动循环播放 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/videos/energy-field-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            // 移动端硬件加速（强制 GPU 渲染）
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform',
            // 最大化清晰度：高对比度 + 高亮度 + 高饱和度
            filter: 'contrast(1.25) brightness(1.35) saturate(1.3)',
            // 淡入效果
            opacity: 1,
            animation: 'cosmicFadeIn 1.5s ease-out'
          }}
        >
          <source src="/assets/videos/energy-field.mp4" type="video/mp4" />
        </video>

        {/* 渐变覆盖层 - 保持文字可读性 */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(2, 13, 10, 0.08) 50%, rgba(0, 0, 0, 0.06) 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {step === 1 ? (
          <form onSubmit={handleFirstSubmit} className="space-y-16">
            <div className="space-y-12 mb-16 ritual-intro">
              <p
                className="text-center leading-loose font-light ritual-text"
                style={{
                  color: '#F7E7CE',
                  fontSize: '17px',
                  letterSpacing: '0.12em',
                  lineHeight: '2.4',
                  fontFamily: 'Georgia, "STSong", "Songti SC", "SimSun", serif',
                  textShadow: '0 2px 20px rgba(247, 231, 206, 0.4)',
                  animation: 'ritualFadeIn 2s ease-out',
                  fontWeight: 300,
                }}
              >
                万物生长，皆有逻辑。
              </p>
              <p
                className="text-center leading-loose font-light ritual-text"
                style={{
                  color: '#F7E7CE',
                  fontSize: '17px',
                  letterSpacing: '0.12em',
                  lineHeight: '2.4',
                  fontFamily: 'Georgia, "STSong", "Songti SC", "SimSun", serif',
                  textShadow: '0 2px 20px rgba(247, 231, 206, 0.4)',
                  animation: 'ritualFadeIn 2s ease-out 0.4s both',
                  fontWeight: 300,
                }}
              >
                在开启这段向内生长的旅程前，
                <br />
                我们需要建立连接。
              </p>
              <p
                className="text-center leading-loose font-light ritual-text-secondary"
                style={{
                  color: 'rgba(247, 231, 206, 0.98)',
                  fontSize: '15px',
                  letterSpacing: '0.1em',
                  lineHeight: '2.2',
                  fontFamily: 'Georgia, "STSong", "Songti SC", "SimSun", serif',
                  textShadow: '0 2px 20px rgba(247, 231, 206, 0.5)',
                  animation: 'ritualFadeIn 2s ease-out 0.8s both',
                  fontWeight: 300,
                  marginTop: '32px',
                }}
              >
                请赋予"自己"一个名字，
                <br />
                那是你当下的存在；
                <br />
                再赋予你的"高我"（老师）一个名字，
                <br />
                那是你智慧的指引。
              </p>
            </div>
            <h1
              className="ritual-question"
              style={{
                animation: 'ritualFadeIn 2s ease-out 1.2s both',
              }}
            >
              那个智慧的内在自我，
              <br />
              你如何称呼它？
            </h1>
            <div className="relative ritual-input-container">
              <input
                type="text"
                value={higherSelfName}
                onChange={(e) => setHigherSelfName(e.target.value)}
                className="ritual-input"
                autoFocus
              />
            </div>
            <div style={{ animation: 'ritualFadeIn 2s ease-out 1.6s both' }}>
              <GoldButton type="submit" disabled={!higherSelfName.trim()} className="w-full">
                继续
              </GoldButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSecondSubmit} className="space-y-20">
            <h1
              className="ritual-question"
              style={{
                animation: 'ritualFadeIn 2s ease-out',
              }}
            >
              它该如何称呼你？
            </h1>
            <div className="relative ritual-input-container" style={{ animation: 'ritualFadeIn 2s ease-out 0.4s both' }}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="ritual-input"
                autoFocus
              />
            </div>
            <div style={{ animation: 'ritualFadeIn 2s ease-out 0.8s both' }}>
              <GoldButton type="submit" disabled={!userName.trim()} className="w-full">
                开启植本人觉察之旅
              </GoldButton>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes cosmicFadeIn {
          0% {
            opacity: 0;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes ritualFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ritual-intro {
          position: relative;
        }

        .ritual-text {
          position: relative;
          animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
          /* 超强文字阴影 - 适配高亮度高清晰度背景 */
          text-shadow:
            0 2px 24px rgba(247, 231, 206, 0.7),
            0 4px 40px rgba(247, 231, 206, 0.5),
            0 0 50px rgba(235, 200, 98, 0.4),
            0 1px 4px rgba(0, 0, 0, 1),
            0 2px 8px rgba(0, 0, 0, 0.8) !important;
        }

        .ritual-text-secondary {
          position: relative;
          animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
          /* 超强文字阴影 */
          text-shadow:
            0 2px 24px rgba(247, 231, 206, 0.75),
            0 4px 40px rgba(247, 231, 206, 0.55),
            0 0 50px rgba(235, 200, 98, 0.45),
            0 1px 4px rgba(0, 0, 0, 1),
            0 2px 8px rgba(0, 0, 0, 0.85) !important;
        }

        .ritual-question {
          color: #F7E7CE;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.12em;
          line-height: 2;
          text-align: center;
          font-family: Georgia, "STSong", "Songti SC", "SimSun", serif;
          /* 超强文字阴影，适配高清晰度明亮背景 */
          text-shadow:
            0 2px 28px rgba(247, 231, 206, 0.8),
            0 4px 45px rgba(247, 231, 206, 0.6),
            0 0 70px rgba(235, 200, 98, 0.5),
            0 1px 4px rgba(0, 0, 0, 1),
            0 2px 8px rgba(0, 0, 0, 0.9);
          animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .ritual-input-container {
          margin: 48px 0;
        }

        .ritual-input {
          width: 100%;
          /* 透明毛玻璃背景 - 几乎看不到黑色，只有模糊效果 */
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          text-align: center;
          font-size: 20px;
          font-weight: 300;
          padding: 20px 16px;
          outline: none;
          border: none;
          border-bottom: 1px solid rgba(247, 231, 206, 0.4);
          border-radius: 8px 8px 0 0;
          color: #F7E7CE;
          letter-spacing: 0.15em;
          font-family: Georgia, "STSong", "Songti SC", "SimSun", serif;
          /* 超强文字阴影（适配高清晰度明亮背景） */
          text-shadow:
            0 2px 18px rgba(247, 231, 206, 0.8),
            0 0 45px rgba(235, 200, 98, 0.6),
            0 1px 4px rgba(0, 0, 0, 1),
            0 2px 8px rgba(0, 0, 0, 0.95);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ritual-input::placeholder {
          color: rgba(247, 231, 206, 0.3);
          letter-spacing: 0.1em;
        }

        .ritual-input:focus {
          background: rgba(255, 255, 255, 0.06);
          border-bottom-color: rgba(247, 231, 206, 0.75);
          box-shadow: 0 4px 24px rgba(247, 231, 206, 0.25);
          text-shadow:
            0 2px 20px rgba(247, 231, 206, 0.85),
            0 0 50px rgba(235, 200, 98, 0.65),
            0 1px 4px rgba(0, 0, 0, 1),
            0 2px 8px rgba(0, 0, 0, 0.95);
        }

        @media (max-width: 640px) {
          .ritual-text {
            font-size: 16px;
            line-height: 2.2;
          }

          .ritual-text-secondary {
            font-size: 14px;
            line-height: 2;
          }

          .ritual-question {
            font-size: 20px;
            line-height: 1.9;
            padding: 0 16px;
          }

          .ritual-input {
            font-size: 18px;
            padding: 16px 0;
          }
        }
      `}</style>
    </div>
  );
}
