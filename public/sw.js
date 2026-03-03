/**
 * Service Worker - 视频资源离线缓存策略
 * 使用 stale-while-revalidate 模式：
 * - 第一次加载：从网络获取并缓存
 * - 后续访问：立即返回缓存，同时在后台更新
 */

const CACHE_NAME = 'maya-healing-videos-v1';
const VIDEO_URLS = [
  '/assets/videos/golden-flow.mp4',
  '/assets/videos/energy-field.mp4',
  '/assets/videos/resonance-wave.mp4',
  '/assets/videos/zen-vortex.mp4',
  '/assets/videos/golden-flow-poster.jpg',
  '/assets/videos/energy-field-poster.jpg',
  '/assets/videos/resonance-wave-poster.jpg',
  '/assets/videos/zen-vortex-poster.jpg'
];

// 安装时预缓存 Poster 图片（体积小，可以立即缓存）
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const posterUrls = VIDEO_URLS.filter(url => url.endsWith('.jpg'));
      return cache.addAll(posterUrls);
    })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch 事件：stale-while-revalidate 策略
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只处理视频和图片资源
  if (!VIDEO_URLS.some(videoUrl => url.pathname.endsWith(videoUrl.split('/').pop()))) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. 尝试从缓存读取
      const cachedResponse = await cache.match(event.request);

      // 2. 并行发起网络请求（后台更新）
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // 只缓存成功的响应
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // 网络失败时不做任何处理，继续使用缓存
        return null;
      });

      // 3. 返回策略：
      // - 如果有缓存，立即返回（同时后台更新）
      // - 如果无缓存，等待网络响应
      return cachedResponse || fetchPromise;
    })
  );
});

console.log('🎬 Service Worker 已激活 - 视频资源离线缓存已启用');
