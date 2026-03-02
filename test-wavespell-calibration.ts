/**
 * 波符计算真理测试
 * 验证波符计算引擎的精准度
 */

import { calculateKin } from './src/utils/mayaCalendar';

const TRUTH_TESTS = [
  { date: '1978-02-09', expectedKin: 222, expectedWavespell: '白风' },
  { date: '1983-09-30', expectedKin: 200, expectedWavespell: '黄战士' },
  { date: '2012-05-11', expectedKin: 243, expectedWavespell: '蓝鹰' },
  { date: '1985-07-08', expectedKin: 66, expectedWavespell: '白世界桥' },
];

console.log('🔍 波符计算真理测试开始...\n');

let allPassed = true;

for (const test of TRUTH_TESTS) {
  const birthDate = new Date(test.date);
  const result = calculateKin(birthDate);

  const kinMatch = result.kin === test.expectedKin;
  const wavespellMatch = result.wavespellName === test.expectedWavespell;

  const status = kinMatch && wavespellMatch ? '✅' : '❌';

  console.log(`${status} 测试: ${test.date}`);
  console.log(`   期望: Kin ${test.expectedKin}, 波符: ${test.expectedWavespell}`);
  console.log(`   实际: Kin ${result.kin}, 波符: ${result.wavespellName}`);
  console.log(`   Kin匹配: ${kinMatch ? '✅' : '❌'}`);
  console.log(`   波符匹配: ${wavespellMatch ? '✅' : '❌'}\n`);

  if (!kinMatch || !wavespellMatch) {
    allPassed = false;

    // 调试信息
    const wavespellIndex = Math.floor((result.kin - 1) / 13);
    const wavespellStartKin = wavespellIndex * 13 + 1;
    const wavespellSeal = (wavespellIndex % 20) + 1;

    console.log(`   📊 调试信息:`);
    console.log(`      波符序号: ${wavespellIndex + 1} (0-based: ${wavespellIndex})`);
    console.log(`      波符起始Kin: ${wavespellStartKin}`);
    console.log(`      波符图腾序号: ${wavespellSeal}`);
    console.log(`      波符编号: ${result.wavespell}\n`);
  }
}

if (allPassed) {
  console.log('🎉 所有测试通过！波符计算引擎精准无误！');
  process.exit(0);
} else {
  console.log('⚠️  部分测试失败，需要修正波符计算逻辑');
  process.exit(1);
}
