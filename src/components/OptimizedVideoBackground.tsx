/**
 * 优化的视频背景组件
 * 使用预加载的视频实例 + poster 兜底，确保瞬间显示
 */

import { useEffect, useRef, useState } from 'react';
import { BACKGROUND_ASSETS, type BackgroundAsset } from '../utils/backgroundAssets';
import { videoPreloader } from '../utils/videoPreloader';

interface OptimizedVideoBackgroundProps {
  assetId: keyof typeof BACKGROUND_ASSETS;
  overlay?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function OptimizedVideoBackground({
  assetId,
  overlay = 'rgba(2, 13, 10, 0.25)',
  className = '',
  style = {}
}: OptimizedVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const asset: BackgroundAsset = BACKGROUND_ASSETS[assetId];

  useEffect(() => {
    if (!videoRef.current) return;

    // 尝试获取预加载的视频
    const preloadedVideo = videoPreloader.getVideo(assetId);

    if (preloadedVideo) {
      // 使用预加载的视频（直接替换 src）
      const source = videoRef.current.querySelector('source');
      if (source) {
        source.src = asset.videoUrl;
      }
      videoRef.current.load();

      // 立即播放
      videoRef.current.play().then(() => {
        setVideoReady(true);
      }).catch(() => {
        // 播放失败，使用 poster 兜底
        console.warn(`Video autoplay failed for ${assetId}, using poster`);
        setVideoReady(true);
      });
    } else {
      // 如果预加载未完成，正常加载
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        setVideoReady(true);
      });
    }
  }, [assetId, asset.videoUrl]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{
        zIndex: -1,
        backgroundColor: asset.fallbackColor,
        background: asset.fallbackColor,
        WebkitTransform: 'translate3d(0,0,0)',
        transform: 'translate3d(0,0,0)',
        WebkitOverflowScrolling: 'touch',
        ...style
      }}
    >
      {/* 视频层 */}
      <video
        ref={videoRef}
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        preload="auto"
        crossOrigin="anonymous"
        poster={asset.posterUrl}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          willChange: 'transform',
          opacity: videoReady ? 1 : 0.95,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <source src={asset.videoUrl} type="video/mp4" />
      </video>

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
