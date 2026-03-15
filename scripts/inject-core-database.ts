import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const CORE_DATA = {
  "global_logic": {
    "wavespell_anchor": "Math.floor((kin - 1) / 13) * 13 + 1",
    "zi_hour_weights": { "early_23_00": [0.4, 0.6], "late_00_00": [0.6, 0.4] }
  },
  "totem_library": {
    "红龙": { "pineal": 50, "throat": 40, "heart": 90, "style": "母体模式", "view": "生命滋养视角" },
    "白风": { "pineal": 82, "throat": 98, "heart": 85, "style": "传播者模式", "view": "灵性沟通视角" },
    "蓝夜": { "pineal": 99, "throat": 70, "heart": 80, "style": "先知模式", "view": "灵感天线视角" },
    "黄种子": { "pineal": 65, "throat": 50, "heart": 75, "style": "觉知者模式", "view": "目标开花视角" },
    "红蛇": { "pineal": 45, "throat": 60, "heart": 85, "style": "生存者模式", "view": "生命本能视角" },
    "白世界桥": { "pineal": 88, "throat": 30, "heart": 48, "style": "跨越者模式", "view": "空间感知视角" },
    "蓝手": { "pineal": 70, "throat": 55, "heart": 75, "style": "成就者模式", "view": "疗愈创造视角" },
    "黄星": { "pineal": 75, "throat": 80, "heart": 70, "style": "艺术家模式", "view": "优雅美化视角" },
    "红月": { "pineal": 92, "throat": 50, "heart": 88, "style": "净化者模式", "view": "宇宙流动视角" },
    "白狗": { "pineal": 78, "throat": 65, "heart": 95, "style": "守护者模式", "view": "慈悲忠诚视角" },
    "蓝猴": { "pineal": 85, "throat": 75, "heart": 60, "style": "幻象者模式", "view": "魔法游戏视角" },
    "黄人": { "pineal": 80, "throat": 85, "heart": 70, "style": "自由意志者", "view": "智慧影响视角" },
    "红天行者": { "pineal": 90, "throat": 70, "heart": 65, "style": "探索者模式", "view": "空间觉醒视角" },
    "白巫师": { "pineal": 96, "throat": 40, "heart": 75, "style": "施法者模式", "view": "永恒接受视角" },
    "蓝鹰": { "pineal": 98, "throat": 72, "heart": 45, "style": "洞察者模式", "view": "上帝视角" },
    "黄战士": { "pineal": 70, "throat": 85, "heart": 85, "style": "战略家模式", "view": "全局统筹视角" },
    "红地球": { "pineal": 80, "throat": 60, "heart": 92, "style": "导航者模式", "view": "进化共时视角" },
    "白镜子": { "pineal": 94, "throat": 55, "heart": 50, "style": "映照者模式", "view": "无穷反思视角" },
    "蓝风暴": { "pineal": 95, "throat": 82, "heart": 65, "style": "破局者模式", "view": "逻辑重组视角" },
    "黄太阳": { "pineal": 70, "throat": 85, "heart": 95, "style": "指挥官模式", "view": "开悟照亮视角" }
  },
  "tone_library": {
    "1": "向内坍缩，极致克制",
    "2": "二元对撞，平衡磨砺",
    "3": "激活连接，服务他人",
    "4": "形式定义，逻辑建构",
    "5": "指挥官模式，光芒万丈",
    "6": "组织平衡，身心律动",
    "7": "通道开启，频率校准",
    "8": "完整秩序，和谐显化",
    "9": "意图脉动，感召引领",
    "10": "显化结果，完美执行",
    "11": "释放瓦解，自由解脱",
    "12": "合作普及，奉献分享",
    "13": "当下临在，超越维度"
  },
  "overrides": {
    "66": { "heart": 48, "desc": "爱非常务实、沉重且讲究原则，属于铁甲温柔型。" },
    "239": { "heart": 40, "desc": "理性的冰霜包裹，呈现出一种疏离的温柔。" }
  }
};

