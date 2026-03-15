export async function createAndPlayAudioFromZero(src: string, volume: number = 0.3): Promise<HTMLAudioElement | null> {
  await stopAllAudio();
  
  const audio = new Audio();
  // 加一个更强的随机后缀，彻底绕过缓存
  audio.src = `${src}${src.includes('?') ? '&' : '?'}nocache=${Math.random().toString(36).substring(7)}`;
  audio.preload = 'metadata'; // 只加载元数据，强制浏览器重新解析头部
  audio.loop = true;

  try {
    // 💀 暴力重置法：在播放前后进行三次强制归零
    audio.currentTime = 0; 
    await audio.play();
    
    // 第一次：起跳瞬间重置
    audio.currentTime = 0; 
    audio.volume = 0; // 先没声

    setTimeout(() => {
      // 第二次：50ms 后，当流媒体已经开始吐数据时，再拽回来
      audio.currentTime = 0;
      audio.volume = volume;
    }, 50);

    setTimeout(() => {
      // 第三次：200ms 后，做最后的生死锁定
      audio.currentTime = 0;
      console.log("✅ [AudioManager] 物理三连重置完成");
    }, 200);

    currentGlobalAudio = audio;
  } catch (err) {
    console.error('播放失败:', err);
  }
  return audio;
}ß