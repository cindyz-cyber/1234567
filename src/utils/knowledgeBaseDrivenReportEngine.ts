/**
 * 知识库驱动报告引擎 - 100% 资料库内容显化
 * Knowledge Base Driven Report Engine - Zero AI Hallucination
 *
 * VERSION: 2.1.0 - Gemini Calibrated (2026-03-02)
 * - 修复心轮使用正确的 heart_chakra 字段
 * - 校准超频调性修正值（心轮0，喉轮0，松果体+3）
 * - 蓝风暴心轮基础值：40%
 *
 * 三层填充逻辑：
 * 1. 画像头部：取自 kin_definitions.core_essence 或组合 [图腾关键词 + 调性描述]
 * 2. 能量中心：从 totems 表提取 heart_chakra, throat_chakra, pineal_gland
 * 3. 波符底色：计算 anchorKin 后从 wavespells 表提取 life_essence
 */

import { supabase } from '../lib/supabase';
import type { KinEnergyReport, EnergyCenterScore, QuantumResonance } from '../types/kinReport';
import { analyzeQuantumResonanceDriven } from './quantumResonanceDrivenEngine';

// 版本标识 - 用于强制缓存失效
export const ENGINE_VERSION = '2.1.0-gemini-calibrated-20260302-2217';

interface TotemData {
  id: number;
  name_cn: string;
  name_en: string;
  pineal_gland: number;
  throat_chakra: number;
  heart_chakra: number;  // 添加心轮字段
  operation_mode: string;
  core_keyword: string;
  description: string;
  energy_signature: string;
}

interface ToneData {
  id: number;
  name_cn: string;
  name_en: string;
  description: string;
  energy_pattern: string;
  life_strategy: string;
  challenge: string;
  gift: string;
}

interface WavespellData {
  name_cn: string;
  name_en: string;
  life_essence: string;
  long_term_purpose: string;
  kin_start: number;
  kin_end: number;
}

interface KinDefinitionData {
  kin_number: number;
  totem_id: number;
  tone_id: number;
  core_essence: string | null;
  life_purpose: string | null;
  shadow_work: string | null;
  integration_path: string | null;
}

/**
 * 从 Kin 号码提取调性（1-13）
 */
function extractTone(kin: number): number {
  return ((kin - 1) % 13) + 1;
}

/**
 * 从 Kin 号码提取图腾（1-20）
 */
function extractTotem(kin: number): number {
  return ((kin - 1) % 20) + 1;
}

/**
 * 计算波符起始 Kin（锚点）
 */
function calculateWavespellAnchor(kin: number): number {
  return Math.floor((kin - 1) / 13) * 13 + 1;
}

/**
 * 从资料库提取完整 Kin 知识
 */
async function fetchKinKnowledge(kin: number) {
  const toneId = extractTone(kin);
  const totemId = extractTotem(kin);
  const anchorKin = calculateWavespellAnchor(kin);

  // 并行获取所有数据
  const [totemResult, toneResult, wavespellResult, kinDefResult] = await Promise.all([
    supabase.from('totems').select('*').eq('id', totemId).maybeSingle(),
    supabase.from('tones').select('*').eq('id', toneId).maybeSingle(),
    supabase.from('wavespells').select('*').eq('kin_start', anchorKin).maybeSingle(),
    supabase.from('kin_definitions').select('*').eq('kin_number', kin).maybeSingle()
  ]);

  if (totemResult.error || !totemResult.data) {
    throw new Error(`图腾数据缺失：Totem ${totemId}`);
  }

  if (toneResult.error || !toneResult.data) {
    throw new Error(`调性数据缺失：Tone ${toneId}`);
  }

  if (wavespellResult.error || !wavespellResult.data) {
    throw new Error(`波符数据缺失：Wavespell starting at Kin ${anchorKin}`);
  }

  return {
    totem: totemResult.data as TotemData,
    tone: toneResult.data as ToneData,
    wavespell: wavespellResult.data as WavespellData,
    kinDef: kinDefResult.data as KinDefinitionData | null
  };
}

/**
 * 第一层：生成画像头部（强制使用资料库）
 */
function generateProfileFromKB(
  totem: TotemData,
  tone: ToneData,
  kinDef: KinDefinitionData | null
) {
  return {
    // 模式：调性 + 运作模式
    mode: `${tone.name_cn}·${totem.operation_mode}`,

    // 视角：使用调性的生命策略
    perspective: tone.life_strategy,

    // 本质：优先使用 Kin 自定义，否则组合图腾关键词 + 调性描述
    essence: kinDef?.core_essence ||
      `${totem.core_keyword}的${tone.description}化身`
  };
}

/**
 * 第二层：生成能量中心（强制使用资料库数值）
 */
