import { KinEnergyReport, EnergyCenter, QuantumResonance } from '../types/energyPortrait';

const TONES = [
  { id: 1, name: '磁性', mode: '吸引者模式', perspective: '启动视角' },
  { id: 2, name: '月亮', mode: '挑战者模式', perspective: '极化视角' },
  { id: 3, name: '电力', mode: '激活者模式', perspective: '服务视角' },
  { id: 4, name: '自我存在', mode: '建筑师模式', perspective: '定义视角' },
  { id: 5, name: '超频', mode: '指挥官模式', perspective: '全局统筹视角' },
  { id: 6, name: '韵律', mode: '平衡者模式', perspective: '节奏视角' },
  { id: 7, name: '共振', mode: '调谐者模式', perspective: '共振视角' },
  { id: 8, name: '银河', mode: '整合者模式', perspective: '和谐视角' },
  { id: 9, name: '太阳', mode: '完成者模式', perspective: '实现视角' },
  { id: 10, name: '行星', mode: '显化者模式', perspective: '显化视角' },
  { id: 11, name: '光谱', mode: '释放者模式', perspective: '解构视角' },
  { id: 12, name: '水晶', mode: '合作者模式', perspective: '集体视角' },
  { id: 13, name: '宇宙', mode: '超越者模式', perspective: '超然视角' }
];

const SEALS = [
  { id: 1, name: '红龙', essence: '你是生命源泉的守护者，滋养与创造的化身', chakra: 'root' },
  { id: 2, name: '白风', essence: '你是灵魂之息的传递者，沟通与净化的大师', chakra: 'throat' },
  { id: 3, name: '蓝夜', essence: '你是梦境王国的探索者，丰盛与直觉的显化师', chakra: 'third_eye' },
  { id: 4, name: '黄种子', essence: '你是潜能开发的园丁，觉知与目标的播种者', chakra: 'crown' },
  { id: 5, name: '红蛇', essence: '你是生命力量的舞者，激情与存活的掌控者', chakra: 'sacral' },
  { id: 6, name: '白世界桥', essence: '你是次元连接的使者，死亡与机会的转换师', chakra: 'heart' },
  { id: 7, name: '蓝手', essence: '你是知识完成的匠人，疗愈与成就的实现者', chakra: 'throat' },
  { id: 8, name: '黄星星', essence: '你是美学优雅的艺术家，和谐与美的创造者', chakra: 'solar_plexus' },
  { id: 9, name: '红月', essence: '你是情绪流动的引导者，净化与感受的传导者', chakra: 'sacral' },
  { id: 10, name: '白狗', essence: '你是无条件爱的践行者，忠诚与心灵的守护者', chakra: 'heart' },
  { id: 11, name: '蓝猴', essence: '你是神圣游戏的魔术师，幻象与欢乐的创造者', chakra: 'third_eye' },
  { id: 12, name: '黄人', essence: '你是自由意志的智者，影响与智慧的传播者', chakra: 'crown' },
  { id: 13, name: '红天行者', essence: '你是空间探索的旅者，探险与勇气的开拓者', chakra: 'root' },
  { id: 14, name: '白巫师', essence: '你是永恒魔法的编织者，接纳与无时间性的大师', chakra: 'heart' },
  { id: 15, name: '蓝鹰', essence: '你是高维视野的观察者，心智与远见的洞察者', chakra: 'third_eye' },
  { id: 16, name: '黄战士', essence: '你是勇敢质疑的战士，智慧与无畏的探询者', chakra: 'solar_plexus' },
  { id: 17, name: '红地球', essence: '你是星球进化的导航者，同步性与共时的引导者', chakra: 'root' },
  { id: 18, name: '白镜', essence: '你是无尽秩序的反射者，映照与永恒的镜面', chakra: 'throat' },
  { id: 19, name: '蓝风暴', essence: '你是自我生成的催化者，转化与能量的激发者', chakra: 'solar_plexus' },
  { id: 20, name: '黄太阳', essence: '你是宇宙光明的化身，启蒙与生命的照耀者', chakra: 'crown' }
];

