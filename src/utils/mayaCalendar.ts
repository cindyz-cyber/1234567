export interface KinData {
  kin: number;
  seal: number;
  tone: number;
  sealName: string;
  toneName: string;
}

export interface EnergyProfile {
  throat: number;
  pineal: number;
  heart: number;
}

const TZOLKIN_START = new Date('1987-07-26');
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

export function calculateKin(birthDate: Date): KinData {
  const diffTime = birthDate.getTime() - TZOLKIN_START.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const kin = ((diffDays % 260) + 260) % 260 || 260;

  const seal = ((kin - 1) % 20) + 1;
  const tone = ((kin - 1) % 13) + 1;

  return {
    kin,
    seal,
    tone,
    sealName: SEALS[seal - 1],
    toneName: TONES[tone - 1]
  };
}

export function calculateEnergyProfile(kinData: KinData): EnergyProfile {
  const { seal, tone } = kinData;

  let throat = 50;
  let pineal = 50;
  let heart = 50;

  if ([2, 6, 10, 14, 18].includes(seal)) {
    throat += 20;
    pineal += 10;
  }

  if ([1, 5, 9, 13, 17].includes(seal)) {
    heart += 20;
    pineal += 15;
  }

  if ([3, 7, 11, 15, 19].includes(seal)) {
    pineal += 25;
    throat += 10;
  }

  if ([4, 8, 12, 16, 20].includes(seal)) {
    heart += 15;
    throat += 15;
  }

  if ([1, 5, 9, 13].includes(tone)) {
    throat += 5;
  }

  if ([2, 6, 10].includes(tone)) {
    heart += 8;
  }

  if ([3, 7, 11].includes(tone)) {
    pineal += 10;
  }

  if ([4, 8, 12].includes(tone)) {
    throat += 7;
    heart += 7;
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

export function generateEnergyReport(
  kinData: KinData,
  profile: EnergyProfile
): string {
  const throatDesc = getEnergyLevelDescription(profile.throat);
  const pinealDesc = getEnergyLevelDescription(profile.pineal);
  const heartDesc = getEnergyLevelDescription(profile.heart);

  return `
【先天能量版本画像】

Kin ${kinData.kin} · ${kinData.sealName} · ${kinData.toneName}

喉轮能量：${profile.throat}% - ${throatDesc.level}
${throatDesc.description}

松果体能量：${profile.pineal}% - ${pinealDesc.level}
${pinealDesc.description}

心轮能量：${profile.heart}% - ${heartDesc.level}
${heartDesc.description}

综合评估：
${profile.throat > 80 || profile.pineal > 80 || profile.heart > 80
  ? '你拥有至少一项高度激活的能量中心，这是珍贵的天赋。善用这份力量，将为你的人生带来独特的优势。'
  : '你的能量配置均衡稳定，通过持续的内在修炼，每个能量中心都有巨大的提升空间。'}
  `.trim();
}
