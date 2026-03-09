import { useEffect, useState } from 'react';
import { playBackgroundMusicLoop, playShareBackgroundMusic, isVideoUrl } from '../utils/audioManager';

interface GoldenTransitionProps {
  userName: string;
  higherSelfName: string;
  onComplete: (backgroundMusic: HTMLAudioElement | null) => void;
  backgroundMusicUrl?: string | null;
  backgroundVideoUrl?: string | null;
  globalAudio?: HTMLAudioElement | null;
  isMusicVideo?: boolean;
}

export default function GoldenTransition({ userName, higherSelfName, onComplete, backgroundMusicUrl, backgroundVideoUrl, globalAudio, isMusicVideo = false }: GoldenTransitionProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const defaultVideoUrl = 'https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4';

  // 智能视频 URL 选择：
  // 1. 如果 backgroundMusicUrl 是 MP4，优先使用它作为视频背景
  // 2. 否则使用 backgroundVideoUrl
  // 3. 都没有则使用默认视频
  const isMediaUrlVideo = backgroundMusicUrl && isVideoUrl(backgroundMusicUrl);
  const effectiveVideoUrl = isMediaUrlVideo
    ? backgroundMusicUrl
    : (backgroundVideoUrl && backgroundVideoUrl.trim() !== '' ? backgroundVideoUrl : defaultVideoUrl);

  useEffect(() => {
    console.log('🎬 [GoldenTransition] 组件挂载，立即初始化音频');
    console.log('🎵 背景音乐 URL:', backgroundMusicUrl);
    console.log('🎥 背景视频 URL:', backgroundVideoUrl);
    console.log('🎵 全局音频对象:', globalAudio ? '有效' : '无');
    console.log('🎬 媒体类型判断 (内部): isMediaUrlVideo =', isMediaUrlVideo);
    console.log('🎯 音乐视频标识 (传入): isMusicVideo =', isMusicVideo);
    console.log('🔊 视频声音策略:', isMusicVideo ? '✅ 开启声音 (muted=false, volume=0.3)' : '🔇 静音播放 (muted=true)');

    let backgroundMusic: HTMLAudioElement | null = null;
    let fadeOutTimer: number | undefined;
    let completeTimer: number | undefined;
    const transitionDuration = 10000;

    const initializeAudio = async () => {
      console.log('⚡ [GoldenTransition] 开始音频初始化流程');

      // 优先使用全局音频对象（在 validateAccess 中提前创建）
      if (globalAudio) {
        console.log('✅ 使用全局音频对象（已在 validateAccess 中初始化）');

        // 🚀 性能优化：首次触发音频加载（从 preload="none" 切换到实际加载）
        if (globalAudio.preload === 'none') {
          console.log('🚀 首次触发音频加载（preload="none" -> "metadata"）');
          globalAudio.preload = 'metadata'; // 启用流式加载
          globalAudio.load(); // 触发加载
          console.log('⏳ 音频开始流式加载...');
        }

        console.log('🔄 第一次强制重置: currentTime = 0');
        globalAudio.currentTime = 0;

        // 🔥 双重确保：等待一帧后再次重置
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('🔄 第二次强制重置: currentTime = 0');
        globalAudio.currentTime = 0;

        console.log('▶️ 开始播放音频');

        try {
          await globalAudio.play();
          console.log('✅ [GoldenTransition] 全局音频播放成功');
          console.log('⏱️ 当前播放位置:', globalAudio.currentTime, '秒');
          console.log('🔊 音量:', globalAudio.volume);

          // 🔥 三重确保：播放后再检查一次
          if (globalAudio.currentTime > 0.5) {
            console.warn('⚠️ 检测到播放位置异常，强制归零');
            globalAudio.currentTime = 0;
          }

          backgroundMusic = globalAudio;
        } catch (err) {
          console.error('❌ 全局音频播放失败:', err);
        }
      }
      // 如果 backgroundMusicUrl 是视频，不加载音频（视频作为背景）
      else if (isMediaUrlVideo) {
        console.log('🎬 检测到 MP4 视频作为背景媒体，跳过音频加载');
        console.log('📊 视频将在背景中静音播放');
      }
      // 回退：如果没有全局音频对象，按原逻辑加载
      else if (backgroundMusicUrl) {
        console.log('⚠️ 无全局音频对象，直接加载场景音频...');
        console.log('📡 场景音频 URL:', backgroundMusicUrl);
        console.log('🚫 已禁用主 App 降级');

        // 🔥 强制禁用主 App 降级
        backgroundMusic = await playShareBackgroundMusic(backgroundMusicUrl, false);

        if (backgroundMusic) {
          console.log('✅ [GoldenTransition] 场景音频加载成功并开始播放');
          console.log('⏱️ 当前播放位置:', backgroundMusic.currentTime, '秒');
          console.log('🔊 音量:', backgroundMusic.volume);
          console.log('▶️ 播放状态:', !backgroundMusic.paused ? '播放中' : '暂停');

          // 🔥 确保从 0 秒播放
          if (backgroundMusic.currentTime > 0.5) {
            console.warn('⚠️ 检测到播放位置异常，强制归零');
            backgroundMusic.currentTime = 0;
          }
        } else {
          console.error('❌ [GoldenTransition] 场景音频加载失败');
          console.error('💡 请检查 bg_music_url 是否正确配置');
        }
      } else {
        console.warn('⚠️ 未配置 backgroundMusicUrl，将在无背景音乐的情况下运行');
        console.warn('💡 请到后台 /admin/share-config 配置 bg_music_url');
      }

      fadeOutTimer = window.setTimeout(() => {
        console.log('🌅 [GoldenTransition] 开始淡出动画');
        setFadeOut(true);
      }, transitionDuration - 1000);

      completeTimer = window.setTimeout(() => {
        console.log('✅ [GoldenTransition] 过渡完成，传递音频对象给下一步');
        console.log('🎵 传递的音频对象:', backgroundMusic ? '有效' : '无');
        onComplete(backgroundMusic);
      }, transitionDuration);
    };

    // 立即执行音频初始化
    initializeAudio();

    return () => {
      console.log('🧹 [GoldenTransition] 组件卸载，清理定时器');
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [onComplete, backgroundMusicUrl, backgroundVideoUrl, isMediaUrlVideo, globalAudio]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden hypnosis-container"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: -1,
          backgroundColor: 'rgba(2, 13, 10, 0.8)',
          WebkitTransform: 'translate3d(0,0,0)',
          transform: 'translate3d(0,0,0)'
        }}
      >
        <video
          autoPlay
          loop
          muted={!isMusicVideo}
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          poster="/0_0_640_N.webp"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
          }}
          ref={(videoEl) => {
            if (videoEl && isMusicVideo) {
              videoEl.volume = 0.3;
              console.log('🔊 [GoldenTransition] 视频音量已设置为 0.3');
            }
          }}
        >
          <source src={effectiveVideoUrl} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backgroundColor: 'rgba(2, 13, 10, 0.15)' }}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-[30vh] z-20 pointer-events-none top-vignette" />

      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute divine-aura pointer-events-none" />
        <div className="divine-golden-tree">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="golden-particle pointer-events-none"
              style={{
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${6 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="guidance-text-container"
        style={{
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 20px',
          position: 'relative',
        }}
      >
        <p
          className="guidance-text"
          style={{
            color: '#F7E7CE',
            fontSize: '15px',
            fontWeight: 200,
            letterSpacing: '0.4em',
            lineHeight: '1.8',
            textShadow: '0 2px 12px rgba(247, 231, 206, 0.3)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            opacity: 0.85,
            maxWidth: '400px',
          }}
        >
          带着问题，闭上眼， 打开心。。。
        </p>
      </div>

      <p
        className="connection-subtitle"
        style={{
          color: '#F7E7CE',
          fontSize: '14px',
          fontWeight: 200,
          letterSpacing: '0.35em',
          opacity: 0.7,
          marginTop: '24px',
          textAlign: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        正在连接你的 <span className="highlight-name">{higherSelfName}</span>
      </p>

      <style>{`
        .top-vignette {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.95) 25%,
            rgba(0, 0, 0, 0.8) 50%,
            rgba(0, 0, 0, 0.4) 75%,
            transparent 100%
          );
        }

        .divine-golden-tree {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.98) 10%,
              rgba(255, 245, 200, 0.5) 18%,
              rgba(255, 225, 120, 0.35) 35%,
              rgba(250, 210, 100, 0.2) 55%,
              rgba(240, 195, 80, 0.1) 75%,
              transparent 100%
            );
          backdrop-filter: blur(0.5px);
          border: 2.5px solid rgba(255, 230, 120, 0.8);
          animation: crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 30px rgba(255, 240, 150, 0.9),
            0 0 50px rgba(255, 220, 100, 0.7),
            0 0 80px rgba(255, 200, 80, 0.5),
            0 0 120px rgba(240, 180, 60, 0.3),
            inset 0 0 50px rgba(255, 245, 200, 0.4),
            inset 0 0 25px rgba(255, 255, 255, 0.6);
          transition: all 0.5s ease;
          overflow: hidden;
        }

        .divine-golden-tree::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            transparent 55%,
            rgba(255, 230, 120, 0.15) 65%,
            rgba(255, 215, 100, 0.25) 75%,
            rgba(255, 200, 85, 0.2) 85%,
            rgba(255, 185, 70, 0.12) 92%,
            transparent 100%
          );
          animation: innerGlow 4s ease-in-out infinite;
        }

        .divine-golden-tree::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 240, 180, 0.9);
          box-shadow:
            0 0 10px rgba(255, 220, 100, 0.8),
            0 0 20px rgba(255, 200, 80, 0.6);
          top: 50%;
          left: 50%;
          animation: particleFloat 8s ease-in-out infinite;
        }

        .golden-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 1);
          box-shadow:
            0 0 10px rgba(255, 235, 140, 1),
            0 0 20px rgba(255, 215, 100, 0.7),
            0 0 30px rgba(255, 195, 80, 0.4);
          animation: particleFloat 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
        }

        .divine-aura {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 245, 200, 0.5) 0%,
            rgba(255, 230, 130, 0.4) 20%,
            rgba(255, 215, 100, 0.3) 40%,
            rgba(245, 195, 80, 0.2) 60%,
            transparent 75%
          );
          animation: auraPulse 4s ease-in-out infinite, auraRotate 20s linear infinite;
          z-index: 1;
          filter: blur(60px);
        }

        @keyframes crystalBreathe {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 30px rgba(255, 240, 150, 0.9),
              0 0 50px rgba(255, 220, 100, 0.7),
              0 0 80px rgba(255, 200, 80, 0.5),
              0 0 120px rgba(240, 180, 60, 0.3),
              inset 0 0 50px rgba(255, 245, 200, 0.4),
              inset 0 0 25px rgba(255, 255, 255, 0.6);
          }
          50% {
            transform: scale(1.08);
            box-shadow:
              0 0 45px rgba(255, 245, 180, 1),
              0 0 75px rgba(255, 230, 120, 0.85),
              0 0 110px rgba(255, 210, 95, 0.65),
              0 0 160px rgba(245, 190, 75, 0.45),
              inset 0 0 65px rgba(255, 250, 220, 0.55),
              inset 0 0 35px rgba(255, 255, 255, 0.75);
          }
        }

        @keyframes energyPulse {
          0%, 100% {
            filter: brightness(1.05);
          }
          50% {
            filter: brightness(1.3);
          }
        }

        @keyframes innerGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          25% {
            transform: translate(-50%, -50%) translate(40px, -30px);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) translate(-35px, 45px);
            opacity: 0.7;
          }
          75% {
            transform: translate(-50%, -50%) translate(50px, 35px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) translate(-40px, -40px);
            opacity: 0;
          }
        }

        @keyframes auraRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes auraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
          }
        }

        .guidance-text {
          animation: textFadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .highlight-name {
          font-weight: 300;
          color: #F7E7CE;
          text-shadow: 0 2px 15px rgba(247, 231, 206, 0.5);
          letter-spacing: 0.4em;
          font-family: Georgia, "Times New Roman", serif;
        }

        .connection-subtitle {
          animation: subtlePulse 3s ease-in-out infinite;
        }

        @keyframes subtlePulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
