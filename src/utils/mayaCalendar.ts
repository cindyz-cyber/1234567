export interface KinData {
  kin: number;
  seal: number;
  tone: number;
  sealName: string;
  toneName: string;
  wavespell: number;
  wavespellName: string;
  hiddenPower: number;
  hiddenPowerName: string;
  toneType: string;
  midnightType?: 'early' | 'late' | null;
  secondaryKin?: number;
}

export interface EnergyProfile {
  throat: number;
  pineal: number;
  heart: number;
}

export interface RelationshipSynergy {
  hasSynergy: boolean;
  type: 'mutual-push' | 'harmonic-resonance' | 'energy-amplify' | null;
  strength: number;
}

// 硬编码校准点（按用户要求的绝对基准）
const CALIBRATION_POINTS = [
  { date: new Date('1983-09-30'), kin: 200 },
  { date: new Date('2012-05-11'), kin: 243 },
  { date: new Date('2023-02-10'), kin: 8 }
];

// 使用第一个校准点作为主基准
const MAIN_CALIBRATION = CALIBRATION_POINTS[0];
const SEALS = [
  '红龙', '白风', '蓝夜', '黄种子', '红蛇',
  '白世界桥', '蓝手', '黄星星', '红月', '白狗',
  '蓝猴', '黄人', '红天行者', '白巫师', '蓝鹰',
  '黄战士', '红地球', '白镜', '蓝风暴', '黄太阳'
];

const TONES = [
  '磁性', '月亮', '电力', '自我存在', '超频',
  '韵律', '共振', '银河', '太阳', '行星',
  '光谱', '水晶', '宇宙'
];

const TONE_TYPES = [
  '吸引目的', '极化挑战', '激活服务', '定义形式', '统领与获取力量',
  '平衡组织', '通灵引导', '和谐示范', '脉冲实现', '显化生产',
  '释放解放', '合作奉献', '超越临在'
];

function calculateWavespell(kin: number): { wavespell: number; wavespellName: string } {
  const wavespellIndex = Math.floor((kin - 1) / 13);
  const wavespellSeal = (wavespellIndex % 20) + 1;
  return {
    wavespell: wavespellIndex + 1,
    wavespellName: SEALS[wavespellSeal - 1]
  };
}

function calculateHiddenPower(kin: number): { hiddenPower: number; hiddenPowerName: string } {
  const hiddenPowerKin = 261 - kin;
  const hiddenPowerSeal = ((hiddenPowerKin - 1) % 20) + 1;
  return {
    hiddenPower: hiddenPowerKin,
    hiddenPowerName: SEALS[hiddenPowerSeal - 1]
  };
}

function getWavespellInfluence(wavespellName: string): string {
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
  return influences[wavespellName] || '独特的宇宙能量';
}

function getHeartDescription(kinData: KinData, profile: EnergyProfile, motherKin?: KinData): string {
  const { kin, sealName } = kinData;

  if (kin === 200) {
    return `开启度 95%（恒星模式）
   关联图腾：黄太阳、白狗、红月
   天生的正义感与博爱精神，你几乎无法对他人的苦难视而不见
   ⚠ 注意预防"救世主情结"导致的自我消耗
   你的心轮处于本质层显化状态，拥有深刻的爱与慈悲之力`;
  }

  if (profile.heart >= 85) {
    let desc = `开启度 ${profile.heart}%（本质层显化）\n`;
    if (motherKin?.kin === 200 && (kin === 243 || kin === 8)) {
      desc += `   💫 母体灌溉效应：受母体黄太阳推动力提前催化\n`;
      desc += `   你的心轮因母亲Kin 200的宇宙能量而高度开启`;
    } else {
      desc += `   你的心轮处于高度激活状态，拥有深刻的爱与慈悲之力`;
    }
    return desc;
  }

  if (profile.heart >= 70) {
    return `开启度 ${profile.heart}%（高度开启）\n   关联图腾：${['黄太阳', '白狗', '红月'].includes(sealName) ? sealName : '多个心轮图腾'}\n   你拥有稳定的情感能量与爱的表达能力`;
  }

  return `开启度 ${profile.heart}%（平衡发展）\n   你的心轮能量处于稳定状态，具备良好的发展潜力`;
}

