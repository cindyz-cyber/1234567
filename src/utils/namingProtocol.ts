import { ChakraEnergy } from './voiceAnalysis';

interface ChakraNamingInfo {
  coreIdentity: string;
  element: string;
  energyFlow: string;
  colorName: string;
}

const CHAKRA_NAMING_MATRIX: Record<string, ChakraNamingInfo> = {
  root: {
    coreIdentity: '扎根者',
    element: '土',
    energyFlow: '向下扎根，凝实于物质',
    colorName: '红'
  },
  sacral: {
    coreIdentity: '创造者',
    element: '水',
    energyFlow: '如水般流动，滋养情感',
    colorName: '橙'
  },
  solar: {
    coreIdentity: '意志者',
    element: '火',
    energyFlow: '如火般燃烧，点燃行动',
    colorName: '黄'
  },
  heart: {
    coreIdentity: '爱者',
    element: '风',
    energyFlow: '在中轴稳固流转',
    colorName: '绿'
  },
  throat: {
    coreIdentity: '传达者',
    element: '以太',
    energyFlow: '向外宣发，化为言语',
    colorName: '蓝'
  },
  thirdEye: {
    coreIdentity: '觉知者',
    element: '光',
    energyFlow: '向内洞察，照见真相',
    colorName: '靛'
  },
  crown: {
    coreIdentity: '连接者',
    element: '思维',
    energyFlow: '向上升华，触及灵性',
    colorName: '紫'
  }
};

const QUALITY_DESCRIPTORS = {
  smooth: {
    sensory: '通透',
    alternate: '润泽',
    quality: '流畅',
    metaphor: '清泉',
    energyState: '自洽且顺畅'
  },
  rough: {
    sensory: '防御',
    alternate: '紧绷',
    quality: '带劲',
    metaphor: '荆棘',
    energyState: '警觉且有力'
  },
  flat: {
    sensory: '沉稳',
    alternate: '静默',
    quality: '平稳',
    metaphor: '湖面',
    energyState: '内敛且稳定'
  }
};

const PHASE_DESCRIPTORS = {
  grounded: {
    spatial: '落地',
    alternate: '务实',
    direction: '向下',
    realm: '大地',
    energyPattern: '你的能量如{metaphor}般向下扎根'
  },
  floating: {
    spatial: '云端',
    alternate: '理想',
    direction: '向上',
    realm: '天空',
    energyPattern: '你的能量如{metaphor}般向上升华'
  },
  dispersed: {
    spatial: '自由',
    alternate: '游走',
    direction: '四散',
    realm: '虚空',
    energyPattern: '你的能量如{metaphor}般自由流动'
  }
};

interface NamingResult {
  tagName: string;
  coloredTitle: string;
  summary: string;
  metaphor: string;
}

function getDominantChakra(chakraEnergy: ChakraEnergy): keyof ChakraEnergy {
  let maxChakra: keyof ChakraEnergy = 'heart';
  let maxValue = 0;

  for (const [chakra, value] of Object.entries(chakraEnergy) as [keyof ChakraEnergy, number][]) {
    if (value > maxValue) {
      maxValue = value;
      maxChakra = chakra;
    }
  }

  return maxChakra;
}

function getWeakestChakra(chakraEnergy: ChakraEnergy): keyof ChakraEnergy {
  let minChakra: keyof ChakraEnergy = 'root';
  let minValue = 1;

  for (const [chakra, value] of Object.entries(chakraEnergy) as [keyof ChakraEnergy, number][]) {
    if (value < minValue) {
      minValue = value;
      minChakra = chakra;
    }
  }

  return minChakra;
}

export function generatePoeticName(
  chakraEnergy: ChakraEnergy,
  phase: 'grounded' | 'floating' | 'dispersed',
  quality: 'smooth' | 'rough' | 'flat'
): NamingResult {
  const dominantChakra = getDominantChakra(chakraEnergy);
  const weakestChakra = getWeakestChakra(chakraEnergy);

  const chakraInfo = CHAKRA_NAMING_MATRIX[dominantChakra];
  const qualityInfo = QUALITY_DESCRIPTORS[quality];
  const phaseInfo = PHASE_DESCRIPTORS[phase];
  const gapChakraInfo = CHAKRA_NAMING_MATRIX[weakestChakra];

  const modifier = buildModifier(phase, quality, phaseInfo, qualityInfo);
  const tagName = `${modifier}的${chakraInfo.coreIdentity}`;

  const coloredTitle = `${chakraInfo.colorName}色${tagName}`;

  const metaphor = qualityInfo.metaphor;
  const energyPattern = phaseInfo.energyPattern.replace('{metaphor}', metaphor);

  const firstSentence = coloredTitle;

  const secondSentence = buildEnergyDescription(
    chakraInfo,
    qualityInfo,
    energyPattern,
    phase,
    dominantChakra
  );

  const thirdSentence = buildGuidance(weakestChakra, gapChakraInfo, dominantChakra, chakraInfo);

  const summary = `${firstSentence}。${secondSentence}${thirdSentence}`;

  return {
    tagName,
    coloredTitle,
    summary,
    metaphor
  };
}

