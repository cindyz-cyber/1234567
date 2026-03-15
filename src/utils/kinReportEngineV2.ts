/**
 * Kin 能量报告生成引擎 V2 - 基于知识库
 * Knowledge Base Driven Kin Energy Report Generator
 */

import type {
  KinEnergyProfile,
  EnergyCenterScore,
  QuantumResonance,
  Year2026Advice,
  KinEnergyReport
} from '../types/kinReport';
import { knowledgeBase, type KinKnowledge } from './knowledgeBase';

/**
 * 从 Kin 号码提取调性（1-13）
 */
export function extractTone(kin: number): number {
  return ((kin - 1) % 13) + 1;
}

/**
 * 从 Kin 号码提取图腾（1-20）
 */
export function extractTotem(kin: number): number {
  return ((kin - 1) % 20) + 1;
}

/**
 * 基于知识库生成能量画像
 */
export async function generateEnergyProfileFromKB(kin: number): Promise<KinEnergyProfile | null> {
  const knowledge = await knowledgeBase.getFullKinKnowledge(kin);
  if (!knowledge) return null;

  const { totem, tone, kin: kinDef } = knowledge;

  return {
    mode: `${tone.name_cn}·${totem.operation_mode}`,
    perspective: tone.life_strategy || `${tone.description}的能量模式`,
    essence: kinDef.core_essence || `${totem.core_keyword}的${tone.name_cn}呈现`
  };
}

/**
 * 基于知识库计算能量中心分数
 */
export async function calculateEnergyCentersFromKB(kin: number): Promise<EnergyCenterScore[]> {
  const knowledge = await knowledgeBase.getFullKinKnowledge(kin);
  if (!knowledge) {
    return generateFallbackEnergyCenters(kin);
  }

  const { totem, tone } = knowledge;

  const heartScore = Math.min(100, Math.max(30, totem.pineal_gland + getToneModifier(tone.id, 'heart')));
  const throatScore = Math.min(100, Math.max(30, totem.throat_chakra + getToneModifier(tone.id, 'throat')));
  const pinealScore = Math.min(100, Math.max(30, totem.pineal_gland + getToneModifier(tone.id, 'pineal')));

  return [
    {
      center: 'heart',
      name: '心轮能量',
      score: heartScore,
      description: generateCenterDescription(heartScore, '心轮', totem.core_keyword, tone.name_cn),
      reasoning: `${totem.name_cn}的核心频率（${totem.pineal_gland}Hz）${tone.energy_pattern ? `在${tone.name_cn}调性下` : ''}呈现为心轮的${getEnergyLevel(heartScore)}表达`
    },
    {
      center: 'throat',
      name: '喉轮能量',
      score: throatScore,
      description: generateCenterDescription(throatScore, '喉轮', totem.core_keyword, tone.name_cn),
      reasoning: `${totem.name_cn}的表达频率（${totem.throat_chakra}Hz）通过${tone.name_cn}调性，形成喉轮的${getEnergyLevel(throatScore)}显化`
    },
    {
      center: 'pineal',
      name: '松果体能量',
      score: pinealScore,
      description: generateCenterDescription(pinealScore, '松果体', totem.core_keyword, tone.name_cn),
      reasoning: `${totem.name_cn}的直觉频率在${tone.name_cn}调性中，激活松果体${getEnergyLevel(pinealScore)}的感知能力`
    }
  ];
}

/**
 * 基于知识库生成量子共振信息
 */
export async function generateQuantumResonanceFromKB(kin: number): Promise<QuantumResonance | null> {
  const knowledge = await knowledgeBase.getFullKinKnowledge(kin);
  if (!knowledge) return null;

  const { totem, tone, kin: kinDef } = knowledge;

  const baseFrequency = (totem.pineal_gland + totem.throat_chakra) / 2;
  const toneMultiplier = 1 + (tone.id - 1) * 0.05;
  const resonanceHz = Math.round(baseFrequency * toneMultiplier * 10) / 10;

  const resonanceType = determineResonanceType(totem.id, tone.id);

  return {
    type: resonanceType,
    frequency: resonanceHz,
    description: kinDef.quantum_signature?.description ||
      `${totem.name_cn}（${totem.core_keyword}）与${tone.name_cn}调性的量子纠缠，形成${resonanceHz}Hz的${resonanceType}共振场`,
    compatibility: kinDef.quantum_signature?.compatibility ||
      generateCompatibility(totem.id, tone.id)
  };
}

/**
 * 基于知识库生成完整报告
 */