function getThroatDescription(kinData: KinData, profile: EnergyProfile): string {
  const { kin, sealName, tone } = kinData;

  if (kin === 200) {
    return `开启度 85%（指挥官模式）
   关联：白风、蓝猴、第5调性（超频）
   言语具有穿透力，倾向于"定调"而非单纯沟通
   ⚠ 注意避免过于硬核、指令化的表达方式
   你说话时，人们会听；你决定时，事情会动`;
  }

  if (profile.throat >= 85) {
    return `开启度 ${profile.throat}%（指挥官模式）\n   你的言语具有强大的穿透力与影响力\n   ${[5, 10].includes(tone) ? '第' + tone + '调性强化了你的领导特质' : '你天生适合引导与统领'}`;
  }

  if (profile.throat >= 70) {
    return `开启度 ${profile.throat}%（高度开启）\n   关联图腾：${['白风', '蓝猴'].includes(sealName) ? sealName : '喉轮图腾'}\n   你拥有强大的表达与创造力，语言和声音是你的力量源泉`;
  }

  return `开启度 ${profile.throat}%（平衡发展）\n   你的表达能量处于稳定状态，具备良好的沟通能力`;
}

function getPinealDescription(kinData: KinData, profile: EnergyProfile): string {
  const { kin, wavespellName, sealName } = kinData;

  if (kin === 200) {
    return `开启度 70%（战略家模式）
   受黄战士波符影响，底层代码是"质疑与逻辑"
   直觉表现为极强的逻辑洞察力，而非纯粹的灵性感知
   你会本能地质疑一切，包括自己的善意是否真的有用`;
  }

  if (profile.pineal >= 70) {
    let desc = `开启度 ${profile.pineal}%（${wavespellName === '黄战士' ? '战略家' : '高度激活'}模式）\n`;
    if (wavespellName === '黄战士' || wavespellName === '蓝鹰' || wavespellName === '蓝夜') {
      desc += `   受${wavespellName}波符影响，你的直觉带有强烈的${wavespellName === '黄战士' ? '逻辑分析' : wavespellName === '蓝鹰' ? '远见洞察' : '深渊智慧'}特质`;
    } else {
      desc += `   你的第三眼高度激活，直觉敏锐，能感知多维度信息`;
    }
    return desc;
  }

  if (profile.pineal >= 60) {
    return `开启度 ${profile.pineal}%（高度开启）\n   关联图腾：${['蓝鹰', '蓝夜', '蓝手'].includes(sealName) ? sealName : '松果体图腾'}\n   你拥有良好的直觉与洞察能力`;
  }

  return `开启度 ${profile.pineal}%（平衡发展）\n   你的直觉能量处于稳定状态，具备良好的觉知潜力`;
}

// Kin能量画像描述
const KIN_PORTRAITS: Record<number, { mode: string; vision: string; essence: string }> = {
  200: {
    mode: '指挥官模式',
    vision: '全局统筹视角',
    essence: '超频黄太阳 - 宇宙光明的化身，天生的领导者与启蒙者，照亮他人前行的道路'
  },
  243: {
    mode: '上帝视角',
    vision: '深海冥想维度',
    essence: '太阳蓝夜 - 潜入意识深渊的探索者，在黑暗中觉知真理，将无形转化为有形'
  },
  8: {
    mode: '星际连接者',
    vision: '宇宙和谐频率',
    essence: '银河黄星 - 优雅美学的创造者，以和谐共振连接天地，将美与智慧编织成网'
  }
};

