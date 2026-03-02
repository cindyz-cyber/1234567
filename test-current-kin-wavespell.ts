import { calculateKin } from './src/utils/mayaCalendar';

console.log('=== 波符算法校准验证 ===\n');

// 新的校准矩阵（真理对齐）
const calibrationCases = [
  {
    date: '1983-09-30',
    expectedKin: 200,
    expectedWavespell: '黄战士',
    description: 'Kin 200 → 起始196 → (196-1)%20=15 → 黄战士'
  },
  {
    date: '1978-02-09',
    expectedKin: 222,
    expectedWavespell: '白镜',
    description: 'Kin 222 → 起始222 → (222-1)%20=17 → 白镜'
  },
  {
    date: '2012-05-11',
    expectedKin: 243,
    expectedWavespell: '蓝风暴',
    description: 'Kin 243 → 起始235 → (235-1)%20=14 → 蓝鹰'
  }
];

// 使用您提供的已验证的测试用例
const verifiedCases = [
  { date: '1963-09-30', expectedKin: 180, description: '历史追溯用例' },
  { date: '1983-09-30', expectedKin: 200, description: '基准点' },
  { date: '1994-07-16', expectedKin: 239, description: '验证用例' },
  { date: '2000-11-03', expectedKin: 199, description: '闰年边界' },
  { date: '2023-02-10', expectedKin: 8, description: '未来推演' }
];

console.log('【强制校验矩阵】\n');

let allPassed = true;

for (const testCase of calibrationCases) {
  const kinData = calculateKin(new Date(testCase.date));
  const kinMatch = kinData.kin === testCase.expectedKin;
  const wavespellMatch = kinData.wavespellName === testCase.expectedWavespell;

  console.log(`日期: ${testCase.date}`);
  console.log(`  Kin: ${kinData.kin} ${kinMatch ? '✓' : '✗'}`);
  console.log(`  图腾: ${kinData.toneName}的${kinData.sealName}`);
  console.log(`  波符: ${kinData.wavespellName} ${wavespellMatch ? '✓' : '✗ (期望: ' + testCase.expectedWavespell + ')'}`);
  console.log(`  推导: ${testCase.description}`);
  console.log('');

  if (!kinMatch || !wavespellMatch) {
    allPassed = false;
  }
}

console.log('\n【已验证的Kin计算】\n');

for (const testCase of verifiedCases) {
  const kinData = calculateKin(new Date(testCase.date));
  const kinMatch = kinData.kin === testCase.expectedKin;

  console.log(`${testCase.description}: ${testCase.date}`);
  console.log(`  Kin: ${kinData.kin} ${kinMatch ? '✓' : '✗ (期望: ' + testCase.expectedKin + ')'}`);
  console.log(`  图腾: ${kinData.toneName}的${kinData.sealName}`);
  console.log(`  波符: ${kinData.wavespellName}波符 (第${kinData.wavespell}波符)`);
  console.log('');
}

// 计算波符图腾的详细信息
console.log('\n【波符序号和图腾映射】\n');

const SEALS = [
  '红龙', '白风', '蓝夜', '黄种子', '红蛇',
  '白世界桥', '蓝手', '黄星星', '红月', '白狗',
  '蓝猴', '黄人', '红天行者', '白巫师', '蓝鹰',
  '黄战士', '红地球', '白镜', '蓝风暴', '黄太阳'
];

// 显示前几个波符的映射关系（使用新算法）
for (let i = 0; i < 20; i++) {
  const startKin = i * 13 + 1;
  const endKin = startKin + 12;
  const sealIndex = (startKin - 1) % 20;
  const wavespellName = SEALS[sealIndex];

  console.log(`波符${i + 1}: Kin ${startKin}-${endKin} → ${wavespellName}`);
}

if (allPassed) {
  console.log('\n✅ 所有校验通过！波符算法与真理对齐。');
} else {
  console.log('\n❌ 校验失败，需要调整算法。');
}
