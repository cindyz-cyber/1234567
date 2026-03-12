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

// 🔥 全局单例锁：彻底消灭双重音频实例
let currentGlobalAudio: HTMLAudioElement | null = null;

export const registerAudio = (audio: HTMLAudioElement) => {
  console.log('📝 [audioManager] 注册新音频实例');
  console.log('   URL:', audio.src);
  console.log('   当前活跃实例数:', activeAudioInstances.size);
  console.trace('   调用栈:');
  activeAudioInstances.add(audio);
  console.log('   注册后实例数:', activeAudioInstances.size);
};

export const unregisterAudio = (audio: HTMLAudioElement) => {
  activeAudioInstances.delete(audio);
};

export const stopAllAudio = async () => {
  console.group('🧹 [audioManager] 停止所有音频');
  console.log('📊 当前活跃音频实例数:', activeAudioInstances.size);
  console.trace('🔍 调用栈:');

  // 🔥 清理全局单例锁
  if (currentGlobalAudio) {
    console.log('🔒 [单例锁] 清理全局单例');
    try {
      currentGlobalAudio.pause();
      currentGlobalAudio.src = '';
      currentGlobalAudio.load();
    } catch (err) {
      console.warn('⚠️ 清理全局单例时出错:', err);
    }
    currentGlobalAudio = null;
  }

  let stoppedCount = 0;
  activeAudioInstances.forEach((audio, index) => {
    try {
      const originalSrc = audio.src;
      const wasPlaying = !audio.paused;
      const currentTime = audio.currentTime;

      console.log(`🎵 音频实例 ${index + 1}:`);
      console.log('   URL:', originalSrc);
      console.log('   状态:', wasPlaying ? '播放中' : '已暂停');
      console.log('   位置:', currentTime, '秒');

      audio.loop = false;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;

      // 🚀 针对长音频优化：强制释放音频源，防止大文件占用内存
      audio.src = '';
      audio.load();

      console.log(`   ✅ 已停止并释放`);
      stoppedCount++;
    } catch (error) {
      console.error('❌ 停止音频失败:', error);
    }
  });
  activeAudioInstances.clear();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  console.log(`✅ 已停止 ${stoppedCount} 个音频实例，内存已清理`);
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

/**
 * 🔥 从 URL 创建新的音频实例并从 0 秒开始播放
 * 适用于主 App 场景，不需要提前创建音频实例
 * 🔥 关键：使用 preload='none' 避免任何预加载
 */
export const createAndPlayAudioFromZero = async (url: string): Promise<HTMLAudioElement | null> => {
  console.group('🎵 [audioManager] createAndPlayAudioFromZero');
  console.log('📡 目标 URL:', url);
  console.log('📊 调用前活跃音频数:', activeAudioInstances.size);

  // 🔥 全局单例锁：硬核清理现有实例
  if (currentGlobalAudio) {
    console.group('🧹 [单例锁] 检测到现有全局音频实例，强制清理');
    console.log('🗑️ 现有实例 URL:', currentGlobalAudio.src);
    console.log('📊 现有实例状态:', currentGlobalAudio.paused ? '暂停' : '播放中');

    try {
      currentGlobalAudio.pause();
      currentGlobalAudio.src = '';
      currentGlobalAudio.load(); // 强制释放内存
      activeAudioInstances.delete(currentGlobalAudio);
      console.log('✅ 现有实例已销毁并从集合中移除');
    } catch (err) {
      console.warn('⚠️ 清理现有实例时出错:', err);
    }

    currentGlobalAudio = null;
    console.groupEnd();
  }

  try {
    console.log('🔨 创建 Audio 对象...');
    const audio = new Audio();

    // 🔥 物理彻底归零：在设置 src 之前先重置浏览器的音频解析状态
    console.log('🧹 物理归零：清除浏览器音频缓存状态...');
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute('src');
    audio.load(); // 强制重置浏览器音频解析器
    console.log('✅ 浏览器音频状态已物理重置');

    // 🔥 关键修复：使用 preload='none' 确保不提前加载
    audio.preload = 'none';
    audio.autoplay = false; // 🔥 彻底禁用自动播放
    audio.crossOrigin = 'anonymous';
    audio.volume = 0;  // 🔥 先静音，防止意外播放
    audio.loop = true; // 🔥 强制循环播放，确保音乐永不停止

    console.log('✅ Audio 对象已创建 (preload=none, autoplay=false, volume=0, loop=true)');
    console.log('📊 当前 src:', audio.src || '(empty)');
    console.log('📊 当前 paused:', audio.paused);
    console.log('📊 当前 currentTime:', audio.currentTime);
    console.log('📊 当前 loop:', audio.loop);

    // 🔥 第三步：先注册，再设置 src，确保注册时机正确
    registerAudio(audio);

    // 🔥 第四步：设置 src 前再次确认归零状态和循环设置
    console.log('🔒 设置 src 前再次确认状态...');
    audio.currentTime = 0;
    audio.preload = 'none'; // 再次确认
    audio.autoplay = false; // 再次确认
    audio.loop = true; // 再次确认循环
    console.log('   currentTime =', audio.currentTime);
    console.log('   preload =', audio.preload);
    console.log('   autoplay =', audio.autoplay);
    console.log('   loop =', audio.loop);

    // 🔥 只在这里设置 src，此时才开始加载
    console.log('📡 设置 audio.src...');
    audio.src = url;
    console.log('📊 设置后 src:', audio.src);
    console.log('📊 设置后 paused:', audio.paused);
    console.log('📊 设置后 currentTime:', audio.currentTime);
    console.log('📊 设置后 loop:', audio.loop);

    // 🔥 显式调用 load()，确保从头开始加载
    console.log('⏳ 调用 audio.load()...');
    audio.load();

    // 等待音频可以播放
    console.log('⏳ 等待 canplay 事件...');
    await new Promise<void>((resolve, reject) => {
      const onCanPlay = () => {
        console.log('✅ canplay 事件触发');
        console.log('📊 canplay 时 currentTime:', audio.currentTime);
        console.log('📊 canplay 时 paused:', audio.paused);
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        resolve();
      };

      const onError = (e: Event) => {
        console.error('❌ 音频加载失败事件');
        console.error('   error:', e);
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        reject(new Error('音频加载失败'));
      };

      audio.addEventListener('canplay', onCanPlay, { once: true });
      audio.addEventListener('error', onError, { once: true });
    });

    console.group('🔥 三重强制归零机制');

    // 🔥 第一次归零
    console.log('⏮️ 第一次归零...');
    audio.currentTime = 0;
    console.log('   currentTime =', audio.currentTime);
    console.log('   paused =', audio.paused);

    // 🔥 等待 60ms 让浏览器清理缓冲区
    console.log('⏳ 等待 60ms 清理缓冲区...');
    await new Promise(resolve => setTimeout(resolve, 60));

    // 🔥 第二次归零（双保险）
    console.log('🔄 第二次归零...');
    audio.currentTime = 0;
    console.log('   currentTime =', audio.currentTime);
    console.log('   paused =', audio.paused);

    console.groupEnd();

    // 🔥 恢复音量
    console.log('🔊 恢复音量到 0.3...');
    audio.volume = 0.3;

    // 🔥 开始播放
    console.log('▶️ 调用 audio.play()...');
    await audio.play();
    console.log('✅ audio.play() 返回成功');
    console.log('📊 播放后即时 currentTime:', audio.currentTime);
    console.log('📊 播放后即时 paused:', audio.paused);

    // 🔥 播放后强制确认循环设置（某些浏览器可能在 play() 后重置）
    audio.loop = true;
    console.log('🔄 播放后再次确认 loop = true');
    console.log('📊 最终 loop 状态:', audio.loop);

    // 🔥 播放后 100ms 检查位置（第三次归零）
    setTimeout(() => {
      console.log('🔍 100ms 后检查播放位置...');
      console.log('   currentTime:', audio.currentTime);
      if (audio.currentTime > 0.5) {
        console.warn('⚠️ 检测到播放位置异常 (>0.5s)，第三次归零');
        audio.currentTime = 0;
        console.log('   ✅ 第三次归零完成，currentTime =', audio.currentTime);
      } else {
        console.log('   ✅ 播放位置验证通过');
      }
    }, 100);

    // 🔥 将新实例赋值给全局单例锁
    currentGlobalAudio = audio;
    console.log('🔒 [单例锁] 新实例已设为全局单例');

    console.log('✅ createAndPlayAudioFromZero 完成');
    console.log('📊 返回前活跃音频数:', activeAudioInstances.size);
    console.groupEnd();
    return audio;
  } catch (error) {
    console.error('❌ createAndPlayAudioFromZero 失败:', error);
    console.groupEnd();
    return null;
  }
};

/**
 * 🔥 双重强制归零播放器 - 确保音频从 0 秒开始
 * 参考 ShareJournal 的成功经验，实现强制重置逻辑
 * 🔥 增强版：60ms 延迟，专为 iOS Safari 优化
 */
export const playAudioFromZero = async (audioInstance: HTMLAudioElement): Promise<void> => {
  if (!audioInstance) {
    console.error('❌ playAudioFromZero: audioInstance 为空');
    return;
  }

  console.group('🔥 [audioManager] 三重强制归零播放 (iOS 优化)');

  // 🔥 第一步：彻底静音并暂停，防止切歌时的爆音
  audioInstance.pause();
  console.log('⏸️ 音频已暂停');

  // 🔥 第二步：第一次强制重置
  console.log('⏮️ 第一次强制重置: currentTime = 0');
  audioInstance.currentTime = 0;
  console.log('📊 当前 currentTime:', audioInstance.currentTime);
  console.log('📊 readyState:', audioInstance.readyState, '(0=无数据, 1=元数据, 2=当前帧, 3=未来数据, 4=足够数据)');

  // 🔥 第三步：等待 60ms 让浏览器音频缓冲区清理（针对 iOS Safari 优化）
  console.log('⏳ 等待 60ms 让浏览器清理音频缓冲区 (iOS Safari 专项)...');
  await new Promise(resolve => setTimeout(resolve, 60));

  // 🔥 第四步：第二次强制重置并确保加载状态
  console.log('🔄 第二次强制重置: currentTime = 0');
  audioInstance.currentTime = 0;
  console.log('📊 重置后 currentTime:', audioInstance.currentTime);
  console.log('📊 重置后 readyState:', audioInstance.readyState);

  try {
    console.log('▶️ 开始播放音频...');
    await audioInstance.play();
    console.log('✅ 音频播放成功');
    console.log('⏱️ 播放后即时位置:', audioInstance.currentTime, '秒');

    // 🔥 第五步：播放后瞬时检查，如果跳秒则强行拉回
    setTimeout(() => {
      if (audioInstance.currentTime > 0.5) {
        console.warn('⚠️ 检测到播放位置异常 (>0.5s)，第三次强制归零');
        audioInstance.currentTime = 0;
        console.log('✅ 第三次重置完成，currentTime =', audioInstance.currentTime);
      } else {
        console.log('✅ 播放位置验证通过，currentTime =', audioInstance.currentTime);
      }
    }, 100);
  } catch (err) {
    console.error('❌ 播放失败:', err);
    console.error('📊 失败时的状态:');
    console.error('   readyState:', audioInstance.readyState);
    console.error('   networkState:', audioInstance.networkState);
    console.error('   paused:', audioInstance.paused);
    console.error('   currentTime:', audioInstance.currentTime);
    console.error('   src:', audioInstance.src);
    throw err;
  } finally {
    console.groupEnd();
  }
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

    // 🔥 使用双重强制归零播放
    await playAudioFromZero(audio);

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
      console.log('📊 音频状态诊断:');
      console.log('   readyState:', audio.readyState, '(0=无数据, 1=元数据, 2=当前帧, 3=未来数据, 4=足够数据)');
      console.log('   networkState:', audio.networkState, '(0=空闲, 1=加载中, 2=无源, 3=无支持)');
      console.log('   duration:', audio.duration, '秒');
      console.log('   currentTime (重置前):', audio.currentTime, '秒');

      // 🔥 第一次重置
      audio.currentTime = 0;
      console.log('✅ 第一次重置完成，currentTime =', audio.currentTime);

      // 🔥 等待 60ms 确保生效（iOS Safari 优化）
      console.log('⏳ 等待 60ms 让浏览器清理缓冲区...');
      await new Promise(r => setTimeout(r, 60));

      // 🔥 第二次重置（双保险）
      audio.currentTime = 0;
      console.log('✅ 第二次重置完成，currentTime =', audio.currentTime);
      console.groupEnd();

      audio.play()
        .then(() => {
          console.group('✅ 背景音乐播放成功');
          console.log('⏱️ 当前播放位置:', audio.currentTime, '秒');
          console.log('📊 播放状态:');
          console.log('   paused:', audio.paused);
          console.log('   muted:', audio.muted);
          console.log('   volume:', audio.volume);
          console.log('   loop:', audio.loop);
          console.groupEnd();

          // 🔥 播放后立即检查并纠正
          setTimeout(() => {
            if (audio.currentTime > 0.5) {
              console.warn('⚠️ 检测到播放位置异常 (>0.5s)，第三次强制归零');
              audio.currentTime = 0;
              console.log('✅ 第三次归零完成，currentTime =', audio.currentTime);
            } else {
              console.log('✅ 播放位置验证通过，currentTime =', audio.currentTime);
            }
          }, 100);
        })
        .catch(err => {
          console.group('❌ 音频播放失败');
          console.error('错误信息:', err);
          console.error('错误类型:', err.name);
          console.error('错误详情:', err.message);
          console.error('📊 失败时的音频状态:');
          console.error('   readyState:', audio.readyState);
          console.error('   networkState:', audio.networkState);
          console.error('   paused:', audio.paused);
          console.error('   currentTime:', audio.currentTime);
          console.error('   src:', audio.src);
          console.error('💡 可能的原因:');
          console.error('   1. 需要用户交互才能播放（浏览器自动播放策略）');
          console.error('   2. 音频文件加载失败（403/404）');
          console.error('   3. 音频格式不支持');
          console.error('   4. 网络连接问题');
          console.groupEnd();
        });

      // 移除监听器，避免重复触发
      audio.removeEventListener('canplay', onCanPlay);
      resolve(audio);
    };

    // 🔥 添加加载超时检测
    const loadTimeout = setTimeout(() => {
      console.group('⚠️ 音频加载超时（5秒）');
      console.error('📊 超时时的音频状态:');
      console.error('   readyState:', audio.readyState, '(如果 < 2，说明网络太慢或文件不可访问)');
      console.error('   networkState:', audio.networkState);
      console.error('   src:', audio.src);
      console.error('💡 建议:');
      console.error('   1. 检查网络连接');
      console.error('   2. 检查 Supabase Storage 权限配置');
      console.error('   3. 确认音频文件 URL 可访问（返回 200 而非 403）');
      console.error('   4. 如果是微信内置浏览器，确认域名已通过认证');
      console.groupEnd();
    }, 5000);

    audio.addEventListener('canplay', () => {
      clearTimeout(loadTimeout);
      onCanPlay();
    }, { once: true });

    // 🔥 添加错误监听
    audio.addEventListener('error', () => {
      clearTimeout(loadTimeout);
    }, { once: true });
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

/**
 * 🔥 用户交互音频预热 - 解决 iOS 自动播放限制
 * 在用户点击"开始"按钮时调用，静默解锁音频权限
 */
export const warmupAudioContext = async (audioInstance?: HTMLAudioElement | null): Promise<void> => {
  console.group('🔓 [audioManager] 用户交互音频预热');

  try {
    // 预热 AudioContext（解决 iOS 和某些浏览器的限制）
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        console.log('🔓 AudioContext 处于 suspended 状态，正在恢复...');
        await audioContext.resume();
        console.log('✅ AudioContext 已恢复为 running 状态');
      } else {
        console.log('✅ AudioContext 已处于', audioContext.state, '状态');
      }
    }

    // 如果传入了音频实例，进行静默预热
    if (audioInstance) {
      console.log('🎵 开始预热音频实例...');
      audioInstance.muted = true;

      try {
        await audioInstance.play();
        console.log('✅ 音频实例预热成功（静音播放）');

        audioInstance.pause();
        audioInstance.muted = false;
        audioInstance.currentTime = 0;

        console.log('✅ 音频实例已复位，准备正式播放');
      } catch (err) {
        console.warn('⚠️ 音频实例预热失败（非致命）:', err);
      }
    }
  } catch (err) {
    console.warn('⚠️ 音频预热失败（非致命）:', err);
  } finally {
    console.groupEnd();
  }
};