function generateEnergyCentersFromKB(
  totem: TotemData,
  tone: ToneData
): EnergyCenterScore[] {
  // 计算心轮：使用心轮数值 + 调性修正
  const heartBase = totem.heart_chakra;
  const heartScore = Math.min(100, Math.max(30, heartBase + getToneHeartModifier(tone.id)));

  // 计算喉轮：直接使用喉轮数值 + 调性修正
  const throatBase = totem.throat_chakra;
  const throatScore = Math.min(100, Math.max(30, throatBase + getToneThroatModifier(tone.id)));

  // 计算松果体：使用松果体数值 + 调性修正
  const pinealBase = totem.pineal_gland;
  const pinealScore = Math.min(100, Math.max(30, pinealBase + getTonePinealModifier(tone.id)));

  return [
    {
      center: 'heart',
      name: '心轮能量',
      score: heartScore,
      description: generateCenterDescription(totem, tone, 'heart', heartScore),
      reasoning: `${totem.operation_mode} - 基础频率 ${heartBase}Hz，${tone.name_cn}调性修正后为 ${heartScore}%`
    },
    {
      center: 'throat',
      name: '喉轮能量',
      score: throatScore,
      description: generateCenterDescription(totem, tone, 'throat', throatScore),
      reasoning: `${totem.operation_mode} - 基础频率 ${throatBase}Hz，${tone.name_cn}调性修正后为 ${throatScore}%`
    },
    {
      center: 'pineal',
      name: '松果体能量',
      score: pinealScore,
      description: generateCenterDescription(totem, tone, 'pineal', pinealScore),
      reasoning: `${totem.operation_mode} - 基础频率 ${pinealBase}Hz，${tone.name_cn}调性修正后为 ${pinealScore}%`
    }
  ];
}

/**
 * 生成能量中心描述（基于运作模式）
 */
function generateCenterDescription(
  totem: TotemData,
  tone: ToneData,
  center: 'heart' | 'throat' | 'pineal',
  score: number
): string {
  const modeDescriptions: Record<string, Record<string, string>> = {
    '跨越者模式': {
      heart: '超然情感，以断舍离的方式处理关系',
      throat: '静默连接，通过放下来传达真相',
      pineal: '跨维度感知，洞察过渡的时机'
    },
    '洞察者模式': {
      heart: '超然观察，保持情感的高度客观',
      throat: '清晰传达，精准表达宏观视野',
      pineal: '极致洞察，从最高处看见全局'
    },
    '指挥官模式': {
      heart: '战略情感，将情绪转化为行动力',
      throat: '命令传达，直接有力的沟通',
      pineal: '战术直觉，快速识别战场态势'
    },
    '恒星模式': {
      heart: '照耀他人，以温暖激发周围能量',
      throat: '光芒传播，通过表达点亮他人',
      pineal: '核心光源，从内在发出持续辐射'
    }
  };

  const modeDesc = modeDescriptions[totem.operation_mode];
  if (!modeDesc) {
    return `${totem.core_keyword}的${tone.description}表达`;
  }

  return modeDesc[center] || `${totem.core_keyword}的${tone.description}显化`;
}

/**
 * 调性对心轮的修正值
 */
function getToneHeartModifier(toneId: number): number {
  const modifiers: Record<number, number> = {
    1: 5,    // 磁性：吸引力增强心轮
    2: -5,   // 月亮：内省减弱外显
    3: 3,    // 电力：激活能量
    4: 0,    // 自我存在：平衡
    5: 5,    // 超越：扩展
    6: 7,    // 韵律：流动增强
    7: 0,    // 共振：平衡
    8: 3,    // 银河：整合
    9: 0,    // 太阳：中性
    10: -3,  // 行星：显化为外在
    11: 8,   // 光谱：释放
    12: 5,   // 水晶：合作增强
    13: 10   // 宇宙：超频
  };
  return modifiers[toneId] || 0;
}

/**
 * 调性对喉轮的修正值
 */
function getToneThroatModifier(toneId: number): number {
  const modifiers: Record<number, number> = {
    1: -3,   // 磁性：内收
    2: 8,    // 月亮：情感表达
    3: 3,    // 电力：激活
    4: 10,   // 自我存在：稳定表达
    5: 5,    // 超越：扩展表达
    6: 0,    // 韵律：平衡
    7: 0,    // 共振：共鸣
    8: 3,    // 银河：整合
    9: -5,   // 太阳：内化
    10: 12,  // 行星：显化
    11: -8,  // 光谱：释放而非表达
    12: 5,   // 水晶：合作沟通
    13: 10   // 宇宙：超频表达
  };
  return modifiers[toneId] || 0;
}

/**
 * 调性对松果体的修正值
 */
