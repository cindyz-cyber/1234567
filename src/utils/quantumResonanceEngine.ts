/**
 * 量子共振关系引擎
 * Quantum Resonance Relationship Engine
 *
 * 核心算法：
 * 1. 母体灌溉型（推动位）: (Kin_A + Kin_B) % 260 === 1
 * 2. 生命磨刀石（对冲位）: |Kin_A - Kin_B| === 130
 * 3. 指引导航位: Kin_B 为 Kin_A 的指引 Kin 位
 */

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
 * 计算指引Kin（Guide Kin）
 * 公式：Guide = Kin + (13 - tone) * 20
 * 如果超过260，则减260
 */
function calculateGuideKin(kin: number): number {
  const tone = ((kin - 1) % 13) + 1;
  let guide = kin + ((13 - tone) % 13) * 20;
  if (guide > 260) guide -= 260;
  return guide;
}

/**
 * 计算支持Kin（Support/Antipode Kin）
 * 公式：Support = Kin + 130
 * 如果超过260，则减260
 */
function calculateSupportKin(kin: number): number {
  let support = kin + 130;
  if (support > 260) support -= 260;
  return support;
}

/**
 * 计算挑战Kin（Challenge/Antipode Kin）
 * 公式：Challenge = Kin + 130（或 Kin - 130）
 */
function calculateChallengeKin(kin: number): number {
  return calculateSupportKin(kin);
}

/**
 * 计算隐藏Kin（Hidden Power Kin）
 * 公式：Hidden = 261 - Kin
 */
function calculateHiddenKin(kin: number): number {
  return 261 - kin;
}

/**
 * 分析两个Kin之间的量子共振关系
 */
export function analyzeQuantumResonance(
  userKin: number,
  relativeKin: number
): QuantumResonanceRelation {
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

  // 2. 生命磨刀石（对冲位）：|Kin_A - Kin_B| === 130
  if (kinDiff === 130) {
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

  // 3. 指引导航位：Kin_B 为 Kin_A 的指引 Kin 位
  const guideKin = calculateGuideKin(userKin);
  if (relativeKin === guideKin) {
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

  // 4. 隐藏力量位：Kin_B 为 Kin_A 的隐藏力量
  const hiddenKin = calculateHiddenKin(userKin);
  if (relativeKin === hiddenKin) {
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

  // 5. 支持位（同色系或特定关系）
  const supportKin = calculateSupportKin(userKin);
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
      label: '支持共振位',
      description: 'Ta 与你同频共振，能够深度理解你的表达方式，是天然的盟友。',
      energyBoost: {
        throat: 10,
        heart: 5
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
