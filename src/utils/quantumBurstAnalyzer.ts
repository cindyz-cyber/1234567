/**
 * 第二层：量子干涉算法 (Interference Logic)
 *
 * 拿到两个能量快照对象后，执行"爆发检测"
 * 严格禁止在这里执行任何数据库查询或日期计算！
 */

import { EnergySnapshot } from './compositeKinCalculator';

export interface QuantumBurst {
  type: 'push' | 'mirror' | 'guide' | 'hidden' | 'support' | 'color_sync' | 'normal';
  title: string;
  score: number;
  description: string;
  synergyType: string;
  energyBoost: {
    pineal?: number;
    throat?: number;
    heart?: number;
  };
  resultSnapshot: {
    pineal: number;
    throat: number;
    heart: number;
  };
}

/**
 * 量子爆发分析核心算法
 * 输入：两个已完成子时加权的能量快照
 * 输出：爆发类型和增强后的能量状态
 */
export function analyzeBurst(userA: EnergySnapshot, userB: EnergySnapshot): QuantumBurst {
  console.log(`🔮 量子爆发分析: Kin ${userA.kin} <-> Kin ${userB.kin}`);

  const kinSum = userA.kin + userB.kin;
  const kinDiff = Math.abs(userA.kin - userB.kin);

  // 基础能量均值
  let resultPineal = Math.round((userA.pineal + userB.pineal) / 2);
  let resultThroat = Math.round((userA.throat + userB.throat) / 2);
  let resultHeart = Math.round((userA.heart + userB.heart) / 2);

  // 检测 1：推动位 (The Pulse) - 母体灌溉
  const isPush = kinSum % 260 === 1 || kinSum === 261;
  if (isPush) {
    const heartBoost = 15;
    resultHeart = Math.min(100, Math.max(userA.heart, userB.heart) + heartBoost);
    const pinealBoost = 8;
    resultPineal = Math.min(100, resultPineal + pinealBoost);

    return {
      type: 'push',
      title: '量子爆发：母体灌溉',
      score: resultHeart,
      description: '你们在一起时，逻辑消失，纯粹的滋养开启。这是灵魂充电桩般的存在，心轮能量暴涨。',
      synergyType: '母体灌溉型',
      energyBoost: { heart: heartBoost, pineal: pinealBoost },
      resultSnapshot: { pineal: resultPineal, throat: resultThroat, heart: resultHeart }
    };
  }

  // 检测 2：对冲位 (The Mirror) - 生命磨刀石
  const isMirror = kinDiff === 130;
  if (isMirror) {
    resultPineal = 100; // 直觉炸裂
    const throatBoost = 5;
    resultThroat = Math.min(100, resultThroat + throatBoost);

    return {
      type: 'mirror',
      title: '量子爆发：生命磨刀石',
      score: resultPineal,
      description: '极性的碰撞将带来意识的巨变。你们是彼此的镜子，直觉在对抗中觉醒到极致。',
      synergyType: '生命磨刀石',
      energyBoost: { pineal: 100 - ((userA.pineal + userB.pineal) / 2), throat: throatBoost },
      resultSnapshot: { pineal: resultPineal, throat: resultThroat, heart: resultHeart }
    };
  }

  // 检测 3：同色系共振
  const totemA = ((userA.kin - 1) % 20) + 1;
  const totemB = ((userB.kin - 1) % 20) + 1;

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
    console.log('✨ 检测到同色系共振！');
    const throatBoost = 8;
    const heartBoost = 4;
    resultThroat = Math.min(100, resultThroat + throatBoost);
    resultHeart = Math.min(100, resultHeart + heartBoost);

    const burstResult = {
      type: 'color_sync' as const,
      title: '同色系共振',
      score: Math.round((resultHeart + resultThroat) / 2),
      description: 'Ta 与你同属一个能量色系，能够深度理解你的表达方式，沟通流畅自然。',
      synergyType: '同色系共振',
      energyBoost: { throat: throatBoost, heart: heartBoost },
      resultSnapshot: { pineal: resultPineal, throat: resultThroat, heart: resultHeart }
    };
    console.log('📊 同色系共振结果:', burstResult);
    return burstResult;
  }

  // 默认：常规共振
  return {
    type: 'normal',
    title: '常规共振',
    score: Math.round((resultPineal + resultThroat + resultHeart) / 3),
    description: 'Ta 与你之间存在自然的能量互动，虽无特殊共振，但仍有成长空间。',
    synergyType: '普通共振',
    energyBoost: {},
    resultSnapshot: { pineal: resultPineal, throat: resultThroat, heart: resultHeart }
  };
}

/**
 * 批量分析：计算用户与多人的量子爆发关系
 */
export function analyzeBurstWithMultiple(
  user: EnergySnapshot,
  others: Array<EnergySnapshot & { name?: string }>
): Array<QuantumBurst & { targetName?: string; targetKin: number }> {
  return others.map((other) => ({
    ...analyzeBurst(user, other),
    targetName: other.name,
    targetKin: other.kin
  }));
}
