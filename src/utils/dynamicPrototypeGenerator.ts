import { ChakraEnergy } from './voiceAnalysis';

interface ChakraInfo {
  name: string;
  colorDesc: string;
  color: string;
  frequency: number;
  organs: string[];
  element: string;
}

const CHAKRA_MATRIX: Record<keyof ChakraEnergy, ChakraInfo> = {
  root: {
    name: '海底轮',
    colorDesc: '红色',
    color: '#C41E3A',
    frequency: 194,
    organs: ['肾', '膀胱', '大肠', '骨骼'],
    element: '土'
  },
  sacral: {
    name: '脐轮',
    colorDesc: '橙色',
    color: '#FF8C00',
    frequency: 417,
    organs: ['生殖系统', '膀胱', '肾'],
    element: '水'
  },
  solar: {
    name: '太阳轮',
    colorDesc: '黄色',
    color: '#FFD700',
    frequency: 528,
    organs: ['脾', '胃', '肝', '胆'],
    element: '火'
  },
  heart: {
    name: '心轮',
    colorDesc: '绿色',
    color: '#00FF7F',
    frequency: 343,
    organs: ['心', '小肠', '肺', '心包'],
    element: '风'
  },
  throat: {
    name: '喉轮',
    colorDesc: '蓝色',
    color: '#4169E1',
    frequency: 384,
    organs: ['甲状腺', '咽喉', '大肠'],
    element: '以太'
  },
  thirdEye: {
    name: '眉心轮',
    colorDesc: '靛蓝色',
    color: '#4B0082',
    frequency: 432,
    organs: ['脑垂体', '松果体', '眼睛'],
    element: '光'
  },
  crown: {
    name: '顶轮',
    colorDesc: '紫白色',
    color: '#E6E6FA',
    frequency: 963,
    organs: ['大脑', '神经系统'],
    element: '思维'
  }
};

const TEXTURE_DESCRIPTORS = {
  smooth: {
    positive: '流畅',
    personality: '自洽的表达者',
    quality: '能量流转顺畅，表达清晰有力'
  },
  rough: {
    positive: '带劲',
    personality: '带刺的守护者',
    quality: '能量带有防御性，表达有力度但略显紧绷'
  },
  flat: {
    positive: '稳定',
    personality: '静默的观察者',
    quality: '能量平稳内敛，表达含蓄稳重'
  }
};

const PHASE_DESCRIPTORS = {
  grounded: {
    identity: '扎根者',
    direction: '能量向下扎根',
    strength: '物质显化力强',
    advice: '关注能量的向上提升'
  },
  floating: {
    identity: '灵性接收者',
    direction: '能量向上宣发',
    strength: '灵性感知力强',
    advice: '建议加强海底轮扎根'
  },
  dispersed: {
    identity: '多维探索者',
    direction: '能量分散流动',
    strength: '适应性强，多才多艺',
    advice: '建议聚焦核心能量中心'
  }
};

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

function getGapChakras(chakraEnergy: ChakraEnergy): Array<keyof ChakraEnergy> {
  const entries = Object.entries(chakraEnergy) as [keyof ChakraEnergy, number][];
  const sorted = entries.sort((a, b) => a[1] - b[1]);
  return sorted.slice(0, 2).map(([chakra]) => chakra);
}

function calculatePhase(chakraEnergy: ChakraEnergy): 'grounded' | 'floating' | 'dispersed' {
  const lowerEnergy = (chakraEnergy.root + chakraEnergy.sacral + chakraEnergy.solar) / 3;
  const upperEnergy = (chakraEnergy.throat + chakraEnergy.thirdEye + chakraEnergy.crown) / 3;
  const variance = Object.values(chakraEnergy).reduce((sum, val, _, arr) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return sum + Math.pow(val - mean, 2);
  }, 0) / 7;

  if (variance > 0.15) return 'dispersed';
  if (lowerEnergy > upperEnergy * 1.3) return 'grounded';
  if (upperEnergy > lowerEnergy * 1.3) return 'floating';
  return 'grounded';
}

export interface GeneratedPrototype {
  id: string;
  name: string;
  tagName: string;
  description: string;
  coreFrequency: number;
  color: string;
  advice: string;
  organs: string;
  doList: string[];
  dontList: string[];
  rechargeHz: number;
  chakraSignature: ChakraEnergy;
  harmonicRichness: number;
  phasePattern: 'grounded' | 'floating' | 'dispersed';
  qualityType: 'smooth' | 'rough' | 'flat';
  somaticSensation: string;
}