function buildModifier(
  phase: 'grounded' | 'floating' | 'dispersed',
  quality: 'smooth' | 'rough' | 'flat',
  phaseInfo: typeof PHASE_DESCRIPTORS[keyof typeof PHASE_DESCRIPTORS],
  qualityInfo: typeof QUALITY_DESCRIPTORS[keyof typeof QUALITY_DESCRIPTORS]
): string {
  if (quality === 'smooth') {
    return phaseInfo.alternate;
  }

  if (quality === 'rough') {
    return qualityInfo.sensory;
  }

  if (phase === 'floating') {
    return phaseInfo.spatial;
  }

  return qualityInfo.alternate;
}

function buildEnergyDescription(
  chakraInfo: ChakraNamingInfo,
  qualityInfo: typeof QUALITY_DESCRIPTORS[keyof typeof QUALITY_DESCRIPTORS],
  energyPattern: string,
  phase: 'grounded' | 'floating' | 'dispersed',
  dominantChakra: keyof ChakraEnergy
): string {
  if (dominantChakra === 'heart') {
    if (phase === 'grounded') {
      return `${energyPattern}，心轮的宽广正转化为大地的厚重。`;
    }
    if (phase === 'floating') {
      return `${energyPattern}，慈悲心正化为灵性的光芒。`;
    }
    return `${chakraInfo.energyFlow}，爱意在各个维度自由延展。`;
  }

  if (dominantChakra === 'throat') {
    return `${energyPattern}，声音承载着真实的表达。`;
  }

  if (dominantChakra === 'thirdEye') {
    return `${energyPattern}，智慧之眼正在开启。`;
  }

  if (dominantChakra === 'crown') {
    return `${energyPattern}，灵性连接已然建立。`;
  }

  if (dominantChakra === 'solar') {
    return `${energyPattern}，意志之火正在燃烧。`;
  }

  if (dominantChakra === 'sacral') {
    return `${energyPattern}，创造力如水般涌动。`;
  }

  return `${energyPattern}，能量在${chakraInfo.element}元素中流动。`;
}

function buildGuidance(
  weakestChakra: keyof ChakraEnergy,
  gapChakraInfo: ChakraNamingInfo,
  dominantChakra: keyof ChakraEnergy,
  dominantInfo: ChakraNamingInfo
): string {
  const chakraGuidance: Record<keyof ChakraEnergy, string> = {
    root: '建议加强海底轮扎根练习，让能量更稳固地立于大地',
    sacral: '建议滋养脐轮，让情感之水自由流淌',
    solar: '建议点燃太阳轮，让意志之火更加旺盛',
    heart: '建议开启心轮，让爱的能量充盈全身',
    throat: '建议微调喉轮频率，让内在真实更自由地表达',
    thirdEye: '建议激活眉心轮，让直觉与洞察力苏醒',
    crown: '建议连接顶轮，让灵性之光照进生命'
  };

  if (dominantChakra === 'heart' && weakestChakra === 'throat') {
    return '建议微调喉轮频率，让爱意更自由地表达。';
  }

  if (dominantChakra === 'throat' && weakestChakra === 'heart') {
    return '建议补充心轮能量，让表达更有温度与慈悲。';
  }

  if (weakestChakra === 'root' && (dominantChakra === 'thirdEye' || dominantChakra === 'crown')) {
    return '建议加强海底轮扎根，让灵性连接更稳固地落地。';
  }

  return `${chakraGuidance[weakestChakra]}。`;
}

export function generateEnhancedDescription(
  chakraEnergy: ChakraEnergy,
  phase: 'grounded' | 'floating' | 'dispersed',
  quality: 'smooth' | 'rough' | 'flat',
  coreFrequency: number
): string {
  const dominantChakra = getDominantChakra(chakraEnergy);
  const chakraInfo = CHAKRA_NAMING_MATRIX[dominantChakra];
  const qualityInfo = QUALITY_DESCRIPTORS[quality];

  const physicalDef = `核心频率${coreFrequency.toFixed(0)}Hz，${chakraInfo.coreIdentity}能量主导，${qualityInfo.energyState}`;

  const somaticMeaning = `${chakraInfo.element}元素流动，${chakraInfo.energyFlow}`;

  return `物理定义：${physicalDef}。体感意义：${somaticMeaning}。`;
}
