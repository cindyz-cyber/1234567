/**
 * 全局背景预加载控制中心（移动端优化版）
 *
 * 移动端策略：
 * - 只预加载 Poster 图片（必需）
 * - 完全跳过视频预加载（节省流量）
 *
 * 桌面端策略：
 * - 预加载 Poster（高优先级）
 * - 预加载视频（中优先级）
 */

import { BACKGROUND_ASSETS } from './backgroundAssets';

interface PreloadLink {
  href: string;
  as: 'video' | 'image';
  type?: string;
  priority: 'high' | 'medium' | 'low';
}

// 设备检测
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);

// 网络检测
const isSlowConnection = (() => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) return false;
  const conn = (navigator as any).connection;
  return conn?.saveData || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g' || conn?.effectiveType === '3g';
})();

class GlobalBackgroundPreloader {
  private injectedLinks = new Set<string>();
  private preloadQueue: PreloadLink[] = [];
  private activePreloadElements: HTMLLinkElement[] = []; // 🔥 跟踪所有预加载元素

  /**
   * 扫描所有背景资源并生成预加载队列（智能筛选）
   */
  private scanAllBackgrounds(): PreloadLink[] {
    const links: PreloadLink[] = [];

    // 遍历所有背景资源
    Object.entries(BACKGROUND_ASSETS).forEach(([key, asset]) => {
      if (!asset) {
        console.warn(`⚠️  背景资源 ${key} 未定义，跳过预加载`);
        return;
      }

      // Poster 图片 - 所有设备都需要（最高优先级）
      if (asset.posterUrl) {
        links.push({
          href: asset.posterUrl,
          as: 'image',
          priority: 'high'
        });
      }

      // 视频资源 - 仅桌面端 + 快速网络
      if (!isMobileDevice && !isSlowConnection && asset.videoUrl) {
        links.push({
          href: asset.videoUrl,
          as: 'video',
          type: 'video/mp4',
          priority: key === 'golden_flow' ? 'high' : 'medium'
        });
      }
    });

    return links;
  }

  /**
   * 🔥 物理阻断音频预加载（确保音频冷启动）
   */
  private isAudioFile(url: string): boolean {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
    return audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
  }

  /**
   * 动态注入 <link rel="preload"> 到 HTML Head
   */
  private injectPreloadLink(link: PreloadLink): void {
    // 🔥 物理阻断：禁止音频文件预加载
    if (this.isAudioFile(link.href)) {
      console.warn(`🚫 阻断音频预加载: ${link.href.split('/').pop()} (确保冷启动)`);
      return;
    }

    // 避免重复注入
    if (this.injectedLinks.has(link.href)) {
      return;
    }

    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.href = link.href;
    linkElement.as = link.as;

    if (link.type) {
      linkElement.type = link.type;
    }

    // 设置 crossorigin（视频/图片跨域加载必需）
    linkElement.crossOrigin = 'anonymous';

    // 添加到 Head
    document.head.appendChild(linkElement);
    this.injectedLinks.add(link.href);
    this.activePreloadElements.push(linkElement); // 🔥 记录元素引用

    console.log(`📥 预加载注入: ${link.as} - ${link.href.split('/').pop()} (优先级: ${link.priority})`);
  }

  /**
   * 🔥 强制取消所有背景预加载（音频播放时调用）
   */
  cancelAllBackgroundPreloads(): void {
    console.group('🛑 [GlobalBackgroundPreloader] 强制取消所有预加载');
    console.log('📊 当前活跃预加载元素数:', this.activePreloadElements.length);

    let canceledCount = 0;
    this.activePreloadElements.forEach((linkElement) => {
      try {
        // 从 DOM 中移除 <link> 元素，浏览器会停止加载
        if (linkElement.parentNode) {
          linkElement.parentNode.removeChild(linkElement);
          canceledCount++;
          console.log(`   ✅ 已移除: ${linkElement.href.split('/').pop()}`);
        }
      } catch (err) {
        console.warn('   ⚠️ 移除失败:', err);
      }
    });

    // 清空跟踪数组
    this.activePreloadElements = [];
    this.injectedLinks.clear();

    console.log(`✅ 已取消 ${canceledCount} 个预加载任务`);
    console.log('📊 释放带宽和 CPU 资源，全力支撑音频解码');
    console.groupEnd();
  }

  /**
   * 按优先级分批注入预加载链接（智能调度）
   */
  async startGlobalPreload(): Promise<void> {
    const deviceType = isMobileDevice ? '移动端' : '桌面端';
    const networkType = isSlowConnection ? '慢速网络' : '正常网络';
    console.log(`🌐 全局预加载启动 [${deviceType}, ${networkType}]`);

    // 扫描所有背景资源
    this.preloadQueue = this.scanAllBackgrounds();

    if (this.preloadQueue.length === 0) {
      console.log('⚠️  无需预加载（可能为移动端 + 慢速网络）');
      return;
    }

    // 第一批：Poster 图片（立即注入，最高优先级）
    const posters = this.preloadQueue.filter(l => l.as === 'image');
    posters.forEach(link => this.injectPreloadLink(link));

    // 第二批：视频（仅桌面端，延迟加载）
    if (!isMobileDevice && !isSlowConnection) {
      setTimeout(() => {
        const videos = this.preloadQueue.filter(l => l.as === 'video');
        videos.forEach(link => this.injectPreloadLink(link));
      }, 800); // 延迟 800ms，确保 Poster 优先
    }

    console.log(`✅ 预加载队列: ${posters.length} 张图片${!isMobileDevice ? ` + ${this.preloadQueue.length - posters.length} 个视频` : ''}`);
  }

  /**
   * 检查资源是否已预加载
   */
  isPreloaded(url: string): boolean {
    return this.injectedLinks.has(url);
  }

  /**
   * 获取预加载统计信息
   */
  getStats() {
    return {
      totalResources: this.preloadQueue.length,
      preloadedCount: this.injectedLinks.size,
      pending: this.preloadQueue.length - this.injectedLinks.size
    };
  }
}

// 导出单例
export const globalBackgroundPreloader = new GlobalBackgroundPreloader();

/**
 * 在 App 入口调用此函数
 */
export async function initializeGlobalBackgroundPreload(): Promise<void> {
  return globalBackgroundPreloader.startGlobalPreload();
}

/**
 * 🔥 在 GoldenTransition 挂载时调用，强制取消所有预加载
 */
export function cancelAllBackgroundPreloads(): void {
  return globalBackgroundPreloader.cancelAllBackgroundPreloads();
}
