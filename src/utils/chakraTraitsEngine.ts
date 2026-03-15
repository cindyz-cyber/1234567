/**
 * 脉轮特质和弱点动态生成引擎
 * Chakra Traits & Weaknesses Dynamic Generation Engine
 *
 * 核心原则：
 * 1. 根据脉轮分数动态匹配模板
 * 2. 消除所有硬编码文本
 * 3. 基于数据库驱动的个性化描述
 */

import { supabase } from '../lib/supabase';

interface ChakraTraitTemplate {
  chakra_name: string;
  score_range: 'high' | 'medium' | 'low';
  min_score: number;
  max_score: number;
  trait_template: string;
}

interface ChakraWeaknessTemplate {
  chakra_name: string;
  score_range: 'high' | 'medium' | 'low';
  min_score: number;
  max_score: number;
  weakness_template: string;
}

/**
 * 根据脉轮名称和分数获取动态特质
 */
export async function generateChakraTrait(
  chakraName: string,
  percentage: number
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('chakra_traits_templates')
      .select('*')
      .eq('chakra_name', chakraName)
      .lte('min_score', percentage)
      .gte('max_score', percentage)
      .maybeSingle();

    if (error) {
      console.error(`Failed to fetch trait for ${chakraName}:`, error);
      return getFallbackTrait(chakraName, percentage);
    }

    if (!data) {
      console.warn(`No trait template found for ${chakraName} at ${percentage}%`);
      return getFallbackTrait(chakraName, percentage);
    }

    return data.trait_template;
  } catch (error) {
    console.error('Error in generateChakraTrait:', error);
    return getFallbackTrait(chakraName, percentage);
  }
}

/**
 * 根据脉轮名称和分数获取动态弱点
 */
export async function generateChakraWeakness(
  chakraName: string,
  percentage: number
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('chakra_weaknesses_templates')
      .select('*')
      .eq('chakra_name', chakraName)
      .lte('min_score', percentage)
      .gte('max_score', percentage)
      .maybeSingle();

    if (error) {
      console.error(`Failed to fetch weakness for ${chakraName}:`, error);
      return getFallbackWeakness(chakraName, percentage);
    }

    if (!data) {
      console.warn(`No weakness template found for ${chakraName} at ${percentage}%`);
      return getFallbackWeakness(chakraName, percentage);
    }

    return data.weakness_template;
  } catch (error) {
    console.error('Error in generateChakraWeakness:', error);
    return getFallbackWeakness(chakraName, percentage);
  }
}

/**
 * 批量生成所有脉轮的特质和弱点
 */
export async function generateAllChakraTraitsAndWeaknesses(
  centers: Array<{ name: string; percentage: number }>
): Promise<Array<{ name: string; traits: string; weaknesses: string }>> {
  const results = await Promise.all(
    centers.map(async (center) => {
      const [traits, weaknesses] = await Promise.all([
        generateChakraTrait(center.name, center.percentage),
        generateChakraWeakness(center.name, center.percentage)
      ]);

      return {
        name: center.name,
        traits,
        weaknesses
      };
    })
  );

  return results;
}

/**
 * 降级方案：如果数据库查询失败，返回基础描述
 */
function getFallbackTrait(chakraName: string, percentage: number): string {
  const range = percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low';

  const fallbacks: Record<string, Record<string, string>> = {
    '喉轮': {
      high: '你的喉轮能量强大，天生擅长表达和沟通。',
      medium: '你的喉轮处于平衡状态，能够有效表达自己的想法。',
      low: '你的喉轮正在觉醒，学习释放真实的声音。'
    },
    '心轮': {
      high: '你的心轮开放，拥有强烈的同理心和爱的能力。',
      medium: '你的心轮平衡，能够在给予与接收之间流动。',
      low: '你的心轮正在学习信任和开放。'
    },
    '松果体': {
      high: '你的松果体活跃，直觉敏锐，洞察力强。',
      medium: '你的松果体平衡，理性与直觉和谐共存。',
      low: '你的松果体正在觉醒，学习信任内在智慧。'
    }
  };

  return fallbacks[chakraName]?.[range] || `${chakraName}能量特质正在发展中。`;
}

function getFallbackWeakness(chakraName: string, percentage: number): string {
  const range = percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low';

  const fallbacks: Record<string, Record<string, string>> = {
    '喉轮': {
      high: '需要注意避免过度表达，学会倾听与沉默。',
      medium: '需要觉察表达与静默的平衡点。',
      low: '需要勇敢练习发声，释放压抑的表达。'
    },
    '心轮': {
      high: '需要注意边界感，避免过度承担他人情绪。',
      medium: '需要觉察给予与接收的平衡。',
      low: '需要温柔地拆除心墙，允许脆弱存在。'
    },
    '松果体': {
      high: '需要避免过度分析，学会信任直觉。',
      medium: '需要在理性与直觉之间灵活切换。',
      low: '需要练习倾听内在智慧，减少对外在证据的依赖。'
    }
  };

  return fallbacks[chakraName]?.[range] || `需要平衡${chakraName}的使用。`;
}
