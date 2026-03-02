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
 * 分析两个 Kin 之间的量子共振关系
 */
export function analyzeQuantumResonance(
  userKin: number,
  relationKin: number,
  relationName: string
): QuantumResonance {
  const userCenters = calculateEnergyCenters(userKin);
  const relationCenters = calculateEnergyCenters(relationKin);

  // 计算差异向量
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

    // 只记录显著差异（>10分）
    if (Math.abs(diff) > 10) {
      modifiers.push({
        center: userCenter.center,
        delta: Math.round(diff * 0.3) // 共振影响约为差值的30%
      });
    }
  });

  // 判断共振类型
  let resonanceType: QuantumResonance['resonanceType'];
  if (maxDiff > 15) {
    resonanceType = 'push'; // 推动因子
  } else if (maxDiff < -15) {
    resonanceType = 'integrate'; // 频率整合
  } else if (Math.abs(maxDiff) < 5) {
    resonanceType = 'mirror'; // 镜像映照
  } else {
    resonanceType = 'complement'; // 互补平衡
  }

  const impact = generateResonanceImpact(
    relationName,
    resonanceType,
    dominantCenter,
    relationCenters.find(c => c.center === dominantCenter)!.score,
    extractWavespell(relationKin)
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
 * 生成共振影响描述
 */
function generateResonanceImpact(
  relationName: string,
  resonanceType: QuantumResonance['resonanceType'],
  dominantCenter: 'heart' | 'throat' | 'pineal',
  centerScore: number,
  wavespell: number
): string {
  const wavespellData = WavespellAttributes[wavespell];
  const centerNames = {
    heart: '心轮',
    throat: '喉轮',
    pineal: '松果体'
  };

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
 * 生成 2026 白风年避坑建议
 */
export function generate2026Advice(
  kin: number,
  energyCenters: EnergyCenterScore[]
): Year2026Advice {
  // 找出最低分的中心（核心卡点）
  const sortedCenters = [...energyCenters].sort((a, b) => a.score - b.score);
  const weakestCenter = sortedCenters[0];

  const centerNames = {
    heart: '心轮',
    throat: '喉轮',
    pineal: '松果体'
  };

  const coreWeakness = `${centerNames[weakestCenter.center]}（${weakestCenter.score}%）`;

  const whiteWindEnergy = '2026白风年（Kin 222-234 周期）是喉轮能量主导的一年，宇宙之风将强化所有与"表达、沟通、传递"相关的频率。';

  // 根据最弱的中心生成针对性建议
  let practicalAdvice = '';

  if (weakestCenter.center === 'throat') {
    practicalAdvice = '2026 实操建议：每天早晨对着镜子大声说出 3 句肯定语，激活喉轮。在白风年的加持下，你的声音将获得前所未有的传播力。不要再沉默，宇宙在等你发声。';
  } else if (weakestCenter.center === 'heart') {
    practicalAdvice = '2026 实操建议：在白风年强大的沟通能量下，学会用语言表达你的感受。每周给一个你在意的人写一封手写信，用文字打开心轮。表达即疗愈。';
  } else {
    practicalAdvice = '2026 实操建议：白风年的高频振动会加速你的灵性觉醒。建立每日冥想习惯（哪怕只有 5 分钟），在静默中倾听内在声音。你的松果体正在等待被唤醒。';
  }

  return {
    coreWeakness,
    whiteWindEnergy,
    practicalAdvice
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
    generatedAt: new Date()
  };
}
