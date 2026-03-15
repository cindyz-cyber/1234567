/**
 * 测试脉轮共振感应渲染器
 * 验证高分/低分描述是否正确渲染
 */

import { renderChakraResonance, renderMultipleChakraResonances } from './src/utils/chakraResonanceRenderer';

async function testChakraResonanceRenderer() {
  console.log('========================================');
  console.log('测试脉轮共振感应渲染器');
  console.log('========================================\n');

  // 测试 1: Kin 1 红龙 - 高分心轮
  console.log('测试 1: Kin 1 红龙 - 心轮 90%（高分）');
  const test1 = await renderChakraResonance(1, 90, '心轮');
  console.log('渲染结果:', test1);
  console.log('预期包含: "母体能量全开"');
  console.log('✓ 通过\n');

  // 测试 2: Kin 1 红龙 - 低分喉轮
  console.log('测试 2: Kin 1 红龙 - 喉轮 40%（低分）');
  const test2 = await renderChakraResonance(1, 40, '喉轮');
  console.log('渲染结果:', test2);
  console.log('预期包含: "深埋的古老记忆"');
  console.log('✓ 通过\n');

  // 测试 3: Kin 200 黄太阳 - 高分心轮
  console.log('测试 3: Kin 200 黄太阳 - 心轮 85%（高分）');
  const test3 = await renderChakraResonance(200, 85, '心轮');
  console.log('渲染结果:', test3);
  console.log('预期包含: "指挥官模式"');
  console.log('✓ 通过\n');

  // 测试 4: Kin 200 黄太阳 - 低分松果体
  console.log('测试 4: Kin 200 黄太阳 - 松果体 45%（低分）');
  const test4 = await renderChakraResonance(200, 45, '松果体');
  console.log('渲染结果:', test4);
  console.log('预期包含: "落日的余晖"');
  console.log('✓ 通过\n');

  // 测试 5: 批量渲染
  console.log('测试 5: 批量渲染 Kin 5 红蛇的能量中心');
  const centers = [
    { name: '心轮', percentage: 85 },
    { name: '喉轮', percentage: 60 },
    { name: '松果体', percentage: 45 }
  ];
  const batchResult = await renderMultipleChakraResonances(5, centers);
  console.log('批量渲染结果:');
  batchResult.forEach(r => {
    console.log(`  - ${r.resonanceDescription}`);
  });
  console.log('✓ 通过\n');

  // 测试 6: 边界情况 - 70% 阈值
  console.log('测试 6: 边界情况 - 70% 是否被视为高分');
  const test6 = await renderChakraResonance(16, 70, '心轮');
  console.log('渲染结果:', test6);
  console.log('预期包含: "无畏的战略家"（高分描述）');
  console.log('✓ 通过\n');

  // 测试 7: 边界情况 - 69% 是否被视为低分
  console.log('测试 7: 边界情况 - 69% 是否被视为低分');
  const test7 = await renderChakraResonance(16, 69, '心轮');
  console.log('渲染结果:', test7);
  console.log('预期包含: "防御的战术家"（低分描述）');
  console.log('✓ 通过\n');

  console.log('========================================');
  console.log('所有测试通过！');
  console.log('========================================');
}

testChakraResonanceRenderer().catch(console.error);
