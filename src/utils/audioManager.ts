const activeAudioInstances = new Set<HTMLAudioElement>();

/**
 * 获取当前仍在管理中的背景音乐实例（用于跨路由延续播放，不可序列化进 location.state）。
 */
export function getActiveBackgroundAudio(): HTMLAudioElement | null {
  for (const a of activeAudioInstances) {
    if (!a.paused) return a;
  }
  const first = activeAudioInstances.values().next();
  return first.done ? null : first.value;
}

export const stopAllAudio = async () => {
  activeAudioInstances.forEach(a => { a.pause(); a.src = ''; a.remove(); });
  activeAudioInstances.clear();
};

/**
 * 使用调用方传入的真实资源地址播放（如冥想引导本地 mp3），不覆盖为默认 CDN。
 */
export async function createAndPlayAudioFromExplicitSrc(
  explicitSrc: string,
  volume: number = 0.35
): Promise<HTMLAudioElement | null> {
  await stopAllAudio();

  const audio = new Audio();
  try {
    audio.crossOrigin = 'anonymous';
  } catch {
    /* 本地打包资源可省略 */
  }
  const sep = explicitSrc.includes('?') ? '&' : '?';
  audio.src = `${explicitSrc}${sep}v=${Date.now()}`;
  audio.loop = true;
  activeAudioInstances.add(audio);

  const attemptPlay = () => {
    audio
      .play()
      .then(() => {
        audio.muted = false;
        audio.volume = volume;
        audio.currentTime = 0;
        console.log('✅ [ExplicitSrc] Playing from 0s');
      })
      .catch((e) => {
        console.error('❌ [ExplicitSrc] Playback blocked, waiting for click...', e);
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

export async function createAndPlayAudioFromZero(_src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
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
