import { supabase } from '../lib/supabase';
const activeAudioInstances = new Set<HTMLAudioElement>();

export const stopAllAudio = async () => {
  activeAudioInstances.forEach(a => { a.pause(); a.src = ''; a.remove(); });
  activeAudioInstances.clear();
};

export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();
  
  // 💀 核心改动：不管传入什么，强制使用你刚传到 Supabase 的新链接
  // 请把下面这行的链接换成你刚从 Supabase 复制的那个
  const forcedSrc = 'https://sqjedjwkfjawikbsvllz.supabase.co/storage/v1/object/public/audio/final_zero_healing.mp3';';
  
  const uniqueSrc = `${forcedSrc}?v=${Date.now()}`;
  const audio = new Audio(uniqueSrc);
  audio.loop = true;
  audio.muted = true;
  activeAudioInstances.add(audio);

  try {
    await audio.play();
    // 物理锁定：每 10ms 归零，持续 1 秒
    let count = 0;
    const forceZero = setInterval(() => {
      audio.currentTime = 0;
      count++;
      if (count > 100) { 
        clearInterval(forceZero);
        audio.muted = false;
        audio.volume = volume;
      }
    }, 10);
  } catch (e) { console.error(e); }
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
