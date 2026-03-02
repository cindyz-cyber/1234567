import { KinEnergyReport, EnergyCenter, QuantumResonance } from '../types/energyPortrait';
import { supabase } from '../lib/supabase';

function getDefaultIcon(centerName: string): string {
  const iconMap: Record<string, string> = {
    '心轮': '❤️',
    '喉轮': '💎',
    '松果体': '👁️',
    '太阳神经丛': '☀️',
    '脐轮': '🔥',
    '海底轮': '🌱',
    '顶轮': '👑'
  };
  return iconMap[centerName] || '⭐';
}

async function fetchEnergyCentersFromDatabase(kin: number): Promise<EnergyCenter[]> {
  try {
    const { data, error } = await supabase
      .from('kin_energy_centers')
      .select('*')
      .eq('kin', kin)
      .order('center_name');

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`No energy centers found for Kin ${kin}`);
    }

    return data.map(center => ({
      name: center.center_name,
      percentage: center.percentage,
      mode: center.mode,
      description: center.description,
      icon: center.icon || getDefaultIcon(center.center_name),
      traits: center.traits,
      weaknesses: center.weaknesses
    }));
  } catch (error) {
    console.error(`Failed to fetch energy centers for Kin ${kin}:`, error);
    throw error;
  }
}

async function fetchKinBasicInfo(kin: number) {
  try {
    const { data: totemData, error: totemError } = await supabase
      .from('knowledge_base_totems')
      .select('*')
      .eq('kin', kin)
      .maybeSingle();

    if (totemError) throw totemError;

    if (totemData) {
      return {
        toneName: totemData.tone_name,
        sealName: totemData.seal_name,
        essence: totemData.essence || '',
        wavespellName: totemData.wavespell_name
      };
    }

    const tone = ((kin - 1) % 13) + 1;
    const seal = ((kin - 1) % 20) + 1;
    const wavespellStartKin = Math.floor((kin - 1) / 13) * 13 + 1;

    const { data: wavespellData } = await supabase
      .from('knowledge_base_wavespells')
      .select('name')
      .eq('start_kin', wavespellStartKin)
      .maybeSingle();

    return {
      toneName: `第${tone}调性`,
      sealName: `第${seal}图腾`,
      essence: '',
      wavespellName: wavespellData?.name || `第${Math.floor((kin - 1) / 13) + 1}波符`
    };
  } catch (error) {
    console.error('Failed to fetch basic info:', error);
    const tone = ((kin - 1) % 13) + 1;
    const seal = ((kin - 1) % 20) + 1;
    return {
      toneName: `第${tone}调性`,
      sealName: `第${seal}图腾`,
      essence: '',
      wavespellName: `第${Math.floor((kin - 1) / 13) + 1}波符`
    };
  }
}

async function calculateQuantumResonance(
  userKin: number,
  familyKin: number,
  familyName: string
): Promise<QuantumResonance | null> {
  try {
    const userCenters = await fetchEnergyCentersFromDatabase(userKin);
    const familyCenters = await fetchEnergyCentersFromDatabase(familyKin);

    const userWeakest = userCenters.reduce((min, c) => c.percentage < min.percentage ? c : min);
    const familyStrongest = familyCenters.reduce((max, c) => c.percentage > max.percentage ? c : max);

    const kinDiff = Math.abs(userKin - familyKin);
    let synergyStrength = 0.5;

    if (userWeakest.name === familyStrongest.name) {
      synergyStrength = 0.9;
    } else if (kinDiff < 20) {
      synergyStrength = 0.7;
    }

    return {
      familyMember: familyName,
      type: userWeakest.name === familyStrongest.name ? 'pusher' : 'mirror',
      typeLabel: userWeakest.name === familyStrongest.name ? '推动因子' : '镜像因子',
      description: `${familyName}的${familyStrongest.name}能量（${familyStrongest.percentage}%）与你的${userWeakest.name}（${userWeakest.percentage}%）形成共振`,
      synergyType: 'harmonic-resonance',
      synergyStrength,
      synergyDescription: `能量共振强度：${Math.round(synergyStrength * 100)}%`
    };
  } catch (error) {
    console.error('Failed to calculate quantum resonance:', error);
    return null;
  }
}

export async function generateEnergyReport(
  kin: number,
  familyKins?: Array<{ name: string; kin: number }>
): Promise<KinEnergyReport> {
  const basicInfo = await fetchKinBasicInfo(kin);
  const centers = await fetchEnergyCentersFromDatabase(kin);

  const portrait = {
    mode: '数据库模式',
    perspective: '知识库视角',
    essence: `${basicInfo.toneName}${basicInfo.sealName}。${basicInfo.essence}`,
    centers
  };

  const quantumResonances: QuantumResonance[] = [];
  if (familyKins && familyKins.length > 0) {
    for (const family of familyKins) {
      try {
        const resonance = await calculateQuantumResonance(kin, family.kin, family.name);
        if (resonance) quantumResonances.push(resonance);
      } catch (error) {
        console.error(`Failed to calculate resonance with ${family.name}:`, error);
      }
    }
  }

  const sortedCenters = [...centers].sort((a, b) => a.percentage - b.percentage);
  const weakestCenter = sortedCenters[0];

  return {
    kin,
    portrait,
    quantumResonances,
    yearGuidance: {
      year: 2026,
      theme: '白风年',
      mainEnergy: '喉轮觉醒',
      advice: `建议强化${weakestCenter.name}能量场`
    },
    weakestCenter: weakestCenter.name,
    challengeAdvice: `专注提升${weakestCenter.name}（当前${weakestCenter.percentage}%）`,
    wavespellInfluence: basicInfo.wavespellName
  };
}

function extractToneAndSeal(essence: string): { toneName: string; sealName: string } {
  const match = essence.match(/^(.*?)(红龙|白风|蓝夜|黄种子|红蛇|白世界桥|蓝手|黄星星|红月|白狗|蓝猴|黄人|红天行者|白巫师|蓝鹰|黄战士|红地球|白镜|蓝风暴|黄太阳)/);

  if (match) {
    return {
      toneName: match[1].trim(),
      sealName: match[2]
    };
  }

  return {
    toneName: '',
    sealName: ''
  };
}

function generate2026Advice(weakestCenter: string, centers: EnergyCenter[]): string {
  return `2026白风年建议：专注${weakestCenter}能量场的觉醒与平衡`;
}

function generateChallengeAdvice(weakestCenter: EnergyCenter, wavespell: { name: string }): string {
  return `在${wavespell.name}的引导下，提升${weakestCenter.name}能量`;
}
