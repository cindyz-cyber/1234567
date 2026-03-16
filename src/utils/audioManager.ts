import { supabase } from '../lib/supabase';
const activeAudioInstances = new Set<HTMLAudioElement>();

export const stopAllAudio = async () => {
  activeAudioInstances.forEach(a => { a.pause(); a.src = ''; a.remove(); });
  activeAudioInstances.clear();
};

export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();
  
  const forcedSrc = 'https://sqjedjwkfjawikbsvllz.supabase.co/storage/v1/object/public/audio/final_zero_healing.mp3';
  
  // 加上时间戳，确保每次都是全新请求
  const uniqueSrc = `${forcedSrc}?v=${Date.now()}`;
  const audio = new Audio();
  
  // 🔑 核心修复 1: 必须允许跨域，否则移动端会报错停止加载
  audio.crossOrigin = "anonymous"; 
  audio.src = uniqueSrc;
  audio.loop = true;
  
  // 🔑 核心修复 2: 初始音量设为 0 但不使用 muted 属性，绕过某些浏览器的静音逻辑
  audio.volume = 0; 
  activeAudioInstances.add(audio);

  try {
    await audio.play();
    
    let count = 0;
    const forceZero = setInterval(() => {
      audio.currentTime = 0;
      count++;
      
      // 在锁定期间逐渐尝试打开声音
      if (count > 20) {
        audio.volume = volume;
      }

      if (count > 100) { 
        clearInterval(forceZero);
        audio.currentTime = 0; // 最后确认一次在 0 秒
        console.log("✅ Audio successfully locked at 0s and playing");
      }
    }, 10);
  } catch (e) { 
    console.error("Audio Playback Error:", e);
    // 自动重试逻辑
    setTimeout(() => { audio.play(); audio.volume = volume; }, 1000);
  }
  
  return audio;
}

export const playAudioFromZero = async (a: HTMLAudioElement) => { if(a) { a.currentTime = 0; await a.play(); } };
export const registerAudio = (a: HTMLAudioElement) => activeAudioInstances.add(a);
export const unregisterAudio = (a: HTMLAudioElement) => activeAudioInstances.delete(a);
export function isVideoUrl(u: string | null): boolean { return !!u && (u.endsWith('.mp4') || u.endsWith('.webm')); }
export async function warmupAudioContext() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === 'suspended') await ctx.resume();
}
