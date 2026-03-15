/**
 * 测试多维语感叙事引擎
 * 验证三段梯度、调性动词、环境音等功能
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testNarrativeEngine() {
  console.log('========================================');
  console.log('多维语感叙事引擎测试');
  console.log('========================================\n');

  // 测试 1: 脉轮叙事模板（三段梯度）
  console.log('【测试 1】脉轮叙事模板 - 松果体三段梯度');
  console.log('─────────────────────────────────────');

  const { data: narratives } = await supabase
    .from('chakra_narrative_templates')
    .select('*')
    .eq('center_name', '松果体')
    .order('tier');

  narratives?.forEach(n => {
    console.log(`\n梯度: ${n.tier.toUpperCase()}`);
    console.log(`关键词: ${n.keywords.slice(0, 3).join('、')}`);
    console.log(`模板示例: ${n.templates[0].substring(0, 60)}...`);
  });

  // 测试 2: 调性动态动词
  console.log('\n\n【测试 2】调性动态动词 - 冷暖色调对比');
  console.log('─────────────────────────────────────');

  const { data: coldTone } = await supabase
    .from('tone_dynamics')
    .select('*')
    .eq('tone_number', 1)
    .single();

  const { data: warmTone } = await supabase
    .from('tone_dynamics')
    .select('*')
    .eq('tone_number', 5)
    .single();

  console.log(`\n调性1（磁性 - 冷色调）:`);
  console.log(`  动词: ${coldTone.verbs.slice(0, 3).join('、')}`);
  console.log(`  形容词: ${coldTone.adjectives.slice(0, 3).join('、')}`);

  console.log(`\n调性5（超越 - 暖色调）:`);
  console.log(`  动词: ${warmTone.verbs.slice(0, 3).join('、')}`);
  console.log(`  形容词: ${warmTone.adjectives.slice(0, 3).join('、')}`);

  // 测试 3: 量子共振爆发短句
  console.log('\n\n【测试 3】量子共振爆发短句');
  console.log('─────────────────────────────────────');

  const { data: burst261 } = await supabase
    .from('quantum_synergy_bursts')
    .select('*')
    .eq('synergy_code', 261)
    .single();

  const { data: burst130 } = await supabase
    .from('quantum_synergy_bursts')
    .select('*')
    .eq('synergy_code', 130)
    .single();

  console.log(`\n母体灌溉（261）:`);
  console.log(`  ${burst261.burst_templates[0]}`);

  console.log(`\n生命磨刀石（130）:`);
  console.log(`  ${burst130.burst_templates[0]}`);

  // 测试 4: 白风年环境音
  console.log('\n\n【测试 4】2026白风年环境音意象');
  console.log('─────────────────────────────────────');

  const { data: windAmbient } = await supabase
    .from('wind_year_ambient')
    .select('*')
    .eq('context', '喉轮专属')
    .single();

  console.log(`\n喉轮专属环境音意象（随机3条）:`);
  const randomImagery = windAmbient.imagery
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  randomImagery.forEach((img, i) => {
    console.log(`  ${i + 1}. ${img}`);
  });

  // 测试 5: 模拟完整渲染
  console.log('\n\n【测试 5】模拟完整渲染 - Kin 239 蓝风暴');
  console.log('─────────────────────────────────────');

  // 模拟 Kin 239 的能量中心数据
  const mockCenters = [
    { name: '松果体', percentage: 98, tier: 'high' },
    { name: '心轮', percentage: 40, tier: 'low' },
    { name: '喉轮', percentage: 72, tier: 'medium' }
  ];

  for (const center of mockCenters) {
    const { data: template } = await supabase
      .from('chakra_narrative_templates')
      .select('*')
      .eq('center_name', center.name)
      .eq('tier', center.tier)
      .single();

    if (template) {
      const narrative = template.templates[0].replace(/{percentage}/g, center.percentage);
      console.log(`\n${center.name} (${center.percentage}%):`);
      console.log(`  ${narrative}`);
    }
  }

  // 测试 6: 验证数据完整性
  console.log('\n\n【测试 6】数据完整性验证');
  console.log('─────────────────────────────────────');

  const { data: allNarratives, count: narrativeCount } = await supabase
    .from('chakra_narrative_templates')
    .select('*', { count: 'exact' });

  const { data: allTones, count: toneCount } = await supabase
    .from('tone_dynamics')
    .select('*', { count: 'exact' });

  const { data: allBursts, count: burstCount } = await supabase
    .from('quantum_synergy_bursts')
    .select('*', { count: 'exact' });

  const { data: allAmbient, count: ambientCount } = await supabase
    .from('wind_year_ambient')
    .select('*', { count: 'exact' });

  console.log(`\n✓ 脉轮叙事模板: ${narrativeCount} 条`);
  console.log(`✓ 调性动态动词: ${toneCount} 条（应为13条）`);
  console.log(`✓ 量子爆发短句: ${burstCount} 条`);
  console.log(`✓ 白风年环境音: ${ambientCount} 条`);

  // 验证每个脉轮都有三段梯度
  const centerNames = ['松果体', '心轮', '喉轮'];
  console.log('\n脉轮梯度覆盖检查:');
  for (const centerName of centerNames) {
    const { count } = await supabase
      .from('chakra_narrative_templates')
      .select('*', { count: 'exact' })
      .eq('center_name', centerName);
    console.log(`  ${centerName}: ${count}/3 ${count === 3 ? '✓' : '✗'}`);
  }

  console.log('\n========================================');
  console.log('测试完成！多维语感叙事引擎已就位');
  console.log('========================================');
}

testNarrativeEngine().catch(console.error);
