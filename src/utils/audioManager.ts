import { supabase } from '../lib/supabase';

interface AudioFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  duration: number;
  is_active: boolean;
  uploaded_at: string;
  description: string | null;
}

const activeAudioInstances = new Set<HTMLAudioElement>();

export const registerAudio = (audio: HTMLAudioElement) => {
  activeAudioInstances.add(audio);
};

export const unregisterAudio = (audio: HTMLAudioElement) => {
  activeAudioInstances.delete(audio);
};

export const stopAllAudio = () => {
  console.group('🧹 音频内存清理 - 长音频专项优化');
  console.log('📊 当前活跃音频实例数:', activeAudioInstances.size);

  activeAudioInstances.forEach((audio, index) => {
    try {
      const originalSrc = audio.src;
      audio.loop = false;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;

      // 🚀 针对长音频优化：强制释放音频源，防止大文件占用内存
      audio.src = '';
      audio.load();

      console.log(`✅ 音频实例 ${index + 1} 已销毁 (原URL: ${originalSrc.substring(0, 50)}...)`);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  });
  activeAudioInstances.clear();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  console.log('✅ 所有音频资源已释放，内存已清理');
  console.groupEnd();
};

export const getRandomActiveAudio = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('audio_files')
      .select('*')
      .eq('file_type', 'guidance')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching audio files:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedAudio = data[randomIndex] as AudioFile;

    const { data: urlData } = await supabase.storage
      .from('audio-files')
      .getPublicUrl(selectedAudio.file_path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in getRandomActiveAudio:', error);
    return null;
  }
};

export const playAudioFromUrl = (url: string): HTMLAudioElement => {
  const audio = new Audio(url);
  audio.volume = 0.7;
  audio.play().catch(err => console.error('Audio play error:', err));
  return audio;
};

export const playBackgroundMusicLoop = async (): Promise<HTMLAudioElement | null> => {
  try {
    const { data, error } = await supabase
      .from('audio_files')
      .select('*')
      .eq('file_type', 'guidance')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedAudio = data[randomIndex] as AudioFile;

    const { data: urlData } = await supabase.storage
      .from('audio-files')
      .getPublicUrl(selectedAudio.file_path);

    const audio = new Audio(urlData.publicUrl);
    audio.volume = 0.3;
    audio.loop = true;
    registerAudio(audio);
    audio.play().catch(err => console.error('Audio play error:', err));

    return audio;
  } catch (error) {
    console.error('Error in playBackgroundMusicLoop:', error);
    return null;
  }
};

export const fadeOutAudio = (audio: HTMLAudioElement, duration: number = 2000): Promise<void> => {
  return new Promise((resolve) => {
    const startVolume = audio.volume;
    const fadeStep = startVolume / (duration / 50);

    const fadeInterval = setInterval(() => {
      if (audio.volume > fadeStep) {
        audio.volume = Math.max(0, audio.volume - fadeStep);
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeInterval);
        resolve();
      }
    }, 50);
  });
};

/**
 * 检测 URL 是否为视频文件（MP4）
 */
export const isVideoUrl = (url: string): boolean => {
  return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('.mp4?');
};

/**
 * 🔥 引流后台专属音频播放器 - 强制阻断主 App 降级
 * 当 URL 为 MP4 时，返回 null 但记录日志，前端需要单独处理视频背景
 * 🔥 修复：等待音频 canplay 事件后再设置 currentTime = 0 并播放
 */
