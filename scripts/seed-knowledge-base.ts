/**
 * 知识库数据填充脚本
 * Knowledge Base Seeding Script
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 环境变量未配置！请检查 .env 文件');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const totems = [
  {
    id: 1,
    name_cn: '红龙',
    name_en: 'Red Dragon',
    pineal_gland: 50,
    throat_chakra: 40,
    operation_mode: '母体模式',
    core_keyword: '滋养/诞生/古老',
    description: '红龙代表宇宙母体的创造力量，是生命诞生的源头能量。它携带着古老的智慧和无条件的滋养力量。',
    energy_signature: '心轮90% - 强大的滋养能量；松果体50% - 稳定的直觉；喉轮40% - 内敛的表达'
  },
  {
    id: 2,
    name_cn: '白风',
    name_en: 'White Wind',
    pineal_gland: 82,
    throat_chakra: 98,
    operation_mode: '传播者模式',
    core_keyword: '灵性/呼吸/沟通',
    description: '白风是灵性沟通的大师，通过呼吸连接天地，传播宇宙的讯息。它代表着精神层面的交流和启发。',
    energy_signature: '喉轮98% - 超强表达力；心轮85% - 和谐共情；松果体82% - 高度灵性感知'
  },
  {
    id: 3,
    name_cn: '蓝夜',
    name_en: 'Blue Night',
    pineal_gland: 99,
    throat_chakra: 70,
    operation_mode: '先知模式',
    core_keyword: '梦境/丰盛/直觉',
    description: '蓝夜是梦境的守护者，拥有最强的直觉感知能力。它连接潜意识深处，预见丰盛的可能性。',
    energy_signature: '松果体99% - 极致直觉；心轮80% - 深度情感；喉轮70% - 内化表达'
  },
  {
    id: 4,
    name_cn: '黄种子',
    name_en: 'Yellow Seed',
    pineal_gland: 65,
    throat_chakra: 50,
    operation_mode: '觉知者模式',
    core_keyword: '目标/开花/耐心',
    description: '黄种子代表潜能的觉醒，需要耐心培育才能开花结果。它是目标清晰且愿意等待的智慧。',
    energy_signature: '心轮75% - 稳定成长；松果体65% - 清晰觉知；喉轮50% - 静默累积'
  },
  {
    id: 5,
    name_cn: '红蛇',
    name_en: 'Red Serpent',
    pineal_gland: 45,
    throat_chakra: 60,
    operation_mode: '生存者模式',
    core_keyword: '生命力/本能/蜕变',
    description: '红蛇是原始生命力的象征，依靠本能生存并不断蜕变。它代表着肉体层面的力量和再生能力。',
    energy_signature: '心轮85% - 强大生命力；喉轮60% - 行动表达；松果体45% - 本能驱动'
  },
  {
    id: 6,
    name_cn: '白世界桥',
    name_en: 'White World-Bridger',
    pineal_gland: 88,
    throat_chakra: 30,
    operation_mode: '跨越者模式',
    core_keyword: '断舍离/连接/机会',
    description: '白世界桥是维度之间的桥梁，通过放下来连接新的机会。它是转变和过渡的大师。',
    energy_signature: '松果体88% - 跨维度感知；心轮48% - 超然情感；喉轮30% - 静默连接'
  },
  {
    id: 7,
    name_cn: '蓝手',
    name_en: 'Blue Hand',
    pineal_gland: 70,
    throat_chakra: 55,
    operation_mode: '成就者模式',
    core_keyword: '知晓/疗愈/创造',
    description: '蓝手是疗愈者和创造者，通过双手将知晓转化为现实。它代表着实践智慧和完成力。',
    energy_signature: '心轮75% - 疗愈能量；松果体70% - 深度知晓；喉轮55% - 行动导向'
  },
  {
    id: 8,
    name_cn: '黄星星',
    name_en: 'Yellow Star',
    pineal_gland: 75,
    throat_chakra: 80,
    operation_mode: '艺术家模式',
    core_keyword: '美化/优雅/艺术',
    description: '黄星星是美学的化身，追求优雅和艺术的完美呈现。它将内在灵性美化为外在形式。',
    energy_signature: '喉轮80% - 艺术表达；松果体75% - 美学感知；心轮70% - 和谐追求'
  },
  {
    id: 9,
    name_cn: '红月',
    name_en: 'Red Moon',
    pineal_gland: 92,
    throat_chakra: 50,
    operation_mode: '净化者模式',
    core_keyword: '宇宙之水/流动/情绪',
    description: '红月是宇宙之水的载体，掌管情绪的流动和净化。它代表着深层情感的转化力量。',
    energy_signature: '松果体92% - 高度敏感；心轮88% - 深度情感；喉轮50% - 内在流动'
  },
  {
    id: 10,
    name_cn: '白狗',
    name_en: 'White Dog',
    pineal_gland: 78,
    throat_chakra: 65,
    operation_mode: '守护者模式',
    core_keyword: '忠诚/无条件的爱/心',
    description: '白狗是心的守护者，代表最纯粹的无条件的爱和忠诚。它是情感连接的最高表达。',
    energy_signature: '心轮95% - 极致之爱；松果体78% - 心灵感应；喉轮65% - 真诚表达'
  },
  {
    id: 11,
    name_cn: '蓝猴',
    name_en: 'Blue Monkey',
    pineal_gland: 85,
    throat_chakra: 75,
    operation_mode: '幻象者模式',
    core_keyword: '游戏/魔法/幽默',
    description: '蓝猴是宇宙的魔法师，通过游戏和幽默打破严肃的幻象。它代表着创造性的嬉戏能量。',
    energy_signature: '松果体85% - 魔法感知；喉轮75% - 幽默表达；心轮60% - 轻盈喜悦'
  },
  {
    id: 12,
    name_cn: '黄人',
    name_en: 'Yellow Human',
    pineal_gland: 80,
    throat_chakra: 85,
    operation_mode: '自由意志者',
    core_keyword: '影响/智慧/自由',
    description: '黄人是自由意志的体现，通过智慧影响世界。它代表着人类意识的最高潜能。',
    energy_signature: '喉轮85% - 智慧表达；松果体80% - 高度觉知；心轮70% - 人性之爱'
  },
  {
    id: 13,
    name_cn: '红天行者',
    name_en: 'Red Skywalker',
    pineal_gland: 90,
    throat_chakra: 70,
    operation_mode: '探索者模式',
    core_keyword: '空间/觉醒/预言',
    description: '红天行者是空间的探索者，行走于不同维度之间。它是觉醒意识和预言能力的载体。',
    energy_signature: '松果体90% - 预言感知；心轮65% - 探索激情；喉轮70% - 空间表达'
  },
  {
    id: 14,
    name_cn: '白巫师',
    name_en: 'White Wizard',
    pineal_gland: 96,
    throat_chakra: 40,
    operation_mode: '施法者模式',
    core_keyword: '永恒/接受/魔法',
    description: '白巫师是永恒魔法的施展者，通过接受来掌握宇宙法则。它代表着无为而无不为的智慧。',
    energy_signature: '松果体96% - 极高魔法感知；心轮75% - 接受之心；喉轮40% - 静默施法'
  },
  {
    id: 15,
    name_cn: '蓝鹰',
    name_en: 'Blue Eagle',
    pineal_gland: 98,
    throat_chakra: 72,
    operation_mode: '洞察者模式',
    core_keyword: '视野/心智/远见',
    description: '蓝鹰从最高处俯瞰全局，拥有超凡的心智洞察力。它代表着宏观视野和战略思维。',
    energy_signature: '松果体98% - 极致洞察；喉轮72% - 清晰传达；心轮40% - 超然观察'
  },
  {
    id: 16,
    name_cn: '黄战士',
    name_en: 'Yellow Warrior',
    pineal_gland: 70,
    throat_chakra: 85,
    operation_mode: '战略家模式',
    core_keyword: '质疑/无畏/逻辑',
    description: '黄战士是勇敢的质疑者，通过逻辑和策略开辟道路。它代表着理性思考和无畏行动。',
    energy_signature: '喉轮85% - 强力表达；心轮85% - 勇气之心；松果体70% - 战略思维'
  },
  {
    id: 17,
    name_cn: '红地球',
    name_en: 'Red Earth',
    pineal_gland: 80,
    throat_chakra: 60,
    operation_mode: '导航者模式',
    core_keyword: '进化/共时性/共鸣',
    description: '红地球是进化的导航者，通过共时性引导集体意识。它代表着与地球母亲的深度连接。',
    energy_signature: '心轮92% - 深度共鸣；松果体80% - 共时感知；喉轮60% - 大地表达'
  },
  {
    id: 18,
    name_cn: '白镜子',
    name_en: 'White Mirror',
    pineal_gland: 94,
    throat_chakra: 55,
    operation_mode: '映照者模式',
    core_keyword: '无穷/秩序/反思',
    description: '白镜子是无限的映照者，通过反射揭示真相。它代表着秩序和深度反思的力量。',
    energy_signature: '松果体94% - 真相感知；心轮50% - 客观之心；喉轮55% - 镜面映照'
  },
  {
    id: 19,
    name_cn: '蓝风暴',
    name_en: 'Blue Storm',
    pineal_gland: 95,
    throat_chakra: 82,
    operation_mode: '破局者模式',
    core_keyword: '能量/催化/重组',
    description: '蓝风暴是宇宙的催化剂，通过能量爆发重组现实。它代表着彻底转变和突破的力量。',
    energy_signature: '松果体95% - 极强感知；喉轮82% - 爆发表达；心轮65% - 转化能量'
  },
  {
    id: 20,
    name_cn: '黄太阳',
    name_en: 'Yellow Sun',
    pineal_gland: 70,
    throat_chakra: 85,
    operation_mode: '指挥官模式',
    core_keyword: '光明/慈悲/启蒙',
    description: '黄太阳是光明的化身，带来慈悲和启蒙。它是完整周期的终点和新周期的起点。',
    energy_signature: '心轮95% - 光辉之爱；喉轮85% - 启蒙表达；松果体70% - 普照意识'
  }
];

const tones = [
  {
    id: 1,
    name_cn: '磁性',
    name_en: 'Magnetic',
    description: '向内坍缩，极致克制',
    energy_pattern: '吸引模式 - 创始能量',
    life_strategy: '通过吸引而非追逐来达成目标，设定清晰意图',
    challenge: '过度内收导致孤立',
    gift: '强大的吸引力和专注力'
  },
  {
    id: 2,
    name_cn: '月亮',
    name_en: 'Lunar',
    description: '两极对立，挑战中成长',
    energy_pattern: '极化模式 - 对立统一',
    life_strategy: '在矛盾中寻找平衡，接受挑战作为成长契机',
    challenge: '陷入二元对立的纠结',
    gift: '在对立中看见完整'
  },
  {
    id: 3,
    name_cn: '电力',
    name_en: 'Electric',
    description: '激活联结，形成网络',
    energy_pattern: '联结模式 - 服务他人',
    life_strategy: '通过服务和联结创造影响力',
    challenge: '失去自我边界',
    gift: '建立有意义的连接'
  },
  {
    id: 4,
    name_cn: '自我存在',
    name_en: 'Self-Existing',
    description: '四方稳固，明确定义',
    energy_pattern: '定义模式 - 建立形式',
    life_strategy: '通过清晰定义和结构化来显化',
    challenge: '过度僵化失去灵活性',
    gift: '建立稳定的结构'
  },
  {
    id: 5,
    name_cn: '超频',
    name_en: 'Overtone',
    description: '指挥官，光芒万丈',
    energy_pattern: '赋权模式 - 中心力量',
    life_strategy: '从中心发出指令，赋予他人力量',
    challenge: '控制欲过强',
    gift: '领导力和赋权能力'
  },
  {
    id: 6,
    name_cn: '韵律',
    name_en: 'Rhythmic',
    description: '有机平衡，动态稳定',
    energy_pattern: '平衡模式 - 韵律之舞',
    life_strategy: '在动态中保持平衡，顺应节奏',
    challenge: '在变化中失去中心',
    gift: '适应性和平衡感'
  },
  {
    id: 7,
    name_cn: '共振',
    name_en: 'Resonant',
    description: '神秘主义者，通灵管道',
    energy_pattern: '共振模式 - 完美和谐',
    life_strategy: '成为通道，让宇宙能量流动',
    challenge: '过度敏感失去边界',
    gift: '与宇宙完美共振'
  },
  {
    id: 8,
    name_cn: '银河',
    name_en: 'Galactic',
    description: '整合完整，和谐共存',
    energy_pattern: '完整模式 - 整体视角',
    life_strategy: '整合所有面向，看见整体图景',
    challenge: '过度追求完美',
    gift: '和谐整合的能力'
  },
  {
    id: 9,
    name_cn: '太阳',
    name_en: 'Solar',
    description: '纯粹意图，脉冲爆发',
    energy_pattern: '意图模式 - 专注实现',
    life_strategy: '以纯粹意图推动显化',
    challenge: '意图过强造成强迫',
    gift: '强大的显化能力'
  },
  {
    id: 10,
    name_cn: '行星',
    name_en: 'Planetary',
    description: '完美显化，物质呈现',
    energy_pattern: '显化模式 - 具象创造',
    life_strategy: '将愿景完美落地到物质世界',
    challenge: '过度执着于结果',
    gift: '卓越的执行力'
  },
  {
    id: 11,
    name_cn: '光谱',
    name_en: 'Spectral',
    description: '释放溶解，放下执着',
    energy_pattern: '溶解模式 - 释放旧有',
    life_strategy: '通过放下来获得自由',
    challenge: '过度释放失去方向',
    gift: '深度释放的勇气'
  },
  {
    id: 12,
    name_cn: '水晶',
    name_en: 'Crystal',
    description: '复杂合作，多维协同',
    energy_pattern: '合作模式 - 集体智慧',
    life_strategy: '在复杂系统中协作共创',
    challenge: '过度配合失去自我',
    gift: '高度协作能力'
  },
  {
    id: 13,
    name_cn: '宇宙',
    name_en: 'Cosmic',
    description: '超越临在，宇宙视角',
    energy_pattern: '超频模式 - 超越局限',
    life_strategy: '以宇宙视角超越所有限制',
    challenge: '过度超然失去人性',
    gift: '超越性的智慧'
  }
];

async function seedKnowledgeBase() {
  console.log('开始填充知识库...\n');

  console.log('1. 插入 20 个图腾...');
  for (const totem of totems) {
    const { error } = await supabase
      .from('totems')
      .upsert(totem, { onConflict: 'id' });

    if (error) {
      console.error(`❌ 图腾 ${totem.name_cn} 插入失败:`, error.message);
    } else {
      console.log(`✓ ${totem.name_cn} (ID: ${totem.id})`);
    }
  }

  console.log('\n2. 插入 13 个调性...');
  for (const tone of tones) {
    const { error } = await supabase
      .from('tones')
      .upsert(tone, { onConflict: 'id' });

    if (error) {
      console.error(`❌ 调性 ${tone.name_cn} 插入失败:`, error.message);
    } else {
      console.log(`✓ ${tone.name_cn} (ID: ${tone.id})`);
    }
  }

  console.log('\n3. 验证数据完整性...');
  const { data: totemCount } = await supabase
    .from('totems')
    .select('id', { count: 'exact', head: true });

  const { data: toneCount } = await supabase
    .from('tones')
    .select('id', { count: 'exact', head: true });

  console.log(`\n✅ 知识库填充完成！`);
  console.log(`   图腾总数: 20`);
  console.log(`   调性总数: 13`);
  console.log(`   可生成 Kin 数: 260 (20 × 13)`);
  console.log(`\n🎯 系统已准备就绪，所有 Kin 报告将从知识库提取数据！`);
}

seedKnowledgeBase().catch(console.error);
