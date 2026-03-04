/**
 * 优化的视频背景组件（移动端优先）
 *
 * 移动端策略：
 * - 立即显示 Poster 静态图（0ms）
 * - 完全跳过视频加载
 * - 节省流量和电量
 *
 * 桌面端策略：
 * - 显示 Poster（0ms）
 * - 加载并播放视频（可选增强）
 */

import { useEffect, useRef, useState } from 'react';
import { BACKGROUND_ASSETS, type BackgroundAsset } from '../utils/backgroundAssets';

interface OptimizedVideoBackgroundProps {
  assetId: keyof typeof BACKGROUND_ASSETS;
  overlay?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 设备检测
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);

export default function OptimizedVideoBackground({
  assetId,
  overlay = 'rgba(2, 13, 10, 0.25)',
  className = '',
  style = {}
}: OptimizedVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const asset: BackgroundAsset = BACKGROUND_ASSETS[assetId];

  useEffect(() => {
    // 预加载 Poster（优先级最高）
    const img = new Image();
    img.onload = () => setPosterLoaded(true);
    img.src = asset.posterUrl;

    // 移动端：只显示 Poster，完全跳过视频
    if (isMobileDevice) {
      return;
    }

    // 桌面端：尝试加载视频
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      videoElement.play()
        .then(() => setVideoPlaying(true))
        .catch(() => {
          console.warn(`Video autoplay blocked for ${assetId}`);
        });
    };

    videoElement.addEventListener('canplay', handleCanPlay, { once: true });

    // 3秒超时：放弃视频加载
    const timeout = setTimeout(() => {
      videoElement.removeEventListener('canplay', handleCanPlay);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      videoElement.removeEventListener('canplay', handleCanPlay);
    };
  }, [assetId, asset.posterUrl]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{
        zIndex: -1,
        // 第一级：品牌底色
        backgroundColor: asset.fallbackColor,
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        ...style
      }}
    >
      {/* 第二级：Poster 静态图（立即显示）*/}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${asset.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)'
        }}
      />

      {/* 第三级：视频（仅桌面端）*/}
      {!isMobileDevice && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            opacity: videoPlaying ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: 'none'
          }}
        >
          <source src={asset.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* 覆盖层 */}
      {overlay && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: overlay,
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
}
