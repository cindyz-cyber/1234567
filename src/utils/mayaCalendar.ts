export interface KinData {
  kin: number;
  seal: number;
  tone: number;
  sealName: string;
  toneName: string;
  isMidnightBirth?: boolean;
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

export function calculateKin(birthDate: Date, isMidnightBirth: boolean = false): KinData {
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

  const result: KinData = {
    kin,
    seal,
    tone,
    sealName: SEALS[seal - 1],
    toneName: TONES[tone - 1],
    isMidnightBirth
  };

  if (isMidnightBirth) {
    // 子时出生：同时拥有当天和次日的印记（双印记能量叠加）
    const nextDayDate = new Date(birthDate);
    nextDayDate.setDate(nextDayDate.getDate() + 1);
    const nextDiffDays = Math.floor((nextDayDate.getTime() - closestPoint.date.getTime()) / (1000 * 60 * 60 * 24));
    let nextKin = closestPoint.kin + nextDiffDays;
    nextKin = ((nextKin - 1) % 260 + 260) % 260 + 1;
    result.secondaryKin = nextKin;
  }

  return result;
}

export function calculateEnergyProfile(
  kinData: KinData,
  motherKin?: number,
  fatherKin?: number
): EnergyProfile {
  const { kin, seal, tone, isMidnightBirth, secondaryKin } = kinData;

  let throat = 50;
  let pineal = 50;
  let heart = 50;

  // 主印记能量计算
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

  // 音调能量修正
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

  // 子时逻辑：双印记叠加，取松果体最高值
  if (isMidnightBirth && secondaryKin) {
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

  // 量子共振算法：母体滋养
  if (motherKin) {
    if (motherKin === 200 && (kin === 243 || kin === 8)) {
      // Kin 200母亲 + Kin 243或8子女 = 心轮85-88%（本质层显化）
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

Kin ${kinData.kin} · ${kinData.sealName} · ${kinData.toneName}${kinData.isMidnightBirth ? ' · 子时双印记' : ''}
${portraitText}

【能量中心解析】

◆ 喉轮能量：${profile.throat}% - ${throatDesc.level}
   ${throatDesc.description}
   ${profile.throat > 80 ? '你拥有强大的表达与创造力，语言和声音是你的力量源泉。' : ''}

◆ 松果体能量：${profile.pineal}% - ${pinealDesc.level}
   ${pinealDesc.description}
   ${profile.pineal > 80 ? '你的第三眼高度激活，直觉敏锐，能感知多维度信息。' : ''}
   ${kinData.isMidnightBirth && kinData.secondaryKin ? `\n   子时双印记加持：已从Kin ${kinData.kin}与Kin ${kinData.secondaryKin}中提取最高松果体频率` : ''}

◆ 心轮能量：${profile.heart}% - ${heartDesc.level}
   ${heartDesc.description}
   ${profile.heart >= 85 ? '你的心轮处于本质层显化状态，拥有深刻的爱与慈悲之力。' : ''}
${familyFieldText}${synergyText}

【综合评估】
${profile.throat > 80 || profile.pineal > 80 || profile.heart > 80
  ? `你拥有至少一项天赋型能量中心，这是宇宙赋予的珍贵礼物。\n通过有意识地运用这些天赋，你将成为照亮他人的光。`
  : `你的能量配置均衡稳定，每个中心都蕴含巨大的觉醒潜力。\n通过持续的内在修炼与觉察，你将逐步解锁完整的宇宙蓝图。`}
  `.trim();
}
