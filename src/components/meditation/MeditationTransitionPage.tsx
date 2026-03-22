import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { flowPath, useFlowMode } from '../../hooks/useFlowMode';
import { stopAllAudio, registerAudio } from '../../utils/audioManager';

/** 音频：硬编码字符串，不经过 GlobalBackgroundPreloader / 预加载中间件 */
const MEDITATION_AUDIO_SRC = '/assets/音频冥想引导2.0.mp3';

/**
 * 冥想过渡页：仅使用原生 video src 与 new Audio，不经过 GoldenTransition / 预加载模块。
 */
export default function MeditationTransitionPage() {
  const navigate = useNavigate();
  const { flowBase } = useFlowMode();
  const location = useLocation();
  const routeState = location.state as {
    userName?: string;
    higherSelfName?: string;
    journalContent?: string;
    meditationMode?: boolean;
  } | null;

  const [fadeOut, setFadeOut] = useState(false);
  const [manualExit, setManualExit] = useState(false);
  const transitionCompletedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const transitionNavRef = useRef({
    userName: '',
    higherSelfName: '',
    routeState: null as typeof routeState,
    flowBase: '',
  });
  transitionNavRef.current = {
    userName: routeState?.userName ?? '',
    higherSelfName: routeState?.higherSelfName ?? '',
    routeState,
    flowBase,
  };

  useEffect(() => {
    void stopAllAudio();
    /** 严禁 GlobalBackgroundPreloader / cancelAllBackgroundPreloads */

    const audio = new Audio(MEDITATION_AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.4;
    registerAudio(audio);
    audioRef.current = audio;

    audio
      .play()
      .then(() => {
        audio.muted = false;
      })
      .catch((e) => {
        console.error('冥想音频播放被拦截:', e);
        const unlock = () => {
          audio.play().catch(() => {});
          document.removeEventListener('click', unlock);
        };
        document.addEventListener('click', unlock);
      });

    return () => {
      if (!transitionCompletedRef.current && audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current.load();
        } catch {
          /* ignore */
        }
        audioRef.current = null;
      }
    };
  }, []);

  const goToDialogue = () => {
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
    window.setTimeout(() => {
      navigate(flowPath(nav.flowBase, '/dialogue'), { state: nextState });
    }, 480);
  };

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
          src="/assets/meditation_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="meditation-welcome-overlay pointer-events-none">
        进入 Cindy 的冥想空间
      </div>

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
      </div>

      <div className="fixed bottom-[max(1.5rem,6vh)] left-0 right-0 z-30 flex justify-center px-6 pointer-events-auto">
        <button
          type="button"
          onClick={goToDialogue}
          className="px-10 sm:px-14 py-3.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/30 text-[#F7E7CE] text-sm sm:text-[15px] tracking-[0.28em] sm:tracking-[0.35em] shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:bg-white/16 hover:border-white/45 active:scale-[0.98] transition-all duration-300 font-light max-w-[min(92vw,420px)] w-full sm:w-auto text-center"
        >
          点击留下智慧
        </button>
      </div>

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
          from { opacity: 0; transform: translate(-50%, -46%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .divine-golden-tree {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.98) 10%, rgba(255, 245, 200, 0.5) 18%, rgba(255, 225, 120, 0.35) 35%, rgba(250, 210, 100, 0.2) 55%, rgba(240, 195, 80, 0.1) 75%, transparent 100%);
          backdrop-filter: blur(0.5px);
          border: 2.5px solid rgba(255, 230, 120, 0.8);
          animation: crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(255, 240, 150, 0.9), 0 0 50px rgba(255, 220, 100, 0.7), 0 0 80px rgba(255, 200, 80, 0.5), 0 0 120px rgba(240, 180, 60, 0.3), inset 0 0 50px rgba(255, 245, 200, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.6);
          overflow: hidden;
        }
        .divine-aura {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 245, 200, 0.5) 0%, rgba(255, 230, 130, 0.4) 20%, rgba(255, 215, 100, 0.3) 40%, rgba(245, 195, 80, 0.2) 60%, transparent 75%);
          animation: auraPulse 4s ease-in-out infinite, auraRotate 20s linear infinite;
          z-index: 1;
          filter: blur(60px);
        }
        .golden-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 1);
          box-shadow: 0 0 10px rgba(255, 235, 140, 1), 0 0 20px rgba(255, 215, 100, 0.7), 0 0 30px rgba(255, 195, 80, 0.4);
          animation: particleFloat 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
        }
        @keyframes crystalBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes energyPulse {
          0%, 100% { filter: brightness(1.05); }
          50% { filter: brightness(1.3); }
        }
        @keyframes particleFloat {
          0% { transform: translate(-50%, -50%) translate(0, 0); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translate(-50%, -50%) translate(-40px, -40px); opacity: 0; }
        }
        @keyframes auraRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes auraPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
