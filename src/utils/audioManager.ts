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
  activeAudioInstances.forEach(audio => {
    try {
      audio.loop = false;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
      audio.src = '';
      audio.load();
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  });
  activeAudioInstances.clear();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
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

export const playShareBackgroundMusic = (musicUrl: string | null | undefined): HTMLAudioElement | null => {
  if (!musicUrl || musicUrl.trim() === '') {
    console.warn('⚠️ No background music URL provided');
    return null;
  }

  const cacheBuster = `?t=${Date.now()}`;
  const finalAudioUrl = musicUrl + cacheBuster;

  console.log('🎵 Original Music URL:', musicUrl);
  console.log('🎵 Final Audio URL:', finalAudioUrl);

  const audio = new Audio(finalAudioUrl);
  audio.volume = 0.3;
  audio.loop = true;
  audio.crossOrigin = 'anonymous';

  registerAudio(audio);

  audio.play()
    .then(() => {
      console.log('✅ Background music started successfully');
    })
    .catch(err => {
      console.error('❌ Audio play error:', err);
    });

  return audio;
};
