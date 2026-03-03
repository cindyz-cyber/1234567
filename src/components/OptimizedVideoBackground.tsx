import { useEffect, useRef, useState } from 'react';
import { BACKGROUND_ASSETS, getPreloadedVideo, isAssetPreloaded } from '../utils/backgroundAssets';

interface OptimizedVideoBackgroundProps {
  assetId: keyof typeof BACKGROUND_ASSETS;
  className?: string;
  opacity?: number;
}

/**
 * 高性能视频背景组件
 *
 * 三级兜底策略:
 * 1. 品牌底色（瞬间显示）
 * 2. Poster 封面图（快速占位）
 * 3. 视频动画（平滑淡入）
 *
 * 性能优化:
 * - 使用 visibility: hidden 代替 display: none
 * - 添加 will-change: transform 提升渲染优先级
 * - Mobile Safari 完整兼容
 */
export default function OptimizedVideoBackground({
  assetId,
  className = '',
  opacity = 0.3
}: OptimizedVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const asset = BACKGROUND_ASSETS[assetId];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 检查是否已预加载
    const preloadedVideo = getPreloadedVideo(assetId);

    if (preloadedVideo) {
      // 使用预加载的视频实例
      console.log(`✅ 使用预加载视频: ${assetId}`);
      setIsVideoReady(true);

      // 尝试自动播放（Mobile Safari 需要用户交互）
      videoElement.play().catch(err => {
        console.warn(`Auto-play blocked for ${assetId}:`, err.message);
        // Poster 会继续显示，不影响用户体验
      });
    } else {
      // 降级加载（如果预加载失败）
      console.warn(`⚠️ 预加载失败，降级加载: ${assetId}`);

      const handleCanPlay = () => {
        setIsVideoReady(true);
        videoElement.play().catch(err => {
          console.warn(`Play failed for ${assetId}:`, err.message);
        });
      };

      videoElement.addEventListener('canplaythrough', handleCanPlay, { once: true });

      return () => {
        videoElement.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, [assetId]);

  return (
    <div
      className={`fixed inset-0 ${className}`}
      style={{
        backgroundColor: asset.fallbackColor, // 第一级兜底：品牌底色
        willChange: 'transform', // 提升渲染优先级
        isolation: 'isolate' // 创建独立渲染层
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={asset.posterUrl} // 第二级兜底：Poster 封面
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: isVideoReady ? opacity : 0, // 第三级：视频淡入
          transition: 'opacity 0.5s ease-in-out',
          visibility: 'visible', // 使用 visibility 代替 display: none
          willChange: 'opacity, transform'
        }}
      >
        <source src={asset.videoUrl} type="video/mp4" />
      </video>

      {/* Poster 加载前的即时兜底（纯色背景已通过父容器提供） */}
      {!isVideoReady && !isAssetPreloaded(assetId) && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${asset.fallbackColor} 0%, rgba(0,0,0,0.8) 100%)`
          }}
        />
      )}
    </div>
  );
}
