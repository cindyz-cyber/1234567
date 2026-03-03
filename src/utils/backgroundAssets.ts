/**
 * 统一背景资源管理
 * 提供三级兜底加载策略：品牌底色 → Poster封面 → 视频动画
 */

// 品牌底色 - 第一级兜底（瞬间显示）
export const BRAND_COLORS = {
  primary: '#0A0A0F',      // 深邃黑
  secondary: '#1A1A2E',    // 神秘紫黑
  golden: '#EBC862',       // 玛雅金
  accent: '#2A2A3E'        // 暗蓝黑
} as const;

// 背景资源配置
export interface BackgroundAsset {
  id: string;
  videoUrl: string;
  posterUrl: string;
  fallbackColor: string;
  description: string;
}

// 核心背景资源（本地化后）
export const BACKGROUND_ASSETS: Record<string, BackgroundAsset> = {
  // 主背景 - 金色流动（最常用）
  golden_flow: {
    id: 'golden_flow',
    videoUrl: '/assets/videos/golden-flow.mp4',  // 对应 b84b7c1b
    posterUrl: '/assets/videos/golden-flow-poster.jpg',
    fallbackColor: BRAND_COLORS.primary,
    description: '金色能量流动'
  },

  // 能量场背景 - 深紫流动
  energy_field: {
    id: 'energy_field',
    videoUrl: '/assets/videos/energy-field.mp4',  // 对应 73a6b711
    posterUrl: '/assets/videos/energy-field-poster.jpg',
    fallbackColor: BRAND_COLORS.secondary,
    description: '紫色能量场'
  },

  // 共振背景 - 蓝色波纹
  resonance_wave: {
    id: 'resonance_wave',
    videoUrl: '/assets/videos/resonance-wave.mp4',  // 对应 661ffc10
    posterUrl: '/assets/videos/resonance-wave-poster.jpg',
    fallbackColor: BRAND_COLORS.accent,
    description: '蓝色共振波'
  },

  // 禅意背景 - 金色漩涡
  zen_vortex: {
    id: 'zen_vortex',
    videoUrl: '/assets/videos/zen-vortex.mp4',  // 对应 7e901a1c
    posterUrl: '/assets/videos/zen-vortex-poster.jpg',
    fallbackColor: BRAND_COLORS.golden,
    description: '金色禅意漩涡'
  }
} as const;

// 预加载状态追踪
const preloadedVideos = new Map<string, HTMLVideoElement>();
const preloadedPosters = new Set<string>();

/**
 * 预加载视频资源
 * 在 App.tsx 入口调用，确保首屏就绪
 */
export function preloadBackgroundVideo(assetId: keyof typeof BACKGROUND_ASSETS): Promise<void> {
  return new Promise((resolve) => {
    const asset = BACKGROUND_ASSETS[assetId];

    // 如果已预加载，直接返回
    if (preloadedVideos.has(assetId)) {
      resolve();
      return;
    }

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = 'auto';

    // 设置 poster（第二级兜底）
    video.poster = asset.posterUrl;

    // 预加载 poster 图片
    const posterImg = new Image();
    posterImg.onload = () => {
      preloadedPosters.add(assetId);
    };
    posterImg.src = asset.posterUrl;

    video.addEventListener('loadeddata', () => {
      preloadedVideos.set(assetId, video);
      resolve();
    }, { once: true });

    video.addEventListener('error', () => {
      console.warn(`Failed to preload video: ${assetId}, poster will be used`);
      resolve(); // 即使失败也继续，使用 poster 兜底
    }, { once: true });

    const source = document.createElement('source');
    source.src = asset.videoUrl;
    source.type = 'video/mp4';
    video.appendChild(source);

    video.load();
  });
}

/**
 * 批量预加载核心资源
 * 优先加载最常用的 golden_flow
 */
export async function preloadCoreBackgrounds(): Promise<void> {
  // 优先级加载
  await preloadBackgroundVideo('golden_flow');

  // 并行加载其他资源
  await Promise.allSettled([
    preloadBackgroundVideo('energy_field'),
    preloadBackgroundVideo('resonance_wave'),
    preloadBackgroundVideo('zen_vortex')
  ]);

  console.log('✅ 核心背景资源预加载完成');
}

/**
 * 获取预加载的视频实例
 */
export function getPreloadedVideo(assetId: keyof typeof BACKGROUND_ASSETS): HTMLVideoElement | null {
  return preloadedVideos.get(assetId) || null;
}

/**
 * 检查资源是否已预加载
 */
export function isAssetPreloaded(assetId: keyof typeof BACKGROUND_ASSETS): boolean {
  return preloadedVideos.has(assetId) || preloadedPosters.has(assetId);
}
