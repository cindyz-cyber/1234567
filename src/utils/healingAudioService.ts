import { supabase } from '../lib/supabase';

export interface HealingTrack {
  id: string;
  title: string;
  frequencyHz: number;
  coverImageUrl: string | null;
  filePath: string;
  duration: number;
  tags: string[];
  description: string | null;
}

export interface FrequencyBenefit {
  frequency: number;
  chakraName: string;
  benefit: string;
  color: string;
}

export const FREQUENCY_BENEFITS: Record<number, FrequencyBenefit> = {
  194: {
    frequency: 194,
    chakraName: '海底轮',
    benefit: '找回掌控感，恢复生存本能与安全感，重新与大地连接',
    color: 'rgba(255, 100, 100, 0.9)'
  },
  417: {
    frequency: 417,
    chakraName: '脐轮',
    benefit: '激活创造力，释放情感流动，恢复生命的活力与欲望',
    color: 'rgba(255, 140, 80, 0.9)'
  },
  528: {
    frequency: 528,
    chakraName: '太阳轮',
    benefit: '提升自信与意志力，恢复消化系统活力，找回行动的勇气',
    color: 'rgba(255, 220, 100, 0.9)'
  },
  639: {
    frequency: 639,
    chakraName: '心轮',
    benefit: '打开心扉，培养慈悲与爱的能力，疗愈情感创伤',
    color: 'rgba(100, 220, 120, 0.9)'
  },
  741: {
    frequency: 741,
    chakraName: '喉轮',
    benefit: '解放真实声音，增强表达力与沟通能力，说出内心真相',
    color: 'rgba(100, 180, 255, 0.9)'
  },
  852: {
    frequency: 852,
    chakraName: '眉心轮',
    benefit: '增强直觉与洞察力，打开第三只眼，看清事物本质',
    color: 'rgba(150, 120, 255, 0.9)'
  },
  963: {
    frequency: 963,
    chakraName: '顶轮',
    benefit: '连接宇宙意识，提升灵性觉知，体验超越自我的存在',
    color: 'rgba(220, 150, 255, 0.9)'
  }
};

export async function getTracksByFrequency(frequencyHz: number): Promise<HealingTrack[]> {
  try {
    const { data, error } = await supabase
      .from('audio_files')
      .select('*')
      .eq('frequency_hz', frequencyHz)
      .eq('is_active', true)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks by frequency:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(track => ({
      id: track.id,
      title: track.title || track.file_name || `${frequencyHz}Hz 疗愈音频`,
      frequencyHz: track.frequency_hz,
      coverImageUrl: track.cover_image_url,
      filePath: track.file_path,
      duration: track.duration || 0,
      tags: track.tags || [],
      description: track.description
    }));
  } catch (err) {
    console.error('Exception fetching tracks:', err);
    return [];
  }
}

export async function getTracksByTag(tag: string): Promise<HealingTrack[]> {
  try {
    const { data, error } = await supabase
      .from('audio_files')
      .select('*')
      .contains('tags', [tag])
      .eq('is_active', true)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks by tag:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(track => ({
      id: track.id,
      title: track.title || track.file_name || '疗愈音频',
      frequencyHz: track.frequency_hz,
      coverImageUrl: track.cover_image_url,
      filePath: track.file_path,
      duration: track.duration || 0,
      tags: track.tags || [],
      description: track.description
    }));
  } catch (err) {
    console.error('Exception fetching tracks by tag:', err);
    return [];
  }
}

export function getRandomTrack(tracks: HealingTrack[], currentTrackId?: string): HealingTrack | null {
  if (!tracks || tracks.length === 0) return null;

  if (tracks.length === 1) return tracks[0];

  const availableTracks = currentTrackId
    ? tracks.filter(track => track.id !== currentTrackId)
    : tracks;

  if (availableTracks.length === 0) {
    return tracks[0];
  }

  const randomIndex = Math.floor(Math.random() * availableTracks.length);
  return availableTracks[randomIndex];
}

export function getAudioUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
