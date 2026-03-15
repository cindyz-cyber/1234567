/**
 * Kin 能量报告生成引擎
 * Universal Kin Energy Report Generator
 */

import type {
  KinEnergyProfile,
  EnergyCenterScore,
  QuantumResonance,
  Year2026Advice,
  KinEnergyReport
} from '../types/kinReport';
import {
  ToneToMode,
  WavespellAttributes,
  ResonanceTypeDescriptions
} from '../types/kinReport';

/**
 * 从 Kin 号码提取调性（1-13）
 */
export function extractTone(kin: number): number {
  return ((kin - 1) % 13) + 1;
}

/**
 * 从 Kin 号码提取波符（1-20）
 */
export function extractWavespell(kin: number): number {
  return Math.floor((kin - 1) / 13) + 1;
}

/**
 * 生成动态能量画像
 */
export function generateEnergyProfile(kin: number): KinEnergyProfile {
  const tone = extractTone(kin);
  const wavespell = extractWavespell(kin);

  const modeData = ToneToMode[tone];
  const wavespellData = WavespellAttributes[wavespell];

  return {
    mode: modeData.mode,
    perspective: modeData.perspective,
    essence: `${tone === 13 ? '超频' : ''}${wavespellData.name.replace('波符', '')}。${wavespellData.coreTheme}。`
  };
}

/**
 * 非线性能量评分算法
 * 根据图腾属性给出极高（>90）或极低（<40）的分数，体现不对称美感
 */
export function calculateEnergyCenters(kin: number): EnergyCenterScore[] {
  const tone = extractTone(kin);
  const wavespell = extractWavespell(kin);
  const wavespellData = WavespellAttributes[wavespell];

  // 基础分数来自波符属性
  let heartScore = wavespellData.energyDistribution.heart;
  let throatScore = wavespellData.energyDistribution.throat;
  let pinealScore = wavespellData.energyDistribution.pineal;

  // 调性修正器：不同调性对三个中心有不同的加成/削弱
  const toneModifiers: Record<number, { heart: number; throat: number; pineal: number }> = {
    1: { heart: 5, throat: -3, pineal: 0 },    // 吸引模式：心轮强化
    2: { heart: -5, throat: 8, pineal: 0 },    // 挑战模式：喉轮强化
    3: { heart: 3, throat: 3, pineal: -2 },    // 联结模式：心喉平衡
    4: { heart: 0, throat: 10, pineal: -5 },   // 定义模式：喉轮极强
    5: { heart: 5, throat: 5, pineal: -3 },    // 赋权模式：心喉提升
    6: { heart: 7, throat: 0, pineal: 0 },     // 平衡模式：心轮稳定
    7: { heart: 0, throat: 0, pineal: 10 },    // 共振模式：松果体极强
    8: { heart: 3, throat: 3, pineal: 3 },     // 完整模式：全面提升
    9: { heart: 0, throat: -5, pineal: 12 },   // 意图模式：松果体超强
    10: { heart: -3, throat: 12, pineal: -5 }, // 显化模式：喉轮极强，松果体弱
    11: { heart: 8, throat: -8, pineal: 5 },   // 溶解模式：心轮强，喉轮弱
    12: { heart: 5, throat: 5, pineal: -5 },   // 合作模式：心喉强，松果体弱
    13: { heart: 10, throat: 10, pineal: 5 }   // 超频模式：全面强化
  };

  const modifier = toneModifiers[tone];
  heartScore += modifier.heart;
  throatScore += modifier.throat;
  pinealScore += modifier.pineal;

  // 确保分数在合理范围内（30-100）
  heartScore = Math.max(30, Math.min(100, heartScore));
  throatScore = Math.max(30, Math.min(100, throatScore));
  pinealScore = Math.max(30, Math.min(100, pinealScore));

  // 生成描述
  const centers: EnergyCenterScore[] = [
    {
      center: 'heart',
      name: '心轮能量',
      score: heartScore,
      description: getHeartDescription(heartScore, tone, wavespell),
      reasoning: getHeartReasoning(heartScore, wavespellData.name)
    },
    {
      center: 'throat',
      name: '喉轮能量',
      score: throatScore,
      description: getThroatDescription(throatScore, tone, wavespell),
      reasoning: getThroatReasoning(throatScore, wavespellData.name)
    },
    {
      center: 'pineal',
      name: '松果体能量',
      score: pinealScore,
      description: getPinealDescription(pinealScore, tone, wavespell),
      reasoning: getPinealReasoning(pinealScore, wavespellData.name)
    }
  ];

  return centers;
}

