const activeAudioInstances = new Set<HTMLAudioElement>();
let currentGlobalAudio: HTMLAudioElement | null = null;

// ——— 必须导出：AdminPanel / HomePage 使用 ———
export async function warmupAudioContext(): Promise<void> {
  const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
  }
}

/**
 * 对已有 Audio 实例强制从 0 秒播放（AdminPanel / HealingStation 用）
 */
export function playAudioFromZero(audio: HTMLAudioElement): Promise<void> {
  if (!audio) return Promise.reject(new Error('playAudioFromZero: audio 为空'));
  audio.pause();
  audio.currentTime = 0;
  return new Promise<void>((resolve, reject) => {
    const done = () => {
      audio.currentTime = 0;
      audio.play().then(resolve).catch(reject);
    };
    setTimeout(done, 60);
  });
}

/**
 * 物理清理所有音频实例：清空 src、load、从 Set 移除
 */
export async function stopAllAudio(): Promise<void> {
  const list = Array.from(activeAudioInstances);
  activeAudioInstances.clear();
  currentGlobalAudio = null;
  list.forEach((audio) => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.load();
      if (audio.parentNode) audio.remove();
    } catch (_) {}
  });
}

export function registerAudio(audio: HTMLAudioElement): void {
  activeAudioInstances.add(audio);
}

export function unregisterAudio(audio: HTMLAudioElement): void {
  activeAudioInstances.delete(audio);
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov');
}

/**
 * 绝对物理锁：在 play() 前用 setInterval 每 5ms 将 currentTime 归零，持续 200ms，muted=true
 * 确保零秒起跳、无幽灵音频
 */
export async function createAndPlayAudioFromZero(
  src: string,
  volume: number = 0.3
): Promise<HTMLAudioElement | null> {
  await stopAllAudio();

  const url = `${src}${src.includes('?') ? '&' : '?'}v=${Date.now()}`;
  const audio = new Audio(url);
  audio.preload = 'auto';
  audio.loop = true;
  audio.muted = true;
  audio.volume = 0;

  registerAudio(audio);
  currentGlobalAudio = audio;

  return new Promise<HTMLAudioElement | null>((resolve) => {
    let lockTimer: ReturnType<typeof setInterval> | null = null;

    const unlock = () => {
      if (lockTimer !== null) {
        clearInterval(lockTimer);
        lockTimer = null;
      }
      try {
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = volume;
        audio.play().catch((err) => console.error('createAndPlayAudioFromZero play:', err));
      } catch (e) {
        console.error('createAndPlayAudioFromZero unlock:', e);
      }
      resolve(audio);
    };

    audio.currentTime = 0;
    lockTimer = setInterval(() => {
      try {
        audio.currentTime = 0;
      } catch (_) {}
    }, 5);
    setTimeout(unlock, 200);
  });
}
