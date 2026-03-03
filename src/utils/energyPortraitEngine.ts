import { KinEnergyReport, EnergyCenter, QuantumResonance } from '../types/energyPortrait';
import { supabase } from '../lib/supabase';
import { analyzeQuantumResonance, calculateSynthesizedField } from './quantumResonanceEngine';
import { calculateCompositeKin, EnergySnapshot } from './compositeKinCalculator';
import { analyzeBurst, QuantumBurst } from './quantumBurstAnalyzer';
import { analyzeQuantumResonanceDriven } from './quantumResonanceDrivenEngine';
import { renderChakraResonance } from './chakraResonanceRenderer';
import { renderComprehensiveChakraNarrative } from './narrativeEngine';
import { generate2026Advice } from './yearlyAdvice2026';
import { generateSoulGiftsAndShadow } from './soulGiftsShadowEngine';

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

export async function fetchEnergyCentersFromDatabase(kin: number): Promise<EnergyCenter[]> {
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

    // 获取调性（用于多维语感渲染）
    const tone = ((kin - 1) % 13) + 1;

    // 使用多维语感叙事引擎增强描述
    const centersWithNarrative = await Promise.all(
      data.map(async (center) => {
        // 使用综合渲染：脉轮 + 调性 + 环境音
        const comprehensiveNarrative = await renderComprehensiveChakraNarrative(
          center.center_name,
          center.percentage,
          tone,
          true // 包含白风年环境音
        );

        return {
          name: center.center_name,
          percentage: center.percentage,
          mode: center.mode,
          description: comprehensiveNarrative.narrative, // 使用多维语感叙事
          icon: center.icon || getDefaultIcon(center.center_name),
          traits: center.traits,
          weaknesses: center.weaknesses
        };
      })
    );

    return centersWithNarrative;
  } catch (error) {
    console.error(`Failed to fetch energy centers for Kin ${kin}:`, error);
    throw error;
  }
}

async function fetchKinBasicInfo(kin: number) {
  try {
    const tone = ((kin - 1) % 13) + 1;
    const seal = ((kin - 1) % 20) + 1;
    const wavespellStartKin = Math.floor((kin - 1) / 13) * 13 + 1;
    const wavespellSeal = ((wavespellStartKin - 1) % 20) + 1;

    const { data: kinDef, error: kinError } = await supabase
      .from('kin_definitions')
      .select('*, totem:totems(name_cn, operation_mode), tone:tones(name_cn, description)')
      .eq('kin_number', kin)
      .maybeSingle();

    if (kinError) throw kinError;

    const { data: wavespellTotem } = await supabase
      .from('totems')
      .select('name_cn')
      .eq('id', wavespellSeal)
      .maybeSingle();

    if (kinDef && kinDef.totem && kinDef.tone) {
      return {
        toneName: kinDef.tone.name_cn,
        sealName: kinDef.totem.name_cn,
        essence: kinDef.core_essence || '',
        wavespellName: wavespellTotem?.name_cn || '',
        style: kinDef.totem.operation_mode || '',
        toneDesc: kinDef.tone.description || ''
      };
    }

    const { data: toneData } = await supabase.from('tones').select('name_cn').eq('id', tone).maybeSingle();
    const { data: totemData } = await supabase.from('totems').select('name_cn').eq('id', seal).maybeSingle();

    return {
      toneName: toneData?.name_cn || `第${tone}调性`,
      sealName: totemData?.name_cn || `第${seal}图腾`,
      essence: '',
      wavespellName: wavespellTotem?.name_cn || '',
      style: '',
      toneDesc: ''
    };
  } catch (error) {
    console.error('Failed to fetch basic info:', error);
    const tone = ((kin - 1) % 13) + 1;
    const seal = ((kin - 1) % 20) + 1;
    return {
      toneName: `第${tone}调性`,
      sealName: `第${seal}图腾`,
      essence: '',
      wavespellName: '',
      style: '',
      toneDesc: ''
    };
  }
}

