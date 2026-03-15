/**
 * 测试 Kin 239 的灵性礼物与阴影合成
 * 验证动态意象合成算法
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testKin239SoulGifts() {
  console.log('========================================');
  console.log('Kin 239 (蓝风暴) - 灵性礼物与阴影测试');
  console.log('========================================\n');

  const kin = 239;
  const totemId = ((kin - 1) % 20) + 1;  // 19 (蓝风暴)
  const toneId = ((kin - 1) % 13) + 1;   // 5 (超频)

  console.log('【Kin 基础信息】');
  console.log('─────────────────────────────────────');
  console.log(`Kin: ${kin}`);
  console.log(`图腾 ID: ${totemId} (蓝风暴)`);
  console.log(`调性 ID: ${toneId} (超频)`);

  // 步骤1：获取喉轮分值
  console.log('\n【步骤 1】获取喉轮分值');
  console.log('─────────────────────────────────────');

  const { data: throatCenter } = await supabase
    .from('kin_energy_centers')
    .select('*')
    .eq('kin', kin)
    .eq('center_name', '喉轮')
    .maybeSingle();

  if (!throatCenter) {
    console.log('❌ 未找到喉轮数据');
    return;
  }

  const throatPercentage = throatCenter.percentage;
  console.log(`✅ 喉轮分值: ${throatPercentage}%`);

  // 步骤2：获取图腾意象
  console.log('\n【步骤 2】获取图腾意象');
  console.log('─────────────────────────────────────');

  const { data: totemImagery } = await supabase
    .from('totem_imagery')
    .select('*')
    .eq('totem_id', totemId)
    .maybeSingle();

  if (!totemImagery) {
    console.log('❌ 未找到图腾意象');
    return;
  }

  console.log(`✅ 图腾: ${totemImagery.totem_name_cn}`);
  console.log(`   原型意象: ${totemImagery.archetype_imagery}`);
  console.log(`   能量底色: ${totemImagery.energy_base_color}`);
  console.log(`   礼物模板: ${totemImagery.gift_template}`);
  console.log(`   阴影意象: ${totemImagery.shadow_imagery}`);

  // 步骤3：获取调性动态张力
  console.log('\n【步骤 3】获取调性动态张力');
  console.log('─────────────────────────────────────');

  const { data: toneTension } = await supabase
    .from('tone_dynamic_tension')
    .select('*')
    .eq('tone_id', toneId)
    .maybeSingle();

  if (!toneTension) {
    console.log('❌ 未找到调性张力');
    return;
  }

  console.log(`✅ 调性: ${toneTension.tone_name_cn}`);
  console.log(`   行动张力: ${toneTension.action_tension}`);
  console.log(`   礼物修饰: ${toneTension.gift_modifier}`);
  console.log(`   阴影触发: ${toneTension.shadow_trigger}`);

  // 步骤4：获取白风年避坑动词
  console.log('\n【步骤 4】获取白风年避坑动词');
  console.log('─────────────────────────────────────');

  const { data: whiteWindAdvice } = await supabase
    .from('yearly_advice_2026_totems')
    .select('action_verb')
    .eq('totem_id', totemId)
    .maybeSingle();

  const actionVerb = whiteWindAdvice?.action_verb || '呼吸';
  console.log(`✅ 白风年关键动词: ${actionVerb}`);

  // 步骤5：合成灵性礼物
  console.log('\n【步骤 5】合成灵性礼物 (Soul Gift)');
  console.log('─────────────────────────────────────');

  let soulGift = '';
  soulGift += `${totemImagery.energy_base_color}。`;
  soulGift += `${toneTension.gift_modifier}，`;
  soulGift += totemImagery.gift_template;

  if (throatPercentage > 80) {
    soulGift += `。你的高喉轮赋予这份礼物"威权定频"的穿透力。`;
  } else if (throatPercentage >= 60) {
    soulGift += `。你的喉轮处于"稳健共振"的黄金平衡点，让这份礼物得以精准传递。`;
  } else {
    soulGift += `。你的喉轮正在"静默蓄能"，这份礼物将在沉默中积累爆发的力量。`;
  }

  console.log('✅ 灵性礼物合成完成！\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('灵性礼物 (Soul Gift):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(soulGift);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 步骤6：合成灵性阴影
  console.log('\n【步骤 6】合成灵性阴影 (Soul Shadow)');
  console.log('─────────────────────────────────────');

  let soulShadow = '';
  soulShadow += `警惕"${totemImagery.shadow_imagery}"。`;
  soulShadow += `${toneTension.shadow_trigger}，`;

  if (throatPercentage > 80) {
    soulShadow += '声音可能化为锋利的切割，忽略了白风年所需的呼吸留白。';
  } else if (throatPercentage >= 60) {
    soulShadow += '声音可能化为机械的定频，失去了灵性共振的温度。';
  } else {
    soulShadow += '声音可能化为压抑的淤积，阻塞了能量流动的管道。';
  }

  soulShadow += `请记得，最强大的穿透力往往来自于话语间的清晨微风，而非指令的重压。`;
  soulShadow += `2026白风年的关键词是"${actionVerb}"。`;

  console.log('✅ 灵性阴影合成完成！\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('灵性阴影 (Soul Shadow):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(soulShadow);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 步骤7：验证禁用词
  console.log('\n【步骤 7】验证禁用通用描述');
  console.log('─────────────────────────────────────');

  const bannedPhrases = [
    '蓝风暴赋予的',
    '超频赋予',
    '过度使用',
    '可能导致',
    '特质',
    '弱点'
  ];

  let hasBannedPhrase = false;
  const combinedText = soulGift + soulShadow;

  bannedPhrases.forEach(phrase => {
    if (combinedText.includes(phrase)) {
      console.log(`❌ 检测到禁用词: "${phrase}"`);
      hasBannedPhrase = true;
    }
  });

  if (!hasBannedPhrase) {
    console.log('✅ 无通用描述，文案精准赋能');
  }

  // 步骤8：验证能量词汇
  console.log('\n【步骤 8】验证能量词汇使用');
  console.log('─────────────────────────────────────');

  const energyWords = [
    '编织',
    '定频',
    '锚定',
    '留白',
    '共振',
    '坍缩',
    '穿透',
    '频率',
    '呼吸'
  ];

  let energyWordCount = 0;
  energyWords.forEach(word => {
    if (combinedText.includes(word)) {
      console.log(`✅ 包含能量词汇: "${word}"`);
      energyWordCount++;
    }
  });

  console.log(`\n能量词汇使用率: ${energyWordCount}/${energyWords.length}`);

  console.log('\n========================================');
  console.log('测试完成！');
  console.log('========================================');
}

testKin239SoulGifts().catch(console.error);
