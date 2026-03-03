/**
 * 多维语感叙事引擎
 * Multi-Dimensional Narrative Engine
 *
 * 功能：
 * 1. 根据能量中心分值自动选择对应的叙事梯度（高/中/低）
 * 2. 融入调性的动态动词（冷/暖色调）
 * 3. 注入量子共振爆发短句
 * 4. 添加2026白风年环境音意象（喉轮专属）
 */

import { supabase } from '../lib/supabase';

export interface NarrativeTemplate {
  centerName: string;
  tier: 'high' | 'medium' | 'low';
  keywords: string[];
  templates: string[];
}

export interface ToneDynamics {
  toneNumber: number;
  colorTemperature: 'cold' | 'warm';
  verbs: string[];
  adjectives: string[];
}

export interface QuantumBurst {
  synergyCode: number;
  relationshipType: string;
  burstTemplates: string[];
}

export interface WindYearAmbient {
  context: string;
  imagery: string[];
}

/**
 * 根据分值判断梯度
 * > 85% = high (全频开启)
 * 60-84% = medium (定频稳健)
 * < 60% = low (清冷保护)
 */
export function getTierByPercentage(percentage: number): 'high' | 'medium' | 'low' {
  if (percentage > 85) return 'high';
  if (percentage >= 60) return 'medium';
  return 'low';
}

/**
 * 获取脉轮叙事模板
 */
export async function fetchNarrativeTemplate(
  centerName: string,
  tier: 'high' | 'medium' | 'low'
): Promise<NarrativeTemplate | null> {
  const { data, error } = await supabase
    .from('chakra_narrative_templates')
    .select('*')
    .eq('center_name', centerName)
    .eq('tier', tier)
    .maybeSingle();

  if (error || !data) {
    console.error(`Failed to fetch narrative template for ${centerName} (${tier}):`, error);
    return null;
  }

  return {
    centerName: data.center_name,
    tier: data.tier,
    keywords: data.keywords,
    templates: data.templates
  };
}

/**
 * 获取调性动态动词
 */
export async function fetchToneDynamics(toneNumber: number): Promise<ToneDynamics | null> {
  const { data, error } = await supabase
    .from('tone_dynamics')
    .select('*')
    .eq('tone_number', toneNumber)
    .maybeSingle();

  if (error || !data) {
    console.error(`Failed to fetch tone dynamics for tone ${toneNumber}:`, error);
    return null;
  }

  return {
    toneNumber: data.tone_number,
    colorTemperature: data.color_temperature,
    verbs: data.verbs,
    adjectives: data.adjectives
  };
}

/**
 * 获取量子共振爆发短句
 */
export async function fetchQuantumBurst(synergyCode: number): Promise<QuantumBurst | null> {
  const { data, error } = await supabase
    .from('quantum_synergy_bursts')
    .select('*')
    .eq('synergy_code', synergyCode)
    .maybeSingle();

  if (error || !data) {
    console.error(`Failed to fetch quantum burst for code ${synergyCode}:`, error);
    return null;
  }

  return {
    synergyCode: data.synergy_code,
    relationshipType: data.relationship_type,
    burstTemplates: data.burst_templates
  };
}

/**
 * 获取白风年环境音意象
 */
export async function fetchWindYearAmbient(context: string = '喉轮专属'): Promise<WindYearAmbient | null> {
  const { data, error } = await supabase
    .from('wind_year_ambient')
    .select('*')
    .eq('context', context)
    .maybeSingle();

  if (error || !data) {
    console.error(`Failed to fetch wind year ambient for context ${context}:`, error);
    return null;
  }

  return {
    context: data.context,
    imagery: data.imagery
  };
}

/**
 * 渲染脉轮叙事
 * 核心函数：将分值转化为文学化的梯度描述
 */
export async function renderChakraNarrative(
  centerName: string,
  percentage: number,
  toneNumber?: number
): Promise<string> {
  // 1. 判断梯度
  const tier = getTierByPercentage(percentage);

  // 2. 获取叙事模板
  const template = await fetchNarrativeTemplate(centerName, tier);
  if (!template || template.templates.length === 0) {
    return `${centerName} ${percentage}%`;
  }

  // 3. 随机选择一个模板（避免重复）
  const selectedTemplate = template.templates[Math.floor(Math.random() * template.templates.length)];

  // 4. 替换变量
  let narrative = selectedTemplate.replace(/{percentage}/g, percentage.toString());

  // 5. 如果提供了调性，融入动态动词
  if (toneNumber) {
    const toneDynamics = await fetchToneDynamics(toneNumber);
    if (toneDynamics && toneDynamics.adjectives.length > 0) {
      const randomAdj = toneDynamics.adjectives[Math.floor(Math.random() * toneDynamics.adjectives.length)];
      narrative = `${narrative} [调性${toneNumber}：${randomAdj}能量场]`;
    }
  }

  // 6. 如果是喉轮，添加白风年环境音（20%概率）
  if (centerName === '喉轮' && Math.random() < 0.2) {
    const ambient = await fetchWindYearAmbient('喉轮专属');
    if (ambient && ambient.imagery.length > 0) {
      const randomImagery = ambient.imagery[Math.floor(Math.random() * ambient.imagery.length)];
      narrative += `\n\n🌬️ ${randomImagery}`;
    }
  }

  return narrative;
}