export function calculateKin(birthDate: Date, midnightType: 'early' | 'late' | null = null): KinData {
  // 找到最近的校准点来计算偏移
  let closestPoint = MAIN_CALIBRATION;
  let minDistance = Math.abs(birthDate.getTime() - MAIN_CALIBRATION.date.getTime());

  for (const point of CALIBRATION_POINTS) {
    const distance = Math.abs(birthDate.getTime() - point.date.getTime());
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  }

  // 计算与最近校准点的天数差
  const diffTime = birthDate.getTime() - closestPoint.date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 从校准Kin值开始计算
  let kin = closestPoint.kin + diffDays;

  // 确保在1-260范围内
  kin = ((kin - 1) % 260 + 260) % 260 + 1;

  const seal = ((kin - 1) % 20) + 1;
  const tone = ((kin - 1) % 13) + 1;
  const { wavespell, wavespellName } = calculateWavespell(kin);
  const { hiddenPower, hiddenPowerName } = calculateHiddenPower(kin);
  const toneType = TONE_TYPES[tone - 1];

  const result: KinData = {
    kin,
    seal,
    tone,
    sealName: SEALS[seal - 1],
    toneName: TONES[tone - 1],
    wavespell,
    wavespellName,
    hiddenPower,
    hiddenPowerName,
    toneType,
    midnightType
  };

  if (midnightType) {
    let secondaryDate = new Date(birthDate);

    if (midnightType === 'early') {
      // 前子时（23:00-00:00）：当天 + 次日（当天+1）
      secondaryDate.setDate(secondaryDate.getDate() + 1);
    } else {
      // 后子时（00:00-01:00）：当天 + 前日（当天-1）
      secondaryDate.setDate(secondaryDate.getDate() - 1);
    }

    const secondaryDiffDays = Math.floor((secondaryDate.getTime() - closestPoint.date.getTime()) / (1000 * 60 * 60 * 24));
    let secondaryKin = closestPoint.kin + secondaryDiffDays;
    secondaryKin = ((secondaryKin - 1) % 260 + 260) % 260 + 1;
    result.secondaryKin = secondaryKin;
  }

  return result;
}

export function calculateEnergyProfile(
  kinData: KinData,
  motherKin?: number,
  fatherKin?: number
): EnergyProfile {
  const { kin, seal, tone, midnightType, secondaryKin, wavespellName } = kinData;

  let throat = 0;
  let pineal = 0;
  let heart = 0;

  // 特殊处理 Kin 200: 超频的黄太阳（黄战士波符）
  if (kin === 200) {
    heart = 70;      // 基础心轮（黄太阳）
    throat = 55;     // 基础喉轮（白风关联）
    pineal = 45;     // 基础松果体（黄战士波符）

    // 黄战士波符影响：注入"质疑与逻辑"底色
    pineal += 25;    // 战略家模式：逻辑洞察力

    // 超频调性（第5调性）：统领与获取力量
    throat += 30;    // 指挥官模式：言语穿透力
    heart += 25;     // 恒星模式：天生正义感与博爱

    return {
      throat: Math.min(100, throat),  // 85%
      pineal: Math.min(100, pineal),  // 70%
      heart: Math.min(100, heart)     // 95%
    };
  }
  // 印记基础能量（基于20个图腾）
  // 黄太阳(20) = 心轮主导型
  else if (seal === 20) {
    heart = 70;      // 基础心轮
    throat = 55;     // 基础喉轮
    pineal = 45;     // 基础松果体
  }
  // 蓝夜(3) = 松果体主导型
  else if (seal === 3) {
    pineal = 70;
    heart = 50;
    throat = 45;
  }
  // 黄星星(8) = 和谐型
  else if (seal === 8) {
    heart = 60;
    throat = 55;
    pineal = 55;
  }
  // 白风(2), 白世界桥(6), 白巫师(14), 白镜(18) = 喉轮型
  else if ([2, 6, 14, 18].includes(seal)) {
    throat = 60;
    pineal = 50;
    heart = 45;
  }
  // 红龙(1), 红蛇(5), 红月(9), 红天行者(13), 红地球(17) = 心轮型
  else if ([1, 5, 9, 13, 17].includes(seal)) {
    heart = 60;
    pineal = 50;
    throat = 45;
  }
  // 蓝手(7), 蓝猴(11), 蓝鹰(15), 蓝风暴(19) = 松果体型
  else if ([7, 11, 15, 19].includes(seal)) {
    pineal = 65;
    throat = 48;
    heart = 47;
  }
  // 黄种子(4), 黄人(12), 黄战士(16) = 平衡型
  else if ([4, 12, 16].includes(seal)) {
    throat = 52;
    pineal = 52;
    heart = 52;
  }
  // 白狗(10) = 心轮型
  else if (seal === 10) {
    heart = 62;
    throat = 48;
    pineal = 48;
  }
  // 默认
  else {
    throat = 50;
    pineal = 50;
    heart = 50;
  }

  // 音调修正（13个调性）
  // 超频(5) = 强化所有能量中心
  if (tone === 5) {
    throat += 30;
    pineal += 25;
    heart += 25;
  }
  // 太阳(9) = 显化力量，心轮和喉轮增强
  else if (tone === 9) {
    throat += 20;
    heart += 18;
    pineal += 12;
  }
  // 银河(8) = 松果体增强
  else if (tone === 8) {
    pineal += 25;
    throat += 15;
    heart += 12;
  }
  // 共振(7) = 全面调和
  else if (tone === 7) {
    throat += 15;
    pineal += 15;
    heart += 15;
  }
  // 磁性(1), 宇宙(13) = 喉轮强化
  else if ([1, 13].includes(tone)) {
    throat += 15;
    pineal += 10;
    heart += 10;
  }
  // 月亮(2), 韵律(6), 行星(10) = 心轮强化
  else if ([2, 6, 10].includes(tone)) {
    heart += 15;
    throat += 8;
    pineal += 8;
  }
  // 电力(3), 光谱(11) = 松果体强化
  else if ([3, 11].includes(tone)) {
    pineal += 18;
    throat += 10;
    heart += 8;
  }
  // 自我存在(4), 水晶(12) = 平衡强化
  else if ([4, 12].includes(tone)) {
    throat += 12;
    pineal += 12;
    heart += 12;
  }

  // 子时逻辑：双印记叠加，取松果体最高值
  if (midnightType && secondaryKin) {
    const secondarySeal = ((secondaryKin - 1) % 20) + 1;
    const secondaryTone = ((secondaryKin - 1) % 13) + 1;

    // 计算次印记的松果体能量
    let secondaryPineal = 50;

    if ([2, 6, 10, 14, 18].includes(secondarySeal)) {
      secondaryPineal += 10;
    }

    if ([1, 5, 9, 13, 17].includes(secondarySeal)) {
      secondaryPineal += 15;
    }

    if ([3, 7, 11, 15, 19].includes(secondarySeal)) {
      secondaryPineal += 25;
    }

    if ([3, 7, 11].includes(secondaryTone)) {
      secondaryPineal += 10;
    }

    // 取两个印记的松果体最高值
    pineal = Math.max(pineal, secondaryPineal);

    // 双印记额外加成
    if ([2, 6, 10, 14, 18].includes(secondarySeal)) {
      throat += 10;
    }

    if ([1, 5, 9, 13, 17].includes(secondarySeal)) {
      heart += 10;
    }

    if ([3, 7, 11, 15, 19].includes(secondarySeal)) {
      throat += 5;
    }

    if ([4, 8, 12, 16, 20].includes(secondarySeal)) {
      heart += 8;
      throat += 8;
    }
  }

  // 量子共振算法：母体灌溉
  if (motherKin) {
    if (motherKin === 200 && (kin === 243 || kin === 8)) {
      // 母体灌溉：Kin 200母亲（超频黄太阳） + Kin 243或8子女
      // 黄太阳的推动力提前催化，心轮动态上调至85%以上
      heart = Math.max(heart, 85 + Math.floor(Math.random() * 4));
    }
  }

  return {
    throat: Math.min(100, throat),
    pineal: Math.min(100, pineal),
    heart: Math.min(100, heart)
  };
}

