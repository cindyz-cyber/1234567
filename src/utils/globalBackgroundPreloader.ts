/**
 * 全局背景预加载控制中心
 * 在 App 启动时扫描所有路由页面的背景资源并静默预加载
 */

import { BACKGROUND_ASSETS } from './backgroundAssets';

interface PreloadLink {
  href: string;
  as: 'video' | 'image';
  type?: string;
  priority: 'high' | 'medium' | 'low';
}

class GlobalBackgroundPreloader {
  private injectedLinks = new Set<string>();
  private preloadQueue: PreloadLink[] = [];

  /**
   * 扫描所有背景资源并生成预加载队列
   */
  private scanAllBackgrounds(): PreloadLink[] {
    const links: PreloadLink[] = [];

    // 遍历所有背景资源
    Object.entries(BACKGROUND_ASSETS).forEach(([key, asset]) => {
      // 视频资源 - 高优先级
      links.push({
        href: asset.videoUrl,
        as: 'video',
        type: 'video/mp4',
        priority: key === 'golden_flow' ? 'high' : 'medium' // golden_flow 最高优先级
      });

      // Poster 图片 - 最高优先级（体积小，必须瞬间加载）
      links.push({
        href: asset.posterUrl,
        as: 'image',
        priority: 'high'
      });
    });

    return links;
  }

  /**
   * 动态注入 <link rel="preload"> 到 HTML Head
   */
  private injectPreloadLink(link: PreloadLink): void {
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

    console.log(`📥 预加载注入: ${link.as} - ${link.href.split('/').pop()} (优先级: ${link.priority})`);
  }

  /**
   * 按优先级分批注入预加载链接
   */
  async startGlobalPreload(): Promise<void> {
    console.log('🌐 全局背景预加载控制中心启动...');

    // 扫描所有背景资源
    this.preloadQueue = this.scanAllBackgrounds();

    // 第一批：高优先级资源（Poster 图片 + golden_flow 视频）
    const highPriority = this.preloadQueue.filter(l => l.priority === 'high');
    highPriority.forEach(link => this.injectPreloadLink(link));

    // 延迟 500ms 后加载中优先级资源（其他视频）
    setTimeout(() => {
      const mediumPriority = this.preloadQueue.filter(l => l.priority === 'medium');
      mediumPriority.forEach(link => this.injectPreloadLink(link));
    }, 500);

    console.log(`✅ 全局预加载已启动: ${this.preloadQueue.length} 个资源加入队列`);
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
