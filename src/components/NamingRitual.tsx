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
      {/* 深空宇宙 GIF 背景 - 移动端优先优化 */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: -1,
          // 初始底色：匹配 GIF 主色调（深绿蓝色 + 金色光晕）
          backgroundColor: '#0a1e1a',
          background: 'linear-gradient(135deg, #0a1e1a 0%, #1a2f2a 50%, #0f2520 100%)',
          // 移动端硬件加速（强制 GPU 渲染，消除延迟）
          WebkitTransform: 'translate3d(0,0,0)',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          perspective: '1000px',
          willChange: 'transform',
          isolation: 'isolate',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* GIF 动图层 - 自动滚动播放 */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            // 使用 background-image 而不是 img 标签（性能更好）
            backgroundImage: 'url(/assets/u8192925825_A_hyper-realistic_deep_space_cosmic_background_li_b84b7c1b-df4c-415a-915f-eb3a46e28f88_1.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // 强制立即渲染（移动端优化）
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // 淡入效果（从底色过渡到 GIF）
            opacity: 1,
            animation: 'cosmicFadeIn 1.5s ease-out',
            // 提高清晰度 + 亮度增加 30%（从 1.05 → 1.35）
            filter: 'contrast(1.15) brightness(1.35) saturate(1.2)'
          }}
        />

        {/* 渐变覆盖层 - 增强文字可读性（降低遮罩强度以配合提亮后的背景） */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(2, 13, 10, 0.15) 50%, rgba(0, 0, 0, 0.12) 100%)',
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
          /* 增强文字阴影 - 深空背景上更清晰 */
          text-shadow:
            0 2px 20px rgba(247, 231, 206, 0.5),
            0 4px 35px rgba(247, 231, 206, 0.3),
            0 1px 3px rgba(0, 0, 0, 0.9) !important;
        }

        .ritual-text-secondary {
          position: relative;
          animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
          /* 增强文字阴影 */
          text-shadow:
            0 2px 20px rgba(247, 231, 206, 0.6),
            0 4px 35px rgba(247, 231, 206, 0.4),
            0 1px 3px rgba(0, 0, 0, 0.9) !important;
        }

        .ritual-question {
          color: #F7E7CE;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.12em;
          line-height: 2;
          text-align: center;
          font-family: Georgia, "STSong", "Songti SC", "SimSun", serif;
          /* 增强文字阴影，确保在深色宇宙背景上清晰可读 */
          text-shadow:
            0 2px 24px rgba(247, 231, 206, 0.6),
            0 4px 40px rgba(247, 231, 206, 0.4),
            0 0 60px rgba(235, 200, 98, 0.3),
            0 1px 3px rgba(0, 0, 0, 0.8);
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
          /* 增强文字阴影（背景更亮后需要更强的阴影） */
          text-shadow:
            0 2px 14px rgba(247, 231, 206, 0.6),
            0 0 35px rgba(235, 200, 98, 0.4),
            0 1px 3px rgba(0, 0, 0, 0.9);
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
            0 2px 18px rgba(247, 231, 206, 0.7),
            0 0 45px rgba(235, 200, 98, 0.5),
            0 1px 4px rgba(0, 0, 0, 0.95);
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
