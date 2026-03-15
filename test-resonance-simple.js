/**
 * 简单的量子共振算法验证
 * 不依赖数据库，仅验证核心算法
 */

function calculateKinDelta(kinA, kinB) {
  const diff = Math.abs(kinA - kinB);
  return Math.min(diff, 260 - diff);
}

function calculateQuantumResonance(kinA, kinB) {
  const kinDelta = calculateKinDelta(kinA, kinB);

  console.log(`\n🔍 分析: Kin ${kinA} ⇄ Kin ${kinB}, 差值=${kinDelta}`);

  // 母体灌溉 (Kin差值 = 1)
  if (kinDelta === 1) {
    console.log('🌟 检测到母体灌溉关系！');
    return {
      label: '母体灌溉',
      score: 100,
      type: 'matrix_irrigation'
    };
  }

  // 生命磨刀石 (Kin差值 = 130)
  if (kinDelta === 130) {
    console.log('⚡ 检测到生命磨刀石关系！');
    return {
      label: '生命磨刀石',
      score: 95,
      type: 'life_whetstone'
    };
  }

  // 自然共振（动态分数算法：65% ~ 93%）
  const dynamicOffset = (kinA + kinB) % 29;
  const synergyScore = 65 + dynamicOffset;

  console.log(`🔢 动态分数算法: (${kinA} + ${kinB}) % 29 = ${dynamicOffset}`);
  console.log(`📊 共振强度: 65 + ${dynamicOffset} = ${synergyScore}%`);

  return {
    label: '自然共振',
    score: synergyScore,
    type: 'natural_resonance'
  };
}

console.log('========================================');
console.log('量子共振核心算法验证');
console.log('========================================');

// 测试 1: 母体灌溉
const test1 = calculateQuantumResonance(239, 240);
console.log(`结果: ${test1.label}, 分数=${test1.score}%`);
if (test1.score !== 100) {
  console.error('❌ 错误：母体灌溉应该是 100%');
} else {
  console.log('✅ 通过');
}

// 测试 2: 生命磨刀石
const test2 = calculateQuantumResonance(50, 180);
console.log(`结果: ${test2.label}, 分数=${test2.score}%`);
if (test2.score !== 95) {
  console.error('❌ 错误：生命磨刀石应该是 95%');
} else {
  console.log('✅ 通过');
}

// 测试 3: 自然共振 - 验证动态分数
const test3 = calculateQuantumResonance(100, 150);
console.log(`结果: ${test3.label}, 分数=${test3.score}%`);
const expectedOffset3 = (100 + 150) % 29;
const expectedScore3 = 65 + expectedOffset3;
if (test3.score !== expectedScore3) {
  console.error(`❌ 错误：预期 ${expectedScore3}%，实际 ${test3.score}%`);
} else {
  console.log('✅ 通过');
}

// 测试 4: 验证不会出现 50%
const test4 = calculateQuantumResonance(22, 200);
console.log(`结果: ${test4.label}, 分数=${test4.score}%`);
if (test4.score === 50) {
  console.error('❌ 错误：不应出现硬编码的 50%');
} else if (test4.label === '协作共振' || test4.label === '普通共振') {
  console.error('❌ 错误：不应出现禁用的标签');
} else {
  console.log('✅ 通过');
}

// 测试 5: 父亲关系（用户提到的问题场景）
const test5 = calculateQuantumResonance(239, 22);
console.log(`结果: ${test5.label}, 分数=${test5.score}%`);
const expectedOffset5 = (239 + 22) % 29;
const expectedScore5 = 65 + expectedOffset5;
console.log(`验证公式: (239 + 22) % 29 = ${expectedOffset5}, 65 + ${expectedOffset5} = ${expectedScore5}%`);
if (test5.score === 50) {
  console.error('❌ 错误：不应出现 50%');
} else {
  console.log('✅ 通过');
}

console.log('\n========================================');
console.log('核心算法验证完成');
console.log('========================================');
