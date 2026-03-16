import { supabase } from '../lib/supabase';
const activeAudioInstances = new Set<HTMLAudioElement>();

export const stopAllAudio = async () => {
  activeAudioInstances.forEach(a => { a.pause(); a.src = ''; a.remove(); });
  activeAudioInstances.clear();
};

export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();
  
  // ✅ 链接已修正为：background.mp3
  const forcedSrc = 'https://sqjedjwkfjawikbsvllz.supabase.co/storage/v1/object/public/audio/background.mp3';
  
  const audio = new Audio();
  audio.crossOrigin = "anonymous"; 
  audio.src = `${forcedSrc}?v=${Date.now()}`; // 杀掉所有缓存记忆
  audio.loop = true;
  activeAudioInstances.add(audio);

  const attemptPlay = () => {
    audio.play().then(() => {
      audio.muted = false;
      audio.volume = volume;
      audio.currentTime = 0; // 核心：播放瞬间强制归零
      console.log("✅ SUCCESS: Playing from 0s");
    }).catch(e => {
      console.error("❌ Playback blocked, waiting for click...", e);
      // 如果被浏览器拦截，监听一次点击来解锁
      const unlock = () => {
        audio.play();
        audio.muted = false;
        audio.volume = volume;
        audio.currentTime = 0;
        document.removeEventListener('click', unlock);
      };
      document.addEventListener('click', unlock);
    });
  };

  attemptPlay();
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
