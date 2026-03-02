import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TONES_MATRIX = [
  {
    id: 1,
    name_cn: '磁性',
    name_en: 'Magnetic',
    description: '向内坍缩，极致克制',
    energy_pattern: '收缩内敛，聚焦单点',
    life_strategy: '吸引关键资源，确立意图起点',
    challenge: '过度封闭，难以外放',
    gift: '强大的目标吸引力与启动能量'
  },
  {
    id: 2,
    name_cn: '月亮',
    name_en: 'Lunar',
    description: '二元对撞，平衡磨砺',
    energy_pattern: '阴阳极化，矛盾共存',
    life_strategy: '在对立中寻找平衡，识别挑战',
    challenge: '摇摆不定，内耗严重',
    gift: '深刻的平衡感与极性智慧'
  },
  {
    id: 3,
    name_cn: '电力',
    name_en: 'Electric',
    description: '激活连接，服务他人',
    energy_pattern: '电能激活，连接万物',
    life_strategy: '通过服务建立深度连接',
    challenge: '能量分散，难以聚焦',
    gift: '卓越的连接能力与服务精神'
  },
  {
    id: 4,
    name_cn: '自我存在',
    name_en: 'Self-Existing',
    description: '形式定义，逻辑建构',
    energy_pattern: '稳定结构，四方平衡',
    life_strategy: '建立稳固形式与清晰定义',
    challenge: '过度僵化，缺乏灵活',
    gift: '强大的结构化思维与定义能力'
  },
  {
    id: 5,
    name_cn: '超频',
    name_en: 'Overtone',
    description: '指挥官模式，光芒万丈',
    energy_pattern: '辐射赋能，中心引领',
    life_strategy: '掌握权力核心，引领集体',
    challenge: '控制欲强，独断专行',
    gift: '天生的领导力与赋能才华'
  },
  {
    id: 6,
    name_cn: '韵律',
    name_en: 'Rhythmic',
    description: '组织平衡，身心律动',
    energy_pattern: '周期韵律，动态平衡',
    life_strategy: '在流动中保持平衡与节奏',
    challenge: '情绪波动，起伏不定',
    gift: '精准的节奏感与平衡能力'
  },
  {
    id: 7,
    name_cn: '共鸣',
    name_en: 'Resonant',
    description: '通道开启，频率校准',
    energy_pattern: '共振调频，中央通道',
    life_strategy: '校准频率，成为能量通道',
    challenge: '过度敏感，频率混乱',
    gift: '强大的共鸣能力与频率感知'
  },
  {
    id: 8,
    name_cn: '银河',
    name_en: 'Galactic',
    description: '完整秩序，和谐显化',
    energy_pattern: '整合完善，和谐共生',
    life_strategy: '整合所有元素，创造和谐',
    challenge: '完美主义，难以接受不完美',
    gift: '卓越的整合能力与和谐创造'
  },
  {
    id: 9,
    name_cn: '太阳',
    name_en: 'Solar',
    description: '意图脉动，感召引领',
    energy_pattern: '意图辐射，感召力场',
    life_strategy: '以清晰意图感召实现',
    challenge: '意图过强，忽略他人',
    gift: '强大的意图力与感召能力'
  },
  {
    id: 10,
    name_cn: '行星',
    name_en: 'Planetary',
    description: '显化结果，完美执行',
    energy_pattern: '物质显化，完美呈现',
    life_strategy: '将意图完美显化为现实',
    challenge: '过度执着结果，忽略过程',
    gift: '卓越的显化能力与执行力'
  },
  {
    id: 11,
    name_cn: '光谱',
    name_en: 'Spectral',
    description: '释放瓦解，自由解脱',
    energy_pattern: '解构释放，归零重启',
    life_strategy: '放下执着，释放旧有',
    challenge: '过度解构，失去根基',
    gift: '深刻的释放能力与解脱智慧'
  },
  {
    id: 12,
    name_cn: '水晶',
    name_en: 'Crystal',
    description: '合作普及，奉献分享',
    energy_pattern: '水晶扩散，普世分享',
    life_strategy: '通过合作奉献服务大众',
    challenge: '过度奉献，忽略自我',
    gift: '卓越的合作能力与奉献精神'
  },
  {
    id: 13,
    name_cn: '宇宙',
    name_en: 'Cosmic',
    description: '当下临在，超越维度',
    energy_pattern: '圆满超越，无限临在',
    life_strategy: '超越所有限制，回归当下',
    challenge: '过度超然，脱离现实',
    gift: '终极的超越智慧与临在能力'
  }
];

