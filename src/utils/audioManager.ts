import { supabase } from '../lib/supabase';

// --- 全局状态 ---
const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;
let globalMuteLock = false; // 物理锁，防止任何静默期间的偷跑

/**
 * 1. 补全 Netlify 报错缺失的导出
 */
export async function warmupAudioContext() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
    }
  } catch (e) {
    console.error('AudioContext warmup failed', e);
  }
}

/**
 * 2. 物理超度所有运行中的音频
 */
export const stopAllAudio = async () => {
  globalMuteLock = true;
  activeAudioInstances.forEach(audio => {
    try {
      audio.pause();
      audio.muted = true;
      audio.src = '';
      audio.load();
      audio.remove();
    } catch (e) {}
  });
  activeAudioInstances.clear();
  currentGlobalAudio = null;
  console.log("🚫 [AudioManager] 全局静音锁开启");
};

/**
 * 3. ⚡ 物理拦截锁定：彻底解决“偷跑 3-4 秒”
 */
export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  // 开启禁播区
  await stopAllAudio();

  const audio = new Audio();
  // 🔥 关键：通过随机 force 参数物理隔离缓存，杀死 Service Worker 偷跑
  const cacheBuster = src.includes('?') ? `&force=${Date.now()}` : `?force=${Date.now()}`;
  audio.src = src + cacheBuster;
  
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true;
  audio.volume = 0;
  audio.pause();
  audio.currentTime = 0;

  activeAudioInstances.add(audio);

  return new Promise((resolve) => {
    // 💀 暴力归零循环：每 5ms 执行一次
    let startLock = setInterval(() => {
      audio.currentTime = 0;
    }, 5);

    audio.oncanplaythrough = async () => {
      audio.oncanplaythrough = null;
      audio.pause();
      audio.currentTime = 0;
      
      try {
        await audio.play();
        // 给浏览器 200ms 彻底抹平所有缓存偏移量
        setTimeout(() => {
          clearInterval(startLock);
          audio.muted = false;
          audio.volume = volume;
          audio.currentTime = 0; 
          globalMuteLock = false;
          currentGlobalAudio = audio;
          console.log("🎯 [AudioManager] 零秒起跳神迹达成");
          resolve(audio);
        }, 200);
      } catch (e) {
        resolve(null);
      }
    };
    
    audio.load();
  });
}

/**
 * 4. 辅助导出（保持兼容性）
 */
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