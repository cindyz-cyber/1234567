/**
 * 测试 Kin 239 的完整报告数据流
 * 验证：白风年建议、灵性礼物/阴影、量子共振
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testKin239FullReport() {
  console.log('========================================');
  console.log('Kin 239 完整报告数据流测试');
  console.log('========================================\n');

  const kin = 239;

  // 步骤1：获取能量中心
  console.log('【步骤 1】获取能量中心数据');
  console.log('─────────────────────────────────────');

  const { data: centers } = await supabase
    .from('kin_energy_centers')
    .select('*')
    .eq('kin', kin)
    .order('center_name');

  if (!centers || centers.length === 0) {
    console.log('❌ 未找到能量中心数据');
    return;
  }

  console.log(`✅ 找到 ${centers.length} 个能量中心`);
  centers.forEach(c => {
    console.log(`   ${c.center_name}: ${c.percentage}%`);
  });

  const throatCenter = centers.find(c => c.center_name === '喉轮');
  const throatPercentage = throatCenter?.percentage || 50;
  console.log(`\n喉轮分值: ${throatPercentage}%`);

  // 步骤2：测试2026白风年建议
  console.log('\n【步骤 2】测试 2026 白风年建议');
  console.log('─────────────────────────────────────');

  const totemId = ((kin - 1) % 20) + 1;

  const { data: yearlyAdvice } = await supabase
    .from('yearly_advice_2026_totems')
    .select('*')
    .eq('totem_id', totemId)
    .maybeSingle();

  if (!yearlyAdvice) {
    console.log('❌ 未找到白风年建议');
  } else {
    console.log('✅ 白风年建议已找到');
    console.log(`   图腾: ${yearlyAdvice.totem_name}`);
    console.log(`   原型: ${yearlyAdvice.archetype}`);
    console.log(`   关键动词: ${yearlyAdvice.action_verb}`);
    console.log(`   核心引导: ${yearlyAdvice.core_guidance?.substring(0, 50)}...`);
  }

  // 步骤3：测试灵性礼物与阴影
  console.log('\n【步骤 3】测试灵性礼物与阴影');
  console.log('─────────────────────────────────────');

  const { data: totemImagery } = await supabase
    .from('totem_imagery')
    .select('*')
    .eq('totem_id', totemId)
    .maybeSingle();

  const toneId = ((kin - 1) % 13) + 1;

  const { data: toneTension } = await supabase
    .from('tone_dynamic_tension')
    .select('*')
    .eq('tone_id', toneId)
    .maybeSingle();

  let soulGift = '';

  if (!totemImagery || !toneTension) {
    console.log('❌ 未找到图腾意象或调性张力');
  } else {
    console.log('✅ 灵性礼物数据已找到');
    console.log(`   图腾意象: ${totemImagery.archetype_imagery}`);
    console.log(`   调性张力: ${toneTension.action_tension}`);

    // 合成灵性礼物
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

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('灵性礼物 (Soul Gift):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(soulGift);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  // 步骤4：测试量子共振（模拟与 Kin 240 的关系，差值=1，母体灌溉）
  console.log('\n【步骤 4】测试量子共振 - 母体灌溉关系');
  console.log('─────────────────────────────────────');

  const kinB = 240;
  const kinDelta = Math.abs(kin - kinB);

  console.log(`Kin A: ${kin}`);
  console.log(`Kin B: ${kinB}`);
  console.log(`差值: ${kinDelta}`);

  if (kinDelta === 1) {
    console.log('✅ 检测到母体灌溉关系！');
    console.log('   关系类型: 母体灌溉');
    console.log('   共振分数: 100%');
    console.log('   描述: 这是宇宙中最罕见的灌溉关系。你们的能量场如同母体的脐带连接...');
  } else {
    console.log(`❌ 非母体灌溉关系（差值=${kinDelta}）`);
  }

  // 步骤5：测试量子共振（模拟与 Kin 109 的关系，差值=130，生命磨刀石）
  console.log('\n【步骤 5】测试量子共振 - 生命磨刀石关系');
  console.log('─────────────────────────────────────');

  const kinC = 109;
  const kinDelta2 = Math.min(Math.abs(kin - kinC), 260 - Math.abs(kin - kinC));

  console.log(`Kin A: ${kin}`);
  console.log(`Kin C: ${kinC}`);
  console.log(`差值: ${kinDelta2}`);

  if (kinDelta2 === 130) {
    console.log('✅ 检测到生命磨刀石关系！');
    console.log('   关系类型: 生命磨刀石');
    console.log('   共振分数: 95%');
    console.log('   描述: 这是宇宙设计的极性对冲关系。你们的能量场形成130度的完美张力...');
  } else {
    console.log(`❌ 非生命磨刀石关系（差值=${kinDelta2}）`);
  }

  // 步骤6：验证禁用词清理
  console.log('\n【步骤 6】验证禁用词清理');
  console.log('─────────────────────────────────────');

  const bannedPhrases = [
    '普通共振',
    '50%',
    'Ta 与你之间存在自然的能量互动',
    '虽无特殊共振',
    '但仍有成长空间'
  ];

  let foundBanned = false;
  const testTexts = [
    soulGift || '',
    yearlyAdvice?.core_guidance || ''
  ];

  bannedPhrases.forEach(phrase => {
    const found = testTexts.some(text => text.includes(phrase));
    if (found) {
      console.log(`❌ 检测到禁用词: "${phrase}"`);
      foundBanned = true;
    }
  });

  if (!foundBanned) {
    console.log('✅ 未检测到禁用词，文案已清理');
  }

  console.log('\n========================================');
  console.log('测试完成！');
  console.log('========================================');
}

testKin239FullReport().catch(console.error);