const TOTEMS_MATRIX = [
  {
    id: 1,
    name_cn: '红龙',
    name_en: 'Red Dragon',
    pineal_gland: 85,
    throat_chakra: 30,
    heart_chakra: 75,
    operation_mode: '滋养孵化模式',
    core_keyword: '诞生',
    description: '宇宙母亲能量，创始滋养',
    energy_signature: '深层滋养，原初创造'
  },
  {
    id: 2,
    name_cn: '白风',
    name_en: 'White Wind',
    pineal_gland: 45,
    throat_chakra: 90,
    heart_chakra: 55,
    operation_mode: '灵性传播模式',
    core_keyword: '呼吸',
    description: '宇宙呼吸，精神传播',
    energy_signature: '灵性沟通，自由流动'
  },
  {
    id: 3,
    name_cn: '蓝夜',
    name_en: 'Blue Night',
    pineal_gland: 90,
    throat_chakra: 40,
    heart_chakra: 60,
    operation_mode: '梦境直觉模式',
    core_keyword: '丰盛',
    description: '梦境守护者，内在富足',
    energy_signature: '直觉梦境，丰盛显化'
  },
  {
    id: 4,
    name_cn: '黄种子',
    name_en: 'Yellow Seed',
    pineal_gland: 70,
    throat_chakra: 50,
    heart_chakra: 80,
    operation_mode: '种子萌发模式',
    core_keyword: '目标',
    description: '潜能种子，目标觉醒',
    energy_signature: '潜能孵化，目标实现'
  },
  {
    id: 5,
    name_cn: '红蛇',
    name_en: 'Red Serpent',
    pineal_gland: 50,
    throat_chakra: 40,
    heart_chakra: 95,
    operation_mode: '生命力唤醒模式',
    core_keyword: '生存',
    description: '昆达里尼能量，本能激活',
    energy_signature: '生命力，肉体智慧'
  },
  {
    id: 6,
    name_cn: '白世界桥',
    name_en: 'White World Bridger',
    pineal_gland: 75,
    throat_chakra: 85,
    heart_chakra: 50,
    operation_mode: '桥接转化模式',
    core_keyword: '死亡',
    description: '世界桥梁，转化释放',
    energy_signature: '连接维度，放下执着'
  },
  {
    id: 7,
    name_cn: '蓝手',
    name_en: 'Blue Hand',
    pineal_gland: 40,
    throat_chakra: 60,
    heart_chakra: 90,
    operation_mode: '疗愈完成模式',
    core_keyword: '完成',
    description: '疗愈之手，完成显化',
    energy_signature: '疗愈能量，实践完成'
  },
  {
    id: 8,
    name_cn: '黄星星',
    name_en: 'Yellow Star',
    pineal_gland: 80,
    throat_chakra: 70,
    heart_chakra: 65,
    operation_mode: '优雅和谐模式',
    core_keyword: '优雅',
    description: '艺术之星，美学和谐',
    energy_signature: '艺术美学，优雅呈现'
  },
  {
    id: 9,
    name_cn: '红月',
    name_en: 'Red Moon',
    pineal_gland: 85,
    throat_chakra: 45,
    heart_chakra: 80,
    operation_mode: '流动净化模式',
    core_keyword: '净化',
    description: '宇宙之水，情绪流动',
    energy_signature: '情绪净化，流动循环'
  },
  {
    id: 10,
    name_cn: '白狗',
    name_en: 'White Dog',
    pineal_gland: 60,
    throat_chakra: 55,
    heart_chakra: 95,
    operation_mode: '无条件爱模式',
    core_keyword: '爱',
    description: '忠诚守护，无条件之爱',
    energy_signature: '心轮爱能，忠诚守护'
  },
  {
    id: 11,
    name_cn: '蓝猴',
    name_en: 'Blue Monkey',
    pineal_gland: 70,
    throat_chakra: 80,
    heart_chakra: 60,
    operation_mode: '魔法幻象模式',
    core_keyword: '魔法',
    description: '魔法猴子，游戏创造',
    energy_signature: '魔法创意，游戏人生'
  },
  {
    id: 12,
    name_cn: '黄人',
    name_en: 'Yellow Human',
    pineal_gland: 90,
    throat_chakra: 65,
    heart_chakra: 70,
    operation_mode: '自由意志模式',
    core_keyword: '自由',
    description: '自由意志，智慧选择',
    energy_signature: '自由意志，智慧心智'
  },
  {
    id: 13,
    name_cn: '红天行者',
    name_en: 'Red Skywalker',
    pineal_gland: 95,
    throat_chakra: 60,
    heart_chakra: 55,
    operation_mode: '探索空间模式',
    core_keyword: '探索',
    description: '天空行者，空间探索',
    energy_signature: '空间意识，维度探索'
  },
  {
    id: 14,
    name_cn: '白巫师',
    name_en: 'White Wizard',
    pineal_gland: 95,
    throat_chakra: 75,
    heart_chakra: 50,
    operation_mode: '超时空魔法模式',
    core_keyword: '无时性',
    description: '时间魔法师，超越时间',
    energy_signature: '时间魔法，无限可能'
  },
  {
    id: 15,
    name_cn: '蓝鹰',
    name_en: 'Blue Eagle',
    pineal_gland: 95,
    throat_chakra: 70,
    heart_chakra: 45,
    operation_mode: '洞察视野模式',
    core_keyword: '洞见',
    description: '鹰眼视角，洞察全局',
    energy_signature: '高维洞察，全局视野'
  },
  {
    id: 16,
    name_cn: '黄战士',
    name_en: 'Yellow Warrior',
    pineal_gland: 65,
    throat_chakra: 85,
    heart_chakra: 60,
    operation_mode: '智慧勇气模式',
    core_keyword: '智慧',
    description: '智慧战士，勇敢探询',
    energy_signature: '智慧勇气，无畏探询'
  },
  {
    id: 17,
    name_cn: '红地球',
    name_en: 'Red Earth',
    pineal_gland: 55,
    throat_chakra: 50,
    heart_chakra: 90,
    operation_mode: '地球导航模式',
    core_keyword: '导航',
    description: '地球母亲，同步进化',
    energy_signature: '地球共振，进化导航'
  },
  {
    id: 18,
    name_cn: '白镜',
    name_en: 'White Mirror',
    pineal_gland: 85,
    throat_chakra: 80,
    heart_chakra: 45,
    operation_mode: '无尽秩序模式',
    core_keyword: '映照',
    description: '宇宙之镜，真相映照',
    energy_signature: '真相映照，秩序反射'
  },
  {
    id: 19,
    name_cn: '蓝风暴',
    name_en: 'Blue Storm',
    pineal_gland: 75,
    throat_chakra: 70,
    heart_chakra: 85,
    operation_mode: '自我再生模式',
    core_keyword: '转化',
    description: '蓝色风暴，催化转化',
    energy_signature: '强力转化，自我再生'
  },
  {
    id: 20,
    name_cn: '黄太阳',
    name_en: 'Yellow Sun',
    pineal_gland: 80,
    throat_chakra: 75,
    heart_chakra: 85,
    operation_mode: '宇宙火焰模式',
    core_keyword: '开悟',
    description: '宇宙之光，普照万物',
    energy_signature: '光明开悟，生命之火'
  }
];