/**
 * 心轮描述生成器
 */
function getHeartDescription(score: number, tone: number, wavespell: number): string {
  if (score >= 90) {
    return '天生的正义感与慈悲心。你的心轮如同太阳般炽热，能温暖周围的每个人。注意预防"救世主情结"导致的自我消耗。';
  } else if (score >= 75) {
    return '你拥有稳定的情感中心，能够给予他人温暖与支持。在关系中保持着健康的界限感。';
  } else if (score >= 60) {
    return '你的心轮能量处于发展阶段，正在学习如何平衡付出与接收。避免过度理性化情感。';
  } else {
    return '你的心轮能量较为内敛，更擅长用行动而非情感表达来展现关怀。这是一种独特的爱的语言。';
  }
}

function getHeartReasoning(score: number, wavespell: string): string {
  return `受「${wavespell}」驱动，你的心轮能量呈现出${score >= 80 ? '强烈的' : score >= 60 ? '稳定的' : '内敛的'}特质。`;
}

/**
 * 喉轮描述生成器
 */
function getThroatDescription(score: number, tone: number, wavespell: number): string {
  if (score >= 90) {
    return '你的声音自带"定调"的重力感，表达具有穿透力，擅长建立规则与标准。你是天生的演说家与领导者。';
  } else if (score >= 75) {
    return '你的表达清晰而有力，能够准确传递信息。在沟通中既有逻辑性又不失感染力。';
  } else if (score >= 60) {
    return '你的喉轮能量正在觉醒，学习如何更自信地表达自我。有时需要克服表达的恐惧。';
  } else {
    return '你更倾向于用行动而非语言来表达。这种"少言多行"的特质在某些场合反而是优势。';
  }
}

function getThroatReasoning(score: number, wavespell: string): string {
  if (tone === 4 || tone === 10) {
    return `在${tone === 4 ? '定义' : '显化'}模式的加持下，你的喉轮能量被极大强化，表达力突出。`;
  }
  return `「${wavespell}」赋予了你${score >= 80 ? '卓越的' : score >= 60 ? '稳定的' : '独特的'}表达能力。`;
}

/**
 * 松果体描述生成器
 */
function getPinealDescription(score: number, tone: number, wavespell: number): string {
  if (score >= 90) {
    return '你的第三只眼高度开启，拥有超强的直觉力与洞察力。能看见他人看不见的维度，接收来自更高意识的讯息。';
  } else if (score >= 75) {
    return '你的直觉灵敏而准确，经常能预感到事情的走向。在关键时刻，内在的声音会为你指引方向。';
  } else if (score >= 60) {
    return '你的松果体能量表现为"逻辑洞察力"——通过理性分析达到直觉的效果。这是另一种形式的智慧。';
  } else {
    return '你更倾向于依赖可见的证据与逻辑推理。这种务实态度让你在物质世界中更加稳定。';
  }
}

function getPinealReasoning(score: number, wavespell: string): string {
  return `受「${wavespell}」驱动，你的松果体能量${score >= 80 ? '高度活跃' : score >= 60 ? '稳定运作' : '以逻辑形式呈现'}。`;
}

/**
 * 计算Kin的图腾ID（1-20）
 */
function extractTotem(kin: number): number {
  return ((kin - 1) % 20) + 1;
}

/**
 * 判断是否为推动位关系（KinA + KinB = 261）
 */
function isPushKin(kinA: number, kinB: number): boolean {
  return kinA + kinB === 261;
}

/**
 * 判断是否为挑战位关系（|KinA - KinB| = 130）
 */
function isChallengeKin(kinA: number, kinB: number): boolean {
  return Math.abs(kinA - kinB) === 130;
}

/**
 * 判断是否为支持位关系（相同色系的图腾）
 */
function isSupportKin(kinA: number, kinB: number): boolean {
  const totemA = extractTotem(kinA);
  const totemB = extractTotem(kinB);

  const redTotems = [1, 5, 9, 13, 17];
  const whiteTotems = [2, 6, 10, 14, 18];
  const blueTotems = [3, 7, 11, 15, 19];
  const yellowTotems = [4, 8, 12, 16, 20];

  const isRed = (t: number) => redTotems.includes(t);
  const isWhite = (t: number) => whiteTotems.includes(t);
  const isBlue = (t: number) => blueTotems.includes(t);
  const isYellow = (t: number) => yellowTotems.includes(t);

  return (isRed(totemA) && isRed(totemB)) ||
         (isWhite(totemA) && isWhite(totemB)) ||
         (isBlue(totemA) && isBlue(totemB)) ||
         (isYellow(totemA) && isYellow(totemB));
}

