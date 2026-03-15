import { supabase } from '../lib/supabase';

const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;

// 必须导出这个函数，否则 HomePage.tsx 会报错
export async function warmupAudioContext() {
  const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
  }
}

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

export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();
  const audio = new Audio(`${src}${src.includes('?') ? '&' : '?'}v=${Date.now()}`);
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true;
  audio.volume = 0;
  
  activeAudioInstances.add(audio);

  try {
    audio.currentTime = 0;
    await audio.play();
    
    // 暴力三连重置
    let count = 0;
    const timer = setInterval(() => {
      audio.currentTime = 0;
      count++;
      if (count > 10) {
        clearInterval(timer);
        audio.muted = false;
        audio.volume = volume;
      }
    }, 20);

    currentGlobalAudio = audio;
  } catch (err) { console.error(err); }
  return audio;
}

export const registerAudio = (audio: HTMLAudioElement) => activeAudioInstances.add(audio);
export const unregisterAudio = (audio: HTMLAudioElement) => activeAudioInstances.delete(audio);
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov');
}