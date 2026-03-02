/**
 * 量子共振关系引擎（知识库驱动版本）
 * Quantum Resonance Relationship Engine (Knowledge Base Driven)
 *
 * 核心算法：
 * 1. 从数据库读取 oracle_guide, oracle_challenge, oracle_support, oracle_hidden
 * 2. 母体灌溉型（推动位）: (Kin_A + Kin_B) % 260 === 1
 * 3. 生命磨刀石（对冲位）: 从数据库的 oracle_challenge 读取
 * 4. 指引导航位: 从数据库的 oracle_guide 读取
 * 5. 隐藏力量位: 从数据库的 oracle_hidden 读取
 */

import { knowledgeBase } from './knowledgeBase';

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
 * 分析两个Kin之间的量子共振关系（使用知识库）
 */
export async function analyzeQuantumResonance(
  userKin: number,
  relativeKin: number
): Promise<QuantumResonanceRelation> {
  const kinSum = userKin + relativeKin;
  const kinDiff = Math.abs(userKin - relativeKin);

  // 1. 母体灌溉型（推动位）：(Kin_A + Kin_B) % 260 === 1
  if (kinSum % 260 === 1 || kinSum === 261) {
    return {
      type: 'push',
      label: '母体灌溉型（推动位）',
      description: '你们是"灵魂充电桩"，Ta 能为你提供源源不断的母体养分，让你的心轮瞬间扩容。',
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
      return {
        type: 'challenge',
        label: '生命磨刀石（对冲位）',
        description: 'Ta 是你生命中的"极性对冲镜"。通过碰撞，Ta 让你看见自己未被开发的另一面。',
        energyBoost: {
          pineal: 10,
          throat: 5
        }
      };
    }

    // 3. 指引导航位：从数据库的 oracle_guide 读取
    if (kinDef.oracle_guide === relativeKin) {
      return {
        type: 'guide',
        label: '指引导航位',
        description: 'Ta 是你的高维灯塔。在你的逻辑风暴中，Ta 是唯一能带你找到上帝视角的锚点。',
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
      return {
        type: 'support',
        label: '支持共振位',
        description: 'Ta 与你同频共振，能够深度理解你的表达方式，是天然的盟友。',
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

  // 无特殊关系
  return {
    type: null,
    label: '普通关系',
    description: 'Ta 与你之间存在自然的能量互动，虽无特殊共振，但仍有成长空间。',
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
