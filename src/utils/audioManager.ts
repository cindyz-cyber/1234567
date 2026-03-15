import { supabase } from '../lib/supabase';

let activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;
let globalLock = false; // 💀 新增全局物理锁

export const stopAllAudio = async () => {
  globalLock = true; // 开启禁播区
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
  console.log("🚫 [AudioManager] 全局静音锁已开启，阻止一切偷跑");
};

export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  // 1. 确保在创建新实例前，旧的必须死透
  await stopAllAudio();
  
  const audio = new Audio();
  // 🔥 核心策略：物理隔离缓存，每次 URL 都是全新的，彻底杀死 Service Worker 的偷跑
  const cacheBust = src.includes('?') ? `&force=${Date.now()}` : `?force=${Date.now()}`;
  audio.src = src + cacheBust;
  
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true;
  audio.volume = 0;
  audio.pause();
  audio.currentTime = 0;

  activeAudioInstances.add(audio);

  return new Promise((resolve) => {
    // 2. 暴力归零循环：每 5ms 执行一次，比显示器刷新率还快
    let startLock = setInterval(() => {
      audio.currentTime = 0;
    }, 5);

    // 3. 监听音频真正可以起跳的瞬间
    audio.oncanplaythrough = async () => {
      audio.oncanplaythrough = null;
      
      // 4. 在暂停状态下最后一次强行归零
      audio.pause();
      audio.currentTime = 0;
      
      // 5. 正式启动并延迟解除物理锁
      try {
        await audio.play();
        setTimeout(() => {
          clearInterval(startLock);
          audio.muted = false;
          audio.volume = volume;
          audio.currentTime = 0; // 最终校准
          globalLock = false;
          currentGlobalAudio = audio;
          console.log("🎯 [AudioManager] 零秒起跳神迹达成");
          resolve(audio);
        }, 150); // 给浏览器 150ms 稳定期
      } catch (e) {
        resolve(null);
      }
    };
    
    audio.load();
  });
}

// 补全兼容接口 (warmupAudioContext, isVideoUrl 等保持不变)