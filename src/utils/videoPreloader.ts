/**
 * 视频预加载服务
 * 在应用启动时静默加载所有背景视频，确保页面切换时瞬间显示
 */

import { BACKGROUND_ASSETS } from './backgroundAssets';
import { isMeditationModeFromSearch } from './urlModeBootstrap';

interface PreloadStatus {
  assetId: string;
  loaded: boolean;
  error: boolean;
  progress: number;
}

class VideoPreloadService {
  private preloadedVideos = new Map<string, HTMLVideoElement>();
  private preloadStatuses = new Map<string, PreloadStatus>();
  private loadingPromises = new Map<string, Promise<void>>();

  /**
   * 预加载单个视频
   */
  async preloadVideo(assetId: keyof typeof BACKGROUND_ASSETS): Promise<void> {
    // 如果已经在加载，返回现有 Promise
    if (this.loadingPromises.has(assetId)) {
      return this.loadingPromises.get(assetId);
    }

    // 如果已经加载完成，直接返回
    if (this.preloadedVideos.has(assetId)) {
      return Promise.resolve();
    }

    const asset = BACKGROUND_ASSETS[assetId];

    if (!asset) {
      console.warn(`⚠️  背景资源 ${assetId} 未定义，跳过预加载`);
      return Promise.resolve();
    }

    const loadPromise = new Promise<void>((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.preload = 'auto';
      video.crossOrigin = 'anonymous';
      video.poster = asset?.posterUrl || '';

      // 添加 GPU 优化
      video.style.transform = 'translateZ(0)';
      video.style.willChange = 'transform';

      // 更新状态
      this.preloadStatuses.set(assetId, {
        assetId,
        loaded: false,
        error: false,
        progress: 0
      });

      // 监听加载进度
      video.addEventListener('progress', () => {
        if (video.buffered.length > 0) {
          const buffered = video.buffered.end(0);
          const duration = video.duration;
          if (duration > 0) {
            const progress = (buffered / duration) * 100;
            const status = this.preloadStatuses.get(assetId);
            if (status) {
              status.progress = progress;
            }
          }
        }
      });

      // 加载完成
      video.addEventListener('canplaythrough', () => {
        this.preloadedVideos.set(assetId, video);
        this.preloadStatuses.set(assetId, {
          assetId,
          loaded: true,
          error: false,
          progress: 100
        });
        console.log(`✅ 视频预加载完成: ${assetId} (${asset.description})`);
        resolve();
      }, { once: true });

      // 加载失败（非致命错误，使用 poster 兜底）
      video.addEventListener('error', (e) => {
        console.warn(`⚠️  视频预加载失败: ${assetId}, 将使用 poster 兜底`, e);
        this.preloadStatuses.set(assetId, {
          assetId,
          loaded: false,
          error: true,
          progress: 0
        });
        resolve(); // 不 reject，让应用继续运行
      }, { once: true });

      if (asset?.videoUrl) {
        const source = document.createElement('source');
        source.src = asset.videoUrl;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.load();
      } else {
        console.warn(`⚠️  背景资源 ${assetId} 缺少 videoUrl`);
        resolve();
      }
    });

    this.loadingPromises.set(assetId, loadPromise);
    return loadPromise;
  }

  /**
   * 批量预加载所有核心视频
   * 按优先级顺序加载
   */
  async preloadAllVideos(): Promise<void> {
    if (isMeditationModeFromSearch()) {
      console.log('🧘 [Meditation] 跳过 videoPreloader 默认批次（zen_vortex 等）');
      return;
    }
    console.log('🎬 开始预加载背景视频...');

    // 第一优先级：golden_flow（起名页、主背景）
    await this.preloadVideo('golden_flow');

    // 第二优先级：其他核心视频（并行加载）
    const parallelLoads = [
      this.preloadVideo('energy_field'),
      this.preloadVideo('resonance_wave'),
      this.preloadVideo('zen_vortex')
    ];

    await Promise.allSettled(parallelLoads);

    const loaded = Array.from(this.preloadStatuses.values())
      .filter(s => s.loaded).length;
    const total = this.preloadStatuses.size;

    console.log(`✅ 背景视频预加载完成: ${loaded}/${total} 个成功`);
  }

  /**
   * 获取预加载的视频实例（克隆版本）
   */
  getVideo(assetId: keyof typeof BACKGROUND_ASSETS): HTMLVideoElement | null {
    const cached = this.preloadedVideos.get(assetId);
    if (!cached) return null;

    // 返回克隆版本，避免多个组件共享同一个实例
    const clone = cached.cloneNode(true) as HTMLVideoElement;
    clone.muted = true;
    clone.playsInline = true;
    clone.loop = true;

    return clone;
  }

  /**
   * 检查视频是否已加载
   */
  isLoaded(assetId: keyof typeof BACKGROUND_ASSETS): boolean {
    return this.preloadedVideos.has(assetId);
  }

  /**
   * 获取加载状态
   */
  getStatus(assetId: keyof typeof BACKGROUND_ASSETS): PreloadStatus | null {
    return this.preloadStatuses.get(assetId) || null;
  }

  /**
   * 获取所有加载状态
   */
  getAllStatuses(): PreloadStatus[] {
    return Array.from(this.preloadStatuses.values());
  }
}

// 导出单例
export const videoPreloader = new VideoPreloadService();

/**
 * 在 App 入口调用此函数
 */
export async function initializeVideoPreload(): Promise<void> {
  if (isMeditationModeFromSearch()) {
    return Promise.resolve();
  }
  return videoPreloader.preloadAllVideos();
}
// 兼容性导出：确保无论 main.tsx 怎么叫，都能找到它
export const VideoPreloader = videoPreloader;