export function calculateFamilyCollision(
  userProfile: EnergyProfile,
  userKin: KinData,
  relativeProfile: EnergyProfile,
  relativeKin: KinData,
  relation: 'father' | 'mother' | 'child'
): EnergyProfile {
  const adjusted = { ...userProfile };

  const kinDiff = Math.abs(userKin.kin - relativeKin.kin);
  const sealDiff = Math.abs(userKin.seal - relativeKin.seal);
  const toneDiff = Math.abs(userKin.tone - relativeKin.tone);

  if (relation === 'mother') {
    if (sealDiff <= 3) {
      adjusted.heart += 10;
    }
    if (toneDiff <= 2) {
      adjusted.pineal += 8;
    }
    if (kinDiff >= 100 && kinDiff <= 150) {
      adjusted.throat += 12;
    }
  }

  if (relation === 'father') {
    if (sealDiff <= 3) {
      adjusted.throat += 10;
    }
    if (toneDiff <= 2) {
      adjusted.heart += 8;
    }
    if (kinDiff >= 80 && kinDiff <= 130) {
      adjusted.pineal += 12;
    }
  }

  if (relation === 'child') {
    if (sealDiff <= 4) {
      adjusted.heart += 15;
      adjusted.pineal += 10;
    }
    if (toneDiff === 0) {
      adjusted.throat += 15;
    }
  }

  return {
    throat: Math.min(100, adjusted.throat),
    pineal: Math.min(100, adjusted.pineal),
    heart: Math.min(100, adjusted.heart)
  };
}

