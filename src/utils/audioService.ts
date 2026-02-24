import { supabase } from '../lib/supabase';

export type AudioCategory =
  | 'instant_elevation'
  | 'abundance'
  | 'relationships'
  | 'deep_healing'
  | 'high_self'
  | 'deep_asmr';

export type ChakraType =
  | 'root'
  | 'sacral'
  | 'solar_plexus'
  | 'heart'
  | 'throat'
  | 'third_eye'
  | 'crown';

export interface AudioFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  duration: number;
  is_active: boolean;
  uploaded_at: string;
  description?: string;
  category?: AudioCategory;
  chakra?: ChakraType;
  energy_type?: string;
}

export async function getAudiosByCategory(category: AudioCategory): Promise<AudioFile[]> {
  const { data, error } = await supabase
    .from('audio_files')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching audios by category:', error);
    return [];
  }

  return data || [];
}

export async function getRandomAudioFromCategory(category: AudioCategory): Promise<AudioFile | null> {
  const audios = await getAudiosByCategory(category);

  if (audios.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * audios.length);
  return audios[randomIndex];
}

export async function getNextAudioFromCategory(
  category: AudioCategory,
  currentAudioId?: string
): Promise<AudioFile | null> {
  const audios = await getAudiosByCategory(category);

  if (audios.length === 0) return null;
  if (audios.length === 1) return audios[0];

  const availableAudios = currentAudioId
    ? audios.filter(audio => audio.id !== currentAudioId)
    : audios;

  const randomIndex = Math.floor(Math.random() * availableAudios.length);
  return availableAudios[randomIndex];
}

export async function getTodaysRecommendation(): Promise<AudioFile | null> {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const chakras: ChakraType[] = ['root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye', 'crown'];
  const todaysChakra = chakras[dayOfYear % chakras.length];

  const { data, error } = await supabase
    .from('audio_files')
    .select('*')
    .eq('chakra', todaysChakra)
    .eq('is_active', true)
    .order('uploaded_at', { ascending: false })
    .limit(10);

  if (error || !data || data.length === 0) {
    return getRandomAudioFromAllCategories();
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

async function getRandomAudioFromAllCategories(): Promise<AudioFile | null> {
  const { data, error } = await supabase
    .from('audio_files')
    .select('*')
    .eq('is_active', true)
    .order('uploaded_at', { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

export function getAudioUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export const CATEGORY_LABELS: Record<AudioCategory, string> = {
  instant_elevation: '当下提频',
  abundance: '丰盛显化',
  relationships: '喜悦关系',
  deep_healing: '深层修复',
  high_self: '高维连接',
  deep_asmr: '深海静默',
};

export const CATEGORY_DESCRIPTIONS: Record<AudioCategory, string> = {
  instant_elevation: '去烦恼 · 清负',
  abundance: '钱 · 事业',
  relationships: '情感 · 社交',
  deep_healing: '脉轮 · 脏腑',
  high_self: '高我 · 直觉',
  deep_asmr: '颅内高潮',
};
