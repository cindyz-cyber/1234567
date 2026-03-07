import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { stopAllAudio } from '../utils/audioManager';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';

interface BookOfAnswersProps {
  onComplete: () => void;
  backgroundAudio?: HTMLAudioElement | null;
  onBack?: () => void;
  isGenerating?: boolean;
  userName?: string;
  kinData?: any;
  higherSelfAdvice: string; // 🔥 必填：真实的高我建议
}

export default function BookOfAnswers({ onComplete, backgroundAudio, onBack, isGenerating = false, userName, kinData, higherSelfAdvice }: BookOfAnswersProps) {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [generatingPoster, setGeneratingPoster] = useState(false);
  const [cardBgUrl, setCardBgUrl] = useState<string>('');
  const posterCardRef = useRef<HTMLDivElement>(null);

  // 🔥 验证传入的高我建议
  useEffect(() => {
    console.group('📖 [BookOfAnswers] 组件初始化');
    console.log('✅ 用户名:', userName || '(未设置)');
    console.log('📝 高我建议:', higherSelfAdvice || '❌ 未传递');
    console.log('📊 建议长度:', higherSelfAdvice?.length || 0, '字符');
    console.log('🎯 Kin 数据:', kinData ? '已加载' : '未加载');
    console.groupEnd();

    if (!higherSelfAdvice || higherSelfAdvice.trim() === '') {
      console.error('❌ [BookOfAnswers] 致命错误：higherSelfAdvice 为空！');
      console.error('💡 这意味着数据流中断，请检查 ShareJournal 是否正确传递 state.higherSelfAdvice');
    }
  }, [higherSelfAdvice, userName, kinData]);

  // 🔥 加载海报背景配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('h5_share_config')
          .select('card_inner_bg_url')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .maybeSingle();

        if (error) {
          console.error('❌ [BookOfAnswers] 配置加载失败:', error);
          setCardBgUrl('/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png');
          return;
        }

        let finalBgUrl = data?.card_inner_bg_url || '/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png';

        // 🔥 为外部 URL 添加时间戳防缓存
        if (finalBgUrl.startsWith('http://') || finalBgUrl.startsWith('https://')) {
          const separator = finalBgUrl.includes('?') ? '&' : '?';
          finalBgUrl = `${finalBgUrl}${separator}t=${Date.now()}`;
          console.log('✅ [BookOfAnswers] 海报背景已添加防缓存时间戳:', finalBgUrl);
        } else {
          console.log('✅ [BookOfAnswers] 海报背景加载成功（本地资源）:', finalBgUrl);
        }

        setCardBgUrl(finalBgUrl);
      } catch (err) {
        console.error('❌ [BookOfAnswers] 配置加载异常:', err);
        setCardBgUrl('/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png');
      }
    };

    loadConfig();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedCard === null) {
      setFlippedCard(index);
    }
  };

  const handleComplete = async (e?: React.MouseEvent) => {
    // 🚫 强制阻止任何默认行为和事件冒泡
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.group('🎯 [BookOfAnswers] 生成卡片按钮被点击 - 启动海报生成');
    console.log('🚫 事件拦截: preventDefault + stopPropagation');
    console.log('🔒 当前完整路径:', window.location.pathname + window.location.search);
    console.log('🔒 当前完整 URL:', window.location.href);
    console.log('🚫 路由锁定: 禁止任何跳转到 / 或主页的行为');
    console.log('🎴 海报背景 URL:', cardBgUrl);
    console.groupEnd();

    // 🔥 第一步：先显示遮罩层和加载状态
    setShowPoster(true);
    setGeneratingPoster(true);

    try {
      // 🔥 第二步：等待 DOM 渲染
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!posterCardRef.current) {
        console.error('❌ [BookOfAnswers] posterCardRef 不存在');
        alert('海报生成失败：DOM 未准备好');
        setGeneratingPoster(false);
        setShowPoster(false);
        return;
      }

      console.log('📸 [BookOfAnswers] 开始捕获海报 DOM...');

      // 🔥 第三步：预加载背景图
      await new Promise<void>((resolve) => {
        const img = new Image();
        if (cardBgUrl.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          console.log('✅ [BookOfAnswers] 背景图预加载成功');
          resolve();
        };
        img.onerror = () => {
          console.warn('⚠️ [BookOfAnswers] 背景图加载失败，继续生成');
          resolve();
        };
        img.src = cardBgUrl;
      });

      // 🔥 第四步：使用 html2canvas 生成海报
      const canvas = await html2canvas(posterCardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: true,
        width: 750,
        height: 1334
      });

      console.log('✅ [BookOfAnswers] html2canvas 捕获成功');

      const imageUrl = canvas.toDataURL('image/png', 1.0);
      console.log('✅ [BookOfAnswers] 海报生成成功，长度:', imageUrl.length);

      setPosterImage(imageUrl);
      setGeneratingPoster(false);

      console.log('✅ [BookOfAnswers] 海报遮罩层已显示');
    } catch (err) {
      console.error('❌ [BookOfAnswers] 海报生成失败:', err);
      alert('海报生成失败，请重试或联系管理员');
      setGeneratingPoster(false);
      setShowPoster(false);
    }

    // 🎵 保留音频播放，由父组件控制
    console.log('🎵 [BookOfAnswers] 保留音频播放，由父组件控制');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 book-of-answers-container">
      <div className="book-background-layer">
        <video
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          preload="auto"
          crossOrigin="anonymous"
          className="book-background-video"
          style={{
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
          }}
        >
          <source src="https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/0e1txddh4g17-1772692096278.mp4" type="video/mp4" />
        </video>
        <div className="book-background-overlay" />
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
          style={{
            backgroundColor: 'rgba(235, 200, 98, 0.1)',
            border: '1px solid rgba(235, 200, 98, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ChevronLeft size={24} color="#EBC862" />
        </button>
      )}
      <div className="w-full max-w-md flex flex-col" style={{ height: '100vh', justifyContent: 'space-between', paddingTop: '80px', paddingBottom: '40px', position: 'relative', zIndex: 10 }}>
        <div className="space-y-4 text-center">
          <h2 className="book-title">
            答案之书
          </h2>
          <p className="book-subtitle">
            {flippedCard === null ? '选择一张卡片，接收指引' : '这是你的方向'}
          </p>
        </div>

        <div className="flex justify-center gap-4" style={{ marginTop: '40px' }}>
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              disabled={flippedCard !== null && flippedCard !== index}
              className={`card-container ${flippedCard === index ? 'flipped' : ''}`}
              style={{
                width: '90px',
                height: '140px',
                perspective: '1000px',
                opacity: flippedCard !== null && flippedCard !== index ? 0.3 : 1,
                transition: 'opacity 0.5s ease',
              }}
            >
              <div className="card">
                {/* Back */}
                <div
                  className="card-face card-back"
                  style={{
                    backgroundColor: 'rgba(2, 10, 9, 0.95)',
                    border: '1px solid #EBC862',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    className="card-back-image"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'url(/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: 0,
                      filter: 'brightness(0.85) contrast(1.15)',
                    }}
                  />
                  <div
                    className="golden-glow-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at center, transparent 25%, rgba(2, 10, 9, 0.4) 100%)',
                      zIndex: 1,
                      boxShadow: 'inset 0 0 40px rgba(235, 200, 98, 0.15), inset 0 0 60px rgba(235, 200, 98, 0.1)',
                    }}
                  />
                </div>

                {/* Front */}
                <div
                  className="card-face card-front"
                  style={{
                    background: 'rgba(5, 10, 20, 0.95)',
                    border: '0.5px solid rgba(200, 220, 255, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 16px',
                    boxShadow: '0 0 40px rgba(180, 200, 255, 0.3), 0 0 60px rgba(180, 200, 255, 0.2)',
                    position: 'relative',
                    backdropFilter: 'blur(40px)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '12px',
                      background: 'radial-gradient(circle at center, rgba(200, 220, 255, 0.08) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <p
                    className="wisdom-text"
                  >
                    {higherSelfAdvice}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {flippedCard !== null && (
          <div className="text-center space-y-4" style={{ paddingBottom: '20px' }}>
            <p className="card-hint-text" style={{
              fontSize: '15px',
              marginBottom: '12px',
              textShadow: '0 0 25px rgba(200, 220, 255, 0.5)'
            }}>
              ✨ 接收完成，生成你的专属能量卡片
            </p>
            <button
              id="generate-poster-btn"
              onClick={(e) => handleComplete(e)}
              disabled={generatingPoster}
              className="complete-button"
              style={{
                padding: '14px 40px',
                fontSize: '16px',
                fontWeight: '400',
                background: generatingPoster
                  ? 'linear-gradient(135deg, rgba(200, 220, 255, 0.04) 0%, rgba(180, 200, 255, 0.06) 100%)'
                  : 'linear-gradient(135deg, rgba(200, 220, 255, 0.08) 0%, rgba(180, 200, 255, 0.12) 100%)',
                borderWidth: '1px',
                borderColor: generatingPoster ? 'rgba(200, 220, 255, 0.15)' : 'rgba(200, 220, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(200, 220, 255, 0.2), inset 0 1px 20px rgba(255, 255, 255, 0.1)',
                opacity: generatingPoster ? 0.6 : 1,
                cursor: generatingPoster ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {generatingPoster ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(200, 220, 255, 0.3)',
                    borderTopColor: 'rgba(200, 220, 255, 0.9)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  正在生成能量卡片...
                </span>
              ) : '生成能量卡片'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .book-of-answers-container {
          position: relative;
        }

        .book-title {
          color: rgba(200, 220, 255, 0.95);
          font-size: 28px;
          font-weight: 200;
          letter-spacing: 0.25em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 30px rgba(200, 220, 255, 0.4);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .book-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          font-weight: 200;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .complete-button {
          padding: 12px 36px;
          border-radius: 4px;
          font-weight: 200;
          font-size: 15px;
          letter-spacing: 0.2em;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px) saturate(120%);
          -webkit-backdrop-filter: blur(40px) saturate(120%);
          border: 0.5px solid rgba(200, 220, 255, 0.15);
          color: rgba(200, 220, 255, 0.9);
          font-family: 'Noto Serif SC', serif;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            inset 0 0 20px rgba(180, 200, 255, 0.03),
            0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .complete-button:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(200, 220, 255, 0.25);
          transform: scale(1.05);
          box-shadow:
            inset 0 0 30px rgba(180, 200, 255, 0.05),
            0 6px 30px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(200, 220, 255, 0.15);
        }

        .card-hint-text {
          color: rgba(200, 220, 255, 0.7);
          font-size: 14px;
          font-weight: 200;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 20px rgba(200, 220, 255, 0.3);
          animation: hintPulse 2s ease-in-out infinite;
        }

        @keyframes hintPulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .book-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          background-color: #000;
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
          -webkit-overflow-scrolling: touch;
        }

        .book-background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8) contrast(1.1);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .book-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
          pointer-events: none;
        }

        .card-container {
          cursor: pointer;
          perspective: 1200px;
        }

        .card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-container.flipped .card {
          transform: rotateY(180deg);
          transition: transform 1.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }

        .card-front {
          transform: rotateY(180deg);
        }

        .card-container:not(.flipped):hover .card {
          transform: translateY(-6px) scale(1.05);
        }

        .card-back-image {
          animation: goldenPulseGlow 3.42s ease-in-out infinite;
        }

        @keyframes goldenPulseGlow {
          0%, 100% {
            filter: brightness(0.85) contrast(1.15) drop-shadow(0 0 8px rgba(235, 200, 98, 0.2));
          }
          50% {
            filter: brightness(0.95) contrast(1.2) drop-shadow(0 0 16px rgba(235, 200, 98, 0.4));
          }
        }

        .golden-glow-overlay {
          animation: glowPulse 3.42s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: inset 0 0 40px rgba(235, 200, 98, 0.15), inset 0 0 60px rgba(235, 200, 98, 0.1);
          }
          50% {
            box-shadow: inset 0 0 50px rgba(235, 200, 98, 0.2), inset 0 0 70px rgba(235, 200, 98, 0.15);
          }
        }

        .wisdom-text {
          color: rgba(200, 220, 255, 0.95);
          font-size: 13px;
          font-weight: 200;
          line-height: 1.8;
          text-align: center;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 20px rgba(200, 220, 255, 0.5);
          position: relative;
          z-index: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          animation: wisdomGlow 3s ease-in-out infinite;
        }

        @keyframes wisdomGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(200, 220, 255, 0.5), 0 0 30px rgba(180, 200, 240, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(200, 220, 255, 0.7), 0 0 45px rgba(180, 200, 240, 0.4);
          }
        }

        .poster-card-hidden {
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: 750px;
          height: 1334px;
          z-index: -1;
          pointer-events: none;
        }

        .poster-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .poster-image {
          max-width: 90%;
          max-height: 70vh;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        }

        .poster-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .poster-button {
          padding: 12px 32px;
          font-size: 16px;
          font-weight: 400;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(200, 220, 255, 0.3);
          background: linear-gradient(135deg, rgba(200, 220, 255, 0.08) 0%, rgba(180, 200, 255, 0.12) 100%);
          color: rgba(200, 220, 255, 0.95);
        }

        .poster-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(200, 220, 255, 0.2);
        }

        .poster-generating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          color: rgba(200, 220, 255, 0.95);
        }

        .poster-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(200, 220, 255, 0.2);
          border-top-color: rgba(200, 220, 255, 0.9);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* 🔥 隐藏的海报卡片（用于 html2canvas 捕获） */}
      <div ref={posterCardRef} className="poster-card-hidden">
        <div
          style={{
            width: '750px',
            height: '1334px',
            backgroundImage: `url(${cardBgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 100%)',
            zIndex: 1
          }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              marginBottom: '40px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
            }}>
              答案之书
            </h1>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              padding: '60px 50px',
              borderRadius: '24px',
              border: '2px solid rgba(235, 200, 98, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(235, 200, 98, 0.1)',
              marginBottom: '60px'
            }}>
              <p style={{
                fontSize: '42px',
                fontWeight: '300',
                lineHeight: '1.8',
                letterSpacing: '0.15em',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                fontFamily: "'Noto Serif SC', serif"
              }}>
                {higherSelfAdvice}
              </p>
            </div>

            {userName && (
              <p style={{
                fontSize: '32px',
                fontWeight: '200',
                letterSpacing: '0.1em',
                opacity: 0.9,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                {userName}
              </p>
            )}

            <p style={{
              fontSize: '24px',
              fontWeight: '200',
              letterSpacing: '0.15em',
              opacity: 0.7,
              marginTop: '40px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}>
              扫码开启你的觉察之旅
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 海报遮罩层（用于显示结果） */}
      {showPoster && (
        <div className="poster-overlay">
          {generatingPoster ? (
            <div className="poster-generating">
              <div className="poster-spinner" />
              <p style={{ fontSize: '18px', letterSpacing: '0.1em' }}>正在生成海报...</p>
            </div>
          ) : posterImage ? (
            <>
              <img src={posterImage} alt="能量卡片" className="poster-image" />
              <div className="poster-actions">
                <button
                  className="poster-button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `能量卡片_${new Date().getTime()}.png`;
                    link.href = posterImage;
                    link.click();
                  }}
                >
                  下载海报
                </button>
                <button
                  className="poster-button"
                  onClick={() => {
                    setShowPoster(false);
                    setPosterImage(null);
                  }}
                >
                  关闭
                </button>
              </div>
              <p style={{
                marginTop: '16px',
                fontSize: '14px',
                color: 'rgba(200, 220, 255, 0.6)',
                letterSpacing: '0.05em'
              }}>
                长按图片可保存到相册
              </p>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