export function getEnergyLevelDescription(value: number): { level: string; description: string } {
  if (value < 50) {
    return {
      level: '待开启/枯竭型',
      description: '能量中心尚未充分激活，需要更多的内在探索与修炼'
    };
  } else if (value >= 50 && value < 80) {
    return {
      level: '平衡型',
      description: '能量中心处于稳定状态，具备良好的发展潜力'
    };
  } else {
    return {
      level: '溢出/天赋型',
      description: '能量中心高度激活，拥有强大的天赋与表达能力'
    };
  }
}

export function detectRelationshipSynergy(
  userKin: KinData,
  relativeKin: KinData,
  relation: 'father' | 'mother' | 'child'
): RelationshipSynergy {
  const kinDiff = Math.abs(userKin.kin - relativeKin.kin);
  const sealDiff = Math.abs(userKin.seal - relativeKin.seal);
  const toneDiff = Math.abs(userKin.tone - relativeKin.tone);

  if (relation === 'mother' || relation === 'child') {
    if (sealDiff <= 2 && toneDiff <= 1) {
      return {
        hasSynergy: true,
        type: 'mutual-push',
        strength: 0.9
      };
    }

    if (kinDiff >= 40 && kinDiff <= 43) {
      return {
        hasSynergy: true,
        type: 'harmonic-resonance',
        strength: 0.85
      };
    }

    if ((userKin.kin + relativeKin.kin) % 13 === 0) {
      return {
        hasSynergy: true,
        type: 'energy-amplify',
        strength: 0.8
      };
    }
  }

  if (relation === 'father') {
    if (sealDiff <= 3 && kinDiff >= 50 && kinDiff <= 80) {
      return {
        hasSynergy: true,
        type: 'mutual-push',
        strength: 0.75
      };
    }
  }

  return {
    hasSynergy: false,
    type: null,
    strength: 0
  };
}

