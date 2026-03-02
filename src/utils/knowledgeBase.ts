import { supabase } from '../lib/supabase';

export interface Totem {
  id: number;
  name_cn: string;
  name_en: string;
  pineal_gland: number;
  throat_chakra: number;
  operation_mode: string;
  core_keyword: string;
  description: string;
  energy_signature: string;
}

export interface Tone {
  id: number;
  name_cn: string;
  name_en: string;
  description: string;
  energy_pattern: string;
  life_strategy: string;
  challenge: string;
  gift: string;
}

export interface KinDefinition {
  kin_number: number;
  totem_id: number;
  tone_id: number;
  oracle_guide: number | null;
  oracle_challenge: number | null;
  oracle_support: number | null;
  oracle_hidden: number | null;
  antipode: number | null;
  analog: number | null;
  core_essence: string;
  life_purpose: string;
  shadow_work: string;
  integration_path: string;
  quantum_signature: Record<string, any>;
}

export interface KinKnowledge {
  kin: KinDefinition;
  totem: Totem;
  tone: Tone;
}

class KnowledgeBaseEngine {
  private totemCache: Map<number, Totem> = new Map();
  private toneCache: Map<number, Tone> = new Map();
  private kinCache: Map<number, KinDefinition> = new Map();

  async getTotem(id: number): Promise<Totem | null> {
    if (this.totemCache.has(id)) {
      return this.totemCache.get(id)!;
    }

    const { data, error } = await supabase
      .from('totems')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching totem:', error);
      return null;
    }

    this.totemCache.set(id, data as Totem);
    return data as Totem;
  }

  async getTone(id: number): Promise<Tone | null> {
    if (this.toneCache.has(id)) {
      return this.toneCache.get(id)!;
    }

    const { data, error } = await supabase
      .from('tones')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching tone:', error);
      return null;
    }

    this.toneCache.set(id, data as Tone);
    return data as Tone;
  }

  async getKinDefinition(kinNumber: number): Promise<KinDefinition | null> {
    if (this.kinCache.has(kinNumber)) {
      return this.kinCache.get(kinNumber)!;
    }

    const { data, error } = await supabase
      .from('kin_definitions')
      .select('*')
      .eq('kin_number', kinNumber)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching kin definition:', error);
      return null;
    }

    this.kinCache.set(kinNumber, data as KinDefinition);
    return data as KinDefinition;
  }

  async getFullKinKnowledge(kinNumber: number): Promise<KinKnowledge | null> {
    const kinDef = await this.getKinDefinition(kinNumber);
    if (!kinDef) return null;

    const [totem, tone] = await Promise.all([
      this.getTotem(kinDef.totem_id),
      this.getTone(kinDef.tone_id)
    ]);

    if (!totem || !tone) return null;

    return {
      kin: kinDef,
      totem,
      tone
    };
  }

  async getAllTotems(): Promise<Totem[]> {
    const { data, error } = await supabase
      .from('totems')
      .select('*')
      .order('id');

    if (error || !data) {
      console.error('Error fetching all totems:', error);
      return [];
    }

    data.forEach(totem => this.totemCache.set(totem.id, totem as Totem));
    return data as Totem[];
  }

  async getAllTones(): Promise<Tone[]> {
    const { data, error } = await supabase
      .from('tones')
      .select('*')
      .order('id');

    if (error || !data) {
      console.error('Error fetching all tones:', error);
      return [];
    }

    data.forEach(tone => this.toneCache.set(tone.id, tone as Tone));
    return data as Tone[];
  }

  async searchKinByTotemAndTone(totemId: number, toneId: number): Promise<KinDefinition | null> {
    const { data, error } = await supabase
      .from('kin_definitions')
      .select('*')
      .eq('totem_id', totemId)
      .eq('tone_id', toneId)
      .maybeSingle();

    if (error || !data) {
      console.error('Error searching kin by totem and tone:', error);
      return null;
    }

    this.kinCache.set((data as KinDefinition).kin_number, data as KinDefinition);
    return data as KinDefinition;
  }

  clearCache() {
    this.totemCache.clear();
    this.toneCache.clear();
    this.kinCache.clear();
  }
}

export const knowledgeBase = new KnowledgeBaseEngine();

export async function seedTotemData(totemData: Omit<Totem, 'created_at' | 'updated_at'>) {
  const { error } = await supabase
    .from('totems')
    .upsert(totemData, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding totem data:', error);
    throw error;
  }
}

export async function seedToneData(toneData: Omit<Tone, 'created_at' | 'updated_at'>) {
  const { error } = await supabase
    .from('tones')
    .upsert(toneData, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding tone data:', error);
    throw error;
  }
}

export async function seedKinDefinition(kinData: Omit<KinDefinition, 'created_at' | 'updated_at'>) {
  const { error } = await supabase
    .from('kin_definitions')
    .upsert(kinData, { onConflict: 'kin_number' });

  if (error) {
    console.error('Error seeding kin definition:', error);
    throw error;
  }
}
