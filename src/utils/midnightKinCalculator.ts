/**
 * 子时双Kin计算引擎
 * Midnight Dual-Kin Calculation Engine
 *
 * 核心逻辑：
 * 1. 普通时段 (01:00 - 22:59)：100% 当天能量
 * 2. 前子时 (23:00 - 23:59)：主Kin = 当天（40%），副本Kin = 次日（60%）
 * 3. 后子时 (00:00 - 00:59)：主Kin = 当天（60%），副本Kin = 前日（40%）
 */

import { calculateKin, calculateEnergyProfile, type KinData, type EnergyProfile } from './mayaCalendar';
import { supabase } from '../lib/supabase';

export interface DualKinResult {
  isDualKin: boolean;
  midnightType: 'early' | 'late' | null;
  primaryKin: KinData;
  primaryWeight: number;
  secondaryKin?: KinData;
  secondaryWeight?: number;
  synthesizedEnergy: EnergyProfile;
  displayLabel: string;
}

/**
 * 检测时间是否为子时
 */
export function detectMidnightType(hour: number, minute: number): 'early' | 'late' | null {
  if (hour === 23) {
    return 'early';
  }
  if (hour === 0) {
    return 'late';
  }
  return null;
}

/**
 * 从数据库获取Kin定义和能量数据
 */
async function getKinEnergyFromDB(kinNumber: number): Promise<EnergyProfile | null> {
  try {
    const { data, error } = await supabase
      .from('kin_definitions')
      .select(`
        *,
        totem:totems(pineal_gland, throat_chakra, heart_chakra)
      `)
      .eq('kin_number', kinNumber)
      .maybeSingle();

    if (error || !data || !data.totem) {
      console.error('Failed to fetch kin energy:', error);
      return null;
    }

    // 使用数据库中的脉轮数值
    return {
      pineal: data.totem.pineal_gland,
      throat: data.totem.throat_chakra,
      heart: data.totem.heart_chakra
    };
  } catch (error) {
    console.error('Error fetching kin energy:', error);
    return null;
  }
}

/**
 * 计算双Kin合成能量
 * 公式：最终分值 = (主Kin分值 * 主权重) + (副本Kin分值 * 副本权重)
 */
function synthesizeEnergy(
  primaryEnergy: EnergyProfile,
  primaryWeight: number,
  secondaryEnergy: EnergyProfile,
  secondaryWeight: number
): EnergyProfile {
  return {
    heart: Math.round(primaryEnergy.heart * primaryWeight + secondaryEnergy.heart * secondaryWeight),
    throat: Math.round(primaryEnergy.throat * primaryWeight + secondaryEnergy.throat * secondaryWeight),
    pineal: Math.round(primaryEnergy.pineal * primaryWeight + secondaryEnergy.pineal * secondaryWeight)
  };
}

/**
 * 生成显示标签
 */
function generateDisplayLabel(
  primaryKin: KinData,
  primaryWeight: number,
  secondaryKin?: KinData,
  secondaryWeight?: number
): string {
  if (!secondaryKin || !secondaryWeight) {
    return `${primaryKin.toneName}的${primaryKin.sealName}`;
  }

  const primaryPercent = Math.round(primaryWeight * 100);
  const secondaryPercent = Math.round(secondaryWeight * 100);

  return `${primaryKin.toneName}的${primaryKin.sealName} (${primaryPercent}%) + ${secondaryKin.toneName}的${secondaryKin.sealName} (${secondaryPercent}%)`;
}

/**
 * 计算带时间的Kin（支持子时双Kin逻辑）
 */
export async function calculateKinWithTime(
  birthDate: Date,
  hour: number,
  minute: number
): Promise<DualKinResult> {
  const midnightType = detectMidnightType(hour, minute);

  // 普通时段：直接返回单Kin
  if (!midnightType) {
    const primaryKin = calculateKin(birthDate);
    const primaryEnergy = await getKinEnergyFromDB(primaryKin.kin);
    const finalEnergy = primaryEnergy || calculateEnergyProfile(primaryKin);

    return {
      isDualKin: false,
      midnightType: null,
      primaryKin,
      primaryWeight: 1.0,
      synthesizedEnergy: finalEnergy,
      displayLabel: `${primaryKin.toneName}的${primaryKin.sealName}`
    };
  }

  // 子时逻辑
  let primaryDate = new Date(birthDate);
  let secondaryDate = new Date(birthDate);
  let primaryWeight = 0.6;
  let secondaryWeight = 0.4;

  if (midnightType === 'early') {
    // 前子时 (23:00-23:59)：当天40%，次日60%
    primaryWeight = 0.4;
    secondaryWeight = 0.6;
    secondaryDate.setDate(secondaryDate.getDate() + 1);
  } else {
    // 后子时 (00:00-00:59)：当天60%，前日40%
    primaryWeight = 0.6;
    secondaryWeight = 0.4;
    secondaryDate.setDate(secondaryDate.getDate() - 1);
  }

  const primaryKin = calculateKin(primaryDate);
  const secondaryKin = calculateKin(secondaryDate);

  // 从数据库获取能量数据
  const primaryEnergy = await getKinEnergyFromDB(primaryKin.kin);
  const secondaryEnergy = await getKinEnergyFromDB(secondaryKin.kin);

  // 如果数据库获取失败，使用计算值
  const finalPrimaryEnergy = primaryEnergy || calculateEnergyProfile(primaryKin);
  const finalSecondaryEnergy = secondaryEnergy || calculateEnergyProfile(secondaryKin);

  // 合成能量
  const synthesizedEnergy = synthesizeEnergy(
    finalPrimaryEnergy,
    primaryWeight,
    finalSecondaryEnergy,
    secondaryWeight
  );

  const displayLabel = generateDisplayLabel(
    primaryKin,
    primaryWeight,
    secondaryKin,
    secondaryWeight
  );

  return {
    isDualKin: true,
    midnightType,
    primaryKin,
    primaryWeight,
    secondaryKin,
    secondaryWeight,
    synthesizedEnergy,
    displayLabel
  };
}

/**
 * 验证子时计算
 * 测试用例：1994-07-16, 00:30 (后子时)
 * 预期：Kin 239 (60%) + Kin 238 (40%)
 */
export async function validateMidnightCalculation() {
  const testDate = new Date('1994-07-16T00:30:00+08:00');
  const result = await calculateKinWithTime(testDate, 0, 30);

  console.log('🧪 子时计算验证测试');
  console.log('═══════════════════════════════════════');
  console.log(`测试时间: 1994-07-16 00:30`);
  console.log(`子时类型: ${result.midnightType === 'late' ? '后子时' : '前子时'}`);
  console.log(`主Kin: Kin ${result.primaryKin.kin} (${Math.round(result.primaryWeight * 100)}%)`);
  if (result.secondaryKin) {
    console.log(`副Kin: Kin ${result.secondaryKin.kin} (${Math.round(result.secondaryWeight! * 100)}%)`);
  }
  console.log(`合成心轮: ${result.synthesizedEnergy.heart}%`);
  console.log(`显示标签: ${result.displayLabel}`);
  console.log('═══════════════════════════════════════');

  const expectedPrimaryKin = 239;
  const expectedSecondaryKin = 238;

  if (result.primaryKin.kin === expectedPrimaryKin && result.secondaryKin?.kin === expectedSecondaryKin) {
    console.log('✅ 子时计算验证通过！');
    return true;
  } else {
    console.error('❌ 子时计算验证失败！');
    return false;
  }
}
