import { supabase } from '../lib/supabase';

export interface AudioFile {
  id: string;
  url: string;
  name: string;
  duration: number;
  tags: string[];
  cover?: string;
  description?: string;
}

/**
 * 暴力清理页面上所有 <audio> 标签，并终止播放，释放资源
 */
export function stopAllAudio() {
  const audios = Array.from(document.querySelectorAll('audio'));
  audios.forEach(audio => {
    try {
      audio.pause();
      audio.currentTime = 0;
      // 彻底销毁
      audio.src = '';
      audio.load();
    } catch (err) {
      // 忽略单个异常
    }
  });
}

/**
 * 死亡重置音频 —— 500ms 内每 50ms 强制归零 audio.currentTime, 十连发
 */
async function brutalDeathReset(audio: HTMLAudioElement) {
  if (!audio) return;
  for (let i = 0; i < 10; i++) {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.load();
    } catch (e) {}
    // 50ms 间隔
    await new Promise(res => setTimeout(res, 50));
  }
}

/**
 * 创建一个音频实例并从头播放（带“死亡重置”保障），返回 AudioElement
 */
export async function createAndPlayAudioFromZero(src: string, volume: number = 1): Promise<HTMLAudioElement> {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = volume;
  audio.loop = false;
  await brutalDeathReset(audio);

  await audio.play();
  return audio;
}

/**
 * 统一入口：分享页的背景音乐播放，确保“死亡重置”被调用
 */
export async function playShareBackgroundMusic(url: string, volume: number = 1, loop: boolean = true): Promise<HTMLAudioElement> {
  const audio = new Audio(url);
  audio.preload = 'auto';
  audio.volume = volume;
  audio.loop = loop;
  await brutalDeathReset(audio);

  await audio.play();
  return audio;
}

/**
 * 从页面中注销某个音频实例（彻底销毁）
 */
export function unregisterAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;
  try {
    audio.pause();
    audio.src = '';
    audio.load();
  } catch (e) {}
}

/**
 * 判断 URL 是否为 mp4 (用于区分音频/视频背景)
 */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
}/**
 * ⚡ 预热音频上下文（补全 Netlify 缺失的函数）
 */
export const warmupAudioContext = async () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
  }
  console.log('✅ 音频上下文已预热');
};/**
* ⚡ 兼容性补丁：为 AdminPanel 和 HomePage 补全缺失函数
*/

// 1. 修复 Netlify 报错：playAudioFromZero
export const playAudioFromZero = async (audio: HTMLAudioElement) => {
 if (!audio) return;
 audio.pause();
 audio.currentTime = 0;
 await audio.play();
 console.log('✅ playAudioFromZero 执行完毕');
};

// 2. 确保 registerAudio 存在（防止其他组件报错）
export const registerAudio = (audio: HTMLAudioElement) => {
 // 即使现在不统计实例，也要保留函数接口
 console.log('📝 Audio registered');
};

// 3. 确保 warmupAudioContext 存在
export const warmupAudioContext = async () => {
 const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
 if (AudioContext) {
   const ctx = new AudioContext();
   if (ctx.state === 'suspended') await ctx.resume();
 }
};