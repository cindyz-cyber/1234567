/**
 * 量子共振计算验证脚本
 * 验证核心算法：母体灌溉、生命磨刀石、自然共振
 */

import { analyzeQuantumResonanceDriven } from './src/utils/quantumResonanceDrivenEngine';

async function testQuantumResonanceCalculation() {
  console.log('========================================');
  console.log('量子共振计算验证');
  console.log('========================================\n');

  // 模拟用户和家人的能量分数
  const userScores = {
    throat: 75,
    heart: 65,
    pineal: 80
  };

  const fatherScores = {
    throat: 70,
    heart: 75,
    pineal: 68
  };

  // 测试场景 1: 母体灌溉（Kin 差值 = 1）
  console.log('📊 测试 1: 母体灌溉关系 (Kin 239 ⇄ Kin 240, 差值=1)');
  const test1 = await analyzeQuantumResonanceDriven(239, 240, userScores, fatherScores);
  console.log(`结果: ${test1.relationshipLabel}`);
  console.log(`类型: ${test1.effectType}`);
  console.log(`分数: ${test1.synergyScore}%`);
  console.log(`描述: ${test1.description}\n`);

  if (test1.synergyScore !== 100 || test1.relationshipLabel !== '母体灌溉') {
    console.error('❌ 错误：母体灌溉关系计算不正确！');
  } else {
    console.log('✅ 母体灌溉关系计算正确\n');
  }

  // 测试场景 2: 生命磨刀石（Kin 差值 = 130）
  console.log('📊 测试 2: 生命磨刀石关系 (Kin 50 ⇄ Kin 180, 差值=130)');
  const test2 = await analyzeQuantumResonanceDriven(50, 180, userScores, fatherScores);
  console.log(`结果: ${test2.relationshipLabel}`);
  console.log(`类型: ${test2.effectType}`);
  console.log(`分数: ${test2.synergyScore}%`);
  console.log(`描述: ${test2.description}\n`);

  if (test2.synergyScore !== 95 || test2.relationshipLabel !== '生命磨刀石') {
    console.error('❌ 错误：生命磨刀石关系计算不正确！');
  } else {
    console.log('✅ 生命磨刀石关系计算正确\n');
  }

  // 测试场景 3: 自然共振（动态分数算法）
  console.log('📊 测试 3: 自然共振关系 (Kin 100 ⇄ Kin 150)');
  const test3 = await analyzeQuantumResonanceDriven(100, 150, userScores, fatherScores);
  console.log(`结果: ${test3.relationshipLabel}`);
  console.log(`类型: ${test3.effectType}`);
  console.log(`分数: ${test3.synergyScore}%`);
  console.log(`Kin差值: ${test3.kinDelta}`);

  // 验证动态分数算法
  const expectedDynamicOffset = (100 + 150) % 29;
  const expectedScore = 65 + expectedDynamicOffset;
  console.log(`预期动态偏移: ${expectedDynamicOffset}`);
  console.log(`预期分数: ${expectedScore}%`);
  console.log(`描述: ${test3.description}\n`);

  if (test3.synergyScore < 65 || test3.synergyScore > 93) {
    console.error('❌ 错误：自然共振分数超出范围 (应在 65-93% 之间)');
  } else {
    console.log('✅ 自然共振分数在正确范围内\n');
  }

  // 测试场景 4: 验证不会出现"协作共振 50%"
  console.log('📊 测试 4: 验证不会出现硬编码的 50% 分数 (Kin 22 ⇄ Kin 200)');
  const test4 = await analyzeQuantumResonanceDriven(22, 200, userScores, fatherScores);
  console.log(`结果: ${test4.relationshipLabel}`);
  console.log(`分数: ${test4.synergyScore}%`);

  if (test4.synergyScore === 50) {
    console.error('❌ 错误：发现硬编码的 50% 分数！');
  } else if (test4.relationshipLabel === '协作共振' || test4.relationshipLabel === '普通共振') {
    console.error('❌ 错误：发现禁用的标签（协作共振/普通共振）！');
  } else {
    console.log('✅ 未发现硬编码的 50% 或禁用标签\n');
  }

  console.log('========================================');
  console.log('验证完成');
  console.log('========================================');
}

testQuantumResonanceCalculation();
