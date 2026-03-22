/**
 * 冥想模式专用预加载：仅 hint meditation_bg.mp4 + 引导 mp3，不触碰 golden_flow / zen_vortex 等默认表。
 */
import meditationBgUrl from '../assets/meditation_bg.mp4';
import meditationGuideAudioUrl from '../assets/音频冥想引导2.0.mp3';

function injectPreload(href: string, as: 'video' | 'fetch') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

export async function initializeMeditationAssetsPreload(): Promise<void> {
  console.log(
    '🧘 [Meditation] 仅预加载冥想素材（已跳过 golden_flow / zen_vortex 等默认背景预加载）'
  );

  injectPreload(meditationBgUrl, 'video');
  injectPreload(meditationGuideAudioUrl, 'fetch');

  // 轻量预热视频解码管道（静音、不插入 DOM）
  try {
    const v = document.createElement('video');
    v.preload = 'auto';
    v.muted = true;
    v.playsInline = true;
    v.src = meditationBgUrl;
    v.load();
  } catch (e) {
    console.warn('冥想背景视频预热失败（非致命）:', e);
  }
}