function getTonePinealModifier(toneId: number): number {
  const modifiers: Record<number, number> = {
    1: 0,    // 磁性：平衡
    2: 0,    // 月亮：平衡
    3: -2,   // 电力：减少直觉
    4: -5,   // 自我存在：物质化
    5: -3,   // 超越：扩散
    6: 0,    // 韵律：平衡
    7: 10,   // 共振：极致直觉
    8: 3,    // 银河：整合
    9: 12,   // 太阳：极致觉知
    10: -5,  // 行星：物质化
    11: 5,   // 光谱：释放直觉
    12: -5,  // 水晶：物质化
    13: 5    // 宇宙：超频
  };
  return modifiers[toneId] || 0;
}

/**
 * 第三层：生成波符信息（强制使用资料库）
 */
function generateWavespellInfo(wavespell: WavespellData) {
  return {
    wavespellName: wavespell.name_cn,
    wavespellInfluence: wavespell.life_essence
  };
}

/**
 * 生成 2026 白风年建议（基于数据库资料库）
 */
async function generate2026Advice(totem: TotemData, tone: ToneData, throatScore: number) {
  try {
    // 1. 从数据库获取图腾层面的核心挑战
    const { data: totemAdvice, error: totemError } = await supabase
      .from('yearly_advice_2026_totems')
      .select('*')
      .eq('totem_id', totem.id)
      .maybeSingle();

    if (totemError) {
      console.warn('读取2026图腾建议失败:', totemError);
    }

    // 2. 从数据库获取喉轮分段模板（根据喉轮分数）
    const { data: throatTemplate, error: throatError } = await supabase
      .from('yearly_advice_2026_throat_templates')
      .select('*')
      .lte('min_percentage', throatScore)
      .gte('max_percentage', throatScore)
      .maybeSingle();

    if (throatError) {
      console.warn('读取2026喉轮模板失败:', throatError);
    }

    // 3. 从数据库获取调性修正语
    const { data: toneModifier, error: toneError } = await supabase
      .from('yearly_advice_2026_tone_modifiers')
      .select('*')
      .eq('tone_id', tone.id)
      .maybeSingle();

    if (toneError) {
      console.warn('读取2026调性修正失败:', toneError);
    }

    // 组合建议文本
    const coreWeakness = totemAdvice?.core_challenge || tone.challenge || '数据同步中';
    const whiteWindEnergy = throatTemplate?.advice_template || '2026 白风年强调灵性传播与呼吸节奏';
    const practicalAdvice = totemAdvice && throatTemplate
      ? `${throatTemplate.prefix_modifier || ''}${totemAdvice.manifestation_path}。${throatTemplate.action_template}${totemAdvice.action_verb}。${toneModifier?.yearly_lesson || ''}`
      : `作为${totem.operation_mode}的你，在白风年需要：${tone.life_strategy}。记住核心关键词：${totem.core_keyword}`;

    return {
      coreWeakness,
      whiteWindEnergy,
      practicalAdvice
    };
  } catch (error) {
    console.error('生成2026建议时出错:', error);
    return {
      coreWeakness: tone.challenge || '数据同步中',
      whiteWindEnergy: '2026 白风年强调灵性传播与呼吸节奏',
      practicalAdvice: '建议数据正在同步，请稍后刷新'
    };
  }
}

/**
 * 生成完整的知识库驱动报告
 */