const WAVESPELLS = [
  { seal: 1, name: '红龙波符', theme: '滋养', background: '创始能量场' },
  { seal: 2, name: '白风波符', theme: '灵性', background: '沟通能量场' },
  { seal: 3, name: '蓝夜波符', theme: '丰盛', background: '梦想能量场' },
  { seal: 4, name: '黄种子波符', theme: '开花', background: '觉知能量场' },
  { seal: 5, name: '红蛇波符', theme: '生存', background: '生命力能量场' },
  { seal: 6, name: '白世界桥波符', theme: '死亡', background: '机会能量场' },
  { seal: 7, name: '蓝手波符', theme: '完成', background: '知识能量场' },
  { seal: 8, name: '黄星星波符', theme: '优雅', background: '美学能量场' },
  { seal: 9, name: '红月波符', theme: '流动', background: '净化能量场' },
  { seal: 10, name: '白狗波符', theme: '爱', background: '心灵能量场' },
  { seal: 11, name: '蓝猴波符', theme: '魔法', background: '游戏能量场' },
  { seal: 12, name: '黄人波符', theme: '自由', background: '智慧能量场' },
  { seal: 13, name: '红天行者波符', theme: '探索', background: '空间能量场' },
  { seal: 14, name: '白巫师波符', theme: '魔法', background: '永恒能量场' },
  { seal: 15, name: '蓝鹰波符', theme: '远见', background: '心智能量场' },
  { seal: 16, name: '黄战士波符', theme: '质疑', background: '智能能量场' },
  { seal: 17, name: '红地球波符', theme: '导航', background: '同步能量场' },
  { seal: 18, name: '白镜波符', theme: '映照', background: '秩序能量场' },
  { seal: 19, name: '蓝风暴波符', theme: '转化', background: '催化能量场' },
  { seal: 20, name: '黄太阳波符', theme: '启蒙', background: '生命能量场' }
];

function calculateEnergyCenters(kin: number): EnergyCenter[] {
  const tone = ((kin - 1) % 13) + 1;
  const seal = ((kin - 1) % 20) + 1;
  const sealData = SEALS[seal - 1];

  const baseScores: Record<string, number> = {
    heart: 50,
    throat: 50,
    third_eye: 50,
    solar_plexus: 50,
    sacral: 50,
    root: 50,
    crown: 50
  };

  baseScores[sealData.chakra] += 40;

  if (tone === 5 || tone === 10) {
    baseScores.throat += 20;
  }
  if (tone === 8 || tone === 13) {
    baseScores.heart += 15;
  }
  if (tone === 3 || tone === 11) {
    baseScores.third_eye += 15;
  }

  const wavespellIndex = Math.floor((kin - 1) / 13);
  const wavespell = WAVESPELLS[wavespellIndex % 20];

  if (wavespell.seal === 2 || wavespell.seal === 7 || wavespell.seal === 18) {
    baseScores.throat += 10;
  }
  if (wavespell.seal === 10 || wavespell.seal === 14 || wavespell.seal === 6) {
    baseScores.heart += 10;
  }
  if (wavespell.seal === 3 || wavespell.seal === 11 || wavespell.seal === 15) {
    baseScores.third_eye += 10;
  }

  const centers: EnergyCenter[] = [
    {
      name: '心轮',
      percentage: Math.min(baseScores.heart, 99),
      mode: baseScores.heart > 80 ? '恒星模式' : baseScores.heart > 60 ? '行星模式' : '地球模式',
      description: generateHeartDescription(baseScores.heart, seal, wavespell),
      icon: '❤️'
    },
    {
      name: '喉轮',
      percentage: Math.min(baseScores.throat, 99),
      mode: baseScores.throat > 80 ? '指挥官模式' : baseScores.throat > 60 ? '传播者模式' : '倾听者模式',
      description: generateThroatDescription(baseScores.throat, seal, wavespell),
      icon: '💎'
    },
    {
      name: '松果体',
      percentage: Math.min(baseScores.third_eye, 99),
      mode: baseScores.third_eye > 80 ? '先知模式' : baseScores.third_eye > 60 ? '战略家模式' : '观察者模式',
      description: generateThirdEyeDescription(baseScores.third_eye, seal, wavespell),
      icon: '👁️'
    }
  ];

  return centers;
}

function generateHeartDescription(score: number, seal: number, wavespell: typeof WAVESPELLS[0]): string {
  if (score > 85) {
    return `天生的正义感与慈悲心。在「${wavespell.name}」的滋养下，你拥有强大的爱之力量。注意预防"救世主情结"导致的自我消耗。`;
  } else if (score > 65) {
    return `你的心轮能量温和而稳定，在关系中能够保持平衡。「${wavespell.name}」赋予你独特的情感智慧。`;
  } else {
    return `心轮能量相对内敛，这意味着你更擅长通过行动而非情感表达来展现爱。建议在 2026 年白风年强化心轮共振。`;
  }
}

function generateThroatDescription(score: number, seal: number, wavespell: typeof WAVESPELLS[0]): string {
  if (score > 85) {
    return `你的声音自带"定调"的重力感，表达具有穿透力，擅长建立规则。「${wavespell.name}」增强了你的表达力场。`;
  } else if (score > 65) {
    return `你的表达清晰而有力，能够有效传递信息。在「${wavespell.name}」的影响下，你的沟通天赋正在觉醒。`;
  } else {
    return `喉轮能量蓄势待发，你更适合倾听与观察。2026 白风年将是你打开表达通道的最佳时机。`;
  }
}

function generateThirdEyeDescription(score: number, seal: number, wavespell: typeof WAVESPELLS[0]): string {
  if (score > 80) {
    return `受「${wavespell.name}」驱动，你的直觉表现为极强的"${wavespell.theme === '质疑' ? '逻辑洞察力' : '灵性感知力'}"。你能看见别人看不见的维度。`;
  } else if (score > 65) {
    return `你的第三眼正在觉醒中，在「${wavespell.name}」的引导下，直觉力稳步提升。多关注梦境与同步性信号。`;
  } else {
    return `松果体能量以潜在形式存在，你更依赖逻辑而非直觉。这并非弱点，而是你的理性天赋。`;
  }
}

