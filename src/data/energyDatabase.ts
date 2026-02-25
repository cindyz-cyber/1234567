export interface EnergyProfile {
  id: string;
  tagName: string;
  hopeNote: string;
  energyFlowAdvice: string;
  healingAudioId?: string;
}

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

export function getEnergyProfile(id: string): EnergyProfile | null {
  return energyDatabase[id] || null;
}

export function generateDynamicEnergyFlow(
  dominantCenter: 'brain' | 'throat' | 'heart',
  gapCenter: 'brain' | 'throat' | 'heart',
  quality: 'smooth' | 'rough' | 'flat',
  phase: 'grounded' | 'floating' | 'dispersed'
): Pick<EnergyProfile, 'energyFlowAdvice' | 'hopeNote'> {
  let energyFlowAdvice = '';
  let hopeNote = '';

  const centerNames = {
    heart: '心轮',
    throat: '喉轮',
    brain: '脑轮'
  };

  if (dominantCenter === gapCenter) {
    energyFlowAdvice = `你的能量分布较为均衡。建议保持当前状态，通过冥想和呼吸练习维持内在平衡。`;
    hopeNote = '你的能量正在寻找新的平衡点，信任这个过程。';
  } else {
    const dominant = centerNames[dominantCenter];
    const gap = centerNames[gapCenter];

    if (dominantCenter === 'brain' && gapCenter === 'heart') {
      energyFlowAdvice = `你的${dominant}能量过载（思维过度活跃），而${gap}能量不足（情感连接薄弱）。建议通过腹式呼吸、听音乐或接触大自然，将过多的脑部能量引导到心轮，重建情感连接。`;
      hopeNote = '你的理性很强大，但别忘了心也需要被倾听。当思维与情感和谐共舞，你会更加完整。';
    } else if (dominantCenter === 'brain' && gapCenter === 'throat') {
      energyFlowAdvice = `你的${dominant}能量充沛（想法很多），但${gap}能量受阻（表达困难）。建议通过朗读、唱歌或与他人倾诉，打通思维到表达的通道，让想法流畅地传递出来。`;
      hopeNote = '你有很多宝贵的想法，它们值得被听见。给自己更多表达的机会。';
    } else if (dominantCenter === 'heart' && gapCenter === 'brain') {
      energyFlowAdvice = `你的${dominant}能量饱满（情感丰富），但${gap}能量薄弱（思路不清）。建议通过书写、整理思绪或学习新知识，激活脑部能量，为情感提供理性的支持。`;
      hopeNote = '你的感受力是天赋，配合清晰的思维，会让你更有力量。';
    } else if (dominantCenter === 'heart' && gapCenter === 'throat') {
      energyFlowAdvice = `你的${dominant}能量充盈（内心丰富），但${gap}能量不足（难以表达）。建议通过写日记、艺术创作或声音练习，建立从心到喉的能量通道，让内在感受能够自如地流淌出来。`;
      hopeNote = '你的内心有很多话想说，给它们一个出口，世界会因你的表达而更美好。';
    } else if (dominantCenter === 'throat' && gapCenter === 'heart') {
      energyFlowAdvice = `你的${dominant}能量强劲（善于表达），但${gap}能量匮乏（缺乏情感深度）。建议在说话前先感受内心，让表达来自真实的情感，而不只是语言的组合。`;
      hopeNote = '你的声音很有力量，当它与心连接时，会更有温度和感染力。';
    } else if (dominantCenter === 'throat' && gapCenter === 'brain') {
      energyFlowAdvice = `你的${dominant}能量旺盛（表达流畅），但${gap}能量不足（逻辑性弱）。建议在表达前先整理思路，通过阅读和思考训练，让言语更具条理性和说服力。`;
      hopeNote = '你的表达很流畅，配合清晰的逻辑，会让你的话语更有分量。';
    }
  }

  if (quality === 'rough') {
    energyFlowAdvice += ' 你的声音质地粗糙，说明内在有未疏解的紧张或防御。建议通过按摩、放松训练或情绪释放，软化这些紧绷的部分。';
    hopeNote += ' 那些粗糙的部分，都承载着你的故事。温柔地对待它们，它们会慢慢软化。';
  } else if (quality === 'flat') {
    energyFlowAdvice += ' 你的声音过于平坦，说明能量缺乏波动和活力。建议通过运动、大笑或情绪表达，激活身体的能量流动。';
    hopeNote += ' 允许自己有更多的情绪起伏，生命的色彩就藏在这些波动里。';
  } else {
    energyFlowAdvice += ' 你的声音流畅自然，说明能量流动良好。继续保持这种状态，并留意身体的反馈。';
    hopeNote += ' 你正走在平衡的路上，保持这份觉察和流动。';
  }

  if (phase === 'floating') {
    energyFlowAdvice += ' 你的能量悬浮在上焦，需要接地。建议赤脚踩地、抱树或练习蹲马步，让能量回归大地。';
  } else if (phase === 'dispersed') {
    energyFlowAdvice += ' 你的能量向外分散，需要向内收摄。建议通过站桩、打坐或腹式呼吸，将能量聚拢到中轴线。';
  } else {
    energyFlowAdvice += ' 你的能量相位稳定，根基扎实，这是很好的状态。';
  }

  return { energyFlowAdvice, hopeNote };
}

export function getHealingAudio(id: string): string | null {
  const profile = getEnergyProfile(id);
  return profile?.healingAudioId || null;
}

export function getProfileWithDynamicBalance(
  id: string,
  dominantCenter: 'brain' | 'throat' | 'heart',
  gapCenter: 'brain' | 'throat' | 'heart',
  quality: 'smooth' | 'rough' | 'flat',
  phase: 'grounded' | 'floating' | 'dispersed'
): EnergyProfile {
  const existingProfile = getEnergyProfile(id);

  if (existingProfile) {
    return existingProfile;
  }

  const dynamicFlow = generateDynamicEnergyFlow(dominantCenter, gapCenter, quality, phase);

  return {
    id,
    tagName: `【能量体 ${id}】`,
    hopeNote: dynamicFlow.hopeNote,
    energyFlowAdvice: dynamicFlow.energyFlowAdvice,
  };
}
