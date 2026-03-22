import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { flowPath, useFlowMode } from '../hooks/useFlowMode';
import {
  createAndPlayAudioFromExplicitSrc,
  createAndPlayAudioFromZero,
  isVideoUrl,
  playAudioFromZero,
  stopAllAudio,
} from '../utils/audioManager';
import { cancelAllBackgroundPreloads } from '../utils/globalBackgroundPreloader';
import { resolveMeditationActive } from '../utils/meditationFlow';
import { DIALOGUE_PORTAL_VIDEO_URL } from '../constants/dialogueAmbient';
import { MEDITATION_BG_MP4, MEDITATION_GUIDE_MP3 } from '../constants/meditationMedia';
import { withCacheBust } from '../utils/cacheBustUrl';

interface GoldenTransitionProps {
  userName?: string;
  higherSelfName?: string;
  onComplete?: (backgroundMusic: HTMLAudioElement | null) => void;
  backgroundMusicUrl?: string | null;
  backgroundVideoUrl?: string | null;
  globalAudio?: HTMLAudioElement | null;
  isMusicVideo?: boolean;
  autoAdvance?: boolean;
  /** ShareJournal 等：由父组件根据 URL 传入，与 state / query 合并判断 */
  meditationMode?: boolean;
}

export default function GoldenTransition({
  userName: propUserName,
  higherSelfName: propHigherSelfName,
  onComplete,
  backgroundMusicUrl,
  backgroundVideoUrl,
  globalAudio,
  isMusicVideo = false,
  autoAdvance = true,
  meditationMode: meditationModeProp = false,
}: GoldenTransitionProps) {
  const navigate = useNavigate();
  const { flowBase } = useFlowMode();
  const location = useLocation();
  const routeState = location.state as {
    userName?: string;
    higherSelfName?: string;
    emotions?: string[];
    bodyStates?: string[];
    journalContent?: string;
    meditationMode?: boolean;
  } | null;
  const userName = propUserName ?? routeState?.userName ?? '';
  const higherSelfName = propHigherSelfName ?? routeState?.higherSelfName ?? '';

  const isMeditationActive = resolveMeditationActive({
    search: location.search,
    stateMeditation: routeState?.meditationMode,
    propMeditation: meditationModeProp,
  });

  /** 冥想引流：仅手动按钮进入高我对话，禁用倒计时自动跳转 */
  const meditationManualOnly = isMeditationActive;

  const [fadeOut, setFadeOut] = useState(false);
  /** 手动点「留下智慧」时用较短淡出，与自动 10s 转场区分 */
  const [manualExit, setManualExit] = useState(false);
  /** 冥想素材单次挂载内稳定的时间戳，避免 <video> src 每帧变化 */
  const meditationMediaCacheBust = useRef(Date.now());
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const isInitializingRef = useRef(false);
  const transitionCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const transitionNavRef = useRef({
    userName,
    higherSelfName,
    routeState,
    flowBase,
    isMeditationActive,
  });
  transitionNavRef.current = {
    userName,
    higherSelfName,
    routeState,
    flowBase,
    isMeditationActive,
  };

  /** 预加载下一页对话背景视频（冥想模式不注入，避免与 meditation_bg 争抢） */
  useEffect(() => {
    if (isMeditationActive) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = DIALOGUE_PORTAL_VIDEO_URL;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    return () => {
      try {
        if (link.parentNode) document.head.removeChild(link);
      } catch {
        /* ignore */
      }
    };
  }, [isMeditationActive]);

  const defaultVideoUrl =
    'https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4';
  const isMediaUrlVideo = backgroundMusicUrl && isVideoUrl(backgroundMusicUrl);
  const effectiveVideoUrl = isMediaUrlVideo
    ? backgroundMusicUrl
    : backgroundVideoUrl || defaultVideoUrl;

  /** 不修改 effectiveVideoUrl；冥想模式使用常量路径 + ?v= 绕过 HTTP 缓存 */
  const backgroundVideoSrcForPlayer = isMeditationActive
    ? withCacheBust(MEDITATION_BG_MP4, meditationMediaCacheBust.current)
    : effectiveVideoUrl;

  const goToDialogueOrComplete = () => {
    transitionCompletedRef.current = true;
    setManualExit(true);
    setFadeOut(true);
    const nav = transitionNavRef.current;
    const nextState = {
      ...nav.routeState,
      userName: nav.userName,
      higherSelfName: nav.higherSelfName,
      journalContent: nav.routeState?.journalContent,
      meditationMode: true as const,
    };
    const handoffMs = 480;
    window.setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current(audioInstanceRef.current);
      } else {
        navigate(flowPath(nav.flowBase, '/dialogue'), { state: nextState });
      }
    }, handoffMs);
  };

  useEffect(() => {
    stopAllAudio();
    cancelAllBackgroundPreloads();

    let fadeOutTimer: number;
    let completeTimer: number;
    const transitionDuration = 10000;

    const initializeAudio = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        if (isMeditationActive) {
          const instance = await createAndPlayAudioFromExplicitSrc(
            withCacheBust(MEDITATION_GUIDE_MP3, meditationMediaCacheBust.current),
            0.4
          );
          audioInstanceRef.current = instance;
        } else if (globalAudio) {
          await playAudioFromZero(globalAudio);
          audioInstanceRef.current = globalAudio;
        } else if (!isMediaUrlVideo) {
          const audioUrl = backgroundMusicUrl || '';
          const cacheBustedUrl = audioUrl ? `${audioUrl}?t=${Date.now()}` : '';
          const instance = await createAndPlayAudioFromZero(cacheBustedUrl);
          audioInstanceRef.current = instance;
        }
      } finally {
        isInitializingRef.current = false;
      }

      const runAutoTimers = autoAdvance && !meditationManualOnly;
      if (runAutoTimers) {
        fadeOutTimer = window.setTimeout(() => setFadeOut(true), transitionDuration - 1000);
        completeTimer = window.setTimeout(() => {
          transitionCompletedRef.current = true;
          const nav = transitionNavRef.current;
          if (onCompleteRef.current) {
            onCompleteRef.current(audioInstanceRef.current);
          } else {
            navigate(flowPath(nav.flowBase, '/dialogue'), {
              state: {
                ...nav.routeState,
                userName: nav.userName,
                higherSelfName: nav.higherSelfName,
                journalContent: nav.routeState?.journalContent,
                meditationMode: nav.isMeditationActive || nav.routeState?.meditationMode,
              },
            });
          }
        }, transitionDuration);
      }
    };

    initializeAudio();

    return () => {
      if (typeof fadeOutTimer !== 'undefined') clearTimeout(fadeOutTimer);
      if (typeof completeTimer !== 'undefined') clearTimeout(completeTimer);
      if (audioInstanceRef.current && !transitionCompletedRef.current) {
        try {
          audioInstanceRef.current.pause();
          audioInstanceRef.current.src = '';
          audioInstanceRef.current.load();
        } catch (_) {}
        audioInstanceRef.current = null;
      }
    };
  }, [
    isMeditationActive,
    meditationManualOnly,
    autoAdvance,
    location.search,
    navigate,
    globalAudio,
    backgroundMusicUrl,
    backgroundVideoUrl,
    isMediaUrlVideo,
  ]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: manualExit ? 'opacity 0.45s ease' : 'opacity 2s ease',
      }}
    >
      <div className="fixed inset-0 w-full h-full z-[-1] bg-[#020d0a]">
        <video
          autoPlay
          loop
          muted={isMeditationActive ? true : !isMusicVideo}
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={backgroundVideoSrcForPlayer} type="video/mp4" />
        </video>
      </div>

      {isMeditationActive && (
        <div className="meditation-welcome-overlay pointer-events-none">
          进入 Cindy 的冥想空间
        </div>
      )}

      {/* 1:1 with HomePage.tsx golden sphere (divine-aura + divine-golden-tree + golden-particle) */}
      <div className="flex flex-col items-center gap-8 z-10 w-full max-w-xl">
        <div
          className="relative flex items-center justify-center outline-none border-none bg-transparent p-0 z-10 pointer-events-none"
          aria-hidden
        >
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

        {!isMeditationActive && (
          <div className="text-center">
            <p className="text-[#F7E7CE] text-lg tracking-[0.4em] mb-4">
              带着问题，闭上眼， 打开心。。。
            </p>
            <p className="text-[#F7E7CE] opacity-70 tracking-[0.3em]">
              正在连接你的 {higherSelfName}
            </p>
          </div>
        )}
      </div>

      {meditationManualOnly && (
        <div className="fixed bottom-[max(1.5rem,6vh)] left-0 right-0 z-30 flex justify-center px-6 pointer-events-auto">
          <button
            type="button"
            onClick={goToDialogueOrComplete}
            className="px-10 sm:px-14 py-3.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/30 text-[#F7E7CE] text-sm sm:text-[15px] tracking-[0.28em] sm:tracking-[0.35em] shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:bg-white/16 hover:border-white/45 active:scale-[0.98] transition-all duration-300 font-light max-w-[min(92vw,420px)] w-full sm:w-auto text-center"
          >
            点击留下智慧
          </button>
        </div>
      )}

      <style>{`
        .meditation-welcome-overlay {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          max-width: 90vw;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          color: rgba(247, 231, 206, 0.95);
          text-shadow:
            0 0 24px rgba(247, 231, 206, 0.5),
            0 2px 12px rgba(0, 0, 0, 0.85);
          animation: meditationWelcomeFadeIn 2.2s ease-out both;
        }

        @keyframes meditationWelcomeFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -46%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
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

        .divine-golden-tree:hover {
          transform: scale(1.05);
          box-shadow:
            0 0 40px rgba(255, 245, 180, 1),
            0 0 70px rgba(255, 225, 110, 0.8),
            0 0 110px rgba(255, 205, 90, 0.6),
            0 0 150px rgba(245, 185, 70, 0.4),
            inset 0 0 60px rgba(255, 250, 220, 0.5),
            inset 0 0 35px rgba(255, 255, 255, 0.7);
          border-color: rgba(255, 235, 130, 1);
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
      `}</style>
    </div>
  );
}