/**
 * 分析两个 Kin 之间的量子共振关系（含Synergy Logic）
 */
export function analyzeQuantumResonance(
  userKin: number,
  relationKin: number,
  relationName: string
): QuantumResonance {
  const userCenters = calculateEnergyCenters(userKin);
  const relationCenters = calculateEnergyCenters(relationKin);

  const modifiers: QuantumResonance['modifier'] = [];
  let maxDiff = 0;
  let dominantCenter: 'heart' | 'throat' | 'pineal' = 'heart';

  userCenters.forEach((userCenter) => {
    const relationCenter = relationCenters.find(c => c.center === userCenter.center)!;
    const diff = relationCenter.score - userCenter.score;

    if (Math.abs(diff) > Math.abs(maxDiff)) {
      maxDiff = diff;
      dominantCenter = userCenter.center;
    }

    if (Math.abs(diff) > 10) {
      modifiers.push({
        center: userCenter.center,
        delta: Math.round(diff * 0.3)
      });
    }
  });

  let resonanceType: QuantumResonance['resonanceType'];

  if (isPushKin(userKin, relationKin)) {
    resonanceType = 'push';
    const heartCenter = modifiers.find(m => m.center === 'heart');
    if (heartCenter) {
      heartCenter.delta += 10;
    } else {
      modifiers.push({ center: 'heart', delta: 10 });
    }
    const pinealCenter = modifiers.find(m => m.center === 'pineal');
    if (pinealCenter) {
      pinealCenter.delta += 5;
    } else {
      modifiers.push({ center: 'pineal', delta: 5 });
    }
  } else if (isChallengeKin(userKin, relationKin)) {
    resonanceType = 'challenge';
  } else if (isSupportKin(userKin, relationKin)) {
    resonanceType = 'support';
    const throatCenter = modifiers.find(m => m.center === 'throat');
    if (throatCenter) {
      throatCenter.delta += 8;
    } else {
      modifiers.push({ center: 'throat', delta: 8 });
    }
  } else if (maxDiff > 15) {
    resonanceType = 'push';
  } else if (maxDiff < -15) {
    resonanceType = 'integrate';
  } else if (Math.abs(maxDiff) < 5) {
    resonanceType = 'mirror';
  } else {
    resonanceType = 'complement';
  }

  const impact = generateResonanceImpact(
    relationName,
    resonanceType,
    dominantCenter,
    relationCenters.find(c => c.center === dominantCenter)!.score,
    extractWavespell(relationKin),
    userKin,
    relationKin
  );

  return {
    relationKin,
    relationName,
    resonanceType,
    impact,
    modifier: modifiers
  };
}

/**
 * 生成共振影响描述（含Synergy Logic深度解读）
 */
