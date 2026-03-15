// 分析波符规律

const testData = [
  { date: '1958-03-09', kin: 59 },
  { date: '1968-03-09', kin: 69 },
  { date: '2018-03-09', kin: 99 },
  { date: '2028-03-09', kin: 109 },
  { date: '2038-03-09', kin: 119 }
];

// 计算天数差异
console.log('=== 天数差异分析 ===\n');

for (let i = 1; i < testData.length; i++) {
  const prev = new Date(testData[i - 1].date);
  const curr = new Date(testData[i].date);
  const daysDiff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
  const kinDiff = testData[i].kin - testData[i - 1].kin;

  console.log(`${testData[i - 1].date} → ${testData[i].date}`);
  console.log(`  实际天数: ${daysDiff} 天`);
  console.log(`  Kin差值: ${kinDiff}`);
  console.log(`  天数 mod 260: ${daysDiff % 260}`);
  console.log('');
}

// 反推基准点
console.log('\n=== 反推基准点 ===\n');

const anchorDate = new Date('1983-09-30');
const anchorKin = 200;

for (const test of testData) {
  const testDate = new Date(test.date);
  const daysDiff = Math.floor((testDate.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24));
  const expectedKin = ((anchorKin + daysDiff - 1) % 260 + 260) % 260 + 1;

  console.log(`${test.date}`);
  console.log(`  距离1983-09-30: ${daysDiff} 天`);
  console.log(`  用现行算法计算: Kin ${expectedKin}`);
  console.log(`  截图显示: Kin ${test.kin}`);
  console.log(`  差异: ${test.kin - expectedKin}`);
  console.log('');
}

// 波符分析
console.log('\n=== 波符图腾分析 ===\n');

const SEALS = [
  '红龙', '白风', '蓝夜', '黄种子', '红蛇',
  '白世界桥', '蓝手', '黄星星', '红月', '白狗',
  '蓝猴', '黄人', '红天行者', '白巫师', '蓝鹰',
  '黄战士', '红地球', '白镜', '蓝风暴', '黄太阳'
];

// 测试每个Kin的波符
const kinWavespellTests = [
  { kin: 59, expectedWavespell: '白风' },
  { kin: 69, expectedWavespell: '蓝鹰' },
  { kin: 99, expectedWavespell: '蓝手' },
  { kin: 109, expectedWavespell: '黄太阳' },
  { kin: 119, expectedWavespell: '黄太阳' }
];

for (const test of kinWavespellTests) {
  const wavespellIndex = Math.floor((test.kin - 1) / 13);
  const wavespellStartKin = wavespellIndex * 13 + 1;

  // 方法1：基于起始Kin的图腾
  const method1SealIndex = ((wavespellStartKin - 1) % 20);
  const method1Seal = SEALS[method1SealIndex];

  // 方法2：基于波符序号循环
  const method2SealIndex = wavespellIndex % 20;
  const method2Seal = SEALS[method2SealIndex];

  console.log(`Kin ${test.kin} (波符${wavespellIndex + 1}，起始Kin ${wavespellStartKin})`);
  console.log(`  期望波符: ${test.expectedWavespell}`);
  console.log(`  方法1（起始Kin图腾）: ${method1Seal} ${method1Seal === test.expectedWavespell ? '✓' : '✗'}`);
  console.log(`  方法2（波符序号循环）: ${method2Seal} ${method2Seal === test.expectedWavespell ? '✓' : '✗'}`);
  console.log('');
}
