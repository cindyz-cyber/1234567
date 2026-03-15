import { supabase } from '../lib/supabase';

const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;

/**
 * 补全 Netlify 报错缺失的函数
 */
export const warmupAudioContext = async () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
  }
};

export const registerAudio = (audio: HTMLAudioElement) => activeAudioInstances.add(audio);
export const unregisterAudio = (audio: HTMLAudioElement) => activeAudioInstances.delete(audio);

export const stopAllAudio = async () => {
  activeAudioInstances.forEach(audio => {
    try {
      audio.pause();
      audio.src = '';
      audio.load();
    } catch (e) {}
  });
  activeAudioInstances.clear();
  currentGlobalAudio = null;
};

/**
 * ⚡ 物理拦截锁定版：彻底解决“偷跑 3-4 秒”的问题
 */
export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  // 1. 物理超度所有可能在后台跑的幽灵声音
  await stopAllAudio();

  const audio = new Audio();
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true;
  audio.volume = 0;
  
  // 2. 核心：在静默状态下赋予地址，并反复按死在 0 秒
  audio.src = src;
  audio.pause(); 
  audio.currentTime = 0;

  activeAudioInstances.add(audio);

  try {
    // 3. 💀 物理拦截：每 10ms 拽回一次，持续 200ms
    let lockInterval = setInterval(() => {
      audio.currentTime = 0;
    }, 10);

    // 等待浏览器缓冲区稳定
    await new Promise(resolve => setTimeout(resolve, 200));

    // 4. 正式启动播放
    await audio.play();
    
    // 5. 确认起跳后放开音量
    setTimeout(() => {
      clearInterval(lockInterval);
      audio.muted = false;
      audio.volume = volume;
      audio.currentTime = 0; 
      console.log("🔥 [AudioManager] 拦截结束，精准 0 秒起跳");
    }, 50);

    currentGlobalAudio = audio;
  } catch (err) {
    console.error('播放失败:', err);
  }
  return audio;
}

// 兼容老代码的接口
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