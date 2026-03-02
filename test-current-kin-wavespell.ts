import { calculateKin } from './src/utils/mayaCalendar';

console.log('=== 当前算法测试（保持Kin算法不变）===\n');

// 使用您提供的已验证的测试用例
const verifiedCases = [
  { date: '1963-09-30', expectedKin: 180, description: '历史追溯用例' },
  { date: '1983-09-30', expectedKin: 200, description: '基准点' },
  { date: '1994-07-16', expectedKin: 239, description: '验证用例' },
  { date: '2000-11-03', expectedKin: 199, description: '闰年边界' },
  { date: '2023-02-10', expectedKin: 8, description: '未来推演' }
];

console.log('【已验证的Kin计算】\n');

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

// 显示前几个波符的映射关系
for (let i = 0; i < 20; i++) {
  const startKin = i * 13 + 1;
  const endKin = startKin + 12;
  const wavespellSeal = (i % 20) + 1;
  const wavespellName = SEALS[wavespellSeal - 1];

  console.log(`波符${i + 1}: Kin ${startKin}-${endKin} → ${wavespellName}`);
}