/**
 * 第三层：渲染层隔离 - 使用数据库驱动的量子共振引擎
 * 严格禁止在 UI 渲染循环中调用此函数！
 */
async function calculateQuantumResonanceWithBurst(
  userSnapshot: EnergySnapshot,
  familySnapshot: EnergySnapshot,
  familyName: string
): Promise<QuantumResonance | null> {
  try {
    // 使用数据库驱动的量子共振引擎
    const resonanceResult = await analyzeQuantumResonanceDriven(
      userSnapshot.kin,
      familySnapshot.kin,
      {
        throat: userSnapshot.throat,
        heart: userSnapshot.heart,
        pineal: userSnapshot.pineal
      },
      {
        throat: familySnapshot.throat,
        heart: familySnapshot.heart,
        pineal: familySnapshot.pineal
      }
    );

    // 计算共振强度（基于效果类型）
    const strengthMap: Record<string, number> = {
      'matrix_irrigation': 1.0,
      'life_whetstone': 1.0,
      'synergy_ally': 0.85,
      'collaboration': 0.7,
      'normal': 0.5
    };

    const synergyStrength = strengthMap[resonanceResult.effectType] || 0.5;

    console.log(`✅ 数据库驱动量子共振: ${familyName} (Kin ${familySnapshot.kin}) - ${resonanceResult.relationshipLabel}, 强度=${Math.round(synergyStrength * 100)}%`);

    return {
      familyMember: familyName,
      type: resonanceResult.effectType,
      typeLabel: resonanceResult.relationshipLabel,
      description: resonanceResult.description,
      synergyType: resonanceResult.synergyType,
      synergyStrength,
      synergyDescription: `${resonanceResult.relationshipLabel}：能量共振强度 ${Math.round(synergyStrength * 100)}%`
    };
  } catch (error) {
    console.error('Failed to calculate quantum resonance with burst:', error);
    return null;
  }
}

/**
 * 向后兼容：旧版本的量子共振计算（仅使用 Kin 数字）
 * 已升级为数据库驱动引擎
 */
async function calculateQuantumResonance(
  userKin: number,
  familyKin: number,
  familyName: string
): Promise<QuantumResonance | null> {
  try {
    // 获取用户和家人的能量中心数据
    const userCenters = await fetchEnergyCentersFromDatabase(userKin);
    const familyCenters = await fetchEnergyCentersFromDatabase(familyKin);

    const userScores = {
      throat: userCenters.find(c => c.name === '喉轮')?.percentage || 50,
      heart: userCenters.find(c => c.name === '心轮')?.percentage || 50,
      pineal: userCenters.find(c => c.name === '松果体')?.percentage || 50
    };

    const familyScores = {
      throat: familyCenters.find(c => c.name === '喉轮')?.percentage || 50,
      heart: familyCenters.find(c => c.name === '心轮')?.percentage || 50,
      pineal: familyCenters.find(c => c.name === '松果体')?.percentage || 50
    };

    // 使用数据库驱动的量子共振引擎
    const resonanceResult = await analyzeQuantumResonanceDriven(
      userKin,
      familyKin,
      userScores,
      familyScores
    );

    // 强度映射：根据效果类型计算共振强度
    const strengthMap: Record<string, number> = {
      'matrix_irrigation': 1.0,
      'life_whetstone': 1.0,
      'synergy_ally': 0.85,
      'collaboration': 0.7,
      'normal': 0.5
    };

    const synergyStrength = strengthMap[resonanceResult.effectType] || 0.5;

    console.log(`✅ 降级算法-数据库驱动: ${familyName} (Kin ${familyKin}) - ${resonanceResult.relationshipLabel}, 强度=${Math.round(synergyStrength * 100)}%`);

    return {
      familyMember: familyName,
      type: resonanceResult.effectType,
      typeLabel: resonanceResult.relationshipLabel,
      description: resonanceResult.description,
      synergyType: resonanceResult.synergyType,
      synergyStrength,
      synergyDescription: `${resonanceResult.relationshipLabel}：能量共振强度 ${Math.round(synergyStrength * 100)}%`
    };
  } catch (error) {
    console.error('Failed to calculate quantum resonance:', error);
    return null;
  }
}

