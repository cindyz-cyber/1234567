import { supabase } from '../lib/supabase';

const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;

export const stopAllAudio = async () => {
  activeAudioInstances.forEach(audio => {
    audio.pause();
    audio.src = '';
    audio.load();
    audio.remove(); // 物理移除
  });
  activeAudioInstances.clear();
  currentGlobalAudio = null;
};

/**
 * ⚡ 战神级：物理拦截锁定
 * 确保音频在真正“获准”播放前，一秒钟都不能多跑
 */
export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  // 1. 先把所有可能在后台偷跑的噪音全杀了
  await stopAllAudio();

  const audio = new Audio();
  audio.preload = 'auto';
  audio.loop = true;
  
  // 🔥 关键：初始状态必须是暂停+静音
  audio.muted = true;
  audio.volume = 0;
  
  // 2. 赋予地址但不准动
  audio.src = src;
  audio.pause(); 
  audio.currentTime = 0;

  activeAudioInstances.add(audio);

  try {
    // 3. 💀 暴力锁定：即使它想播，我也每 10ms 把它的进度拽回 0
    let lockInterval = setInterval(() => {
      audio.currentTime = 0;
    }, 10);

    // 4. 等待 150ms 确保浏览器彻底认领了“从 0 开始”的指令
    await new Promise(resolve => setTimeout(resolve, 150));

    // 5. 正式启动
    await audio.play();
    
    // 6. 确认起跳成功后再解锁
    setTimeout(() => {
      clearInterval(lockInterval);
      audio.muted = false;
      audio.volume = volume;
      audio.currentTime = 0; // 最后一推
      console.log("✅ [AudioManager] 拦截结束，精准 0 秒起跳");
    }, 50);

    currentGlobalAudio = audio;
  } catch (err) {
    console.error('播放失败:', err);
  }
  return audio;
}

// 补全兼容接口... (保留 warmupAudioContext 和 isVideoUrl)