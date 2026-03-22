import { useEffect, useMemo, useRef } from 'react';

/**
 * 冥想物理隔离视图：仅原生 video/audio + public 静态路径。
 * 不依赖路由、GlobalBackgroundPreloader、videoPreloader 或 BACKGROUND_ASSETS。
 */
export default function MeditationPureView() {
  const cacheBust = useMemo(() => Date.now(), []);
  const videoSrc = `/assets/meditation_bg.mp4?t=${cacheBust}`;
  const audioSrc = `/assets/音频冥想引导2.0.mp3?t=${cacheBust}`;

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.4;
    void el.play().catch((e) => {
      console.warn('[MeditationPureView] 音频需用户交互后播放:', e);
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
      data-meditation-pure="1"
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
