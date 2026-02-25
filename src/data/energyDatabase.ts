export interface EnergyProfile {
  id: string;
  tagName: string;
  hopeNote: string;
  bodyBalance: string;
  emotionAction: string;
  healingAudioId?: string;
}

export const energyDatabase: Record<string, EnergyProfile> = {
  "001": {
    id: "001",
    tagName: "【带刺的防御者】",
    hopeNote: "你的防御机制保护了你很久，但现在可以尝试放下一些盔甲，让光照进来。",
    bodyBalance: "关注喉咙和胸口的紧绷感，肝气上逆容易导致声音带刺。建议多做扩胸运动，疏通肝经。",
    emotionAction: "轻揉耳后到锁骨的区域，配合深呼吸，想象那股上冲的气慢慢顺下来，回到丹田。",
    healingAudioId: "healing_001"
  },
  "002": {
    id: "002",
    tagName: "【悬浮的思考者】",
    hopeNote: "你的思维很活跃，但别忘了让能量回到身体，扎根会让你更有力量。",
    bodyBalance: "脑部能量过载，心阴不足，容易失眠。建议睡前泡脚，引导能量下行。",
    emotionAction: "闭眼30秒，想象头顶有光柱向下流动，经过胸口、腹部，最后从脚底扎入大地。",
    healingAudioId: "healing_002"
  },
  "003": {
    id: "003",
    tagName: "【心火上扬者】",
    hopeNote: "你的热情是礼物，学会调节它的流向，会让你更加自在。",
    bodyBalance: "心肺循环需要关注，心火过旺容易急躁。建议多喝温水，避免辛辣食物。",
    emotionAction: "尝试'呵'字诀：轻轻发出'呵'音，感受心口的热气随声音释放出去。",
    healingAudioId: "healing_003"
  },
  "004": {
    id: "004",
    tagName: "【平坦的观察者】",
    hopeNote: "你的冷静是智慧，但也可以允许自己有更多的情绪流动。",
    bodyBalance: "能量分布均匀但缺乏波动，脾胃运化可能偏弱。建议适度运动，激活身体活力。",
    emotionAction: "双手搓热后按压腹部，顺时针按摩，帮助气血循环，唤醒内在的生命力。",
    healingAudioId: "healing_004"
  },
  "005": {
    id: "005",
    tagName: "【稳定的锚点】",
    hopeNote: "你的稳定感给人安全，记得也要给自己留出向上生长的空间。",
    bodyBalance: "能量扎根良好，但可能过于沉重。建议多伸展身体，打开胸腔和肩膀。",
    emotionAction: "站立时想象脚下生根，同时头顶向天空延伸，感受上下两股力量的平衡。",
    healingAudioId: "healing_005"
  },
  "006": {
    id: "006",
    tagName: "【横向散开者】",
    hopeNote: "你的能量正在寻找出口，给它一个方向，它会成为你的助力。",
    bodyBalance: "能量横向分散，中焦可能虚弱。建议加强核心力量训练，收摄能量。",
    emotionAction: "双手抱丹田，深呼吸时想象能量从四周回归到中心，凝聚成一个光球。",
    healingAudioId: "healing_006"
  }
};

export function getEnergyProfile(id: string): EnergyProfile | null {
  return energyDatabase[id] || null;
}

export function generateDynamicBalance(
  source: 'brain' | 'throat' | 'heart' | 'lower',
  quality: 'smooth' | 'rough' | 'flat',
  phase: 'grounded' | 'floating' | 'dispersed'
): Pick<EnergyProfile, 'bodyBalance' | 'emotionAction' | 'hopeNote'> {
  let bodyBalance = '';
  let emotionAction = '';
  let hopeNote = '';

  switch (source) {
    case 'heart':
      bodyBalance = '关注心肺循环系统。心部发声说明情绪能量集中在胸腔，若有压抑感请多扩胸深呼吸。';
      emotionAction = '尝试"呵"字诀发声：轻轻发"呵"音，感受心火随声音疏解。可配合双手按压膻中穴（两乳之间）。';
      hopeNote = '你的心是开放的，这份真诚是珍贵的礼物。';
      break;

    case 'throat':
      bodyBalance = '关注肝气运行与颈部张力。喉部发声表示能量卡在中上焦，容易引起喉咙紧绷、肩颈僵硬。';
      emotionAction = '轻揉耳后至锁骨的区域，配合吞咽动作。想象那股上冲的气慢慢顺下来，回归丹田。';
      hopeNote = '你正在学习表达，每一次发声都是勇气的展现。';
      break;

    case 'brain':
      bodyBalance = '关注头部能量过载与心阴不足。脑部发声说明思维过度活跃，容易失眠、头晕。需要引导能量下行。';
      emotionAction = '闭眼30秒，想象头顶有温暖的光从天而降，流经全身，最后从脚底扎入大地。可配合泡脚。';
      hopeNote = '你的智慧是光，但别忘了让它照亮整个身体，而不只是头脑。';
      break;

    case 'lower':
      bodyBalance = '关注脾胃运化与肾气储备。下焦发声表示能量根基稳固，但可能缺乏向上的推动力。';
      emotionAction = '双手搓热敷在后腰（肾区），深吸气时想象能量从丹田升起，充满整个身体。';
      hopeNote = '你的根基很稳，现在可以安心地向上生长了。';
      break;
  }

  if (quality === 'rough') {
    bodyBalance += ' 声音质地粗糙提示内在有未疏解的情绪，可能伴随肝郁或气滞。';
    hopeNote += ' 那些带刺的部分，都是在保护曾经受伤的你，现在可以温柔地卸下防御了。';
  } else if (quality === 'flat') {
    bodyBalance += ' 声音平坦说明情绪能量较为收敛，可能存在气血运行缓慢的情况。';
    hopeNote += ' 允许自己有更多的情绪波动，生命的美就在这流动之中。';
  } else {
    bodyBalance += ' 声音流畅说明气血运行较为顺畅，身心状态良好。';
    hopeNote += ' 保持这份流动的状态，你正走在平衡的路上。';
  }

  if (phase === 'floating') {
    emotionAction += ' 额外提醒：能量悬浮时，增加接地练习，如赤脚踩草地、抱树、蹲马步。';
  } else if (phase === 'dispersed') {
    emotionAction += ' 额外提醒：能量散开时，需要向内收摄，可练习站桩、打坐或瑜伽束角式。';
  }

  return { bodyBalance, emotionAction, hopeNote };
}

export function getHealingAudio(id: string): string | null {
  const profile = getEnergyProfile(id);
  return profile?.healingAudioId || null;
}

export function getProfileWithDynamicBalance(
  id: string,
  source: 'brain' | 'throat' | 'heart' | 'lower',
  quality: 'smooth' | 'rough' | 'flat',
  phase: 'grounded' | 'floating' | 'dispersed'
): EnergyProfile {
  const existingProfile = getEnergyProfile(id);

  if (existingProfile) {
    return existingProfile;
  }

  const dynamicBalance = generateDynamicBalance(source, quality, phase);

  return {
    id,
    tagName: `【能量体 ${id}】`,
    hopeNote: dynamicBalance.hopeNote,
    bodyBalance: dynamicBalance.bodyBalance,
    emotionAction: dynamicBalance.emotionAction,
  };
}
