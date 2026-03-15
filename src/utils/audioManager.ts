import { supabase } from '../lib/supabase';

// --- 核心单例 ---
const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;

// --- 兼容性函数接口（确保 AdminPanel 和 HomePage 不报错） ---

export const registerAudio = (audio: HTMLAudioElement) => {
  activeAudioInstances.add(audio);
};

export const unregisterAudio = (audio: HTMLAudioElement) => {
  activeAudioInstances.delete(audio);
};

export const warmupAudioContext = async () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
  }
};

export const playAudioFromZero = async (audio: HTMLAudioElement) => {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  await audio.play();
};

export const stopAllAudio = async () => {
  if (currentGlobalAudio) {
    currentGlobalAudio.pause();
    currentGlobalAudio.src = '';
    currentGlobalAudio.load();
    currentGlobalAudio = null;
  }
  activeAudioInstances.forEach(audio => {
    try {
      audio.pause();
      audio.src = '';
      audio.load();
    } catch (e) {}
  });
  activeAudioInstances.clear();
};

// --- 核心业务逻辑：战神级死亡重置 ---

export const createAndPlayAudioFromZero = async (src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> => {
  await stopAllAudio();
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true;
  registerAudio(audio);
  
  audio.src = src;
  audio.pause();
  
  // 💀 10次强制归零逻辑
  for (let i = 0; i < 10; i++) {
    audio.currentTime = 0;
    await new Promise(res => setTimeout(res, 30)); 
  }

  try {
    await audio.play();
    audio.muted = false;
    audio.volume = volume;
    audio.currentTime = 0; 
    currentGlobalAudio = audio;
  } catch (err) {
    console.error('播放失败:', err);
  }
  return audio;
};

// 判断 URL 类型
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
}