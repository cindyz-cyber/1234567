import { supabase } from '../lib/supabase';

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
 */
export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true; // ⚠️ 关键：先静音，防止跳秒时的爆音
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

// 补全兼容接口，防止其他页面报错
export const warmupAudioContext = async () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
  }
};
const initializeAudio = async () => {
  if (isInitializingRef.current) return;
  isInitializingRef.current = true;

  // 1. 确定 URL（这里保留你之前的随机化 URL 逻辑）
  const cacheBustedUrl = `${audioUrl}?t=${Date.now()}`;

  // 2. 🚀 关键：只这一行，把所有脏活累活全丢给 Manager
  // 因为 Manager 内部已经写好了：静音 -> 播放 -> 200ms 内强制归零锁定 -> 开声音
  audioInstanceRef.current = await createAndPlayAudioFromZero(cacheBustedUrl);
  
  if (audioInstanceRef.current) {
    setCurrentBackgroundMusic(audioInstanceRef.current);
  }

  isInitializingRef.current = false;
  
  // 3. 后面的定时器（fadeOutTimer）保持不动
};



export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov');
}