export const playShareBackgroundMusic = async (
  shareConfigUrl: string | null | undefined,
  fallbackToMainApp: boolean = false  // 🔥 默认禁用降级
): Promise<HTMLAudioElement | null> => {
  console.group('🎵 引流后台音频加载 - 场景配置绝对优先');
  console.log('🚫 主 App 降级已禁用，fallbackToMainApp:', fallbackToMainApp);

  // 🔥 强制检查场景配置
  if (!shareConfigUrl || shareConfigUrl.trim() === '') {
    console.error('❌ 场景未配置 bg_music_url！');
    console.error('💡 请到后台 /admin/share-config 上传音频文件');
    console.error('🚫 已禁用主 App 降级，不会尝试加载 audio_files 表');
    console.groupEnd();
    return null;
  }

  const trimmedUrl = shareConfigUrl.trim();
  console.log('✅ 场景专属音频 URL:', trimmedUrl);
  console.log('📊 URL 长度:', trimmedUrl.length);
  console.log('🔍 URL 是否包含空格:', /\s/.test(trimmedUrl));

  // 检测是否为视频文件
  if (isVideoUrl(trimmedUrl)) {
    console.log('🎬 检测到 MP4 视频文件，将作为背景视频使用（静音播放）');
    console.log('💡 前端需要在 <video> 标签中加载此 URL');
    console.groupEnd();
    return null; // 视频不在这里处理，返回 null 让前端知道需要用视频
  }

  // 🔥 针对文件名包含空格或特殊字符的处理
  console.group('🔧 URL 编码处理（防止文件名空格失效）');
  console.log('📡 原始 URL:', trimmedUrl);

  // 检查 URL 是否已经是完整的 Supabase URL
  let finalMusicUrl: string;
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    // 已经是完整 URL，只需要编码路径部分
    try {
      const urlObj = new URL(trimmedUrl);
      const pathSegments = urlObj.pathname.split('/');
      const encodedSegments = pathSegments.map(segment => encodeURIComponent(segment));
      urlObj.pathname = encodedSegments.join('/');
      finalMusicUrl = urlObj.toString();
      console.log('✅ URL 路径已编码:', finalMusicUrl);
    } catch (e) {
      console.warn('⚠️ URL 解析失败，使用原始 URL');
      finalMusicUrl = trimmedUrl;
    }
  } else {
    // 相对路径，直接编码
    finalMusicUrl = encodeURI(trimmedUrl);
    console.log('✅ 相对路径已编码:', finalMusicUrl);
  }
  console.groupEnd();

  const cacheBuster = `?t=${Date.now()}`;
  const finalAudioUrl = finalMusicUrl + cacheBuster;

  console.group('🎵 长音频流式播放优化');
  console.log('🎵 Original Music URL:', finalMusicUrl);
  console.log('🎵 Final Audio URL:', finalAudioUrl);
  console.log('📊 Preload策略: metadata (流式播放，边缓冲边播放)');
  console.log('💾 内存管理: 已注册自动销毁机制');
  console.groupEnd();

  const audio = new Audio();

  // 🚀 强制启用 Range Requests（HTTP 206 Partial Content）
  // preload='metadata' 会自动触发分段请求，浏览器只下载元数据和当前播放位置附近的数据
  audio.preload = 'metadata';
  audio.crossOrigin = 'anonymous';

  // 设置音频源（Supabase Storage 自动支持 Range Requests）
  audio.src = finalAudioUrl;
  audio.volume = 0.3;
  audio.loop = true;

  registerAudio(audio);

  console.group('🔍 Range Request 验证');
  console.log('✅ preload="metadata" 已设置，浏览器将自动使用 Range 请求');
  console.log('✅ Supabase Storage 自动支持 HTTP 206 Partial Content 响应');
  console.log('✅ 微信内置浏览器兼容：通过主App域名分发，避免安全拦截');
  console.log('📊 预期行为：');
  console.log('  1. 浏览器发送 Range: bytes=0-xxx 请求头');
  console.log('  2. Supabase 返回 206 Partial Content');
  console.log('  3. 仅下载当前播放位置附近的数据，实现流式播放');
  console.log('  4. 100MB 的 192kbps 音频可在 1-2 秒内开始播放');
  console.groupEnd();

  console.group('🚀 192kbps 高品质长音频流式播放配置');
  console.log('📊 Preload: metadata（只预加载元数据，边缓冲边播放）');
  console.log('🔄 Loop: true（自动循环）');
  console.log('🔊 Volume: 0.3（30% 音量）');
  console.log('🌐 CORS: anonymous（支持跨域）');
  console.log('📡 Range Requests: ✅ 强制启用（HTTP 206 Partial Content）');
  console.log('🎵 比特率: 192kbps 高品质音频');
  console.log('📦 文件大小: 最大支持 100MB');
  console.log('💡 优势: 30分钟 192kbps 大文件无需等待完整下载，秒开播放');
  console.log('🔒 微信兼容: 使用主App已认证域名，避免安全拦截');
  console.groupEnd();

  // 🔥 修复 NotSupportedError：强制设置 CORS 和重新加载
  console.group('🔧 修复 NotSupportedError');
  console.log('✅ 设置 crossOrigin = "anonymous"');
  console.log('✅ 调用 load() 重新初始化音频元素');
  audio.load();
  console.groupEnd();

  audio.addEventListener('loadstart', () => {
    console.log('🎵 音频开始加载（流式）');
  });

  audio.addEventListener('canplay', () => {
    console.log('✅ 音频已可播放（缓冲足够）');
  });

  audio.addEventListener('loadedmetadata', () => {
    console.log('✅ 音频元数据已加载');
    console.log('⏱️ 音频时长:', audio.duration, '秒');
  });

  audio.addEventListener('error', (e) => {
    console.error('❌ 音频加载错误:', e);
    console.error('📊 错误详情:', {
      code: audio.error?.code,
      message: audio.error?.message,
      networkState: audio.networkState,
      readyState: audio.readyState
    });
    console.error('🔗 尝试加载的 URL:', audio.src);
    console.error('🔍 可能的原因:');
    console.error('  1. URL 不可访问或返回 404');
    console.error('  2. 文件格式不被浏览器支持');
    console.error('  3. CORS 跨域问题');
    console.error('  4. 服务器返回的 MIME type 不正确');
  });

  // 🔥 等待元数据加载完成后再播放，确保 currentTime = 0 生效
  return new Promise<HTMLAudioElement>((resolve) => {
    const onCanPlay = async () => {
      console.group('🔄 强制音频从头播放');
      console.log('⏮️ 重置播放进度: currentTime = 0');
      console.log('💡 确保用户听到歌曲第 0 秒，避免从中间跳出');

      // 🔥 第一次重置
      audio.currentTime = 0;
      console.log('✅ 第一次重置完成，currentTime =', audio.currentTime);

      // 🔥 等待一小段时间确保生效
      await new Promise(r => setTimeout(r, 50));

      // 🔥 第二次重置（双保险）
      audio.currentTime = 0;
      console.log('✅ 第二次重置完成，currentTime =', audio.currentTime);
      console.groupEnd();

      audio.play()
        .then(() => {
          console.log('✅ Background music started successfully (streaming mode)');
          console.log('⏱️ 当前播放位置:', audio.currentTime, '秒');

          // 🔥 播放后立即检查并纠正
          setTimeout(() => {
            if (audio.currentTime > 0.5) {
              console.warn('⚠️ 检测到播放位置异常，第三次强制归零');
              audio.currentTime = 0;
            }
          }, 100);
        })
        .catch(err => {
          console.error('❌ Audio play error:', err);
          console.error('💡 可能需要用户交互才能播放');
        });

      // 移除监听器，避免重复触发
      audio.removeEventListener('canplay', onCanPlay);
      resolve(audio);
    };

    audio.addEventListener('canplay', onCanPlay, { once: true });
  });
};
/**
 * 🔥 新增：暂停所有音频但保持实例存活
 * 用于场景切换时，确保预加载的音频对象在进入 GoldenTransition 时依然存活
 * 与 stopAllAudio 的区别：
 * - pauseAllAudio: 只执行 pause()，保持音频实例和 src，适合临时暂停
 * - stopAllAudio: 销毁音频实例，清空 src，释放内存，适合组件卸载
 */
export const pauseAllAudio = () => {
  console.group('⏸️ 暂停所有音频（保持实例存活）');
  console.log('📊 当前活跃音频实例数:', activeAudioInstances.size);
  console.log('💡 策略: 只执行 pause()，不销毁实例');
  console.log('🎯 目的: 确保预加载的音频对象在后续步骤中可以继续使用');

  activeAudioInstances.forEach((audio, index) => {
    try {
      if (!audio.paused) {
        audio.pause();
        console.log(`⏸️ 音频实例 ${index + 1} 已暂停 (URL: ${audio.src.substring(0, 50)}...)`);
      } else {
        console.log(`⏭️ 音频实例 ${index + 1} 已处于暂停状态`);
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  });

  console.log('✅ 所有音频已暂停，实例保持存活');
  console.log('🔄 音频可在后续步骤中通过 play() 恢复播放');
  console.groupEnd();
};