export function generateEnergyReport(
  kin: number,
  familyKins?: Array<{ name: string; kin: number }>
): KinEnergyReport {
  const tone = ((kin - 1) % 13) + 1;
  const seal = ((kin - 1) % 20) + 1;
  const toneData = TONES[tone - 1];
  const sealData = SEALS[seal - 1];
  const wavespellIndex = Math.floor((kin - 1) / 13);
  const wavespell = WAVESPELLS[wavespellIndex % 20];

  const centers = calculateEnergyCenters(kin);

  const portrait = {
    mode: toneData.mode,
    perspective: toneData.perspective,
    essence: `${toneData.name}${sealData.name}。${sealData.essence}，旨在通过${toneData.perspective}照亮他人前行的道路。`,
    centers
  };

  const quantumResonances: QuantumResonance[] = [];
  if (familyKins && familyKins.length > 0) {
    familyKins.forEach(family => {
      const resonance = calculateQuantumResonance(kin, family.kin, family.name);
      if (resonance) quantumResonances.push(resonance);
    });
  }

  const sortedCenters = [...centers].sort((a, b) => a.percentage - b.percentage);
  const weakestCenter = sortedCenters[0];

  const yearGuidance = {
    year: 2026,
    theme: '白风年',
    mainEnergy: '喉轮觉醒',
    advice: generate2026Advice(weakestCenter.name, centers)
  };

  const challengeAdvice = generateChallengeAdvice(weakestCenter, wavespell);

  return {
    kin,
    portrait,
    quantumResonances,
    yearGuidance,
    weakestCenter: weakestCenter.name,
    challengeAdvice
  };
}

function calculateQuantumResonance(
  userKin: number,
  familyKin: number,
  familyName: string
): QuantumResonance | null {
  const userCenters = calculateEnergyCenters(userKin);
  const familyCenters = calculateEnergyCenters(familyKin);

  const userWeakest = userCenters.reduce((min, c) => c.percentage < min.percentage ? c : min);
  const familyStrongest = familyCenters.reduce((max, c) => c.percentage > max.percentage ? c : max);

  let type: 'pusher' | 'integrator' | 'mirror' | 'anchor' = 'mirror';
  let typeLabel = '镜像因子';
  let description = '';

  if (familyStrongest.name === userWeakest.name && familyStrongest.percentage > 75) {
    type = 'pusher';
    typeLabel = '推动因子';
    description = `${familyName}的高频${familyStrongest.name}正在量子层面撞击你的${userWeakest.name}边界，补全了你看不见的维度视角。`;
  } else if (Math.abs(familyStrongest.percentage - userWeakest.percentage) > 30) {
    type = 'integrator';
    typeLabel = '频率整合';
    description = `${familyName}的${familyStrongest.name}能量正在软化你${userWeakest.name}中的固有模式，让你的能量场更具流动性与美感。`;
  } else if (Math.abs(familyCenters[0].percentage - userCenters[0].percentage) < 10) {
    type = 'mirror';
    typeLabel = '共振镜像';
    description = `${familyName}与你的能量场高度共振，你们在量子层面形成了强大的能量放大器。`;
  } else {
    type = 'anchor';
    typeLabel = '锚定支撑';
    description = `${familyName}的稳定能量为你提供了坚实的根基，让你可以安心探索更高维度。`;
  }

  return {
    relationName: familyName,
    kin: familyKin,
    type,
    typeLabel,
    description
  };
}

function generate2026Advice(weakestCenter: string, centers: EnergyCenter[]): string {
  const centerAdvice: Record<string, string> = {
    '心轮': '2026 白风年的核心能量是"真实表达"。你的心轮需要被看见，建议每周进行一次心轮冥想，用声音振动激活心脏空间。',
    '喉轮': '白风年是你的本命年能量！建议开启一项需要公开表达的项目（播客、演讲、写作），让你的声音成为疗愈工具。',
    '松果体': '2026 年你需要平衡直觉与逻辑。建议每天清晨记录梦境，并在满月时进行松果体激活冥想，强化灵性感知。'
  };

  return centerAdvice[weakestCenter] || '2026 白风年，聚焦于真实表达与深度聆听，让能量在言语与沉默间自由流动。';
}

function generateChallengeAdvice(weakestCenter: EnergyCenter, wavespell: typeof WAVESPELLS[0]): string {
  return `你的核心卡点在【${weakestCenter.name}】，目前能量指数为 ${weakestCenter.percentage}%。在「${wavespell.name}」的${wavespell.background}中，建议你通过${wavespell.theme}主题的冥想与实践，逐步激活这一能量中心。2026 白风年将为你的${weakestCenter.name}觉醒提供强大的宇宙支持。`;
}