const WAVESPELLS_MATRIX = [
  {
    id: 1,
    name_cn: '红龙波',
    name_en: 'Red Dragon Wavespell',
    kin_start: 1,
    kin_end: 13,
    seal_id: 1,
    color: 'red',
    wave_type: '创始波',
    life_essence: '滋养孵化的原初能量',
    long_term_purpose: '学习如何滋养自己与他人，建立深层的养育能力'
  },
  {
    id: 2,
    name_cn: '白巫师波',
    name_en: 'White Wizard Wavespell',
    kin_start: 14,
    kin_end: 26,
    seal_id: 14,
    color: 'white',
    wave_type: '心智波',
    life_essence: '超越时间的魔法意识',
    long_term_purpose: '掌握时间魔法，接纳无限可能性'
  },
  {
    id: 3,
    name_cn: '蓝手波',
    name_en: 'Blue Hand Wavespell',
    kin_start: 27,
    kin_end: 39,
    seal_id: 7,
    color: 'blue',
    wave_type: '疗愈波',
    life_essence: '疗愈与完成的实践能量',
    long_term_purpose: '发展疗愈能力，学会完成与放手'
  },
  {
    id: 4,
    name_cn: '黄太阳波',
    name_en: 'Yellow Sun Wavespell',
    kin_start: 40,
    kin_end: 52,
    seal_id: 20,
    color: 'yellow',
    wave_type: '开悟波',
    life_essence: '光明普照的宇宙智慧',
    long_term_purpose: '觉醒内在光明，照亮生命道路'
  },
  {
    id: 5,
    name_cn: '红天行者波',
    name_en: 'Red Skywalker Wavespell',
    kin_start: 53,
    kin_end: 65,
    seal_id: 13,
    color: 'red',
    wave_type: '探索波',
    life_essence: '空间探索的维度意识',
    long_term_purpose: '拓展意识边界，探索未知领域'
  },
  {
    id: 6,
    name_cn: '白世界桥波',
    name_en: 'White World Bridger Wavespell',
    kin_start: 66,
    kin_end: 78,
    seal_id: 6,
    color: 'white',
    wave_type: '跨越波',
    life_essence: '连接维度的桥接能量',
    long_term_purpose: '学习放下执着，连接不同世界'
  },
  {
    id: 7,
    name_cn: '蓝风暴波',
    name_en: 'Blue Storm Wavespell',
    kin_start: 79,
    kin_end: 91,
    seal_id: 19,
    color: 'blue',
    wave_type: '转化波',
    life_essence: '自我再生的催化力量',
    long_term_purpose: '拥抱转化，在风暴中重生'
  },
  {
    id: 8,
    name_cn: '黄人波',
    name_en: 'Yellow Human Wavespell',
    kin_start: 92,
    kin_end: 104,
    seal_id: 12,
    color: 'yellow',
    wave_type: '自由意志波',
    life_essence: '智慧选择的自由能量',
    long_term_purpose: '发展自由意志，做出智慧选择'
  },
  {
    id: 9,
    name_cn: '红蛇波',
    name_en: 'Red Serpent Wavespell',
    kin_start: 105,
    kin_end: 117,
    seal_id: 5,
    color: 'red',
    wave_type: '生命力波',
    life_essence: '本能激活的生存智慧',
    long_term_purpose: '觉醒生命力，接纳肉体智慧'
  },
  {
    id: 10,
    name_cn: '白镜波',
    name_en: 'White Mirror Wavespell',
    kin_start: 118,
    kin_end: 130,
    seal_id: 18,
    color: 'white',
    wave_type: '真相波',
    life_essence: '真相映照的秩序之镜',
    long_term_purpose: '面对真实自我，映照内在秩序'
  },
  {
    id: 11,
    name_cn: '蓝猴波',
    name_en: 'Blue Monkey Wavespell',
    kin_start: 131,
    kin_end: 143,
    seal_id: 11,
    color: 'blue',
    wave_type: '魔法波',
    life_essence: '幻象创造的游戏能量',
    long_term_purpose: '用游戏精神创造魔法人生'
  },
  {
    id: 12,
    name_cn: '黄种子波',
    name_en: 'Yellow Seed Wavespell',
    kin_start: 144,
    kin_end: 156,
    seal_id: 4,
    color: 'yellow',
    wave_type: '目标觉醒波',
    life_essence: '种子萌发的潜能觉知',
    long_term_purpose: '发现内在种子，觉醒生命目标'
  },
  {
    id: 13,
    name_cn: '红月波',
    name_en: 'Red Moon Wavespell',
    kin_start: 157,
    kin_end: 169,
    seal_id: 9,
    color: 'red',
    wave_type: '流动波',
    life_essence: '情绪流动的净化之水',
    long_term_purpose: '学习情绪流动，接纳情感净化'
  },
  {
    id: 14,
    name_cn: '白狗波',
    name_en: 'White Dog Wavespell',
    kin_start: 170,
    kin_end: 182,
    seal_id: 10,
    color: 'white',
    wave_type: '爱与忠诚波',
    life_essence: '无条件爱的心轮能量',
    long_term_purpose: '发展无条件的爱与忠诚'
  },
  {
    id: 15,
    name_cn: '蓝夜波',
    name_en: 'Blue Night Wavespell',
    kin_start: 183,
    kin_end: 195,
    seal_id: 3,
    color: 'blue',
    wave_type: '直觉梦境波',
    life_essence: '梦境直觉的丰盛显化',
    long_term_purpose: '信任直觉，在梦境中发现丰盛'
  },
  {
    id: 16,
    name_cn: '黄战士波',
    name_en: 'Yellow Warrior Wavespell',
    kin_start: 196,
    kin_end: 208,
    seal_id: 16,
    color: 'yellow',
    wave_type: '智慧勇气波',
    life_essence: '勇敢探询的智慧之道',
    long_term_purpose: '培养智慧勇气，无畏探询真相'
  },
  {
    id: 17,
    name_cn: '红地球波',
    name_en: 'Red Earth Wavespell',
    kin_start: 209,
    kin_end: 221,
    seal_id: 17,
    color: 'red',
    wave_type: '进化导航波',
    life_essence: '地球共振的进化智慧',
    long_term_purpose: '与地球同步，导航进化之路'
  },
  {
    id: 18,
    name_cn: '白风波',
    name_en: 'White Wind Wavespell',
    kin_start: 222,
    kin_end: 234,
    seal_id: 2,
    color: 'white',
    wave_type: '灵性传播波',
    life_essence: '灵性沟通的呼吸之流',
    long_term_purpose: '成为灵性传播者，自由沟通'
  },
  {
    id: 19,
    name_cn: '蓝鹰波',
    name_en: 'Blue Eagle Wavespell',
    kin_start: 235,
    kin_end: 247,
    seal_id: 15,
    color: 'blue',
    wave_type: '洞察视野波',
    life_essence: '高维洞察的鹰眼全局',
    long_term_purpose: '提升意识高度，洞察全局真相'
  },
  {
    id: 20,
    name_cn: '黄星星波',
    name_en: 'Yellow Star Wavespell',
    kin_start: 248,
    kin_end: 260,
    seal_id: 8,
    color: 'yellow',
    wave_type: '美学和谐波',
    life_essence: '艺术优雅的和谐呈现',
    long_term_purpose: '创造美与和谐，优雅显化人生'
  }
];

