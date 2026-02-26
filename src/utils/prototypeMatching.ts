import { supabase } from '../lib/supabase';

export interface VoicePrototype {
  id: string;
  name: string;
  tagName: string;
  description: string;
  coreFrequency: number;
  chakraSignature: {
    root: number;
    sacral: number;
    solar: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
  harmonicRichness: number;
  phasePattern: 'grounded' | 'floating' | 'dispersed';
  qualityType: 'smooth' | 'rough' | 'flat';
  somaticSensation: string;
  color: string;
  advice?: string;
  organs?: string;
  doList?: string[];
  dontList?: string[];
  rechargeHz?: number;
}

export interface ChakraEnergy {
  root: number;
  sacral: number;
  solar: number;
  heart: number;
  throat: number;
  thirdEye: number;
  crown: number;
}

function calculateEuclideanDistance(
  chakra1: ChakraEnergy,
  chakra2: ChakraEnergy
): number {
  const normalized1 = normalizeChakraEnergy(chakra1);
  const normalized2 = normalizeChakraEnergy(chakra2);

  let sumSquaredDiff = 0;
  for (const key of Object.keys(normalized1) as Array<keyof ChakraEnergy>) {
    const diff = normalized1[key] - normalized2[key];
    sumSquaredDiff += diff * diff;
  }

  return Math.sqrt(sumSquaredDiff);
}

function normalizeChakraEnergy(chakra: ChakraEnergy): ChakraEnergy {
  const values = Object.values(chakra);
  const max = Math.max(...values);

  if (max === 0) {
    return { ...chakra };
  }

  const normalized: ChakraEnergy = {} as ChakraEnergy;
  for (const key of Object.keys(chakra) as Array<keyof ChakraEnergy>) {
    normalized[key] = chakra[key] / max;
  }

  return normalized;
}

function calculateHarmonicRichness(chakraEnergy: ChakraEnergy): number {
  const values = Object.values(chakraEnergy);
  const nonZeroCount = values.filter(v => v > 0.1).length;
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const richness = (nonZeroCount / 7) * 50 + (1 - stdDev / avg) * 50;
  return Math.min(100, Math.max(0, richness));
}

export async function fetchPrototypes(): Promise<VoicePrototype[]> {
  console.log('[prototypeMatching] Fetching prototypes from database...');

  const { data, error } = await supabase
    .from('voice_energy_prototypes')
    .select('*')
    .order('id');

  if (error) {
    console.error('[prototypeMatching] Error fetching prototypes:', error);
    return [];
  }

  console.log('[prototypeMatching] Fetched', data?.length || 0, 'prototypes');

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    tagName: row.tag_name,
    description: row.description,
    coreFrequency: row.core_frequency,
    chakraSignature: row.chakra_signature,
    harmonicRichness: parseFloat(row.harmonic_richness),
    phasePattern: row.phase_pattern,
    qualityType: row.quality_type,
    somaticSensation: row.somatic_sensation,
    color: row.color || '#FFFFFF',
    advice: row.advice,
    organs: row.organs,
    doList: row.do_list || [],
    dontList: row.dont_list || [],
    rechargeHz: row.recharge_hz
  }));
}

export interface PrototypeMatchResult {
  prototype: VoicePrototype;
  similarity: number;
  distance: number;
}

export async function matchPrototype(
  chakraEnergy: ChakraEnergy,
  phasePattern: 'grounded' | 'floating' | 'dispersed',
  qualityType: 'smooth' | 'rough' | 'flat'
): Promise<PrototypeMatchResult | null> {
  console.log('[prototypeMatching] Starting prototype matching...', { phasePattern, qualityType });

  const prototypes = await fetchPrototypes();

  if (prototypes.length === 0) {
    console.warn('[prototypeMatching] No prototypes found in database');
    return null;
  }

  console.log('[prototypeMatching] Calculating matches for', prototypes.length, 'prototypes');

  let bestMatch: PrototypeMatchResult | null = null;
  let minDistance = Infinity;

  const userHarmonicRichness = calculateHarmonicRichness(chakraEnergy);

  for (const prototype of prototypes) {
    const distance = calculateEuclideanDistance(chakraEnergy, prototype.chakraSignature);

    const phaseMatch = phasePattern === prototype.phasePattern ? 1.0 : 0.7;
    const qualityMatch = qualityType === prototype.qualityType ? 1.0 : 0.8;
    const harmonicDiff = Math.abs(userHarmonicRichness - prototype.harmonicRichness) / 100;

    const adjustedDistance = distance * (2 - phaseMatch) * (2 - qualityMatch) * (1 + harmonicDiff);

    if (adjustedDistance < minDistance) {
      minDistance = adjustedDistance;
      const similarity = Math.max(0, (1 - adjustedDistance / Math.sqrt(7)) * 100);

      bestMatch = {
        prototype,
        similarity,
        distance: adjustedDistance
      };
    }
  }

  if (bestMatch && bestMatch.similarity >= 85) {
    console.log('[prototypeMatching] Found match:', bestMatch.prototype.name, 'similarity:', bestMatch.similarity);
    return bestMatch;
  }

  console.log('[prototypeMatching] No match found above 85% threshold');
  return null;
}

export function getDominantChakra(chakraEnergy: ChakraEnergy): keyof ChakraEnergy {
  let maxEnergy = 0;
  let dominant: keyof ChakraEnergy = 'heart';

  for (const key of Object.keys(chakraEnergy) as Array<keyof ChakraEnergy>) {
    if (chakraEnergy[key] > maxEnergy) {
      maxEnergy = chakraEnergy[key];
      dominant = key;
    }
  }

  return dominant;
}

export function getGapChakras(chakraEnergy: ChakraEnergy): Array<keyof ChakraEnergy> {
  const entries = Object.entries(chakraEnergy) as Array<[keyof ChakraEnergy, number]>;
  entries.sort((a, b) => a[1] - b[1]);
  return entries.slice(0, 2).map(e => e[0]);
}
