/**
 * ZenBackground - 通用背景组件
 *
 * 自动应用所有"秒开"优化逻辑：
 * 1. 三级渲染协议（底色 → Poster → 视频）
 * 2. GPU 硬件加速
 * 3. 移动端兼容性补丁
 * 4. 预加载资源复用
 * 5. 优雅降级策略
 *
 * 使用示例：
 * <ZenBackground assetId="golden_flow" overlay="rgba(2, 13, 10, 0.25)" />
 */

import { useEffect, useRef, useState } from 'react';
import { BACKGROUND_ASSETS, type BackgroundAsset } from '../utils/backgroundAssets';
import { videoPreloader } from '../utils/videoPreloader';

interface ZenBackgroundProps {
  assetId: keyof typeof BACKGROUND_ASSETS;
  overlay?: string;
  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;
}

export default function ZenBackground({
  assetId,
  overlay,
  className = '',
  style = {},
  onReady
}: ZenBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [renderStage, setRenderStage] = useState<'color' | 'poster' | 'video'>('color');
  const asset: BackgroundAsset = BACKGROUND_ASSETS[assetId];

  useEffect(() => {
    // 第一级：底色（立即显示，0ms）
    setRenderStage('color');

    // 第二级：Poster（50ms 后显示）
    const posterTimer = setTimeout(() => {
      setRenderStage('poster');
    }, 50);

    // 第三级：视频加载
    if (!videoRef.current) {
      clearTimeout(posterTimer);
      return;
    }

    const videoElement = videoRef.current;

    // 尝试使用预加载的视频
    const preloadedVideo = videoPreloader.getVideo(assetId);

    const handleVideoReady = () => {
      setRenderStage('video');
      if (onReady) onReady();
    };

    if (preloadedVideo) {
      // 使用预加载实例
      videoElement.load();
      videoElement.play()
        .then(handleVideoReady)
        .catch(() => {
          console.warn(`Video autoplay failed for ${assetId}, using poster`);
          // 保持 poster 显示
        });
    } else {
      // 降级加载
      const handleCanPlay = () => {
        videoElement.play()
          .then(handleVideoReady)
          .catch(() => {
            console.warn(`Play failed for ${assetId}`);
          });
      };

      videoElement.addEventListener('canplaythrough', handleCanPlay, { once: true });

      return () => {
        clearTimeout(posterTimer);
        videoElement.removeEventListener('canplaythrough', handleCanPlay);
      };
    }

    return () => clearTimeout(posterTimer);
  }, [assetId, onReady]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{
        zIndex: -1,
        // 第一级兜底：主题底色（0ms 瞬间显示）
        backgroundColor: asset.fallbackColor,
        background: asset.fallbackColor,
        // 移动端硬件加速补丁（防止 iOS 闪烁/消失）
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        willChange: 'transform, opacity',
        WebkitOverflowScrolling: 'touch',
        isolation: 'isolate',
        ...style
      }}
    >
      {/* 第二级兜底：Poster 静态封面 (50ms) */}
      {renderStage !== 'color' && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${asset.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: renderStage === 'poster' ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        />
      )}

      {/* 第三级：动态视频背景 (加载完成后 Cross-fade 淡入) */}
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
          // GPU 硬件加速
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          // Cross-fade 效果
          opacity: renderStage === 'video' ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <source src={asset.videoUrl} type="video/mp4" />
      </video>

      {/* 覆盖层（可选） */}
      {overlay && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: overlay,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* 调试信息（开发环境） */}
      {import.meta.env.DEV && (
        <div
          className="absolute bottom-4 right-4 px-3 py-1 text-xs rounded"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            fontFamily: 'monospace',
            pointerEvents: 'none'
          }}
        >
          Stage: {renderStage} | Asset: {assetId}
        </div>
      )}
    </div>
  );
}