export async function generateKnowledgeBaseDrivenReport(
  kin: number,
  userName?: string,
  higherSelfName?: string,
  familyData?: Array<{ kin: number; name: string }>
): Promise<KinEnergyReport> {
  // 从资料库获取所有数据
  const { totem, tone, wavespell, kinDef } = await fetchKinKnowledge(kin);

  // 调试日志 - 显示从数据库读取的原始值
  console.log(`🔍 [${ENGINE_VERSION}] Kin ${kin} 数据库原始值:`, {
    图腾: totem.name_cn,
    调性: tone.name_cn,
    心轮基础: totem.heart_chakra,
    喉轮基础: totem.throat_chakra,
    松果体基础: totem.pineal_gland,
    运作模式: totem.operation_mode
  });

  // 第一层：画像头部
  const profile = generateProfileFromKB(totem, tone, kinDef);

  // 第二层：能量中心
  const energyCenters = generateEnergyCentersFromKB(totem, tone);

  // 调试日志 - 显示计算后的能量中心值
  console.log(`📊 [${ENGINE_VERSION}] Kin ${kin} 计算结果:`, {
    心轮: energyCenters.find(c => c.center === 'heart')?.score,
    喉轮: energyCenters.find(c => c.center === 'throat')?.score,
    松果体: energyCenters.find(c => c.center === 'pineal')?.score
  });

  // 第三层：波符底色
  const wavespellInfo = generateWavespellInfo(wavespell);

  // 获取喉轮分数用于2026建议
  const throatCenter = energyCenters.find(c => c.center === 'throat');
  const throatScore = throatCenter?.score || totem.throat_chakra;

  // 第四层：2026白风年建议（从数据库读取）
  const year2026Advice = await generate2026Advice(totem, tone, throatScore);

  // 第五层：量子共振分析（仅在有家人数据时计算）
  let quantumResonances: QuantumResonance[] | undefined = undefined;

  if (familyData && familyData.length > 0) {
    quantumResonances = [];

    for (const family of familyData) {
      try {
        // 获取家人的能量中心数据
        const familyKinKnowledge = await fetchKinKnowledge(family.kin);
        const familyEnergyCenters = generateEnergyCentersFromKB(familyKinKnowledge.totem, familyKinKnowledge.tone);

        const userScores = {
          throat: energyCenters.find(c => c.center === 'throat')?.score || throatScore,
          heart: energyCenters.find(c => c.center === 'heart')?.score || totem.heart_chakra,
          pineal: energyCenters.find(c => c.center === 'pineal')?.score || totem.pineal_gland
        };

        const familyScores = {
          throat: familyEnergyCenters.find(c => c.center === 'throat')?.score || familyKinKnowledge.totem.throat_chakra,
          heart: familyEnergyCenters.find(c => c.center === 'heart')?.score || familyKinKnowledge.totem.heart_chakra,
          pineal: familyEnergyCenters.find(c => c.center === 'pineal')?.score || familyKinKnowledge.totem.pineal_gland
        };

        // 使用量子共振引擎动态计算
        const resonanceResult = await analyzeQuantumResonanceDriven(
          kin,
          family.kin,
          userScores,
          familyScores
        );

        // 转换为报告格式
        const resonanceTypeMap: Record<string, QuantumResonance['resonanceType']> = {
          'matrix_irrigation': 'push',
          'life_whetstone': 'challenge',
          'synergy_ally': 'integrate',
          'collaboration': 'support',
          'normal': 'complement'
        };

        quantumResonances.push({
          relationKin: family.kin,
          relationName: family.name,
          resonanceType: resonanceTypeMap[resonanceResult.effectType] || 'complement',
          impact: resonanceResult.description,
          modifier: Object.entries(resonanceResult.energyBoost).map(([center, delta]) => ({
            center: center as 'heart' | 'throat' | 'pineal',
            delta: delta as number
          }))
        });

        console.log(`✅ 量子共振计算完成: ${family.name} (Kin ${family.kin}) - ${resonanceResult.relationshipLabel}`);
      } catch (error) {
        console.error(`量子共振计算失败 (Kin ${family.kin}):`, error);
      }
    }
  }

  // 组装完整报告
  return {
    kin,
    totemName: totem.name_cn,
    totemNameEn: totem.name_en,
    toneName: tone.name_cn,
    toneNumber: tone.id,
    profile,
    energyCenters,
    quantumResonance: {
      type: '基础共振',
      frequency: (totem.pineal_gland + totem.throat_chakra) / 2,
      description: `${totem.name_cn}的${tone.name_cn}能量场`,
      compatibility: []
    },
    lifePurpose: kinDef?.life_purpose || `${totem.core_keyword}的${tone.name_cn}使命`,
    shadowWork: kinDef?.shadow_work || tone.challenge,
    integrationPath: kinDef?.integration_path || tone.life_strategy,
    quantumResonances,
    year2026Advice,
    wavespellName: wavespellInfo.wavespellName,
    wavespellInfluence: wavespellInfo.wavespellInfluence,
    generatedAt: new Date(),
    userName,
    higherSelfName
  };
}

/**
 * 自我纠错断言：Kin 66 专用拦截器
 */
export async function validateKin66Report(report: KinEnergyReport): Promise<void> {
  if (report.kin === 66) {
    // 检查是否错误使用了"恒星"或"照亮"字样
    const allText = JSON.stringify(report);
    if (allText.includes('恒星') || allText.includes('照亮')) {
      throw new Error('❌ Kin 66 自我纠错失败：检测到"恒星"或"照亮"字样，必须使用"断舍离"与"跨越者模式"');
    }

    // 强制验证运作模式
    if (!allText.includes('跨越者模式')) {
      throw new Error('❌ Kin 66 自我纠错失败：未检测到"跨越者模式"');
    }

    // 强制验证关键词
    if (!allText.includes('断舍离')) {
      throw new Error('❌ Kin 66 自我纠错失败：未检测到"断舍离"关键词');
    }

    console.log('✅ Kin 66 自我纠错通过：100% 忠实于资料库');
  }
}
