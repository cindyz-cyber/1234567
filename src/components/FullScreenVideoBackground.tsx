import { useEffect, useRef, useState } from 'react';

interface FullScreenVideoBackgroundProps {
  videoUrl: string;
  poster?: string;
}

export default function FullScreenVideoBackground({
  videoUrl,
  poster
}: FullScreenVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  console.group('🎬 全屏视频背景加载');
  console.log('📍 组件: FullScreenVideoBackground');
  console.log('🔗 视频 URL:', videoUrl);
  console.log('🖼️ 海报 URL:', poster || '无');
  console.groupEnd();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      console.log('✅ 视频已准备就绪，开始播放');
      setIsVideoReady(true);
      videoElement.play().catch(err => {
        console.warn('⚠️ 自动播放被阻止:', err.message);
        // 移动端可能需要用户交互才能播放
      });
    };

    const handleError = (e: Event) => {
      console.error('❌ 视频加载失败:', e);
    };

    videoElement.addEventListener('canplaythrough', handleCanPlay, { once: true });
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('canplaythrough', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  return (
    <>
      {/* 兜底背景色 - 视频加载前显示 */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: -3,
          backgroundColor: '#020d0a',
        }}
      />

      {/* 全屏视频 */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        preload="auto"
        poster={poster}
        disablePictureInPicture
        disableRemotePlayback
        src={videoUrl}
        className="fixed inset-0 w-full h-full object-cover"
        style={{
          zIndex: -2,
          opacity: isVideoReady ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          WebkitTransform: 'translate3d(0,0,0)',
          transform: 'translate3d(0,0,0)',
          willChange: 'opacity',
        }}
      />

      {/* 可选：顶部遮罩层，增强文字可读性 */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: -1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </>
  );
}