function generateResonanceImpact(
  relationName: string,
  resonanceType: QuantumResonance['resonanceType'],
  dominantCenter: 'heart' | 'throat' | 'pineal',
  centerScore: number,
  wavespell: number,
  userKin: number,
  relationKin: number
): string {
  const wavespellData = WavespellAttributes[wavespell];
  const centerNames = {
    heart: '心轮',
    throat: '喉轮',
    pineal: '松果体'
  };

  if (isPushKin(userKin, relationKin)) {
    return `${relationName}（Kin ${relationKin}）是你的推动位关系（${userKin} + ${relationKin} = 261），这是【母体灌溉/深度互补】的完美配置。TA的存在像养分般渗入你的心轮深处，激活你未曾觉察的慈悲本能，同时在松果体层面产生量子纠缠，共同接收来自更高维度的指引。这是灵魂契约级别的深度连接。`;
  }

  if (isChallengeKin(userKin, relationKin)) {
    return `${relationName}（Kin ${relationKin}）是你的挑战位关系（|${userKin} - ${relationKin}| = 130），这是【极性扩张/生命磨刀石】的高级配置。TA的能量不会改变你的脉轮数值，而是通过极性差异强制觉醒你未被激活的潜能。你们是彼此的镜像反转，在冲突中完成灵魂的淬炼与扩张。这种关系会让你痛苦，但也会让你成为更完整的自己。`;
  }

  if (isSupportKin(userKin, relationKin)) {
    return `${relationName}（Kin ${relationKin}）是你的支持位关系（相同色系图腾），这是【喉轮一致性增强】的和谐配置。你们在表达频率上天然同步，能够无缝理解彼此的沟通方式。TA的存在会放大你喉轮的稳定性与穿透力，让你的声音更具权威感。这是天然的盟友关系。`;
  }

  if (resonanceType === 'push') {
    if (dominantCenter === 'pineal') {
      return `${relationName}的高频${centerNames[dominantCenter]}（来自${wavespellData.name}）正在量子层面撞击你的直觉边界，补全了你看不见的"${wavespellData.essence}"视角。`;
    } else if (dominantCenter === 'throat') {
      return `${relationName}的强大表达力（来自${wavespellData.name}）正在推动你突破沟通的舒适区，教会你如何更有力地发声。`;
    } else {
      return `${relationName}的心轮能量（来自${wavespellData.name}）正在唤醒你内在的情感深度，软化你的防御机制。`;
    }
  } else if (resonanceType === 'integrate') {
    if (dominantCenter === 'throat') {
      return `${relationName}的${wavespellData.essence}能量正在软化你喉轮中的硬核指令，让输出更具美感与和谐。`;
    } else if (dominantCenter === 'heart') {
      return `${relationName}的内敛情感风格正在教会你：爱不一定要大声说出来，行动本身就是最好的表达。`;
    } else {
      return `${relationName}的务实态度正在帮助你将高频直觉落地，在理性与灵性之间找到平衡。`;
    }
  } else if (resonanceType === 'mirror') {
    return `${relationName}与你在能量频率上高度同步，如同镜像般映照出你的${centerNames[dominantCenter]}特质。这种共振让你们能够深度理解彼此。`;
  } else {
    return `${relationName}的能量与你形成完美的互补，在${centerNames[dominantCenter]}层面填补了你的空白，创造出1+1>2的协同效应。`;
  }
}

/**
 * 生成 2026 白风年全局建议（基于喉轮阈值算法）
 */
export function generate2026Advice(
  kin: number,
  energyCenters: EnergyCenterScore[]
): Year2026Advice {
  const sortedCenters = [...energyCenters].sort((a, b) => a.score - b.score);
  const weakestCenter = sortedCenters[0];

  const centerNames = {
    heart: '心轮',
    throat: '喉轮',
    pineal: '松果体'
  };

  const coreWeakness = `${centerNames[weakestCenter.center]}（${weakestCenter.score}%）`;

  const whiteWindEnergy = '2026白风年（Kin 222-234 周期）是喉轮能量主导的一年，宇宙之风将强化所有与"表达、沟通、传递"相关的频率。';

  let practicalAdvice = '';

  const throatCenter = energyCenters.find(c => c.center === 'throat');
  const throatScore = throatCenter?.score || 50;

  if (throatScore < 60) {
    practicalAdvice = `2026 实操建议：你的喉轮能量为 ${throatScore}%，处于沉默区间。白风年是你的【沉默之门开启期】——借白风年之势，学会呼吸式表达：不必大声，但要真实。每天早晨深呼吸3次，在呼气时轻声说出一句你内心真正想说的话。白风会将你的低语放大成宇宙级的传播。你的力量不在于音量，而在于真诚。`;
  } else if (throatScore > 80) {
    practicalAdvice = `2026 实操建议：你的喉轮能量为 ${throatScore}%，处于威权区间。白风年是你的【扩音器年】——但要警惕：过度的表达力可能变成压迫感。今年的课题是【将威权指令转化为具有慈悲感的温润传播】。在每次发声前，先在心中默问："我的话语是在照亮，还是在控制？"用白风的柔软稀释你的锋利，让你的声音成为疗愈而非武器。`;
  } else {
    practicalAdvice = `2026 实操建议：你的喉轮能量为 ${throatScore}%，处于平衡区间。白风年对你而言是【精准表达的黄金期】——你既不沉默也不过度，正是宇宙需要的频率。今年重点在于提升表达的【质】而非【量】：每次发声前先在心中沉淀3秒，确保每个字都承载着真实的能量。白风会奖励那些用心说话的人。`;
  }

  if (weakestCenter.center === 'throat' && throatScore >= 60) {
    practicalAdvice = `2026 实操建议：虽然你的喉轮不是最弱项（${throatScore}%），但在白风年的放大镜下，任何表达上的不自信都会被无限放大。建议每天对着镜子练习【真实表达】：说出那些你平时不敢说的话（哪怕只是对自己说）。白风会保护你的真诚。`;
  } else if (weakestCenter.center === 'heart') {
    practicalAdvice = `2026 实操建议：你的核心卡点在心轮（${weakestCenter.score}%），但白风年的沟通能量可以成为你打开心门的钥匙。建议每周给一个你在意的人写一封手写信，用文字表达你的感受。当你学会用语言描述情感时，心轮会自然打开。表达即疗愈。`;
  } else if (weakestCenter.center === 'pineal') {
    practicalAdvice = `2026 实操建议：你的核心卡点在松果体（${weakestCenter.score}%），但白风年的高频振动会加速你的灵性觉醒。建议每日清晨在静默中深呼吸5分钟，倾听内在声音。当外在的表达与内在的直觉连接时，你的松果体会被唤醒。白风会将你的低频提升至高频。`;
  }

  return {
    coreWeakness,
    whiteWindEnergy,
    practicalAdvice
  };
}

