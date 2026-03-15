import { calculateKin } from './src/utils/mayaCalendar';

console.log('=== 波符算法校准验证 ===\n');

const calibrationCases = [
  {
    date: '1983-09-30',
    expectedKin: 200,
    expectedWavespell: '黄战士',
    calculation: 'Kin 200 → 起始Kin 196 → (196-1)%20=15 → 黄战士'
  },
  {
    date: '1978-02-09',
    expectedKin: 222,
    expectedWavespell: '白镜',
    calculation: 'Kin 222 → 起始Kin 222 → (222-1)%20=1 → 白风'
  },
  {
    date: '2012-05-11',
    expectedKin: 243,
    expectedWavespell: '蓝鹰',
    calculation: 'Kin 243 → 起始Kin 235 → (235-1)%20=14 → 蓝鹰'
  }
];

console.log('【强制校验矩阵】\n');

let allPassed = true;

for (const testCase of calibrationCases) {
  const kinData = calculateKin(new Date(testCase.date));

  const kinMatch = kinData.kin === testCase.expectedKin;
  const wavespellMatch = kinData.wavespellName === testCase.expectedWavespell;

  console.log(`日期: ${testCase.date}`);
  console.log(`  Kin: ${kinData.kin} ${kinMatch ? '✓' : '✗ (期望: ' + testCase.expectedKin + ')'}`);
  console.log(`  图腾: ${kinData.toneName}的${kinData.sealName}`);
  console.log(`  波符: ${kinData.wavespellName} ${wavespellMatch ? '✓' : '✗ (期望: ' + testCase.expectedWavespell + ')'}`);
  console.log(`  推导: ${testCase.calculation}`);
  console.log('');

  if (!kinMatch || !wavespellMatch) {
    allPassed = false;
  }
}

// 详细验证波符起始Kin的计算
console.log('\n【波符起始Kin验证】\n');

const SEALS = [
  '红龙', '白风', '蓝夜', '黄种子', '红蛇',
  '白世界桥', '蓝手', '黄星星', '红月', '白狗',
  '蓝猴', '黄人', '红天行者', '白巫师', '蓝鹰',
  '黄战士', '红地球', '白镜', '蓝风暴', '黄太阳'
];

for (const testCase of calibrationCases) {
  const kin = testCase.expectedKin;
  const wavespellStartKin = Math.floor((kin - 1) / 13) * 13 + 1;
  const sealIndex = (wavespellStartKin - 1) % 20;
  const sealName = SEALS[sealIndex];

  console.log(`Kin ${kin}:`);
  console.log(`  起始Kin: ${wavespellStartKin}`);
  console.log(`  图腾索引: (${wavespellStartKin}-1) % 20 = ${sealIndex}`);
  console.log(`  波符图腾: ${sealName} ${sealName === testCase.expectedWavespell ? '✓' : '✗'}`);
  console.log('');
}

if (allPassed) {
  console.log('✅ 所有校验通过！波符算法与真理对齐。');
} else {
  console.log('❌ 校验失败，需要调整算法。');
}
