/**
 * 量子共振关系引擎（三层架构重构版）
 * Quantum Resonance Relationship Engine (3-Tier Architecture)
 *
 * 第一层：个体能量实例化 → compositeKinCalculator.ts
 * 第二层：量子干涉算法 → quantumBurstAnalyzer.ts
 * 第三层：渲染层隔离 → 本文件作为协调层
 *
 * 重要：此引擎仅用于知识库驱动的 Oracle 关系查询
 * 推动位和对冲位的"爆发检测"已移至 quantumBurstAnalyzer
 */

import { knowledgeBase } from './knowledgeBase';
import { EnergySnapshot, calculateCompositeKin } from './compositeKinCalculator';
import { QuantumBurst, analyzeBurst } from './quantumBurstAnalyzer';
import { renderQuantumSynergyBurst } from './narrativeEngine';

export interface QuantumResonanceRelation {
  type: 'push' | 'challenge' | 'guide' | 'support' | 'hidden' | null;
  label: string;
  description: string;
  energyBoost: {
    heart?: number;
    throat?: number;
    pineal?: number;
  };
}

/**
 * 三层架构协调函数：完整的量子共振分析
 * 输入：两个日期和小时（可选）
 * 输出：完整的爆发分析结果
 */
export async function analyzeQuantumResonanceFull(
  userDate: Date,
  userHour: number | undefined,
  relativeDate: Date,
  relativeHour: number | undefined
): Promise<QuantumBurst> {
  // 第一层：个体能量实例化
  const userSnapshot = await calculateCompositeKin(userDate, userHour);
  const relativeSnapshot = await calculateCompositeKin(relativeDate, relativeHour);

  // 第二层：量子干涉算法
  const burst = analyzeBurst(userSnapshot, relativeSnapshot);

  return burst;
}

/**
 * 向后兼容：使用 Kin 数字分析关系（仅用于知识库查询）
 * 注意：这不包含"爆发检测"，仅返回 Oracle 关系
 */
