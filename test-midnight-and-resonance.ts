/**
 * 完整功能验证测试
 * 1. 子时双Kin计算逻辑
 * 2. 量子共振关系算法
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ========================================
// 1. 子时双Kin计算测试
// ========================================

interface KinData {
  kin: number;
  seal: number;
  tone: number;
  sealName: string;
  toneName: string;
}

const SEALS = [
  '红龙', '白风', '蓝夜', '黄种子', '红蛇',
  '白世界桥', '蓝手', '黄星星', '红月', '白狗',
  '蓝猴', '黄人', '红天行者', '白巫师', '蓝鹰',
  '黄战士', '红地球', '白镜', '蓝风暴', '黄太阳'
];

const TONES = [
  '磁性', '月亮', '电力', '自我存在', '超频',
  '韵律', '共振', '银河', '太阳', '行星',
  '光谱', '水晶', '宇宙'
];

function calculateKinNumber(birthDate: Date): number {
  const MAYA_EPOCH = new Date('1997-07-26');
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const normalizeDate = (d: Date): Date => {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  };

  let startDate = normalizeDate(MAYA_EPOCH);
  let endDate = normalizeDate(birthDate);
  let isNegative = false;

  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
    isNegative = true;
  }

  let days = 0;
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth();
    const day = currentDate.getUTCDate();

    if (!(month === 1 && day === 29 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)))) {
      days++;
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  const effectiveDays = isNegative ? -days : days;
  const anchorKin = 200;
  let kin = ((anchorKin + effectiveDays - 1) % 260 + 260) % 260 + 1;

  return kin;
}

function getKinData(kin: number): KinData {
  const seal = ((kin - 1) % 20) + 1;
  const tone = ((kin - 1) % 13) + 1;

  return {
    kin,
    seal,
    tone,
    sealName: SEALS[seal - 1],
    toneName: TONES[tone - 1]
  };
}

async function getKinEnergyFromDB(kinNumber: number) {
  const { data, error } = await supabase
    .from('kin_definitions')
    .select(`
      *,
      totem:totems(pineal_gland, throat_chakra, heart_chakra)
    `)
    .eq('kin_number', kinNumber)
    .maybeSingle();

  if (error || !data || !data.totem) {
    console.error('Failed to fetch kin energy:', error);
    return null;
  }

  return {
    pineal: data.totem.pineal_gland,
    throat: data.totem.throat_chakra,
    heart: data.totem.heart_chakra
  };
}

async function testMidnightKin() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('【测试1】子时双Kin计算逻辑');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 测试用例：1994年7月16日后子时（00:30）
  const testDate = new Date('1994-07-16T00:30:00+08:00');
  const hour = 0;
  const minute = 30;

  console.log(`📅 测试时间: 1994-07-16 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);

  // 判断子时类型
  let midnightType: 'early' | 'late' | null = null;
  if (hour === 23) midnightType = 'early';
  if (hour === 0) midnightType = 'late';

  console.log(`⏰ 子时类型: ${midnightType === 'late' ? '后子时' : midnightType === 'early' ? '前子时' : '非子时'}\n`);

  if (!midnightType) {
    console.log('✅ 非子时，使用单Kin计算');
    return;
  }

  // 计算主Kin和副Kin
  const primaryDate = new Date(testDate);
  const secondaryDate = new Date(testDate);

  let primaryWeight = 0.6;
  let secondaryWeight = 0.4;

  if (midnightType === 'early') {
    primaryWeight = 0.4;
    secondaryWeight = 0.6;
    secondaryDate.setDate(secondaryDate.getDate() + 1);
  } else {
    primaryWeight = 0.6;
    secondaryWeight = 0.4;
    secondaryDate.setDate(secondaryDate.getDate() - 1);
  }

  const primaryKinNum = calculateKinNumber(primaryDate);
  const secondaryKinNum = calculateKinNumber(secondaryDate);

  const primaryKin = getKinData(primaryKinNum);
  const secondaryKin = getKinData(secondaryKinNum);

  console.log(`🔸 主Kin: Kin ${primaryKin.kin} - ${primaryKin.toneName}的${primaryKin.sealName} (权重: ${Math.round(primaryWeight * 100)}%)`);
  console.log(`🔹 副Kin: Kin ${secondaryKin.kin} - ${secondaryKin.toneName}的${secondaryKin.sealName} (权重: ${Math.round(secondaryWeight * 100)}%)\n`);

  // 从数据库获取能量数据
  console.log('📡 从数据库获取脉轮数值...\n');

  const primaryEnergy = await getKinEnergyFromDB(primaryKin.kin);
  const secondaryEnergy = await getKinEnergyFromDB(secondaryKin.kin);

  if (!primaryEnergy || !secondaryEnergy) {
    console.error('❌ 数据库获取失败');
    return;
  }

  console.log(`主Kin能量: 心轮 ${primaryEnergy.heart}%, 喉轮 ${primaryEnergy.throat}%, 松果体 ${primaryEnergy.pineal}%`);
  console.log(`副Kin能量: 心轮 ${secondaryEnergy.heart}%, 喉轮 ${secondaryEnergy.throat}%, 松果体 ${secondaryEnergy.pineal}%\n`);

  // 合成能量
  const synthesizedHeart = Math.round(primaryEnergy.heart * primaryWeight + secondaryEnergy.heart * secondaryWeight);
  const synthesizedThroat = Math.round(primaryEnergy.throat * primaryWeight + secondaryEnergy.throat * secondaryWeight);
  const synthesizedPineal = Math.round(primaryEnergy.pineal * primaryWeight + secondaryEnergy.pineal * secondaryWeight);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【合成结果】');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`💖 合成心轮: ${synthesizedHeart}%`);
  console.log(`   计算公式: ${primaryEnergy.heart} × ${primaryWeight} + ${secondaryEnergy.heart} × ${secondaryWeight} = ${synthesizedHeart}`);
  console.log(`\n💬 合成喉轮: ${synthesizedThroat}%`);
  console.log(`   计算公式: ${primaryEnergy.throat} × ${primaryWeight} + ${secondaryEnergy.throat} × ${secondaryWeight} = ${synthesizedThroat}`);
  console.log(`\n🔮 合成松果体: ${synthesizedPineal}%`);
  console.log(`   计算公式: ${primaryEnergy.pineal} × ${primaryWeight} + ${secondaryEnergy.pineal} × ${secondaryWeight} = ${synthesizedPineal}`);

  console.log('\n✅ 子时双Kin计算完成！');
  console.log(`📋 显示标签: "${primaryKin.toneName}的${primaryKin.sealName} (${Math.round(primaryWeight * 100)}%) + ${secondaryKin.toneName}的${secondaryKin.sealName} (${Math.round(secondaryWeight * 100)}%)"`);
}

// ========================================
// 2. 量子共振关系测试
// ========================================

function analyzeQuantumResonance(userKin: number, relativeKin: number): {
  type: string;
  label: string;
  description: string;
} {
  const kinSum = userKin + relativeKin;
  const kinDiff = Math.abs(userKin - relativeKin);

  // 1. 母体灌溉型（推动位）
  if (kinSum % 260 === 1 || kinSum === 261) {
    return {
      type: 'push',
      label: '母体灌溉型（推动位）',
      description: '你们是"灵魂充电桩"，Ta 能为你提供源源不断的母体养分，让你的心轮瞬间扩容。'
    };
  }

  // 2. 生命磨刀石（对冲位）
  if (kinDiff === 130) {
    return {
      type: 'challenge',
      label: '生命磨刀石（对冲位）',
      description: 'Ta 是你生命中的"极性对冲镜"。通过碰撞，Ta 让你看见自己未被开发的另一面。'
    };
  }

  // 3. 指引导航位
  const tone = ((userKin - 1) % 13) + 1;
  let guideKin = userKin + ((13 - tone) % 13) * 20;
  if (guideKin > 260) guideKin -= 260;

  if (relativeKin === guideKin) {
    return {
      type: 'guide',
      label: '指引导航位',
      description: 'Ta 是你的高维灯塔。在你的逻辑风暴中，Ta 是唯一能带你找到上帝视角的锚点。'
    };
  }

  return {
    type: 'normal',
    label: '普通关系',
    description: 'Ta 与你之间存在自然的能量互动。'
  };
}

async function testQuantumResonance() {
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('【测试2】量子共振关系算法');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const testCases = [
    { userKin: 200, relativeKin: 61, expectedType: 'push', name: '推动位测试' },
    { userKin: 100, relativeKin: 230, expectedType: 'challenge', name: '对冲位测试' },
    { userKin: 239, relativeKin: 194, expectedType: 'normal', name: '普通关系测试' }
  ];

  for (const testCase of testCases) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`【${testCase.name}】`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`用户Kin: ${testCase.userKin}`);
    console.log(`关系人Kin: ${testCase.relativeKin}`);
    console.log(`Kin和: ${testCase.userKin + testCase.relativeKin}`);
    console.log(`Kin差: ${Math.abs(testCase.userKin - testCase.relativeKin)}`);

    const result = analyzeQuantumResonance(testCase.userKin, testCase.relativeKin);

    console.log(`\n🔮 关系类型: ${result.label}`);
    console.log(`📝 描述: ${result.description}`);

    if (result.type === testCase.expectedType) {
      console.log(`✅ 测试通过 - 检测到正确的关系类型: ${result.type}`);
    } else {
      console.log(`❌ 测试失败 - 期望: ${testCase.expectedType}, 实际: ${result.type}`);
    }
    console.log();
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ 量子共振关系测试完成！');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// ========================================
// 主测试函数
// ========================================

async function runAllTests() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║          玛雅历系统 - 完整功能验证测试                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');

  await testMidnightKin();
  await testQuantumResonance();

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                    所有测试完成                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
}

runAllTests().catch(console.error);
