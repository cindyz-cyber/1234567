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

  energyFlowAdvice = `您的${dominantName}能量充沛，展现出良好的生命力。\n\n建议关注：\n\n• ${primaryGapName}滋养：对应${primaryGapOrgans}系统，建议通过相应频率音乐、温和食疗来充盈此轮。\n\n• ${secondaryGapName}补足：对应${secondaryGapOrgans}系统，可在主要调理完成后温和滋养。\n\n`;

  if (dominantChakra === 'crown' || dominantChakra === 'thirdEye') {
    energyFlowAdvice += '上焦能量充足，建议通过泡脚、按摩涌泉穴，让能量温柔地流向下焦，形成上下贯通的和谐状态。\n\n';
  } else if (dominantChakra === 'root' || dominantChakra === 'sacral') {
    energyFlowAdvice += '下焦能量扎实，建议通过伸展运动、深呼吸，让能量向上流动至心轮和喉轮，获得更完整的表达力。\n\n';
  } else if (dominantChakra === 'throat') {
    energyFlowAdvice += '表达通道活跃，建议适度放松颈部，将部分能量导向心轮储存，让表达更有力量感。\n\n';
  } else if (dominantChakra === 'heart') {
    energyFlowAdvice += '心轮光明饱满，建议通过腹式呼吸让能量向下扎根，平衡情感与理性，获得更稳定的内在力量。\n\n';
  } else if (dominantChakra === 'solar') {
    energyFlowAdvice += '意志力中心充盈，建议通过冥想放松腹部，平衡行动力与柔软度，让力量更加从容。\n\n';
  }

  hopeNote = `${dominantName}能量充沛是很好的生命状态。当您滋养${primaryGapName}和${secondaryGapName}，整个能量系统将更和谐完整，身心都会感到轻盈圆满。`;

  if (quality === 'rough') {
    energyFlowAdvice += '声音质地展现出独特的力量感，建议通过按摩、声音疗愈，让这份力量更加柔和流畅。\n\n';
    hopeNote += '您的力量正在寻找更温柔的表达方式，这是成长的美好过程。';
  } else if (quality === 'flat') {
    energyFlowAdvice += '声音质地平稳安静，建议通过运动、唱歌或情绪表达，激活能量的丰富色彩和生命力。\n\n';
    hopeNote += '允许自己展现更多生命的律动，丰盛就在这些自然的波动中。';
  } else {
    energyFlowAdvice += '声音质地流畅自然，表达通道畅通，继续保持这份觉察和流动。\n\n';
    hopeNote += '您的能量流动顺畅，这是很好的状态基础。';
  }

  if (phase === 'floating') {
    energyFlowAdvice += '能量轻盈向上，建议赤脚踩地、抱树或练习蹲马步，让能量扎根大地，获得更稳固的支持力。';
  } else if (phase === 'dispersed') {
    energyFlowAdvice += '能量向外拓展，建议通过站桩、打坐或腹式呼吸，将能量收摄回中轴，形成更强的凝聚力。';
  } else {
    energyFlowAdvice += '能量稳定扎根，根基扎实，这是很好的平衡状态。';
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