const TOTEM_NAMES = [
  "红龙", "白风", "蓝夜", "黄种子", "红蛇", "白世界桥", "蓝手", "黄星", "红月", "白狗",
  "蓝猴", "黄人", "红天行者", "白巫师", "蓝鹰", "黄战士", "红地球", "白镜子", "蓝风暴", "黄太阳"
];

const TONE_NAMES = [
  "磁性", "月亮", "电力", "自我存在", "超频", "韵律", "共振", "银河", "太阳", "行星", "光谱", "水晶", "宇宙"
];

async function clearExistingData() {
  console.log('🗑️  清空现有数据...');

  await supabase.from('kin_energy_centers').delete().neq('kin', 0);
  await supabase.from('totems').delete().neq('id', 0);
  await supabase.from('tones').delete().neq('id', 0);
  await supabase.from('kin_definitions').delete().neq('kin_number', 0);

  console.log('✅ 数据清空完成');
}

async function insertTotemLibrary() {
  console.log('📚 插入图腾库数据...');

  const totemRecords = TOTEM_NAMES.map((name, index) => {
    const data = CORE_DATA.totem_library[name];
    return {
      id: index + 1,
      name_cn: name,
      name_en: name,
      pineal_gland: data.pineal,
      throat_chakra: data.throat,
      operation_mode: data.style,
      core_keyword: data.view,
      description: `${data.style}，呈现${data.view}特质`,
      energy_signature: JSON.stringify({ heart: data.heart, throat: data.throat, pineal: data.pineal })
    };
  });

  const { error } = await supabase.from('totems').upsert(totemRecords, { onConflict: 'id' });
  if (error) {
    console.error('❌ 图腾库插入失败:', error);
    throw error;
  }

  console.log(`✅ 插入了 ${totemRecords.length} 个图腾`);
}

async function insertToneLibrary() {
  console.log('🎵 插入音调库数据...');

  const toneRecords = TONE_NAMES.map((name, index) => {
    const desc = CORE_DATA.tone_library[(index + 1).toString()];
    return {
      id: index + 1,
      name_cn: name,
      name_en: name,
      description: desc,
      energy_pattern: desc,
      life_strategy: desc,
      challenge: '',
      gift: ''
    };
  });

  const { error } = await supabase.from('tones').upsert(toneRecords, { onConflict: 'id' });
  if (error) {
    console.error('❌ 音调库插入失败:', error);
    throw error;
  }

  console.log(`✅ 插入了 ${toneRecords.length} 个音调`);
}

