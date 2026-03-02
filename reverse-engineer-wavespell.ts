// 反向工程：从已知的Kin和波符推导规律

const SEALS = [
  '红龙', '白风', '蓝夜', '黄种子', '红蛇',
  '白世界桥', '蓝手', '黄星星', '红月', '白狗',
  '蓝猴', '黄人', '红天行者', '白巫师', '蓝鹰',
  '黄战士', '红地球', '白镜', '蓝风暴', '黄太阳'
];

const knownData = [
  { kin: 59, wavespell: '白风' },   // 白风 = 索引1
  { kin: 69, wavespell: '蓝鹰' },   // 蓝鹰 = 索引14
  { kin: 99, wavespell: '蓝手' },   // 蓝手 = 索引6
  { kin: 109, wavespell: '黄太阳' }, // 黄太阳 = 索引19
  { kin: 119, wavespell: '黄太阳' }  // 黄太阳 = 索引19
];

console.log('=== 反向工程波符规律 ===\n');

for (const data of knownData) {
  const wavespellIndex = Math.floor((data.kin - 1) / 13); // 波符序号（0-based）
  const wavespellStartKin = wavespellIndex * 13 + 1;      // 波符起始Kin
  const sealIndex = SEALS.indexOf(data.wavespell);        // 图腾索引（0-based）

  console.log(`Kin ${data.kin} → 波符"${data.wavespell}"`);
  console.log(`  波符序号: ${wavespellIndex} (第${wavespellIndex + 1}波符)`);
  console.log(`  起始Kin: ${wavespellStartKin}`);
  console.log(`  图腾索引: ${sealIndex}`);

  // 尝试找到规律
  const pattern1 = (wavespellStartKin - 1) % 20; // 起始Kin对应的图腾索引
  const pattern2 = wavespellIndex % 20;           // 波符序号对应的图腾索引
  const pattern3 = (wavespellStartKin + sealIndex - 1) % 20; // 可能的偏移

  console.log(`  规律测试:`);
  console.log(`    起始Kin图腾索引: ${pattern1} (${SEALS[pattern1]})`);
  console.log(`    波符序号循环: ${pattern2} (${SEALS[pattern2]})`);
  console.log(`    是否匹配: ${pattern1 === sealIndex ? '方法1✓' : pattern2 === sealIndex ? '方法2✓' : '✗'}`);

  // 检查起始Kin
  const startKinSeal = ((wavespellStartKin - 1) % 20);
  console.log(`  起始Kin ${wavespellStartKin}的图腾: ${SEALS[startKinSeal]}`);
  console.log('');
}

// 波符序号和图腾的映射关系
console.log('\n=== 推导波符映射表 ===\n');
console.log('波符序号 → 期望图腾 → 起始Kin → 起始Kin图腾\n');

for (const data of knownData) {
  const wavespellIndex = Math.floor((data.kin - 1) / 13);
  const wavespellStartKin = wavespellIndex * 13 + 1;
  const startKinSealIndex = ((wavespellStartKin - 1) % 20);

  console.log(`波符${wavespellIndex + 1} (Kin ${wavespellStartKin}-${wavespellStartKin + 12})`);
  console.log(`  起始Kin图腾: ${SEALS[startKinSealIndex]}`);
  console.log(`  实际波符图腾: ${data.wavespell}`);
  console.log('');
}
