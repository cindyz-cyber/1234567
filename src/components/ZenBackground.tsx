/**
 * ZenBackground - 通用背景组件（移动端优先版本）
 *
 * 策略：
 * - 移动端：立即显示静态图，完全跳过视频（性能优先）
 * - 桌面端：显示视频（体验优先）
 * - 低性能设备：自动降级为静态图
 *
 * 三级渲染协议：
 * 1. 0ms - 底色（品牌色，永不白屏）
 * 2. 0ms - Poster 静态图（立即显示，不等待）
 * 3. 可选 - 视频（仅桌面端 + 高性能设备）
 */

import { useEffect, useRef, useState } from 'react';
import { BACKGROUND_ASSETS, type BackgroundAsset } from '../utils/backgroundAssets';

interface ZenBackgroundProps {
  assetId: keyof typeof BACKGROUND_ASSETS;
  overlay?: string;
  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;
  forceStatic?: boolean; // 强制使用静态图
}

// 检测设备类型
const isMobile = (() => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
})();

// 检测网络状况
const isSlowConnection = (() => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) return false;
  const conn = (navigator as any).connection;
  return conn?.saveData || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';
})();

export default function ZenBackground({
  assetId,
  overlay,
  className = '',
  style = {},
  onReady,
  forceStatic = false
}: ZenBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const asset: BackgroundAsset = BACKGROUND_ASSETS[assetId];

  // 决定是否使用视频（移动端 + 慢速网络 = 纯静态）
  const shouldUseVideo = !isMobile && !isSlowConnection && !forceStatic;

  useEffect(() => {
    // 立即预加载 Poster 图片
    const img = new Image();
    img.onload = () => {
      setPosterLoaded(true);
      if (!shouldUseVideo && onReady) {
        onReady(); // 移动端：Poster 加载完成即就绪
      }
    };
    img.src = asset.posterUrl;

    // 如果不使用视频，到此为止
    if (!shouldUseVideo) {
      return;
    }

    // 桌面端：尝试加载视频
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let playTimeout: NodeJS.Timeout;

    const tryPlayVideo = () => {
      videoElement.play()
        .then(() => {
          setVideoLoaded(true);
          if (onReady) onReady();
        })
        .catch(() => {
          // 播放失败，保持使用 Poster
          console.warn(`Video autoplay blocked for ${assetId}, using poster`);
        });
    };

    // 监听 canplay 事件（不等待 canplaythrough，更快）
    const handleCanPlay = () => {
      clearTimeout(playTimeout);
      playTimeout = setTimeout(tryPlayVideo, 100);
    };

    videoElement.addEventListener('canplay', handleCanPlay, { once: true });

    // 3秒超时保护：如果视频加载过慢，放弃
    const abandonTimeout = setTimeout(() => {
      console.warn(`Video loading timeout for ${assetId}, keeping poster only`);
      videoElement.removeEventListener('canplay', handleCanPlay);
    }, 3000);

    return () => {
      clearTimeout(playTimeout);
      clearTimeout(abandonTimeout);
      videoElement.removeEventListener('canplay', handleCanPlay);
    };
  }, [assetId, shouldUseVideo, onReady, asset.posterUrl]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{
        zIndex: -1,
        // 第一级：品牌底色（0ms 立即显示，永不白屏）
        backgroundColor: asset.fallbackColor,
        background: asset.fallbackColor,
        // 移动端硬件加速补丁
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        perspective: '1000px',
        willChange: 'auto',
        isolation: 'isolate',
        ...style
      }}
    >
      {/* 第二级：Poster 静态图（0ms 立即显示，不等待）*/}
      <div
        ref={posterRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${asset.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1, // 始终显示
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          // Poster 加载后微调透明度
          transition: posterLoaded ? 'none' : 'opacity 0.2s ease-in'
        }}
      />

      {/* 第三级：视频背景（仅桌面端 + 高性能设备）*/}
      {shouldUseVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata" // 移动端改为 metadata，不预加载完整视频
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // 视频淡入效果（不遮挡 Poster）
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: 'none'
          }}
        >
          <source src={asset.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* 覆盖层（可选）*/}
      {overlay && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: overlay,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* 调试信息（开发环境）*/}
      {import.meta.env.DEV && (
        <div
          className="absolute bottom-4 right-4 px-3 py-1 text-xs rounded"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#0f0',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            fontSize: '11px',
            lineHeight: '1.4'
          }}
        >
          Device: {isMobile ? 'Mobile' : 'Desktop'}<br />
          Mode: {shouldUseVideo ? 'Video' : 'Static'}<br />
          Poster: {posterLoaded ? 'Loaded' : 'Loading'}<br />
          {shouldUseVideo && <>Video: {videoLoaded ? 'Playing' : 'Loading'}</>}
        </div>
      )}
    </div>
  );
}