export async function generateEnergyReport(
  kin: number,
  familyKins?: Array<{
    name: string;
    kin: number;
    birthDate?: Date;
    hour?: number;
  }>,
  userBirthDate?: Date,
  userHour?: number
): Promise<KinEnergyReport> {
  const basicInfo = await fetchKinBasicInfo(kin);
  const centers = await fetchEnergyCentersFromDatabase(kin);

  const portrait = {
    mode: basicInfo.style || '数据库模式',
    perspective: basicInfo.toneDesc || '知识库视角',
    essence: basicInfo.essence || `${basicInfo.toneName}的${basicInfo.sealName}`,
    centers
  };

  const quantumResonances: QuantumResonance[] = [];
  if (familyKins && familyKins.length > 0) {
    // 如果有用户日期，使用三层架构
    let userSnapshot: EnergySnapshot | null = null;
    if (userBirthDate) {
      userSnapshot = await calculateCompositeKin(userBirthDate, userHour);
      console.log('✅ 用户快照已生成:', { kin: userSnapshot.kin, date: userBirthDate });
    } else {
      console.warn('⚠️ 缺少用户日期，将降级到旧算法');
    }

    for (const family of familyKins) {
      try {
        // 优先使用三层架构（如果有日期信息）
        if (userSnapshot && family.birthDate) {
          console.log(`🚀 使用三层架构计算与 ${family.name} 的共振 (Kin ${family.kin})`);
          const familySnapshot = await calculateCompositeKin(family.birthDate, family.hour);
          const resonance = await calculateQuantumResonanceWithBurst(
            userSnapshot,
            familySnapshot,
            family.name
          );
          console.log(`📊 三层架构结果:`, resonance);
          if (resonance) quantumResonances.push(resonance);
        } else {
          // 降级为旧算法（仅使用 Kin 数字）
          console.warn(`⬇️ 降级到旧算法计算与 ${family.name} 的共振 (原因: ${!userSnapshot ? '缺少用户快照' : '缺少家人日期'})`);
          const resonance = await calculateQuantumResonance(kin, family.kin, family.name);
          console.log(`📊 旧算法结果:`, resonance);
          if (resonance) quantumResonances.push(resonance);
        }
      } catch (error) {
        console.error(`Failed to calculate resonance with ${family.name}:`, error);
      }
    }
  }

  const sortedCenters = [...centers].sort((a, b) => a.percentage - b.percentage);
  const weakestCenter = sortedCenters[0];

  // 获取喉轮分值用于生成2026年度建议和灵性礼物/阴影
  const throatCenter = centers.find(c => c.name === '喉轮');
  const throatPercentage = throatCenter?.percentage || 50;

  // 并行生成动态的2026白风年建议和灵性礼物/阴影
  const [yearlyAdvice, soulGiftsAndShadow] = await Promise.all([
    generate2026Advice(kin, throatPercentage),
    generateSoulGiftsAndShadow(kin, throatPercentage)
  ]);

  return {
    kin,
    portrait,
    quantumResonances,
    yearGuidance: {
      year: yearlyAdvice.year,
      theme: yearlyAdvice.theme,
      mainEnergy: yearlyAdvice.archetype,
      advice: yearlyAdvice.synthesizedGuidance
    },
    weakestCenter: weakestCenter.name,
    challengeAdvice: `专注提升${weakestCenter.name}（当前${weakestCenter.percentage}%）`,
    wavespellInfluence: basicInfo.wavespellName,
    soulGift: soulGiftsAndShadow.soulGift,
    soulShadow: soulGiftsAndShadow.soulShadow,
    archetypeImagery: soulGiftsAndShadow.archetypeImagery
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