async function generateAllKinData() {
  console.log('🔄 生成260个Kin的完整数据...');

  const kinDefinitions = [];
  const energyCenterRecords = [];

  for (let kin = 1; kin <= 260; kin++) {
    const tone = ((kin - 1) % 13) + 1;
    const seal = ((kin - 1) % 20) + 1;
    const totemName = TOTEM_NAMES[seal - 1];
    const toneName = TONE_NAMES[tone - 1];
    const totemData = CORE_DATA.totem_library[totemName];
    const toneDesc = CORE_DATA.tone_library[tone.toString()];

    const wavespellStartKin = Math.floor((kin - 1) / 13) * 13 + 1;
    const wavespellSeal = ((wavespellStartKin - 1) % 20) + 1;
    const wavespellName = TOTEM_NAMES[wavespellSeal - 1];

    let heart = totemData.heart;
    let pineal = totemData.pineal;
    let throat = totemData.throat;
    let heartDesc = '';

    const override = CORE_DATA.overrides[kin.toString()];
    if (override) {
      if (override.heart !== undefined) {
        heart = override.heart;
      }
      if (override.desc) {
        heartDesc = override.desc;
      }
    }

    kinDefinitions.push({
      kin_number: kin,
      totem_id: seal,
      tone_id: tone,
      core_essence: `${toneName}的${totemName}。${totemData.view}，呈现${totemData.style}特质。`,
      life_purpose: `通过${totemData.style}实现${totemData.view}`,
      shadow_work: '',
      integration_path: '',
      quantum_signature: {
        tone: toneName,
        totem: totemName,
        wavespell: wavespellName,
        style: totemData.style,
        view: totemData.view
      }
    });

    energyCenterRecords.push(
      {
        kin,
        center_name: '心轮',
        percentage: heart,
        mode: heart > 80 ? '恒星模式' : heart > 60 ? '行星模式' : '地球模式',
        description: heartDesc || `心轮能量${heart}%，${totemData.style}影响下的情感表达`,
        icon: '❤️',
        traits: `${totemName}赋予的心轮特质`,
        weaknesses: heart < 60 ? '需要强化情感连接' : null
      },
      {
        kin,
        center_name: '喉轮',
        percentage: throat,
        mode: throat > 80 ? '指挥官模式' : throat > 60 ? '传播者模式' : '倾听者模式',
        description: `喉轮能量${throat}%，${totemData.style}影响下的表达方式`,
        icon: '💎',
        traits: `${totemName}赋予的喉轮特质`,
        weaknesses: throat < 60 ? '需要强化表达能力' : null
      },
      {
        kin,
        center_name: '松果体',
        percentage: pineal,
        mode: pineal > 80 ? '先知模式' : pineal > 60 ? '战略家模式' : '观察者模式',
        description: `松果体能量${pineal}%，${totemData.style}影响下的直觉感知`,
        icon: '👁️',
        traits: `${totemName}赋予的松果体特质`,
        weaknesses: pineal < 60 ? '需要强化直觉开发' : null
      }
    );
  }

  console.log(`📊 准备插入 ${kinDefinitions.length} 条Kin定义记录...`);

  for (let i = 0; i < kinDefinitions.length; i += 100) {
    const batch = kinDefinitions.slice(i, i + 100);
    const { error: kinError } = await supabase
      .from('kin_definitions')
      .upsert(batch, { onConflict: 'kin_number' });

    if (kinError) {
      console.error(`❌ Kin定义插入失败 (batch ${Math.floor(i/100) + 1}):`, kinError);
      throw kinError;
    }
    console.log(`   ✅ 批次 ${Math.floor(i/100) + 1} 完成 (${batch.length} 条记录)`);
  }

  console.log(`📊 准备插入 ${energyCenterRecords.length} 条能量中心记录...`);

  for (let i = 0; i < energyCenterRecords.length; i += 100) {
    const batch = energyCenterRecords.slice(i, i + 100);
    const { error: centerError } = await supabase
      .from('kin_energy_centers')
      .upsert(batch, { onConflict: 'kin,center_name', ignoreDuplicates: false });

    if (centerError) {
      console.error(`❌ 能量中心数据插入失败 (batch ${Math.floor(i/100) + 1}):`, centerError);
      throw centerError;
    }
    console.log(`   ✅ 批次 ${Math.floor(i/100) + 1} 完成 (${batch.length} 条记录)`);
  }

  console.log('✅ 所有260个Kin数据生成完成');
}

async function verifyKeyKins() {
  console.log('\n🔍 验证关键Kin数据...');

  const testKins = [66, 200, 239];

  for (const kin of testKins) {
    const { data: centers } = await supabase
      .from('kin_energy_centers')
      .select('*')
      .eq('kin', kin)
      .order('center_name');

    console.log(`\n=== Kin ${kin} ===`);
    if (centers && centers.length > 0) {
      centers.forEach(c => {
        console.log(`   ${c.center_name}: ${c.percentage}% (${c.mode})`);
      });
    } else {
      console.log(`   ❌ 无数据`);
    }
  }

  console.log('\n✅ 验证完成');
}

async function main() {
  try {
    console.log('🚀 开始注入核心数据库...\n');

    await clearExistingData();
    await insertTotemLibrary();
    await insertToneLibrary();
    await generateAllKinData();
    await verifyKeyKins();

    console.log('\n🎉 核心数据库注入完成！');
  } catch (error) {
    console.error('\n❌ 注入失败:', error);
    process.exit(1);
  }
}

main();