export function generateDeepPortrait(kinData: KinData, profile: EnergyProfile): string {
  const { kin, sealName, wavespellName, hiddenPowerName, toneName } = kinData;

  if (kin === 200) {
    return `
### 深度画像：太阳的心与战士的魂

亲爱的超频黄太阳，你的存在本身就是一个矛盾的艺术品。

你的核心印记是**黄太阳**——宇宙光明的化身，天生的正义感与博爱精神让你总想照亮他人的道路。你的心轮开启度高达**${profile.heart}%**（恒星模式），这意味着你几乎无法对他人的苦难视而不见。你渴望成为那个带来希望的人，像太阳一样无私地散发温暖。

然而，你的底层代码却是**黄战士波符**——质疑、逻辑、战斗与智慧的底色。这让你的松果体以**${profile.pineal}%**（战略家模式）的强度运作，你的直觉表现为极强的逻辑洞察力。你会本能地质疑一切，包括自己的善意是否真的有用，你的光明是否只是一种自我安慰。

更有趣的是，你的第5调性（超频）赋予你**"统领与获取力量"**的特质。你的喉轮高达**${profile.throat}%**（指挥官模式），你的言语具有穿透力，你倾向于"定调"而非单纯沟通。你说话时，人们会听；你决定时，事情会动。

**这就是你的拉扯：**
- 太阳想要温暖所有人，战士却要求你先确认谁值得被照亮
- 心轮想要无条件的爱，松果体却冷静地分析每一份付出的成本
- 超频调性让你天生适合领导，但黄太阳的能量又让你害怕"救世主情结"导致的自我消耗

你不是简单的"光明使者"，你是**带着战略思维的太阳，用逻辑守护博爱的战士**。

你的挑战是：如何在照亮他人的同时，不让自己燃烧殆尽？如何在统领全局时，不变成过于硬核、指令化的指挥官？

你的礼物是：当你学会用战士的智慧守护太阳的光芒时，你将成为这个世界最稀缺的存在——**既有温度又有锋芒的光**。
    `.trim();
  }

  if (kin === 243) {
    return `
### 深度画像：深海中的太阳光束

你是**太阳蓝夜**（Kin 243），一个在黑暗中寻找光明的探索者。

你的核心印记**蓝夜**让你天生拥有潜入意识深渊的能力，你的松果体高度激活，你能感知到常人看不见的维度。你喜欢独处、冥想、探索那些无形的真理。你的世界是深海，是梦境，是那些说不清道不明的直觉。

但你的调性是**太阳**（第9调性），这意味着你必须**显化**，必须把那些深海中的宝藏带到地表。你不能永远躲在自己的内在世界里，你的使命是将无形转化为有形。

**这就是你的矛盾：**
- 蓝夜想要停留在深处，太阳调性却要求你浮出水面
- 你的直觉告诉你真理在沉默中，但你的使命是把它说出来
- 你害怕被世俗的光芒刺伤眼睛，但你又必须成为那束穿透深海的光

${profile.heart >= 85 ? `\n值得注意的是，你的心轮开启度达到了**${profile.heart}%**——这可能是因为你的母亲是Kin 200（超频黄太阳）。她的光明能量为你的深海冥想提供了温暖与方向，让你在探索意识深渊时永远不会迷失。这是**母体灌溉**的力量，黄太阳的推动力提前催化了你的心轮。\n` : ''}

你的礼物是：当你学会在深海与地表之间自由穿梭时，你将成为**连接意识深处与现实世界的桥梁**。
    `.trim();
  }

  if (kin === 8) {
    return `
### 深度画像：编织宇宙之网的星际建筑师

你是**银河黄星**（Kin 8），优雅美学的创造者，用和谐共振连接天地的星际建筑师。

你的核心印记**黄星**让你对美、和谐、平衡有着近乎本能的追求。你能看到事物之间的关联，你擅长编织网络，让原本分散的元素形成优雅的整体。你的能量配置相对均衡，这本身就是一种艺术。

你的调性是**银河**（第8调性），这赋予你**和谐示范**的使命。你不仅要追求美，还要把这份美展现给世界，成为他人的参照系。

**你的特质：**
- 你天生懂得如何让事物"看起来对"——无论是设计、关系还是生活方式
- 你的存在本身就是一种美学教育，人们会不自觉地被你的和谐频率吸引
- 你擅长连接，像星网一样把人与人、想法与想法编织在一起

${profile.heart >= 85 ? `\n你的心轮开启度达到**${profile.heart}%**，这很可能受到了母亲Kin 200（超频黄太阳）的能量加持。她的宇宙视野激活了你的和谐共振能力，让你将美与智慧编织成网的天赋得到了提前催化。这是**母体灌溉**效应。\n` : ''}

你的挑战是：如何在追求完美和谐的同时，不陷入过度控制或完美主义？

你的礼物是：当你学会放松控制，信任宇宙本身的和谐时，你将成为**自然流动的美学大师**。
    `.trim();
  }

  return `
### 深度画像

**${sealName} · ${toneName}** · 所属${wavespellName}波符

你的核心印记是**${sealName}**，这决定了你的基本能量特质。
你的调性是**${toneName}**，这赋予你独特的表达方式与人生课题。
你的底层代码来自**${wavespellName}波符**，这为你的性格注入了深层的底色。
你的隐藏推动力是**${hiddenPowerName}**，在关键时刻为你提供支持。

你的能量配置：
- 心轮 ${profile.heart}% ${profile.heart >= 85 ? '（恒星模式：天生的爱与慈悲）' : profile.heart >= 70 ? '（高度开启）' : '（平衡发展）'}
- 喉轮 ${profile.throat}% ${profile.throat >= 85 ? '（指挥官模式：穿透性表达）' : profile.throat >= 70 ? '（高度开启）' : '（平衡发展）'}
- 松果体 ${profile.pineal}% ${profile.pineal >= 70 ? '（战略家模式：逻辑洞察力）' : profile.pineal >= 60 ? '（高度开启）' : '（平衡发展）'}

这个独特的组合造就了你的多维存在。
  `.trim();
}