/**
 * 批量渲染多个能量中心
 */
export async function renderMultipleChakraNarratives(
  centers: Array<{ name: string; percentage: number }>,
  toneNumber?: number
): Promise<Array<{ name: string; percentage: number; narrative: string }>> {
  const results = [];

  for (const center of centers) {
    const narrative = await renderChakraNarrative(center.name, center.percentage, toneNumber);
    results.push({
      name: center.name,
      percentage: center.percentage,
      narrative
    });
  }

  return results;
}

/**
 * 渲染量子共振爆发短句
 * 用于关系分析中增强文学性
 */
export async function renderQuantumSynergyBurst(synergyCode: number): Promise<string> {
  const burst = await fetchQuantumBurst(synergyCode);
  if (!burst || burst.burstTemplates.length === 0) {
    return '';
  }

  // 随机选择一个爆发短句
  const selectedBurst = burst.burstTemplates[Math.floor(Math.random() * burst.burstTemplates.length)];
  return selectedBurst;
}

/**
 * 增强版关系描述
 * 整合共振代码 + 爆发短句
 */
export async function renderEnhancedRelationship(
  relationshipType: string,
  synergyCode?: number
): Promise<string> {
  let description = `关系类型：${relationshipType}`;

  if (synergyCode) {
    const burst = await renderQuantumSynergyBurst(synergyCode);
    if (burst) {
      description += `\n\n${burst}`;
    }
  }

  return description;
}

/**
 * 根据调性色温添加语气修饰
 */
export function getToneModifier(toneNumber: number, colorTemp: 'cold' | 'warm'): string {
  const coldModifiers = ['收敛', '锚定', '定义', '律动', '稳固', '精准'];
  const warmModifiers = ['放射', '扩容', '显化', '超越', '激活', '升华'];

  const modifiers = colorTemp === 'cold' ? coldModifiers : warmModifiers;
  return modifiers[Math.floor(Math.random() * modifiers.length)];
}

/**
 * 综合渲染：脉轮 + 调性 + 环境音
 * 这是最完整的叙事生成函数
 */
export async function renderComprehensiveChakraNarrative(
  centerName: string,
  percentage: number,
  toneNumber: number,
  includeWindYear: boolean = true
): Promise<{
  narrative: string;
  tier: string;
  keywords: string[];
  toneModifier?: string;
  windYearImagery?: string;
}> {
  const tier = getTierByPercentage(percentage);
  const template = await fetchNarrativeTemplate(centerName, tier);

  if (!template) {
    return {
      narrative: `${centerName} ${percentage}%`,
      tier,
      keywords: []
    };
  }

  // 选择模板
  const selectedTemplate = template.templates[Math.floor(Math.random() * template.templates.length)];
  let narrative = selectedTemplate.replace(/{percentage}/g, percentage.toString());

  // 获取调性动词
  const toneDynamics = await fetchToneDynamics(toneNumber);
  let toneModifier: string | undefined;

  if (toneDynamics) {
    toneModifier = getToneModifier(toneNumber, toneDynamics.colorTemperature);
    const randomVerb = toneDynamics.verbs[Math.floor(Math.random() * toneDynamics.verbs.length)];
    narrative = `${narrative} [调性${toneNumber}·${toneModifier}·${randomVerb}模式]`;
  }

  // 白风年环境音（仅喉轮）
  let windYearImagery: string | undefined;
  if (centerName === '喉轮' && includeWindYear && Math.random() < 0.3) {
    const ambient = await fetchWindYearAmbient('喉轮专属');
    if (ambient && ambient.imagery.length > 0) {
      windYearImagery = ambient.imagery[Math.floor(Math.random() * ambient.imagery.length)];
      narrative += `\n\n🌬️ ${windYearImagery}`;
    }
  }

  return {
    narrative,
    tier,
    keywords: template.keywords,
    toneModifier,
    windYearImagery
  };
}
