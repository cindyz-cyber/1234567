import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';

/** 默认漏斗与 runEntryPreload 拆到独立 chunk，冥想 URL 绝不加载、不执行 GlobalBackgroundPreloader */
const DefaultView = lazy(() => import('./components/meditation/DefaultView'));

/**
 * 冥想超轻量壳：仅原生 video/audio + `public/assets` 相对路径，不引用 BackgroundWrapper / 全局背景系统。
 * `./assets/*` 相对当前页面 URL 解析，配合 public 目录绕过构建期 hash。
 */
export function MeditationApp() {
  const cacheBust = useMemo(() => Date.now(), []);
  const videoSrc = `./assets/meditation_bg.mp4?t=${cacheBust}`;
  const audioSrc = `./assets/音频冥想引导2.0.mp3?t=${cacheBust}`;

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.4;
    void el.play().catch((e) => {
      console.warn('[MeditationApp] 音频需用户交互后播放:', e);
      const unlock = () => {
        void el.play().catch(() => {});
        document.removeEventListener('click', unlock);
        document.removeEventListener('touchstart', unlock);
      };
      document.addEventListener('click', unlock);
      document.addEventListener('touchstart', unlock);
    });
  }, []);

  return (
    <div
      data-meditation-app="1"
      style={{
        position: 'fixed',
        inset: 0,
        margin: 0,
        padding: 0,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <audio ref={audioRef} src={audioSrc} loop playsInline preload="auto" />
    </div>
  );
}

export type AppProps = {
  /** 由 main.tsx 在 createRoot 之前根据 URL 判定并传入 */
  isMeditation: boolean;
};

export default function App({ isMeditation }: AppProps) {
  if (isMeditation) {
    return <MeditationApp />;
  }

  return (
    <Suspense fallback={null}>
      <DefaultView />
    </Suspense>
  );
}