function generateKinDefinitions(): any[] {
  const definitions = [];

  for (let kin = 1; kin <= 260; kin++) {
    const toneId = ((kin - 1) % 13) + 1;
    const sealId = ((kin - 1) % 20) + 1;

    const tone = TONES_MATRIX.find(t => t.id === toneId)!;
    const seal = TOTEMS_MATRIX.find(s => s.id === sealId)!;

    const wavespellIndex = Math.floor((kin - 1) / 13);
    const wavespell = WAVESPELLS_MATRIX[wavespellIndex];

    const oracleGuide = ((kin - 1 + (toneId - 1) * 20) % 260) + 1;
    const oracleChallenge = (kin + 130 - 1) % 260 + 1;
    const oracleSupport = ((kin - 1 + 10) % 20) === sealId ? kin : ((kin - 1 - (sealId - 1) + 10) % 20 + 1 + (toneId - 1) * 20);
    const oracleHidden = (14 - toneId) === 0 ? kin : ((14 - toneId - 1) * 20 + sealId);

    const coreEssence = `${tone.name_cn}的${seal.name_cn}`;

    const lifePurpose = `在${wavespell.name_cn}的引导下，以${tone.energy_pattern}的方式，展现${seal.core_keyword}的能量。${tone.life_strategy}，${seal.description}。`;

    const shadowWork = `需要警惕${tone.challenge}的倾向，同时平衡${seal.operation_mode}可能带来的盲点。`;

    const integrationPath = `通过${tone.gift}，结合${seal.energy_signature}，在${wavespell.life_essence}中找到人生方向。`;

    definitions.push({
      kin_number: kin,
      totem_id: sealId,
      tone_id: toneId,
      oracle_guide: oracleGuide,
      oracle_challenge: oracleChallenge,
      oracle_support: oracleSupport,
      oracle_hidden: oracleHidden,
      antipode: oracleChallenge,
      analog: oracleSupport,
      core_essence: coreEssence,
      life_purpose: lifePurpose,
      shadow_work: shadowWork,
      integration_path: integrationPath,
      quantum_signature: {
        wavespell_id: wavespell.id,
        wavespell_essence: wavespell.life_essence,
        tone_pattern: tone.energy_pattern,
        seal_signature: seal.energy_signature
      }
    });
  }

  return definitions;
}

