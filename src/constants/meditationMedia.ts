/**
 * 冥想素材：由 Vite 解析为构建后可用的绝对 URL，供原生 src / 预加载直接使用（不经 Hook）。
 */
export const MEDITATION_BG_MP4 = new URL('../assets/meditation_bg.mp4', import.meta.url).href;

export const MEDITATION_GUIDE_MP3 = new URL(
  '../assets/音频冥想引导2.0.mp3',
  import.meta.url
).href;
