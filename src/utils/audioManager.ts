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

export const playShareBackgroundMusic = async (
  shareConfigUrl: string | null | undefined,
  fallbackToMainApp: boolean = true
): Promise<HTMLAudioElement | null> => {
  let finalMusicUrl: string | null = null;

  console.group('🎵 音频加载策略 - 三级优先级');

  if (shareConfigUrl && shareConfigUrl.trim() !== '') {
    console.log('✅ 优先级 1: h5_share_config.bg_music_url 已配置');
    console.log('🎵 URL:', shareConfigUrl);
    finalMusicUrl = shareConfigUrl;
  } else if (fallbackToMainApp) {
    console.log('⚠️ 优先级 1 未配置，尝试优先级 2: 主 App 全局音频资源');
    try {
      const mainAppAudio = await playBackgroundMusicLoop();
      if (mainAppAudio) {
        console.log('✅ 优先级 2 成功: 已从主 App audio_files 表获取音频');
        console.groupEnd();
        return mainAppAudio;
      }
      console.warn('⚠️ 优先级 2 失败: 主 App 无可用音频资源');
    } catch (err) {
      console.error('❌ 优先级 2 异常:', err);
    }

    console.warn('⚠️ 优先级 3: 本地静态资源（未实现）');
    console.warn('💡 建议: 请在 /admin/share-config 配置 bg_music_url');
  } else {
    console.error('❌ 所有优先级均未配置，音频加载失败');
  }

  console.groupEnd();

  if (!finalMusicUrl) {
    console.error('❌ 无可用音频 URL，终止播放');
    return null;
  }

  const cacheBuster = `?t=${Date.now()}`;
  const finalAudioUrl = finalMusicUrl + cacheBuster;

  console.group('🎵 长音频流式播放优化');
  console.log('🎵 Original Music URL:', finalMusicUrl);
  console.log('🎵 Final Audio URL:', finalAudioUrl);
  console.log('📊 Preload策略: metadata (流式播放，边缓冲边播放)');
  console.log('💾 内存管理: 已注册自动销毁机制');
  console.groupEnd();

  const audio = new Audio(finalAudioUrl);
  audio.volume = 0.3;
  audio.loop = true;
  audio.crossOrigin = 'anonymous';
  audio.preload = 'metadata';

  registerAudio(audio);

  audio.play()
    .then(() => {
      console.log('✅ Background music started successfully (streaming mode)');
    })
    .catch(err => {
      console.error('❌ Audio play error:', err);
    });

  return audio;
};
