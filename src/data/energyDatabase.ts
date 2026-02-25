export interface EnergyProfile {
  id: string;
  tagName: string;
  hopeNote: string;
  energyFlowAdvice: string;
  healingAudioId?: string;
}

type ChakraKey = 'root' | 'sacral' | 'solar' | 'heart' | 'throat' | 'thirdEye' | 'crown';

export const energyDatabase: Record<string, EnergyProfile> = {
  "001": {
    id: "001",
    tagName: "【带刺的防御者】",
    hopeNote: "你的防御机制保护了你很久，但现在可以尝试放下一些盔甲，让光照进来。",
    energyFlowAdvice: "你的喉轮能量过强，建议将能量向下导流至心轮。通过深呼吸和放松颈部，让表达的力量更加温和有力。避免长时间说话，多做颈部拉伸。",
    healingAudioId: "healing_001"
  },
  "002": {
    id: "002",
    tagName: "【悬浮的思考者】",
    hopeNote: "你的思维很活跃，但别忘了让能量回到身体，扎根会让你更有力量。",
    energyFlowAdvice: "你的脑轮能量过载，需要引导能量下行到心轮和下焦。建议睡前泡脚15分钟，想象能量从头顶流向脚底，帮助思绪沉淀。",
    healingAudioId: "healing_002"
  },
  "003": {
    id: "003",
    tagName: "【心火上扬者】",
    hopeNote: "你的热情是礼物，学会调节它的流向，会让你更加自在。",
    energyFlowAdvice: "你的心轮能量充沛但可能上冲过度。建议通过有意识的腹式呼吸，将心火能量引导至丹田储存，避免能量空耗。",
    healingAudioId: "healing_003"
  },
  "004": {
    id: "004",
    tagName: "【平坦的观察者】",
    hopeNote: "你的冷静是智慧，但也可以允许自己有更多的情绪流动。",
    energyFlowAdvice: "你的能量场过于平坦，缺少波动和流动性。建议通过适度运动、唱歌或大笑，激活身体的气血循环，让能量重新活跃起来。",
    healingAudioId: "healing_004"
  },
  "005": {
    id: "005",
    tagName: "【稳定的锚点】",
    hopeNote: "你的稳定感给人安全，记得也要给自己留出向上生长的空间。",
    energyFlowAdvice: "你的下焦能量扎根稳固，但上部能量可能不足。建议多做伸展运动，打开胸腔，让能量向上流动至心轮和喉轮。",
    healingAudioId: "healing_005"
  },
  "006": {
    id: "006",
    tagName: "【横向散开者】",
    hopeNote: "你的能量正在寻找出口，给它一个方向，它会成为你的助力。",
    energyFlowAdvice: "你的能量横向分散，中心能量薄弱。建议通过站桩、打坐或瑜伽束角式，将分散的能量收摄回中轴线，重建核心稳定性。",
    healingAudioId: "healing_006"
  }
};

const chakraNames: Record<ChakraKey, string> = {
  root: '海底轮',
  sacral: '脐轮',
  solar: '太阳轮',
  heart: '心轮',
  throat: '喉轮',
  thirdEye: '眉心轮',
  crown: '顶轮'
};

const organMapping: Record<ChakraKey, string[]> = {
  root: ['肾', '小肠'],
  sacral: ['膀胱', '肾'],
  solar: ['脾', '胃', '肝'],
  heart: ['心', '小肠'],
  throat: ['肺', '大肠'],
  thirdEye: ['膀胱'],
  crown: ['小肠']
};

export function getEnergyProfile(id: string): EnergyProfile | null {
  return energyDatabase[id] || null;
}

