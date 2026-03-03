/**
 * 2026 白风年频率对齐算法
 * Yearly Advice 2026 - Frequency Alignment Engine
 *
 * 核心原则：
 * 1. 废除通用文案，禁止显示"2026年是白风年，适合沟通"
 * 2. 基于喉轮分值动态合成建议
 * 3. 引入调性修正逻辑
 * 4. 精准图腾特定避坑与显化路径
 */

import { supabase } from '../lib/supabase';

interface TotemAdvice {
  totem_id: number;
  totem_name_cn: string;
  core_challenge: string;
  manifestation_path: string;
  action_verb: string;
  frequency_type: string;
}

interface ThroatTemplate {
  throat_range: 'high' | 'medium' | 'low';
  min_percentage: number;
  max_percentage: number;
  archetype: string;
  advice_template: string;
  action_template: string;
  prefix_modifier: string;
}

interface ToneModifier {
  tone_id: number;
  tone_name_cn: string;
  tone_type: string;
  yearly_lesson: string;
}

export interface YearlyAdvice2026 {
  year: number;
  theme: string;
  archetype: string;
  mainAdvice: string;
  actionStep: string;
  totemSpecific: string;
  toneModifier: string;
  synthesizedGuidance: string;
}

/**
 * 根据喉轮分值获取对应的模板
 */
async function getThroatTemplate(throatPercentage: number): Promise<ThroatTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('yearly_advice_2026_throat_templates')
      .select('*')
      .lte('min_percentage', throatPercentage)
      .gte('max_percentage', throatPercentage)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch throat template:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getThroatTemplate:', error);
    return null;
  }
}

/**
 * 获取图腾特定建议
 */
async function getTotemAdvice(totemId: number): Promise<TotemAdvice | null> {
  try {
    const { data, error } = await supabase
      .from('yearly_advice_2026_totems')
      .select('*')
      .eq('totem_id', totemId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch totem advice:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getTotemAdvice:', error);
    return null;
  }
}

/**
 * 获取调性修正逻辑
 */
async function getToneModifier(toneId: number): Promise<ToneModifier | null> {
  try {
    const { data, error } = await supabase
      .from('yearly_advice_2026_tone_modifiers')
      .select('*')
      .eq('tone_id', toneId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch tone modifier:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getToneModifier:', error);
    return null;
  }
}

/**
 * 生成 2026 白风年频率对齐建议
 *
 * @param kin - Kin 号码（用于提取图腾和调性）
 * @param throatPercentage - 喉轮分值百分比
 * @returns 完整的年度建议对象
 */
export async function generate2026Advice(
  kin: number,
  throatPercentage: number
): Promise<YearlyAdvice2026> {
  // 提取图腾和调性
  const totemId = ((kin - 1) % 20) + 1;
  const toneId = ((kin - 1) % 13) + 1;

  // 并行获取所有数据
  const [throatTemplate, totemAdvice, toneModifier] = await Promise.all([
    getThroatTemplate(throatPercentage),
    getTotemAdvice(totemId),
    getToneModifier(toneId)
  ]);

  // 如果数据缺失，返回降级建议
  if (!throatTemplate || !totemAdvice || !toneModifier) {
    console.warn('Missing data for 2026 advice generation, using fallback');
    return {
      year: 2026,
      theme: '白风年',
      archetype: '频率对齐',
      mainAdvice: '2026 年是白风年，核心频率是灵性沟通与呼吸。专注于将内在的真实通过声音传递出来。',
      actionStep: '在每一次发声前，先进行三次深呼吸，对齐心轮的频率。',
      totemSpecific: '跟随你的图腾本质，在这一年找到你独特的表达方式。',
      toneModifier: '根据你的调性节奏，找到最适合你的沟通频率。',
      synthesizedGuidance: '2026 年白风年，让呼吸成为你的语言，让沉默成为你的力量。'
    };
  }

  // 动态合成建议
  const synthesizedGuidance = synthesizeGuidance(
    throatTemplate,
    totemAdvice,
    toneModifier,
    throatPercentage
  );

  return {
    year: 2026,
    theme: '白风年',
    archetype: throatTemplate.archetype,
    mainAdvice: throatTemplate.advice_template,
    actionStep: throatTemplate.action_template,
    totemSpecific: totemAdvice.manifestation_path,
    toneModifier: toneModifier.yearly_lesson,
    synthesizedGuidance
  };
}

/**
 * 动态合成最终建议
 * 根据喉轮分值、图腾特质、调性类型进行智能组合
 */
function synthesizeGuidance(
  throatTemplate: ThroatTemplate,
  totemAdvice: TotemAdvice,
  toneModifier: ToneModifier,
  throatPercentage: number
): string {
  let guidance = '';

  // 1. 喉轮前缀修饰
  guidance += `${throatTemplate.prefix_modifier}。`;

  // 2. 图腾核心挑战
  guidance += `作为${totemAdvice.totem_name_cn}，${totemAdvice.core_challenge}。`;

  // 3. 调性修正逻辑
  if (toneModifier.tone_type === '收敛型') {
    guidance += `你的${toneModifier.tone_name_cn}调性提醒你：${toneModifier.yearly_lesson}。`;
  } else if (toneModifier.tone_type === '放射型') {
    guidance += `你的${toneModifier.tone_name_cn}调性赋予你任务：${toneModifier.yearly_lesson}。`;
  } else {
    guidance += `你的${toneModifier.tone_name_cn}调性引导你：${toneModifier.yearly_lesson}。`;
  }

  // 4. 行动动词强化
  guidance += `2026 年，请记住这个动词："${totemAdvice.action_verb}"。`;

  // 5. 喉轮分值特定提醒
  if (throatPercentage > 80) {
    guidance += '你的高喉轮需要学会在沉默中蓄能，而非在每个瞬间释放。';
  } else if (throatPercentage < 60) {
    guidance += '你的低喉轮正在等待白风的唤醒，勇敢地让声音成为你的翅膀。';
  } else {
    guidance += '你的喉轮处于黄金平衡点，这一年是你精准表达的最佳时机。';
  }

  return guidance;
}

/**
 * 获取图腾名称（用于 UI 显示）
 */
export async function getTotemName(totemId: number): Promise<string> {
  const advice = await getTotemAdvice(totemId);
  return advice?.totem_name_cn || `图腾 ${totemId}`;
}

/**
 * 获取调性名称（用于 UI 显示）
 */
export async function getToneName(toneId: number): Promise<string> {
  const modifier = await getToneModifier(toneId);
  return modifier?.tone_name_cn || `调性 ${toneId}`;
}
