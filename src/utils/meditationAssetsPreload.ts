/**
 * 冥想模式专用预加载：仅在 URL 含 meditation 时执行，且只注入冥想背景视频一条。
 */
import { MEDITATION_BG_MP4 } from '../constants/meditationMedia';

export async function initializeMeditationAssetsPreload(): Promise<void> {
  if (typeof window === 'undefined' || !window.location.search.includes('meditation')) {
    return;
  }

  const bust = Date.now();
  const href = `${MEDITATION_BG_MP4}${MEDITATION_BG_MP4.includes('?') ? '&' : '?'}v=${bust}`;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = href;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);

  console.log('预加载注入: meditation_bg.mp4');

  try {
    const v = document.createElement('video');
    v.preload = 'auto';
    v.muted = true;
    v.playsInline = true;
    v.src = href;
    v.load();
  } catch (e) {
    console.warn('冥想背景视频预热失败（非致命）:', e);
  }
}