export async function generateKinReportFromKB(
  kin: number,
  userName?: string,
  higherSelfName?: string
): Promise<KinEnergyReport | null> {
  const knowledge = await knowledgeBase.getFullKinKnowledge(kin);
  if (!knowledge) return null;

  const { totem, tone, kin: kinDef } = knowledge;

  const profile = await generateEnergyProfileFromKB(kin);
  const energyCenters = await calculateEnergyCentersFromKB(kin);
  const quantumResonance = await generateQuantumResonanceFromKB(kin);

  if (!profile || !quantumResonance) return null;

  return {
    kin,
    totemName: totem.name_cn,
    totemNameEn: totem.name_en,
    toneName: tone.name_cn,
    toneNumber: tone.id,
    profile,
    energyCenters,
    quantumResonance,
    lifePurpose: kinDef.life_purpose || `作为${totem.name_cn}的${tone.name_cn}化身，你的使命是${totem.core_keyword}`,
    shadowWork: kinDef.shadow_work || tone.challenge || `在${tone.name_cn}的能量中，觉察${totem.core_keyword}的阴影面`,
    integrationPath: kinDef.integration_path || `通过${tone.life_strategy}，整合${totem.core_keyword}的能量`,
    year2026Advice: generate2026Advice(totem, tone),
    userName,
    higherSelfName
  };
}

function getToneModifier(toneId: number, center: 'heart' | 'throat' | 'pineal'): number {
  const modifiers: Record<number, { heart: number; throat: number; pineal: number }> = {
    1: { heart: 5, throat: -3, pineal: 0 },
    2: { heart: -5, throat: 8, pineal: 0 },
    3: { heart: 3, throat: 3, pineal: -2 },
    4: { heart: 0, throat: 10, pineal: -5 },
    5: { heart: 5, throat: 5, pineal: -3 },
    6: { heart: 7, throat: 0, pineal: 0 },
    7: { heart: 0, throat: 0, pineal: 10 },
    8: { heart: 3, throat: 3, pineal: 3 },
    9: { heart: 0, throat: -5, pineal: 12 },
    10: { heart: -3, throat: 12, pineal: -5 },
    11: { heart: 8, throat: -8, pineal: 5 },
    12: { heart: 5, throat: 5, pineal: -5 },
    13: { heart: 10, throat: 10, pineal: 5 }
  };

  return modifiers[toneId]?.[center] || 0;
}

function getEnergyLevel(score: number): string {
  if (score >= 90) return '超频';
  if (score >= 75) return '强劲';
  if (score >= 60) return '平衡';
  if (score >= 45) return '温和';
  return '内敛';
}

function generateCenterDescription(
  score: number,
  centerName: string,
  keyword: string,
  toneName: string
): string {
  const level = getEnergyLevel(score);
  return `${centerName}呈现${level}状态（${score}%），${keyword}的能量在${toneName}调性中以${level}方式运作`;
}

function determineResonanceType(totemId: number, toneId: number): string {
  if (toneId === 7) return '完美共振';
  if (toneId === 13) return '超频共振';
  if (toneId === 1) return '磁性共振';
  if (totemId % 4 === 0) return '和谐共振';
  if (totemId % 3 === 0) return '创造共振';
  return '流动共振';
}

function generateCompatibility(totemId: number, toneId: number): string[] {
  const compatList: string[] = [];

  const harmonyTotem = ((totemId + 9) % 20) + 1;
  compatList.push(`与图腾${harmonyTotem}形成和谐对位`);

  const harmonyTone = ((toneId + 6) % 13) + 1;
  compatList.push(`与调性${harmonyTone}产生能量互补`);

  if (toneId === 7 || toneId === 13) {
    compatList.push('具有普遍兼容性，能与大部分频率共振');
  }

  return compatList;
}

function generate2026Advice(totem: any, tone: any): Year2026Advice {
  return {
    focus: `2026年，${totem.name_cn}的${tone.name_cn}能量要求你聚焦于：${totem.core_keyword}`,
    action: tone.life_strategy || `以${tone.name_cn}的方式行动`,
    avoid: tone.challenge || `避免${tone.name_cn}能量的失衡`,
    opportunity: `${totem.operation_mode}将在今年开启新的可能性`,
    timing: `${tone.name_cn}周期是你的最佳行动窗口`
  };
}

function generateFallbackEnergyCenters(kin: number): EnergyCenterScore[] {
  const tone = extractTone(kin);
  const baseScore = 50 + (tone * 2);

  return [
    {
      center: 'heart',
      name: '心轮能量',
      score: baseScore,
      description: '基础能量状态',
      reasoning: '使用默认计算方式'
    },
    {
      center: 'throat',
      name: '喉轮能量',
      score: baseScore + 5,
      description: '基础能量状态',
      reasoning: '使用默认计算方式'
    },
    {
      center: 'pineal',
      name: '松果体能量',
      score: baseScore - 5,
      description: '基础能量状态',
      reasoning: '使用默认计算方式'
    }
  ];
}