export function generateDynamicEnergyFlowFor7Chakras(
  dominantChakra: ChakraKey,
  gapChakras: ChakraKey[],
  quality: 'smooth' | 'rough' | 'flat',
  phase: 'grounded' | 'floating' | 'dispersed'
): Pick<EnergyProfile, 'energyFlowAdvice' | 'hopeNote'> {
  let energyFlowAdvice = '';
  let hopeNote = '';

  const primaryGap = gapChakras[0];
  const secondaryGap = gapChakras[1];

  const dominantName = chakraNames[dominantChakra];
  const primaryGapName = chakraNames[primaryGap];
  const secondaryGapName = chakraNames[secondaryGap];
  const primaryGapOrgans = organMapping[primaryGap].join('、');
  const secondaryGapOrgans = organMapping[secondaryGap].join('、');

  energyFlowAdvice = `【7脉轮对冲诊断】\n\n你的${dominantName}能量过盛，形成能量堆积。根据"损有余而补不足"原则：\n\n• 主要缺口：${primaryGapName}能量最弱，对应脏腑为${primaryGapOrgans}。建议优先通过相应频率音乐、食疗和经络疏通来滋养此轮。\n\n• 次要缺口：${secondaryGapName}也需关注，对应${secondaryGapOrgans}系统。可在主要缺口得到改善后进行调理。\n\n`;

  if (dominantChakra === 'crown' || dominantChakra === 'thirdEye') {
    energyFlowAdvice += '• 上焦过盛处理：你的能量过度集中在头部，容易导致思虑过度、失眠。建议通过泡脚、按摩涌泉穴，将能量引导下行至海底轮和脐轮，重建上下平衡。\n\n';
  } else if (dominantChakra === 'root' || dominantChakra === 'sacral') {
    energyFlowAdvice += '• 下焦过盛处理：你的能量过度沉降在下焦，可能感到沉重、迟钝。建议通过伸展运动、深呼吸打开上焦通道，让能量向心轮和喉轮上升。\n\n';
  } else if (dominantChakra === 'throat') {
    energyFlowAdvice += '• 喉轮过盛处理：表达欲过强或喉部紧张。建议减少过度说话，多做颈部放松，将能量导向心轮和下丹田储存。\n\n';
  } else if (dominantChakra === 'heart') {
    energyFlowAdvice += '• 心轮过盛处理：情绪波动大或心火上扬。建议通过腹式呼吸将心火能量下沉至太阳轮和脐轮，平复情绪波动。\n\n';
  } else if (dominantChakra === 'solar') {
    energyFlowAdvice += '• 太阳轮过盛处理：控制欲强或消化系统紧张。建议通过冥想放松腹部，平衡意志力与柔软度。\n\n';
  }

  hopeNote = `${dominantName}的能量虽然充沛，但平衡才是健康之道。当你滋养了${primaryGapName}和${secondaryGapName}，整个能量系统会进入更和谐的状态，身心都会感到轻盈和完整。`;

  if (quality === 'rough') {
    energyFlowAdvice += '• 声音质地粗糙：说明内在有未疏解的紧张、愤怒或防御机制。建议通过按摩、情绪释放或声音疗愈，软化这些紧绷的能量结。\n\n';
    hopeNote += ' 那些粗糙带刺的部分，都是你曾经的保护盔甲。当你准备好放下，温柔会自然流淌。';
  } else if (quality === 'flat') {
    energyFlowAdvice += '• 声音质地平坦：能量场缺乏波动和情绪流动性，可能过度压抑或麻木。建议通过运动、大笑、唱歌或情绪表达，重新激活能量的生命力。\n\n';
    hopeNote += ' 允许自己有更丰富的情绪起伏，生命的色彩就藏在这些自然的波动里。';
  } else {
    energyFlowAdvice += '• 声音质地流畅：能量流动自然，说明你的表达通道较为畅通。继续保持这种觉察和流动性。\n\n';
    hopeNote += ' 你的能量流动顺畅，这是很好的状态基础。';
  }

  if (phase === 'floating') {
    energyFlowAdvice += '• 能量相位：悬浮上升。能量过度集中在上焦，缺乏接地性。建议赤脚踩地、抱树或练习蹲马步，让能量重新扎根大地。';
  } else if (phase === 'dispersed') {
    energyFlowAdvice += '• 能量相位：横向散开。能量向外分散，中轴线薄弱。建议通过站桩、打坐或腹式呼吸，将分散的能量收摄回中脉。';
  } else {
    energyFlowAdvice += '• 能量相位：稳定扎根。你的根基扎实，能量相对稳定，这是很好的基础状态。';
  }

  return { energyFlowAdvice, hopeNote };
}

export function getHealingAudio(id: string): string | null {
  const profile = getEnergyProfile(id);
  return profile?.healingAudioId || null;
}

export function getProfileWithDynamicBalance(
  id: string,
  dominantChakra: ChakraKey,
  gapChakras: ChakraKey[],
  quality: 'smooth' | 'rough' | 'flat',
  phase: 'grounded' | 'floating' | 'dispersed'
): EnergyProfile {
  const existingProfile = getEnergyProfile(id);

  if (existingProfile) {
    return existingProfile;
  }

  const dynamicFlow = generateDynamicEnergyFlowFor7Chakras(dominantChakra, gapChakras, quality, phase);

  return {
    id,
    tagName: `【能量体 ${id}】`,
    hopeNote: dynamicFlow.hopeNote,
    energyFlowAdvice: dynamicFlow.energyFlowAdvice,
  };
}