/**
 * 从 mayaCalendar 获取波符信息
 */
function getWavespellInfo(kin: number): { name: string; influence: string } {
  // 使用精准的数学逻辑计算波符
  const wavespellIndex = Math.floor((kin - 1) / 13);
  const wavespellStartKin = wavespellIndex * 13 + 1;
  const wavespellSeal = ((wavespellStartKin - 1) % 20) + 1;

  const SEALS = [
    '红龙', '白风', '蓝夜', '黄种子', '红蛇',
    '白世界桥', '蓝手', '黄星星', '红月', '白狗',
    '蓝猴', '黄人', '红天行者', '白巫师', '蓝鹰',
    '黄战士', '红地球', '白镜', '蓝风暴', '黄太阳'
  ];

  const influences: Record<string, string> = {
    '红龙': '滋养与诞生的原初能量',
    '白风': '精神与沟通的灵性气息',
    '蓝夜': '梦境与丰盛的深渊智慧',
    '黄种子': '觉察与目标的生命潜能',
    '红蛇': '生命力与生存的本能驱动',
    '白世界桥': '连接与死亡的转化之桥',
    '蓝手': '疗愈与实现的双手创造',
    '黄星星': '美学与和谐的优雅频率',
    '红月': '流动与净化的水之能量',
    '白狗': '忠诚与爱的心之守护',
    '蓝猴': '魔法与游戏的童真智慧',
    '黄人': '自由意志与智慧的人类精神',
    '红天行者': '探索与空间的旅者之路',
    '白巫师': '永恒与魔法的时间掌控',
    '蓝鹰': '远见与心智的天空视角',
    '黄战士': '质疑与勇气的战斗智慧',
    '红地球': '进化与导航的地球母体',
    '白镜': '无限与秩序的映照真理',
    '蓝风暴': '转化与催化的风暴能量',
    '黄太阳': '启蒙与生命的宇宙之光'
  };

  const wavespellName = SEALS[wavespellSeal - 1];

  return {
    name: wavespellName,
    influence: influences[wavespellName] || '独特的宇宙能量'
  };
}

/**
 * 生成完整的 Kin 能量报告
 */
export function generateKinReport(
  kin: number,
  familyData?: Array<{ kin: number; name: string }>
): KinEnergyReport {
  const profile = generateEnergyProfile(kin);
  const energyCenters = calculateEnergyCenters(kin);
  const year2026Advice = generate2026Advice(kin, energyCenters);
  const wavespellInfo = getWavespellInfo(kin);

  let quantumResonances: QuantumResonance[] | undefined;

  if (familyData && familyData.length > 0) {
    quantumResonances = familyData.map(family =>
      analyzeQuantumResonance(kin, family.kin, family.name)
    );

    // 应用量子修正
    quantumResonances.forEach(resonance => {
      resonance.modifier.forEach(mod => {
        const center = energyCenters.find(c => c.center === mod.center);
        if (center) {
          center.score = Math.max(30, Math.min(100, center.score + mod.delta));
        }
      });
    });
  }

  return {
    kin,
    profile,
    energyCenters,
    quantumResonances,
    year2026Advice,
    wavespellName: wavespellInfo.name,
    wavespellInfluence: wavespellInfo.influence,
    generatedAt: new Date()
  };
}