export function generateEnergyReport(
  kinData: KinData,
  profile: EnergyProfile,
  motherKin?: KinData,
  fatherKin?: KinData,
  synergies?: RelationshipSynergy[]
): string {
  const throatDesc = getEnergyLevelDescription(profile.throat);
  const pinealDesc = getEnergyLevelDescription(profile.pineal);
  const heartDesc = getEnergyLevelDescription(profile.heart);

  // 获取Kin画像
  const portrait = KIN_PORTRAITS[kinData.kin];
  let portraitText = '';
  if (portrait) {
    portraitText = `\n\n【能量画像】\n模式：${portrait.mode}\n视角：${portrait.vision}\n本质：${portrait.essence}`;
  }

  // 家族场域解读
  let familyFieldText = '';
  if (motherKin || fatherKin) {
    familyFieldText = '\n\n【家族场域解读】\n';

    if (motherKin) {
      const motherPortrait = KIN_PORTRAITS[motherKin.kin];
      familyFieldText += `\n母亲印记：Kin ${motherKin.kin} - ${motherKin.sealName} ${motherKin.toneName}\n`;

      if (motherKin.kin === 200 && (kinData.kin === 243 || kinData.kin === 8)) {
        familyFieldText += `母体滋养效应已激活：黄太阳的光明照亮${kinData.kin === 243 ? '蓝夜的深海' : '黄星的星网'}，\n`;
        familyFieldText += `你的心轮因母爱的宇宙能量而高度开启（${profile.heart}%），这是本质层的显化力量。\n`;
      }

      if (motherPortrait && portrait) {
        if (motherKin.kin === 200 && kinData.kin === 243) {
          familyFieldText += `\n能量互动：指挥官之光穿透上帝视角的黑暗，母亲的太阳能量为你的深海冥想提供温暖与方向，\n`;
          familyFieldText += `你在探索意识深渊时永远不会迷失，因为有光明在守护。\n`;
        } else if (motherKin.kin === 200 && kinData.kin === 8) {
          familyFieldText += `\n能量互动：太阳之母孕育星际连接者，她的光明激活你的和谐共振能力，\n`;
          familyFieldText += `你将美与智慧编织成网的天赋源自母体的宇宙视野。\n`;
        }
      }
    }

    if (fatherKin) {
      familyFieldText += `\n父亲印记：Kin ${fatherKin.kin} - ${fatherKin.sealName} ${fatherKin.toneName}\n`;
      familyFieldText += `父亲的能量为你的松果体与喉轮发展提供独特的支持。\n`;
    }
  }

  // 能量共振关系
  let synergyText = '';
  if (synergies && synergies.some(s => s.hasSynergy)) {
    const activeSynergies = synergies.filter(s => s.hasSynergy);
    synergyText = '\n\n【量子共振关系】\n';
    activeSynergies.forEach(s => {
      if (s.type === 'mutual-push') {
        synergyText += '• 互为推动 - 你与家人形成强大的能量循环，彼此加速灵性成长\n';
      } else if (s.type === 'harmonic-resonance') {
        synergyText += '• 和谐共鸣 - 在深层意识维度同频共振，心灵无缝连接\n';
      } else if (s.type === 'energy-amplify') {
        synergyText += '• 能量倍增 - 家族能量场相互叠加，产生1+1>2的量子效应\n';
      }
    });
  }

  return `
【先天版本分析】

Kin ${kinData.kin} · ${kinData.toneName}的${kinData.sealName}${kinData.midnightType ? ` · ${kinData.midnightType === 'early' ? '前子时' : '后子时'}双印记` : ''}

【核心计算维度】

◆ 核心印记（Solar Seal & Tone）
   ${kinData.toneName}的${kinData.sealName}

◆ 所属波符（Wavespell）
   ${kinData.wavespellName}波符（第${kinData.wavespell}波符）
   底层底色：${getWavespellInfluence(kinData.wavespellName)}

◆ 隐藏推动力（Hidden Power）
   ${kinData.hiddenPowerName}（Kin ${kinData.hiddenPower}）
   在关键时刻为你提供支持与推动

◆ 调性特质（Tone Type）
   第${kinData.tone}调性：${kinData.toneType}
${portraitText}

【能量中心解析】

◆ 心轮（Heart）：${profile.heart}%
   ${getHeartDescription(kinData, profile, motherKin)}

◆ 喉轮（Throat）：${profile.throat}%
   ${getThroatDescription(kinData, profile)}

◆ 松果体（Pineal）：${profile.pineal}%
   ${getPinealDescription(kinData, profile)}
${familyFieldText}${synergyText}

【综合评估】
${profile.throat > 80 || profile.pineal > 80 || profile.heart > 80
  ? `你拥有至少一项天赋型能量中心，这是宇宙赋予的珍贵礼物。\n通过有意识地运用这些天赋，你将成为照亮他人的光。`
  : `你的能量配置均衡稳定，每个中心都蕴含巨大的觉醒潜力。\n通过持续的内在修炼与觉察，你将逐步解锁完整的宇宙蓝图。`}
  `.trim();
}
