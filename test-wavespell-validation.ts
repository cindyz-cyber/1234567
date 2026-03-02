import { calculateKin } from './src/utils/mayaCalendar';

console.log('=== 波符校准测试（基于截图数据）===\n');

const testCases = [
  { date: '1958-03-09', expectedKin: 59, expectedWavespell: '白风', description: '1958年（60年前）' },
  { date: '1968-03-09', expectedKin: 69, expectedWavespell: '蓝鹰', description: '1968年（50年前）' },
  { date: '2018-03-09', expectedKin: 99, expectedWavespell: '蓝手', description: '2018年（基准-10年）' },
  { date: '2028-03-09', expectedKin: 109, expectedWavespell: '黄太阳', description: '2028年（基准）' },
  { date: '2038-03-09', expectedKin: 119, expectedWavespell: '黄太阳', description: '2038年（基准+10年）' }
];

let allPassed = true;

for (const testCase of testCases) {
  const kinData = calculateKin(new Date(testCase.date));

  const kinMatch = kinData.kin === testCase.expectedKin;
  const wavespellMatch = kinData.wavespellName === testCase.expectedWavespell;

  console.log(`${testCase.description}`);
  console.log(`  日期: ${testCase.date}`);
  console.log(`  Kin: ${kinData.kin} ${kinMatch ? '✓' : '✗ (期望: ' + testCase.expectedKin + ')'}`);
  console.log(`  波符: ${kinData.wavespellName} ${wavespellMatch ? '✓' : '✗ (期望: ' + testCase.expectedWavespell + ')'}`);
  console.log(`  波符序号: ${kinData.wavespell}`);
  console.log('');

  if (!kinMatch || !wavespellMatch) {
    allPassed = false;
  }
}

if (allPassed) {
  console.log('✅ 所有波符测试通过！');
} else {
  console.log('❌ 部分测试失败，需要进一步调整算法');
}
