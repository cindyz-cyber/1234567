/**
 * 验证 Kin 239 + Kin 22 的母体灌溉效果
 * 测试量子共振算法是否正确触发爆发短句
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testKin239And22Synergy() {
  console.log('========================================');
  console.log('Kin 239 + Kin 22 母体灌溉验证');
  console.log('========================================\n');

  const userKin = 239;
  const relativeKin = 22;
  const kinSum = userKin + relativeKin;

  console.log(`用户 Kin: ${userKin}`);
  console.log(`关系人 Kin: ${relativeKin}`);
  console.log(`Kin 总和: ${kinSum}`);
  console.log(`验证公式: (${userKin} + ${relativeKin}) % 260 = ${kinSum % 260}`);
  console.log('');

  // 测试1：验证母体灌溉判断逻辑
  console.log('【测试 1】母体灌溉判断逻辑');
  console.log('─────────────────────────────────────');

  if (kinSum % 260 === 1 || kinSum === 261) {
    console.log('✅ 判断逻辑正确：符合母体灌溉条件');
    console.log(`   ${userKin} + ${relativeKin} = ${kinSum} ${kinSum === 261 ? '=== 261' : '% 260 === 1'}`);
  } else {
    console.log('❌ 判断逻辑错误：不符合母体灌溉条件');
    console.log(`   期望: (${userKin} + ${relativeKin}) % 260 === 1`);
    console.log(`   实际: ${kinSum % 260}`);
  }

  // 测试2：从数据库获取母体灌溉爆发短句
  console.log('\n【测试 2】数据库爆发短句获取');
  console.log('─────────────────────────────────────');

  const { data: burst261, error } = await supabase
    .from('quantum_synergy_bursts')
    .select('*')
    .eq('synergy_code', 261)
    .single();

  if (error) {
    console.log('❌ 数据库查询失败:', error.message);
  } else if (burst261) {
    console.log('✅ 成功获取母体灌溉爆发短句');
    console.log(`   关系类型: ${burst261.relationship_type}`);
    console.log(`   短句数量: ${burst261.burst_templates.length} 条`);
    console.log(`\n   示例短句:`);
    console.log(`   ${burst261.burst_templates[0]}`);
  }

  // 测试3：测试 analyzeQuantumResonance 函数
  console.log('\n【测试 3】量子共振引擎计算');
  console.log('─────────────────────────────────────');

  // 动态导入量子共振引擎
  const { analyzeQuantumResonance } = await import('./src/utils/quantumResonanceEngine.ts');

  const resonanceResult = await analyzeQuantumResonance(userKin, relativeKin);

  console.log('计算结果:');
  console.log(`  类型: ${resonanceResult.type}`);
  console.log(`  标签: ${resonanceResult.label}`);
  console.log(`  描述: ${resonanceResult.description.substring(0, 60)}...`);

  if (resonanceResult.type === 'push' && resonanceResult.label.includes('母体灌溉')) {
    console.log('\n✅ 关系类型识别正确：母体灌溉型');
  } else {
    console.log('\n❌ 关系类型识别错误');
    console.log(`   期望: type === "push", label 包含 "母体灌溉"`);
    console.log(`   实际: type === "${resonanceResult.type}", label === "${resonanceResult.label}"`);
  }

  // 测试4：验证能量加成
  console.log('\n【测试 4】能量爆发加成验证');
  console.log('─────────────────────────────────────');

  if (resonanceResult.energyBoost) {
    console.log('✅ 能量加成数据存在');
    console.log(`   心轮加成: +${resonanceResult.energyBoost.heart || 0}%`);
    console.log(`   喉轮加成: +${resonanceResult.energyBoost.throat || 0}%`);
    console.log(`   松果体加成: +${resonanceResult.energyBoost.pineal || 0}%`);

    if (resonanceResult.energyBoost.heart === 15) {
      console.log('\n✅ 母体灌溉心轮加成正确：+15%');
    } else {
      console.log(`\n❌ 心轮加成错误，期望 +15%，实际 +${resonanceResult.energyBoost.heart || 0}%`);
    }
  } else {
    console.log('❌ 能量加成数据缺失');
  }

  // 测试5：完整报告生成测试
  console.log('\n【测试 5】完整报告生成测试');
  console.log('─────────────────────────────────────');

  const { generateEnergyReport } = await import('./src/utils/energyPortraitEngine.ts');

  const report = await generateEnergyReport(
    userKin,
    [{ name: '测试关系人', kin: relativeKin }]
  );

  console.log(`生成报告成功: Kin ${report.kin}`);
  console.log(`量子共振记录数: ${report.quantumResonances.length}`);

  if (report.quantumResonances.length > 0) {
    const resonance = report.quantumResonances[0];
    console.log('\n量子共振详情:');
    console.log(`  家人: ${resonance.familyMember}`);
    console.log(`  类型标签: ${resonance.typeLabel}`);
    console.log(`  共振强度: ${Math.round(resonance.synergyStrength * 100)}%`);
    console.log(`  描述: ${resonance.description.substring(0, 80)}...`);

    if (resonance.typeLabel.includes('母体灌溉') && resonance.synergyStrength === 1.0) {
      console.log('\n✅ 报告显示正确：母体灌溉型，共振强度 100%');
    } else {
      console.log('\n⚠️ 报告显示异常');
      console.log(`   期望: typeLabel 包含 "母体灌溉", synergyStrength === 1.0`);
      console.log(`   实际: typeLabel === "${resonance.typeLabel}", synergyStrength === ${resonance.synergyStrength}`);
    }
  } else {
    console.log('❌ 未生成量子共振记录');
  }

  // 测试6：验证多维语感爆发短句集成
  console.log('\n【测试 6】多维语感爆发短句集成');
  console.log('─────────────────────────────────────');

  const hasBurstKeywords = resonanceResult.description.includes('量子爆发') ||
                           resonanceResult.description.includes('灵魂') ||
                           resonanceResult.description.includes('母体') ||
                           resonanceResult.description.includes('次元');

  if (hasBurstKeywords) {
    console.log('✅ 描述包含多维语感爆发短句关键词');
    console.log(`   完整描述:\n   ${resonanceResult.description}`);
  } else {
    console.log('⚠️ 描述可能未集成多维语感爆发短句');
    console.log(`   当前描述: ${resonanceResult.description}`);
  }

  console.log('\n========================================');
  console.log('测试完成！');
  console.log('========================================');
}

testKin239And22Synergy().catch(console.error);
