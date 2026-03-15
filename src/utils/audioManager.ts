import { supabase } from '../lib/supabase';

const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;

/**
 * 1. 显式导出以修复 Netlify 报错
 */
export async function warmupAudioContext() {
  try {
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
    }
  } catch (e) {
    console.error('AudioContext warmup failed', e);
  }
}

/**
 * 2. 物理超度旧音频
 */
export const stopAllAudio = async () => {
  activeAudioInstances.forEach(audio => {
    try {
      audio.pause();
      audio.src = '';
      audio.load();
      audio.remove();
    } catch (e) {}
  });
  activeAudioInstances.clear();
  currentGlobalAudio = null;
};

/**
 * 3. ⚡ 战神三连重置版：解决 28 秒错位问题
 */
export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();

  const audio = new Audio();
  // 加上绝对唯一的指纹，绕过一切缓存
  const uniqueSrc = `${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}_${Math.random().toString(36).slice(2)}`;
  audio.src = uniqueSrc;
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true;
  audio.volume = 0;

  activeAudioInstances.add(audio);

  try {
    // 第一次尝试归零
    audio.currentTime = 0;
    await audio.play();

    // 💀 暴力三连：不管浏览器在哪，每隔一会就强行拉回 0
    // 第一次：立即
    audio.currentTime = 0;

    setTimeout(() => {
      // 第二次：50ms 后，流媒体数据刚开始涌入时
      audio.currentTime = 0;
      audio.muted = false;
      audio.volume = volume;
    }, 50);

    setTimeout(() => {
      // 第三次：200ms 后，做最后的生死校准
      audio.currentTime = 0;
      console.log("🎯 [AudioManager] 物理归零三连击完成");
    }, 200);

    currentGlobalAudio = audio;
  } catch (err) {
    console.error('播放失败:', err);
  }
  return audio;
}

// 兼容老代码接口
export const registerAudio = (audio: HTMLAudioElement) => activeAudioInstances.add(audio);
export const unregisterAudio = (audio: HTMLAudioElement) => activeAudioInstances.delete(audio);
export const playAudioFromZero = async (audio: HTMLAudioElement) => {
  if (!audio) return;
  audio.currentTime = 0;
  await audio.play();
};
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov');
}