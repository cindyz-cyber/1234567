import { VoiceAnalysisResult, ChakraEnergy } from './voiceAnalysis';

type ChakraKey = keyof ChakraEnergy;

const chakraNames: Record<ChakraKey, string> = {
  root: '海底轮',
  sacral: '脐轮',
  solar: '太阳轮',
  heart: '心轮',
  throat: '喉轮',
  thirdEye: '眉心轮',
  crown: '顶轮'
};

const chakraFrequencies: Record<ChakraKey, number> = {
  root: 194,
  sacral: 417,
  solar: 528,
  heart: 343,
  throat: 384,
  thirdEye: 432,
  crown: 963
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

export interface ReportData {
  coreSummary: {
    summary: string;
    details: {
      profile: string;
      sourceAnalysis: string;
      qualityAnalysis: string;
      phaseAnalysis: string;
    };
  };
  chakraAnalysis: {
    summary: string;
    details: {
      formula: string;
      dominantChakra: string;
      gapChakras: string;
      distribution: string;
      energyFlow: string;
    };
  };
  organTherapy: {
    summary: string;
    details: {
      primaryOrgan: string;
      secondaryOrgan: string;
      recommendations: string[];
    };
  };
  actionPlan: {
    summary: string;
    details: {
      doList: string[];
      avoidList: string[];
    };
  };
  healingStation: {
    summary: string;
    details: {
      recommendedFrequency: number;
      chakraTarget: string;
      reason: string;
      howToUse: string[];
    };
  };
}

export function generateReport(analysis: VoiceAnalysisResult): ReportData {
  const dominantChakraName = chakraNames[analysis.dominantChakra];
  const primaryGapName = chakraNames[analysis.gapChakras[0]];
  const secondaryGapName = chakraNames[analysis.gapChakras[1]];

  const dominantFreq = chakraFrequencies[analysis.dominantChakra];
  const primaryGapFreq = chakraFrequencies[analysis.gapChakras[0]];
  const secondaryGapFreq = chakraFrequencies[analysis.gapChakras[1]];

  const primaryOrgans = organMapping[analysis.gapChakras[0]].join('、');
  const secondaryOrgans = organMapping[analysis.gapChakras[1]].join('、');

  const sourceMap = {
    brain: '脑部发声（上焦主导）',
    throat: '喉部发声（中焦主导）',
    heart: '心部发声（中焦主导）',
    lower: '下焦发声（下焦主导）'
  };

  const qualityMap = {
    smooth: '流畅平滑，能量通道顺畅',
    rough: '粗糙带刺，内在有未疏解的紧张',
    flat: '平坦逻辑，情绪波动较少'
  };

  const phaseMap = {
    grounded: '稳定扎根，能量相对稳定',
    floating: '悬浮上升，能量过度集中在上焦',
    scattering: '横向散开，能量向外分散'
  };

  const coreSummary = `你的能量体呈现【${analysis.profileName}】状态，由于${primaryGapName}能量断层（${Math.round(analysis.chakraDistribution[analysis.gapChakras[0]])}%），建议补充 ${primaryGapFreq}Hz 频率音频。`;

  const chakraSummary = `检测到你的声音频谱中${primaryGapName}（核心频率 ${primaryGapFreq}Hz）能量最弱，而${dominantChakraName}（${dominantFreq}Hz）能量占比最高，形成明显的能量失衡。`;

  const organSummary = `由于${primaryGapName}能量断层，对应${primaryOrgans}系统需要重点调理；${secondaryGapName}（${secondaryOrgans}）也需要关注。`;

  const actionSummary = `由于${primaryGapName}能量断层，建议补充 ${primaryGapFreq}Hz 频率的音频，滋养${primaryOrgans}系统。`;

  const healingSummary = `由于${primaryGapName}能量断层，建议补充 ${primaryGapFreq}Hz 频率的音频，帮助恢复整体能量平衡。`;

  const doList: string[] = [];
  const avoidList: string[] = [];

  if (analysis.gapChakras[0] === 'root') {
    doList.push(
      '每天泡脚15-20分钟，水温略高于体温',
      '练习深蹲、马步等下肢力量训练',
      '赤脚踩地，连接大地能量',
      '食用根茎类食物：红薯、胡萝卜、土豆'
    );
    avoidList.push(
      '长时间久坐不动',
      '过度熬夜消耗肾精',
      '忽视排泄规律'
    );
  } else if (analysis.gapChakras[0] === 'sacral') {
    doList.push(
      '每天喝足够的水（至少1.5升）',
      '练习骨盆运动，如猫式伸展',
      '适度进行创造性活动：绘画、手工',
      '按摩腹部，顺时针环绕'
    );
    avoidList.push(
      '憋尿或忽视泌尿系统健康',
      '过度压抑情绪和欲望',
      '久坐不动导致骨盆僵硬'
    );
  } else if (analysis.gapChakras[0] === 'solar') {
    doList.push(
      '规律进食，细嚼慢咽',
      '晒太阳，吸收阳光能量',
      '练习腹式呼吸，增强核心力量',
      '食用黄色食物：小米、玉米、南瓜'
    );
    avoidList.push(
      '暴饮暴食或过度节食',
      '长期处于高压控制状态',
      '忽视消化系统信号'
    );
  } else if (analysis.gapChakras[0] === 'heart') {
    doList.push(
      '练习慈心冥想，向自己和他人发送善意',
      '拥抱、触摸等身体接触',
      '听舒缓的音乐，感受情感流动',
      '食用绿色蔬菜：菠菜、西兰花'
    );
    avoidList.push(
      '过度理性化情感',
      '压抑真实感受',
      '隔绝亲密关系'
    );
  } else if (analysis.gapChakras[0] === 'throat') {
    doList.push(
      '每天朗读或唱歌15分钟',
      '写日记，表达内心想法',
      '学习倾听与真诚表达',
      '做颈部拉伸和按摩'
    );
    avoidList.push(
      '长时间沉默不语',
      '说话过快或过多',
      '压抑真实声音'
    );
  } else if (analysis.gapChakras[0] === 'thirdEye') {
    doList.push(
      '练习眉心注视冥想',
      '培养直觉和想象力',
      '保证充足睡眠，尤其是深度睡眠',
      '减少屏幕时间，保护视力'
    );
    avoidList.push(
      '过度依赖外部信息',
      '忽视内在直觉',
      '长时间盯着屏幕'
    );
  } else if (analysis.gapChakras[0] === 'crown') {
    doList.push(
      '练习静坐冥想，每天至少10分钟',
      '接触大自然，仰望星空',
      '阅读灵性或哲学书籍',
      '保持开放和谦卑的心态'
    );
    avoidList.push(
      '过度执着于物质层面',
      '封闭心灵，拒绝新观念',
      '忽视灵性成长'
    );
  }

  if (analysis.dominantChakra === 'crown' || analysis.dominantChakra === 'thirdEye') {
    avoidList.push(
      '过度思考和分析',
      '长时间脑力劳动不休息',
      '睡前使用电子设备'
    );
  } else if (analysis.dominantChakra === 'throat') {
    avoidList.push(
      '说话过多消耗能量',
      '过度表达和辩论',
      '忽视倾听的重要性'
    );
  } else if (analysis.dominantChakra === 'heart') {
    avoidList.push(
      '情绪过度波动',
      '对他人过度共情消耗自己',
      '忽视理性思考'
    );
  }

  const distribution = Object.entries(analysis.chakraDistribution)
    .map(([chakra, percentage]) => {
      const chakraName = chakraNames[chakra as ChakraKey];
      const freq = chakraFrequencies[chakra as ChakraKey];
      return `• ${chakraName} (${freq}Hz): ${percentage}%`;
    })
    .join('\n');

  const detectionInfo = analysis.detectionDetails && analysis.detectionDetails.length > 0
    ? analysis.detectionDetails.slice(0, 3).map(d =>
        `• 检测值: ${d.detectedFrequency}Hz → 判定: ${d.organSystem}`
      ).join('\n')
    : `• 检测值: ${dominantFreq}Hz → 判定: ${dominantChakraName}\n• 检测值: ${primaryGapFreq}Hz → 判定: ${primaryGapName}`;

  const formula = `【频率检测结果】
${detectionInfo}

【核心频率坐标】
心轮: 342-343Hz (核心)
喉轮: 384Hz (核心)
眉心轮: 432Hz (核心)
太阳神经丛: 528Hz (转化频)
海底轮: <200Hz (纯低频)

【能量分析】
最强脉轮：${dominantChakraName} (${dominantFreq}Hz) - ${Math.round(analysis.chakraDistribution[analysis.dominantChakra])}%
能量断层：${primaryGapName} (${primaryGapFreq}Hz) - ${Math.round(analysis.chakraDistribution[analysis.gapChakras[0]])}%
补足建议：建议聆听 ${primaryGapFreq}Hz 音频`;

  return {
    coreSummary: {
      summary: coreSummary,
      details: {
        profile: analysis.profileName,
        sourceAnalysis: sourceMap[analysis.source],
        qualityAnalysis: qualityMap[analysis.quality],
        phaseAnalysis: phaseMap[analysis.phase]
      }
    },
    chakraAnalysis: {
      summary: chakraSummary,
      details: {
        formula,
        dominantChakra: `${dominantChakraName}能量最强，占比 ${Math.round(analysis.chakraDistribution[analysis.dominantChakra])}%`,
        gapChakras: `${primaryGapName}能量最弱（${Math.round(analysis.chakraDistribution[analysis.gapChakras[0]])}%），${secondaryGapName}次弱（${Math.round(analysis.chakraDistribution[analysis.gapChakras[1]])}%）`,
        distribution,
        energyFlow: `你的能量从${dominantChakraName}过度集中，需要向${primaryGapName}和${secondaryGapName}进行疏导。这种失衡可能导致对应脏腑系统的功能减弱，影响整体身心健康。`
      }
    },
    organTherapy: {
      summary: organSummary,
      details: {
        primaryOrgan: `${primaryGapName} → ${primaryOrgans}系统：能量最弱，需要优先调理。建议通过食疗、经络按摩和${primaryGapFreq}Hz频率音乐进行滋养。`,
        secondaryOrgan: `${secondaryGapName} → ${secondaryOrgans}系统：也需要关注，可在主要缺口改善后进行调理。`,
        recommendations: [
          `针对${primaryOrgans}：选择对应经络进行按摩或艾灸`,
          `食疗调理：摄入滋养${primaryOrgans}的食物`,
          `作息调整：遵循脏腑工作时间表，适时休息`,
          `情绪管理：${primaryOrgans}对应的情绪需要疏导`
        ]
      }
    },
    actionPlan: {
      summary: actionSummary,
      details: {
        doList,
        avoidList
      }
    },
    healingStation: {
      summary: healingSummary,
      details: {
        recommendedFrequency: primaryGapFreq,
        chakraTarget: primaryGapName,
        reason: `你的${primaryGapName}能量仅占 ${Math.round(analysis.chakraDistribution[analysis.gapChakras[0]])}%，远低于健康状态的平衡值（约14%）。通过持续聆听${primaryGapFreq}Hz频率，可以激活并补充这个脉轮的能量，从而调理对应的${primaryOrgans}系统。`,
        howToUse: [
          `每天聆听20-30分钟，最佳时段为清晨或睡前`,
          `使用耳机获得更好的共振效果`,
          `配合腹式呼吸，想象能量流向${primaryGapName}`,
          `持续7-21天，让身体逐渐适应新的能量平衡`
        ]
      }
    }
  };
}
