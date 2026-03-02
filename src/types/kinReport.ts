/**
 * Kin 能量报告框架规范
 * Universal Kin Energy Report Framework
 */

export interface KinEnergyProfile {
  mode: string;           // 模式：指挥官模式、创造者模式等
  perspective: string;    // 视角：全局统筹视角、细节洞察视角等
  essence: string;        // 本质描述
}

export interface EnergyCenterScore {
  center: 'heart' | 'throat' | 'pineal';
  name: string;
  score: number;          // 0-100，必须体现不对称美感
  description: string;    // 中心能量描述
  reasoning: string;      // 评分理由
}

export interface QuantumResonance {
  relationKin: number;
  relationName: string;   // 女儿、儿子、伴侣等
  resonanceType: 'push' | 'integrate' | 'mirror' | 'complement' | 'challenge' | 'support';
  impact: string;         // 对用户的影响描述
  modifier: {
    center: 'heart' | 'throat' | 'pineal';
    delta: number;        // 修正值 -20 到 +20
  }[];
}

export interface Year2026Advice {
  coreWeakness: string;   // 核心卡点（最低分项目）
  whiteWindEnergy: string; // 白风年喉轮能量描述
  practicalAdvice: string; // 实操建议
}

export interface KinEnergyReport {
  kin: number;
  profile: KinEnergyProfile;
  energyCenters: EnergyCenterScore[];
  quantumResonances?: QuantumResonance[]; // 可选，仅在有家人数据时显示
  year2026Advice: Year2026Advice;
  generatedAt: Date;
}

// 调性（模式）映射
export const ToneToMode: Record<number, { mode: string; perspective: string }> = {
  1: { mode: '吸引模式', perspective: '磁性吸引视角' },
  2: { mode: '挑战模式', perspective: '突破边界视角' },
  3: { mode: '联结模式', perspective: '关系网络视角' },
  4: { mode: '定义模式', perspective: '规则建立视角' },
  5: { mode: '赋权模式', perspective: '能量授予视角' },
  6: { mode: '平衡模式', perspective: '和谐统筹视角' },
  7: { mode: '共振模式', perspective: '频率同步视角' },
  8: { mode: '完整模式', perspective: '全息整合视角' },
  9: { mode: '意图模式', perspective: '愿景导航视角' },
  10: { mode: '显化模式', perspective: '落地实现视角' },
  11: { mode: '溶解模式', perspective: '释放转化视角' },
  12: { mode: '合作模式', perspective: '协同创造视角' },
  13: { mode: '超频模式', perspective: '宇宙统筹视角' }
};

