/**
 * 测试量子共振数据库驱动引擎
 * 验证是否消除了硬编码，正确接入数据库
 */

import { generateEnergyReport } from './src/utils/energyPortraitEngine';

async function testQuantumResonanceFix() {
  console.log('🧪 测试量子共振数据库驱动引擎\n');

  // 测试案例：Kin 239（用户）与 Kin 22（家人）
  const userKin = 239;
  const familyMembers = [
    {
      name: '核心',
      kin: 22,
      birthDate: new Date('1996-07-17'),
      hour: 0
    }
  ];

  const userBirthDate = new Date('1994-07-17');
  const userHour = 0;

  console.log(`📊 用户: Kin ${userKin}`);
  console.log(`📊 家人: ${familyMembers[0].name} (Kin ${familyMembers[0].kin})\n`);

  try {
    const report = await generateEnergyReport(
      userKin,
      familyMembers,
      userBirthDate,
      userHour
    );

    console.log('✅ 报告生成成功\n');

    if (report.quantumResonances.length === 0) {
      console.error('❌ 错误：没有生成量子共振数据');
      return;
    }

    const resonance = report.quantumResonances[0];

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('量子共振结果：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`家人名称: ${resonance.familyMember}`);
    console.log(`关系类型: ${resonance.typeLabel}`);
    console.log(`共振强度: ${Math.round(resonance.synergyStrength * 100)}%`);
    console.log(`描述: ${resonance.description}`);
    console.log(`协同描述: ${resonance.synergyDescription}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 验证是否消除了硬编码
    const hardcodedPhrases = [
      '普通共振',
      '协作共振',
      'Ta 与你之间存在自然的能量互动',
      '你们之间存在协作的能量场域'
    ];

    let foundHardcoded = false;
    for (const phrase of hardcodedPhrases) {
      if (resonance.description.includes(phrase) || resonance.typeLabel === phrase) {
        console.error(`❌ 发现硬编码文本: "${phrase}"`);
        foundHardcoded = true;
      }
    }

    if (!foundHardcoded) {
      console.log('✅ 已消除所有硬编码，使用数据库驱动的动态描述');
    }

    // 验证是否为母体灌溉或挑战关系
    const kinDelta = Math.abs(userKin - familyMembers[0].kin);
    console.log(`\nKin 差值: ${kinDelta}`);

    if (kinDelta === 1) {
      if (resonance.typeLabel.includes('母体灌溉') || resonance.typeLabel.includes('Matrix Irrigation')) {
        console.log('✅ 正确识别为母体灌溉关系');
      } else {
        console.error(`❌ Kin差值=1，应该是母体灌溉，但识别为: ${resonance.typeLabel}`);
      }
    }

    if (kinDelta === 130) {
      if (resonance.typeLabel.includes('生命磨刀石') || resonance.typeLabel.includes('挑战')) {
        console.log('✅ 正确识别为生命磨刀石关系');
      } else {
        console.error(`❌ Kin差值=130，应该是生命磨刀石，但识别为: ${resonance.typeLabel}`);
      }
    }

    console.log('\n🎯 测试完成');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testQuantumResonanceFix();
