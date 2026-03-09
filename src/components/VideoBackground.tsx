import { useEffect, useRef, useState } from 'react';
import { BACKGROUND_ASSETS, getPreloadedVideo, BRAND_COLORS } from '../utils/backgroundAssets';

/**
 * 优化后的视频背景组件
 * 使用三级兜底策略 + 本地化资源 + Mobile Safari 优化
 */
interface VideoBackgroundProps {
  videoUrl?: string;
}

export default function VideoBackground({ videoUrl }: VideoBackgroundProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const asset = BACKGROUND_ASSETS.golden_flow;
  const defaultHomeVideo = 'https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/imuqqrh3qnl-1773037470946.mp4';
  const finalVideoUrl = videoUrl || defaultHomeVideo || asset?.sources?.[0]?.url;

  console.group('🎥 视频背景加载');
  console.log('📍 组件: VideoBackground');
  console.log('🔗 配置台传入 URL (videoUrl):', videoUrl || '❌ 未传入');
  console.log('🔗 新主页默认视频:', defaultHomeVideo);
  console.log('🔗 本地降级 URL (fallback):', asset?.sources?.[0]?.url || '❌ 未定义');
  console.log('✅ 最终使用 URL:', finalVideoUrl);
  console.log('🚀 资源来源:', videoUrl ? 'Supabase Storage（配置台）' : '新主页默认视频');
  console.groupEnd();

  if (!asset) {
    console.error('❌ golden_flow 背景资源未定义');
    return <div className="fixed inset-0" style={{ backgroundColor: BRAND_COLORS.primary, zIndex: -3 }} />;
  }

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const preloadedVideo = getPreloadedVideo('golden_flow');
    if (preloadedVideo) {
      setIsVideoReady(true);
      videoElement.play().catch(err => {
        console.warn('Auto-play blocked:', err.message);
      });
    } else {
      const handleCanPlay = () => {
        setIsVideoReady(true);
        videoElement.play().catch(() => {});
      };
      videoElement.addEventListener('canplaythrough', handleCanPlay, { once: true });
      return () => videoElement.removeEventListener('canplaythrough', handleCanPlay);
    }
  }, []);

  return (
    <>
      {/* 全屏兜底背景 - 立即显示，防止白屏 */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: -3,
          backgroundColor: BRAND_COLORS.primary,
        }}
      />

      <video
        ref={videoRef}
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        controls={false}
        preload="auto"
        poster={asset?.posterUrl || ''}
        disablePictureInPicture={true}
        disableRemotePlayback={true}
        src={finalVideoUrl}
        className="fixed w-full object-cover"
        style={{
          top: '66vh',
          bottom: 0,
          height: '34vh',
          zIndex: -2,
          filter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
          WebkitTransform: 'translate3d(0,0,0)',
          transform: 'translate3d(0,0,0)',
          opacity: isVideoReady ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          willChange: 'opacity, transform',
          visibility: 'visible'
        }}
      />


      <div
        className="fixed"
        style={{
          top: '66vh',
          left: 0,
          right: 0,
          bottom: 0,
          height: '34vh',
          backgroundColor: 'rgba(2, 13, 10, 0.15)',
          zIndex: -1,
        }}
      />
    </>
  );
}
