/**
 * 测试 Kin 239 的 2026 白风年频率对齐建议
 * 验证基于喉轮分值的动态合成算法
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testKin239Advice() {
  console.log('========================================');
  console.log('Kin 239 (蓝风暴) - 2026 白风年建议测试');
  console.log('========================================\n');

  const kin = 239;

  // 提取图腾和调性
  const totemId = ((kin - 1) % 20) + 1;  // 239 % 20 = 19 (蓝风暴)
  const toneId = ((kin - 1) % 13) + 1;   // 239 % 13 = 5 (超频)

  console.log('【Kin 基础信息】');
  console.log('─────────────────────────────────────');
  console.log(`Kin: ${kin}`);
  console.log(`图腾 ID: ${totemId}`);
  console.log(`调性 ID: ${toneId}`);

  // 步骤1：获取 Kin 239 的喉轮分值
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
  console.log(`   模式: ${throatCenter.mode}`);

  // 步骤2：获取喉轮模板
  console.log('\n【步骤 2】匹配喉轮模板');
  console.log('─────────────────────────────────────');

  const { data: throatTemplate } = await supabase
    .from('yearly_advice_2026_throat_templates')
    .select('*')
    .lte('min_percentage', throatPercentage)
    .gte('max_percentage', throatPercentage)
    .maybeSingle();

  if (!throatTemplate) {
    console.log('❌ 未找到匹配的喉轮模板');
    return;
  }

  console.log(`✅ 匹配模板: ${throatTemplate.archetype}`);
  console.log(`   分值区间: ${throatTemplate.min_percentage}% - ${throatTemplate.max_percentage}%`);
  console.log(`   建议模板: ${throatTemplate.advice_template}`);
  console.log(`   行动模板: ${throatTemplate.action_template}`);

  // 步骤3：获取图腾特定建议
  console.log('\n【步骤 3】获取图腾特定建议');
  console.log('─────────────────────────────────────');

  const { data: totemAdvice } = await supabase
    .from('yearly_advice_2026_totems')
    .select('*')
    .eq('totem_id', totemId)
    .maybeSingle();

  if (!totemAdvice) {
    console.log('❌ 未找到图腾建议');
    return;
  }

  console.log(`✅ 图腾: ${totemAdvice.totem_name_cn}`);
  console.log(`   核心避坑: ${totemAdvice.core_challenge}`);
  console.log(`   显化路径: ${totemAdvice.manifestation_path}`);
  console.log(`   行动动词: ${totemAdvice.action_verb}`);
  console.log(`   频率类型: ${totemAdvice.frequency_type}`);

  // 步骤4：获取调性修正
  console.log('\n【步骤 4】获取调性修正逻辑');
  console.log('─────────────────────────────────────');

  const { data: toneModifier } = await supabase
    .from('yearly_advice_2026_tone_modifiers')
    .select('*')
    .eq('tone_id', toneId)
    .maybeSingle();

  if (!toneModifier) {
    console.log('❌ 未找到调性修正');
    return;
  }

  console.log(`✅ 调性: ${toneModifier.tone_name_cn}`);
  console.log(`   类型: ${toneModifier.tone_type}`);
  console.log(`   年度课题: ${toneModifier.yearly_lesson}`);

  // 步骤5：动态合成建议
  console.log('\n【步骤 5】动态合成最终建议');
  console.log('─────────────────────────────────────');

  let synthesizedGuidance = '';

  // 1. 喉轮前缀修饰
  synthesizedGuidance += `${throatTemplate.prefix_modifier}。`;

  // 2. 图腾核心挑战
  synthesizedGuidance += `作为${totemAdvice.totem_name_cn}，${totemAdvice.core_challenge}。`;

  // 3. 调性修正逻辑
  if (toneModifier.tone_type === '收敛型') {
    synthesizedGuidance += `你的${toneModifier.tone_name_cn}调性提醒你：${toneModifier.yearly_lesson}。`;
  } else if (toneModifier.tone_type === '放射型') {
    synthesizedGuidance += `你的${toneModifier.tone_name_cn}调性赋予你任务：${toneModifier.yearly_lesson}。`;
  } else {
    synthesizedGuidance += `你的${toneModifier.tone_name_cn}调性引导你：${toneModifier.yearly_lesson}。`;
  }

  // 4. 行动动词强化
  synthesizedGuidance += `2026 年，请记住这个动词："${totemAdvice.action_verb}"。`;

  // 5. 喉轮分值特定提醒
  if (throatPercentage > 80) {
    synthesizedGuidance += '你的高喉轮需要学会在沉默中蓄能，而非在每个瞬间释放。';
  } else if (throatPercentage < 60) {
    synthesizedGuidance += '你的低喉轮正在等待白风的唤醒，勇敢地让声音成为你的翅膀。';
  } else {
    synthesizedGuidance += '你的喉轮处于黄金平衡点，这一年是你精准表达的最佳时机。';
  }

  console.log('✅ 合成完成！\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('最终建议：');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(synthesizedGuidance);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 步骤6：验证预期输出
  console.log('\n【步骤 6】验证预期输出');
  console.log('─────────────────────────────────────');

  const expectedKeywords = [
    '白风',
    '蓝风暴',
    '超频',
    '定轴',
    '呼吸定轴'
  ];

  let matchCount = 0;
  expectedKeywords.forEach(keyword => {
    if (synthesizedGuidance.includes(keyword)) {
      console.log(`✅ 包含关键词: "${keyword}"`);
      matchCount++;
    } else {
      console.log(`⚠️ 缺少关键词: "${keyword}"`);
    }
  });

  console.log(`\n关键词匹配率: ${matchCount}/${expectedKeywords.length}`);

  // 步骤7：验证禁用词
  console.log('\n【步骤 7】验证禁用通用废话');
  console.log('─────────────────────────────────────');

  const bannedPhrases = [
    '2026年是白风年，适合沟通',
    '这一年适合',
    '你可以',
    '建议你'
  ];

  let hasBannedPhrase = false;
  bannedPhrases.forEach(phrase => {
    if (synthesizedGuidance.includes(phrase)) {
      console.log(`❌ 检测到禁用词: "${phrase}"`);
      hasBannedPhrase = true;
    }
  });

  if (!hasBannedPhrase) {
    console.log('✅ 无通用废话，文案精准');
  }

  console.log('\n========================================');
  console.log('测试完成！');
  console.log('========================================');
}

testKin239Advice().catch(console.error);