export async function analyzeQuantumResonance(
  userKin: number,
  relativeKin: number
): Promise<QuantumResonanceRelation> {
  const kinSum = userKin + relativeKin;
  const kinDiff = Math.abs(userKin - relativeKin);

  // 1. 母体灌溉型（推动位）：(Kin_A + Kin_B) % 260 === 1
  if (kinSum % 260 === 1 || kinSum === 261) {
    const burstDescription = await renderQuantumSynergyBurst(261);
    return {
      type: 'push',
      label: '母体灌溉型（推动位）',
      description: burstDescription || '你们是"灵魂充电桩"，Ta 能为你提供源源不断的母体养分，让你的心轮瞬间扩容。',
      energyBoost: {
        heart: 15,
        pineal: 8
      }
    };
  }

  // 从知识库获取用户 Kin 的定义（包含校准后的 oracle 关系）
  const kinDef = await knowledgeBase.getKinDefinition(userKin);

  if (kinDef) {
    // 2. 生命磨刀石（对冲位）：从数据库的 oracle_challenge 读取
    if (kinDef.oracle_challenge === relativeKin) {
      const burstDescription = await renderQuantumSynergyBurst(130);
      return {
        type: 'challenge',
        label: '生命磨刀石（对冲位）',
        description: burstDescription || 'Ta 是你生命中的"极性对冲镜"。通过碰撞，Ta 让你看见自己未被开发的另一面。',
        energyBoost: {
          pineal: 10,
          throat: 5
        }
      };
    }

    // 3. 指引导航位：从数据库的 oracle_guide 读取
    if (kinDef.oracle_guide === relativeKin) {
      const burstDescription = await renderQuantumSynergyBurst(777);
      return {
        type: 'guide',
        label: '指引导航位',
        description: burstDescription || 'Ta 是你的高维灯塔。在你的逻辑风暴中，Ta 是唯一能带你找到上帝视角的锚点。',
        energyBoost: {
          pineal: 12,
          heart: 5
        }
      };
    }

    // 4. 隐藏力量位：从数据库的 oracle_hidden 读取
    if (kinDef.oracle_hidden === relativeKin) {
      return {
        type: 'hidden',
        label: '隐藏力量位',
        description: 'Ta 是你的隐藏推动力。在你看不见的维度里，Ta 为你提供源源不断的支持。',
        energyBoost: {
          heart: 8,
          throat: 8
        }
      };
    }

    // 5. 支持位：从数据库的 oracle_support 读取
    if (kinDef.oracle_support === relativeKin) {
      const burstDescription = await renderQuantumSynergyBurst(888);
      return {
        type: 'support',
        label: '支持共振位',
        description: burstDescription || 'Ta 与你同频共振，能够深度理解你的表达方式，是天然的盟友。',
        energyBoost: {
          throat: 10,
          heart: 5
        }
      };
    }
  }

  // 6. 同色系检测（备选逻辑）
  const totemA = ((userKin - 1) % 20) + 1;
  const totemB = ((relativeKin - 1) % 20) + 1;

  const redTotems = [1, 5, 9, 13, 17];
  const whiteTotems = [2, 6, 10, 14, 18];
  const blueTotems = [3, 7, 11, 15, 19];
  const yellowTotems = [4, 8, 12, 16, 20];

  const isSameColor =
    (redTotems.includes(totemA) && redTotems.includes(totemB)) ||
    (whiteTotems.includes(totemA) && whiteTotems.includes(totemB)) ||
    (blueTotems.includes(totemA) && blueTotems.includes(totemB)) ||
    (yellowTotems.includes(totemA) && yellowTotems.includes(totemB));

  if (isSameColor) {
    return {
      type: 'support',
      label: '同色系共振',
      description: 'Ta 与你同属一个能量色系，能够深度理解你的表达方式，是天然的盟友。',
      energyBoost: {
        throat: 8,
        heart: 4
      }
    };
  }

  // 无特殊关系 - 使用自然共振（动态分数算法）
  const dynamicOffset = (userKin + relativeKin) % 29;
  const dynamicScore = 65 + dynamicOffset;

  // 动态描述：根据分数区间生成不同文案
  let dynamicDesc = "";
  if (dynamicScore >= 85) {
    dynamicDesc = `高频协同场域（共振强度 ${dynamicScore}%）：你们的频率高度交叠，这意味着在沟通与协作中，阻力极小。这是一种天然的赋能关系，适合共同开创复杂的逻辑模型。`;
  } else if (dynamicScore >= 75) {
    dynamicDesc = `温和共振矩阵（共振强度 ${dynamicScore}%）：你们之间形成了一个平衡的能量夹角。虽然不是极端的推动，但在日常互动中能够提供稳定、持续的逻辑支撑。`;
  } else {
    dynamicDesc = `差异化互补连接（共振强度 ${dynamicScore}%）：你们的能量模式存在可见的差异。这种连结需要更多的「倾听与留白」来磨合，学会在不同的逻辑频道中寻找共识的锚点。`;
  }

  return {
    type: null,
    label: '自然共振',
    description: dynamicDesc,
    energyBoost: {}
  };
}

/**
 * 计算合成能量场
 * 当存在特殊关系时，合成场的分值应高于两个人的原始均值
 */
export function calculateSynthesizedField(
  userEnergy: { heart: number; throat: number; pineal: number },
  relativeEnergy: { heart: number; throat: number; pineal: number },
  resonance: QuantumResonanceRelation
): { heart: number; throat: number; pineal: number } {
  // 基础均值
  const baseHeart = (userEnergy.heart + relativeEnergy.heart) / 2;
  const baseThroat = (userEnergy.throat + relativeEnergy.throat) / 2;
  const basePineal = (userEnergy.pineal + relativeEnergy.pineal) / 2;

  // 应用量子共振加成
  const synthesized = {
    heart: baseHeart + (resonance.energyBoost.heart || 0),
    throat: baseThroat + (resonance.energyBoost.throat || 0),
    pineal: basePineal + (resonance.energyBoost.pineal || 0)
  };

  // 确保分值在合理范围内
  return {
    heart: Math.min(100, Math.max(30, synthesized.heart)),
    throat: Math.min(100, Math.max(30, synthesized.throat)),
    pineal: Math.min(100, Math.max(30, synthesized.pineal))
  };
}