export function generateDynamicPrototype(
  chakraEnergy: ChakraEnergy,
  phase: 'grounded' | 'floating' | 'scattering',
  quality: 'smooth' | 'rough' | 'flat',
  dominantFrequency: number
): GeneratedPrototype {
  const mappedPhase = phase === 'scattering' ? 'dispersed' : phase;

  const dominantChakra = getDominantChakra(chakraEnergy);
  const gapChakras = getGapChakras(chakraEnergy);

  const chakraInfo = CHAKRA_MATRIX[dominantChakra];
  const textureInfo = TEXTURE_DESCRIPTORS[quality];
  const phaseInfo = PHASE_DESCRIPTORS[mappedPhase];
  const gapChakraInfo = CHAKRA_MATRIX[gapChakras[0]];

  const tagName = `${chakraInfo.colorDesc}·${textureInfo.personality}·${phaseInfo.identity}`;

  const id = `DYN${Math.floor(dominantFrequency)}`;

  const description = `物理定义：核心频率${dominantFrequency.toFixed(0)}Hz(${chakraInfo.name})，${textureInfo.quality}，${phaseInfo.direction}。体感意义：${phaseInfo.strength}，${chakraInfo.element}元素主导。`;

  const organs = `${chakraInfo.organs.slice(0, 2).join('、')}功能活跃，${gapChakraInfo.organs[0]}需关注`;

  const advice = `${phaseInfo.advice}，${textureInfo.quality.includes('防御') ? '通过温润方式化解能量紧张' : '保持当前能量流动'}。`;

  const doList = generateDoList(dominantChakra, mappedPhase, quality);
  const dontList = generateDontList(dominantChakra, mappedPhase, quality);

  const rechargeHz = gapChakraInfo.frequency;

  const harmonicRichness = calculateRichness(chakraEnergy);

  const somaticSensation = `${chakraInfo.name}能量${chakraEnergy[dominantChakra] > 0.8 ? '极强' : '强'}，${gapChakraInfo.name}能量待提升，${textureInfo.quality}`;

  return {
    id,
    name: `动态生成原型·${dominantFrequency.toFixed(0)}Hz`,
    tagName,
    description,
    coreFrequency: dominantFrequency,
    color: chakraInfo.color,
    advice,
    organs,
    doList,
    dontList,
    rechargeHz,
    chakraSignature: chakraEnergy,
    harmonicRichness,
    phasePattern: mappedPhase,
    qualityType: quality,
    somaticSensation
  };
}

function generateDoList(
  chakra: keyof ChakraEnergy,
  phase: 'grounded' | 'floating' | 'dispersed',
  quality: 'smooth' | 'rough' | 'flat'
): string[] {
  const doMap: Record<keyof ChakraEnergy, string[]> = {
    root: ['体力运动', '接地冥想', '营养补充'],
    sacral: ['艺术创作', '情绪表达', '水元素疗愈'],
    solar: ['目标设定', '意志力训练', '晒太阳'],
    heart: ['慈悲练习', '呼吸调息', '人际连接'],
    throat: ['声音表达', '书写创作', '诚实沟通'],
    thirdEye: ['冥想静坐', '直觉练习', '洞察训练'],
    crown: ['灵性连接', '觉知提升', '静默独处']
  };

  const base = doMap[chakra];

  if (quality === 'rough') {
    base.push('温润饮食', '柔和运动');
  }

  if (phase === 'floating') {
    base.push('扎根练习', '下三轮强化');
  }

  return base.slice(0, 3);
}

function generateDontList(
  chakra: keyof ChakraEnergy,
  phase: 'grounded' | 'floating' | 'dispersed',
  quality: 'smooth' | 'rough' | 'flat'
): string[] {
  const dontMap: Record<keyof ChakraEnergy, string[]> = {
    root: ['过度灵修', '忽视身体'],
    sacral: ['压抑情绪', '过度理性'],
    solar: ['过度消耗', '忽视休息'],
    heart: ['封闭自我', '过度牺牲'],
    throat: ['压抑表达', '言不由衷'],
    thirdEye: ['过度思考', '忽视直觉'],
    crown: ['脱离现实', '忽视身体']
  };

  const base = dontMap[chakra];

  if (quality === 'rough') {
    base.push('激烈争论', '辛辣刺激');
  }

  if (phase === 'grounded') {
    base.push('忽视灵性', '过度物质化');
  }

  return base.slice(0, 3);
}

function calculateRichness(chakraEnergy: ChakraEnergy): number {
  const values = Object.values(chakraEnergy);
  const nonZeroCount = values.filter(v => v > 0.1).length;
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const richness = (nonZeroCount / 7) * 50 + (1 - stdDev / avg) * 50;
  return Math.min(100, Math.max(0, richness));
}
