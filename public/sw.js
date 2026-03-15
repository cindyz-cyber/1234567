/**
 * Service Worker - Cache First (缓存优先) 策略
 *
 * 策略说明：
 * - 第一次加载：从网络下载并永久缓存
 * - 后续访问：直接从本地缓存读取（0 延迟秒开）
 * - 离线访问：完全支持，不依赖网络
 *
 * 更新机制：
 * - 修改 CACHE_NAME 版本号（如 v1 → v2）会清理旧缓存
 * - 强制刷新（Ctrl+Shift+R）会跳过 Service Worker
 */

const CACHE_NAME = 'maya-healing-backgrounds-v1';

// 所有需要缓存的背景资源
const BACKGROUND_RESOURCES = [
  // 视频文件
  '/assets/videos/golden-flow.mp4',
  '/assets/videos/energy-field.mp4',
  '/assets/videos/resonance-wave.mp4',
  '/assets/videos/zen-vortex.mp4',

  // Poster 封面图
  '/assets/videos/golden-flow-poster.jpg',
  '/assets/videos/energy-field-poster.jpg',
  '/assets/videos/resonance-wave-poster.jpg',
  '/assets/videos/zen-vortex-poster.jpg'
];

// 安装事件：预缓存所有 Poster 图片（体积小，立即缓存）
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker 安装中...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 先缓存所有 Poster（优先级最高）
      const posters = BACKGROUND_RESOURCES.filter(url => url.endsWith('.jpg'));
      return cache.addAll(posters).then(() => {
        console.log('✅ Poster 图片已预缓存:', posters.length, '个');
      });
    })
  );

  // 立即激活，不等待旧版本
  self.skipWaiting();
});

// 激活事件：清除所有缓存并彻底注销 Service Worker（避免大型音频断点续传缓存导致播放偏移）
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker 激活中 - 即将注销并清除缓存...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          console.log('🗑️  删除缓存:', name);
          return caches.delete(name);
        })
      );
    }).then(() => {
      console.log('✅ 所有缓存已清除，正在注销 Service Worker');
      return self.registration.unregister();
    }).then(() => {
      console.log('✅ Service Worker 已注销');
    })
  );
});

// Fetch 事件：Cache First (缓存优先) 策略
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 检查是否为背景资源
  const isBackgroundResource = BACKGROUND_RESOURCES.some(resource =>
    url.pathname.includes(resource.split('/').pop())
  );

  if (!isBackgroundResource) {
    // 非背景资源，使用默认网络请求
    return;
  }

  // Cache First 策略：缓存优先，网络兜底
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. 先尝试从缓存读取
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        // ✅ 缓存命中 - 直接返回（0 延迟）
        console.log('⚡ 缓存命中:', url.pathname.split('/').pop());
        return cachedResponse;
      }

      // 2. 缓存未命中 - 从网络获取
      console.log('📥 网络获取:', url.pathname.split('/').pop());

      try {
        const networkResponse = await fetch(event.request);

        // 只缓存成功的响应
        if (networkResponse && networkResponse.status === 200) {
          // 永久保存到缓存
          cache.put(event.request, networkResponse.clone());
          console.log('💾 已缓存:', url.pathname.split('/').pop());
        }

        return networkResponse;
      } catch (error) {
        // 3. 网络失败 - 返回离线提示
        console.error('❌ 网络失败:', url.pathname.split('/').pop(), error);

        // 可选：返回一个降级的占位图
        return new Response('Network error occurred', {
          status: 408,
          statusText: 'Request Timeout'
        });
      }
    })
  );
});

// 后台消息监听（可选，用于手动清理缓存）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('🗑️  缓存已手动清除');
      })
    );
  }

  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        const keys = await cache.keys();
        event.ports[0].postMessage({
          cacheSize: keys.length,
          resources: keys.map(req => req.url)
        });
      })
    );
  }
});

console.log('🎬 Service Worker 已就绪 - Cache First 策略已启用');