// 波符（底色）到图腾属性的映射
export const WavespellAttributes: Record<number, {
  name: string;
  essence: string;
  coreTheme: string;
  energyDistribution: {
    heart: number;    // 基础分 0-100
    throat: number;
    pineal: number;
  };
}> = {
  1: { // 红龙波符
    name: '红龙波符',
    essence: '养育与诞生',
    coreTheme: '你是宇宙母性能量的化身，天生的养育者与守护者',
    energyDistribution: { heart: 92, throat: 65, pineal: 58 }
  },
  2: { // 白巫师波符
    name: '白巫师波符',
    essence: '无时间性与魔法',
    coreTheme: '你是时间之外的魔法师，能看见超越线性的可能性',
    energyDistribution: { heart: 70, throat: 75, pineal: 95 }
  },
  3: { // 蓝手波符
    name: '蓝手波符',
    essence: '知晓与疗愈',
    coreTheme: '你是宇宙的疗愈之手，通过双手传递智慧与转化',
    energyDistribution: { heart: 88, throat: 72, pineal: 68 }
  },
  4: { // 黄太阳波符
    name: '黄太阳波符',
    essence: '普照与启蒙',
    coreTheme: '你是宇宙光明的化身，天生的领导者与启蒙者',
    energyDistribution: { heart: 95, throat: 85, pineal: 70 }
  },
  5: { // 红天行者波符
    name: '红天行者波符',
    essence: '空间与探索',
    coreTheme: '你是宇宙的探险家，用脚步丈量世界的边界',
    energyDistribution: { heart: 65, throat: 78, pineal: 82 }
  },
  6: { // 白世界桥波符
    name: '白世界桥波符',
    essence: '死亡与重生',
    coreTheme: '你是生死之间的桥梁，掌握释放与转化的艺术',
    energyDistribution: { heart: 75, throat: 70, pineal: 90 }
  },
  7: { // 蓝风暴波符
    name: '蓝风暴波符',
    essence: '自生能量与催化',
    coreTheme: '你是宇宙的催化剂，带来剧烈而必要的转化',
    energyDistribution: { heart: 68, throat: 88, pineal: 72 }
  },
  8: { // 黄人波符
    name: '黄人波符',
    essence: '自由意志与智慧',
    coreTheme: '你是自由意志的守护者，用智慧照亮选择之路',
    energyDistribution: { heart: 72, throat: 82, pineal: 85 }
  },
  9: { // 红蛇波符
    name: '红蛇波符',
    essence: '生命力与本能',
    coreTheme: '你是原始生命力的化身，连接身体与本能的智慧',
    energyDistribution: { heart: 85, throat: 62, pineal: 78 }
  },
  10: { // 白镜波符
    name: '白镜波符',
    essence: '无尽秩序与映照',
    coreTheme: '你是宇宙的镜子，映照出完美秩序与真实本质',
    energyDistribution: { heart: 70, throat: 75, pineal: 92 }
  },
  11: { // 蓝猴波符
    name: '蓝猴波符',
    essence: '魔术与游戏',
    coreTheme: '你是宇宙的魔术师，用游戏精神创造奇迹',
    energyDistribution: { heart: 78, throat: 85, pineal: 75 }
  },
  12: { // 黄人类波符
    name: '黄人类波符',
    essence: '自由意志与影响',
    coreTheme: '你是人类意识的代表，用自由意志影响世界',
    energyDistribution: { heart: 80, throat: 88, pineal: 70 }
  },
  13: { // 红天行者波符
    name: '红地球波符',
    essence: '导航与共时',
    coreTheme: '你是地球意识的导航者，与宇宙共时同步',
    energyDistribution: { heart: 82, throat: 72, pineal: 85 }
  },
  14: { // 白狗波符
    name: '白狗波符',
    essence: '心与忠诚',
    coreTheme: '你是无条件之爱的化身，用心灵连接一切',
    energyDistribution: { heart: 98, throat: 65, pineal: 68 }
  },
  15: { // 蓝夜波符
    name: '蓝夜波符',
    essence: '丰盛与梦想',
    coreTheme: '你是梦想的守护者，将内在富足显化于外',
    energyDistribution: { heart: 75, throat: 70, pineal: 95 }
  },
  16: { // 黄战士波符
    name: '黄战士波符',
    essence: '智慧与质疑',
    coreTheme: '你是智慧的战士，用质疑与逻辑开辟真理之路',
    energyDistribution: { heart: 68, throat: 85, pineal: 88 }
  },
  17: { // 红地球波符
    name: '红月波符',
    essence: '净化与流动',
    coreTheme: '你是宇宙的净化之水，用流动带来更新',
    energyDistribution: { heart: 88, throat: 68, pineal: 75 }
  },
  18: { // 白风波符
    name: '白风波符',
    essence: '灵性与沟通',
    coreTheme: '你是宇宙之风，将灵性智慧传递到每个角落',
    energyDistribution: { heart: 72, throat: 92, pineal: 80 }
  },
  19: { // 蓝鹰波符
    name: '蓝鹰波符',
    essence: '视野与创造',
    coreTheme: '你是高空翱翔的鹰，用全景视野创造未来',
    energyDistribution: { heart: 70, throat: 78, pineal: 92 }
  },
  20: { // 黄星波符
    name: '黄星波符',
    essence: '优雅与美学',
    coreTheme: '你是宇宙的艺术家，用美与和谐点亮世界',
    energyDistribution: { heart: 85, throat: 80, pineal: 75 }
  }
};

// 共振类型描述
export const ResonanceTypeDescriptions = {
  push: '推动因子/母体灌溉',
  integrate: '频率整合',
  mirror: '镜像映照',
  complement: '互补平衡',
  challenge: '挑战位/极性扩张',
  support: '支持位/喉轮增强'
};
