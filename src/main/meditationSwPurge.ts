/**
 * 冥想入口：注销全部 Service Worker，并（首次）强制整页刷新，避免旧 SW / 磁盘缓存。
 */
const RELOAD_FLAG = 'meditation_sw_purge_reload_done_v1';

export async function purgeServiceWorkersForMeditationEntry(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.location.search.includes('meditation')) return false;

  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    console.log('[Meditation] Service Worker 已全部注销，数量:', regs.length);
  } catch (e) {
    console.warn('[Meditation] Service Worker 注销失败:', e);
  }

  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      console.log('[Meditation] Cache Storage 已清空，条目:', keys.length);
    } catch (e) {
      console.warn('[Meditation] caches.delete 失败:', e);
    }
  }

  if (!sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.setItem(RELOAD_FLAG, '1');
    window.location.reload();
    return true;
  }

  return false;
}
