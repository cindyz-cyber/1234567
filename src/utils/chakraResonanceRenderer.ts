/**
 * 脉轮共振感应渲染器
 * 根据能量中心的分值高低，渲染出对应的感应描述
 */

import { supabase } from '../lib/supabase';

export interface ChakraResonanceDescription {
  totemId: number;
  totemName: string;
  colorFamily: string;
  highScoreDescription: string;
  lowScoreDescription: string;
}

/**
 * 从数据库获取脉轮共振描述
 */
export async function fetchChakraResonanceDescriptions(): Promise<ChakraResonanceDescription[]> {
  const { data, error } = await supabase
    .from('chakra_resonance_descriptions')
    .select('*')
    .order('totem_id');

  if (error) {
    console.error('Failed to fetch chakra resonance descriptions:', error);
    return [];
  }

  return (data || []).map(row => ({
    totemId: row.totem_id,
    totemName: row.totem_name_cn,
    colorFamily: row.color_family,
    highScoreDescription: row.high_score_description,
    lowScoreDescription: row.low_score_description
  }));
}

/**
 * 根据 Kin 和分值渲染感应描述
 * @param kin - Kin 数字 (1-260)
 * @param percentage - 能量中心分值 (0-100)
 * @param centerName - 能量中心名称（用于生成完整描述）
 * @returns 感应描述文本
 */
export async function renderChakraResonance(
  kin: number,
  percentage: number,
  centerName: string
): Promise<string> {
  // 计算图腾ID
  const totemId = ((kin - 1) % 20) + 1;

  // 获取描述
  const { data, error } = await supabase
    .from('chakra_resonance_descriptions')
    .select('*')
    .eq('totem_id', totemId)
    .maybeSingle();

  if (error || !data) {
    console.error(`Failed to fetch description for totem ${totemId}:`, error);
    return `${centerName}能量 ${percentage}%`;
  }

  // 判断高分/低分阈值（>=70为高分，<70为低分）
  const isHighScore = percentage >= 70;

  const description = isHighScore
    ? data.high_score_description
    : data.low_score_description;

  return `${centerName} ${percentage}% - ${description}`;
}

/**
 * 批量渲染多个能量中心的感应描述
 */
export async function renderMultipleChakraResonances(
  kin: number,
  centers: Array<{ name: string; percentage: number }>
): Promise<Array<{ name: string; percentage: number; resonanceDescription: string }>> {
  const results = [];

  for (const center of centers) {
    const resonanceDescription = await renderChakraResonance(kin, center.percentage, center.name);
    results.push({
      name: center.name,
      percentage: center.percentage,
      resonanceDescription
    });
  }

  return results;
}

/**
 * 获取图腾的核心特质（高分模式）
 */
export async function getTotemCoreEssence(kin: number): Promise<string> {
  const totemId = ((kin - 1) % 20) + 1;

  const { data, error } = await supabase
    .from('chakra_resonance_descriptions')
    .select('high_score_description, totem_name_cn')
    .eq('totem_id', totemId)
    .maybeSingle();

  if (error || !data) {
    return '未知图腾特质';
  }

  return `${data.totem_name_cn}的核心特质：${data.high_score_description}`;
}
