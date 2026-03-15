import { supabase } from '../lib/supabase';

// --- 核心单例 ---
const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;

export const registerAudio = (audio: HTMLAudioElement) => activeAudioInstances.add(audio);
export const unregisterAudio = (audio: HTMLAudioElement) => activeAudioInstances.delete(audio);

export const stopAllAudio = async () => {
  if (currentGlobalAudio) {
    currentGlobalAudio.pause();
    currentGlobalAudio.src = '';
    currentGlobalAudio.load();
    currentGlobalAudio = null;
  }
  activeAudioInstances.forEach(audio => {
    try { audio.pause(); audio.src = ''; audio.load(); } catch (e) {}
  });
  activeAudioInstances.clear();
};

/**
 * ⚡ 战神级：物理归零并实时锁定
 * 解决了 iOS/Chrome 在 GoldenTransition 时的跳秒冷颤问题
 */
export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true; // ⚠️ 关键：先静音，防止重置时的杂音
  registerAudio(audio);

  audio.src = src;
  
  try {
    await audio.play();
    
    // 💀 核心锁定：在播放开始后的 200ms 内，每 20ms 强行拉回 0 秒
    let lockCount = 0;
    const locker = setInterval(() => {
      audio.currentTime = 0;
      lockCount++;
      if (lockCount > 10) {
        clearInterval(locker);
        audio.muted = false; // 锁定稳了再开声音
        audio.volume = volume;
        console.log("✅ [AudioManager] 归零锁定完成");
      }
    }, 20);

    currentGlobalAudio = audio;
  } catch (err) {
    console.error('播放失败:', err);
  }
  return audio;
}

/**
 * 补全兼容接口，防止其他页面（如 HomePage/Admin）报错
 */
export const warmupAudioContext = async () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
  }
};

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