async function injectCompleteMatrix() {
  console.log('🚀 开始注入完整玛雅历矩阵...\n');

  console.log('�� 注入 13 调性矩阵...');
  for (const tone of TONES_MATRIX) {
    const { error } = await supabase
      .from('tones')
      .upsert(tone, { onConflict: 'id' });

    if (error) {
      console.error(`❌ 调性 ${tone.id} 注入失败:`, error.message);
    } else {
      console.log(`✅ 调性 ${tone.id} - ${tone.name_cn} 注入成功`);
    }
  }

  console.log('\n🎭 注入 20 图腾脉轮矩阵...');
  for (const totem of TOTEMS_MATRIX) {
    const { error } = await supabase
      .from('totems')
      .upsert(totem, { onConflict: 'id' });

    if (error) {
      console.error(`❌ 图腾 ${totem.id} 注入失败:`, error.message);
    } else {
      console.log(`✅ 图腾 ${totem.id} - ${totem.name_cn} (松果体:${totem.pineal_gland}, 喉轮:${totem.throat_chakra}, 心轮:${totem.heart_chakra})`);
    }
  }

  console.log('\n🌊 注入 20 波符主题矩阵...');
  for (const wavespell of WAVESPELLS_MATRIX) {
    const { error } = await supabase
      .from('wavespells')
      .upsert(wavespell, { onConflict: 'id' });

    if (error) {
      console.error(`❌ 波符 ${wavespell.id} 注入失败:`, error.message);
    } else {
      console.log(`✅ 波符 ${wavespell.id} - ${wavespell.name_cn} (Kin ${wavespell.kin_start}-${wavespell.kin_end})`);
    }
  }

  console.log('\n🔮 生成并注入 260 Kin 定义...');
  const kinDefinitions = generateKinDefinitions();

  const batchSize = 50;
  for (let i = 0; i < kinDefinitions.length; i += batchSize) {
    const batch = kinDefinitions.slice(i, i + batchSize);
    const { error } = await supabase
      .from('kin_definitions')
      .upsert(batch, { onConflict: 'kin_number' });

    if (error) {
      console.error(`❌ Kin ${i + 1}-${Math.min(i + batchSize, 260)} 批次注入失败:`, error.message);
    } else {
      console.log(`✅ Kin ${i + 1}-${Math.min(i + batchSize, 260)} 批次注入成功`);
    }
  }

  console.log('\n✨ 完整玛雅历矩阵注入完成！');
  console.log('\n📋 注入总结:');
  console.log(`- 13 个调性能量描述`);
  console.log(`- 20 个图腾脉轮分值（固定数值）`);
  console.log(`- 20 个波符主题底色`);
  console.log(`- 260 个 Kin 完整定义`);
  console.log('\n🔒 所有数据已锁定，禁止AI自行修改图腾脉轮分值！');
}

injectCompleteMatrix().catch(console.error);
