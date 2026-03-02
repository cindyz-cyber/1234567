/**
 * 测试知识库驱动的量子共振引擎
 * 验证是否从数据库正确读取 oracle 关系而非使用硬编码公式
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Node.js 环境下创建 Supabase 客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 简化版知识库（直接使用 supabase 客户端）
async function getKinDefinition(kinNumber: number) {
  const { data, error } = await supabase
    .from('kin_definitions')
    .select('*')
    .eq('kin_number', kinNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching kin definition:', error);
    return null;
  }

  return data;
}

// 简化版量子共振分析
async function analyzeQuantumResonance(userKin: number, relativeKin: number) {
  const kinSum = userKin + relativeKin;

  // 1. 母体灌溉型（推动位）
  if (kinSum % 260 === 1 || kinSum === 261) {
    return {
      type: 'push',
      label: '母体灌溉型（推动位）',
      description: '你们是"灵魂充电桩"',
      energyBoost: { heart: 15, pineal: 8 }
    };
  }

  // 从知识库获取用户 Kin 的定义
  const kinDef = await getKinDefinition(userKin);

  if (kinDef) {
    // 2. Challenge（对冲位）
    if (kinDef.oracle_challenge === relativeKin) {
      return {
        type: 'challenge',
        label: '生命磨刀石（对冲位）',
        description: 'Ta 是你生命中的"极性对冲镜"',
        energyBoost: { pineal: 10, throat: 5 }
      };
    }

    // 3. Guide（指引位）
    if (kinDef.oracle_guide === relativeKin) {
      return {
        type: 'guide',
        label: '指引导航位',
        description: 'Ta 是你的高维灯塔',
        energyBoost: { pineal: 12, heart: 5 }
      };
    }

    // 4. Hidden（隐藏位）
    if (kinDef.oracle_hidden === relativeKin) {
      return {
        type: 'hidden',
        label: '隐藏力量位',
        description: 'Ta 是你的隐藏推动力',
        energyBoost: { heart: 8, throat: 8 }
      };
    }

    // 5. Support（支持位）
    if (kinDef.oracle_support === relativeKin) {
      return {
        type: 'support',
        label: '支持共振位',
        description: 'Ta 与你同频共振',
        energyBoost: { throat: 10, heart: 5 }
      };
    }
  }

  return {
    type: null,
    label: '普通关系',
    description: 'Ta 与你之间存在自然的能量互动',
    energyBoost: {}
  };
}

interface TestCase {
  userKin: number;
  relativeKin: number;
  expectedType: string;
  description: string;
}

const testCases: TestCase[] = [
  {
    userKin: 239,
    relativeKin: 110,
    expectedType: 'challenge',
    description: 'Kin 239 的挑战位应该从数据库读取（oracle_challenge）'
  },
  {
    userKin: 22,
    relativeKin: 239,
    expectedType: 'push',
    description: 'Kin 22 + Kin 239 = 261，母体灌溉型'
  },
  {
    userKin: 200,
    relativeKin: 70,
    expectedType: 'challenge',
    description: 'Kin 200 - Kin 70 = 130，对冲位'
  }
];

async function testQuantumResonanceEngine() {
  console.log('🧪 测试知识库驱动的量子共振引擎\n');
  console.log('=' .repeat(80));

  for (const testCase of testCases) {
    console.log(`\n📊 测试案例: ${testCase.description}`);
    console.log(`用户 Kin: ${testCase.userKin}`);
    console.log(`关系人 Kin: ${testCase.relativeKin}`);

    // 先从知识库读取定义，看看数据库中存储的 oracle 关系
    const kinDef = await getKinDefinition(testCase.userKin);
    if (kinDef) {
      console.log('\n📚 知识库中的 Oracle 关系:');
      console.log(`  - Guide: ${kinDef.oracle_guide}`);
      console.log(`  - Challenge: ${kinDef.oracle_challenge}`);
      console.log(`  - Support: ${kinDef.oracle_support}`);
      console.log(`  - Hidden: ${kinDef.oracle_hidden}`);
    }

    // 执行量子共振分析
    const result = await analyzeQuantumResonance(testCase.userKin, testCase.relativeKin);

    console.log('\n🔮 量子共振分析结果:');
    console.log(`  类型: ${result.type}`);
    console.log(`  标签: ${result.label}`);
    console.log(`  描述: ${result.description}`);
    console.log(`  能量加成:`, result.energyBoost);

    // 验证结果
    const isCorrect = result.type === testCase.expectedType;
    console.log(`\n${isCorrect ? '✅' : '❌'} 预期类型: ${testCase.expectedType}, 实际类型: ${result.type}`);

    console.log('\n' + '-'.repeat(80));
  }

  console.log('\n\n🎯 特殊测试: Kin 200 的完整 Oracle 关系');
  console.log('=' .repeat(80));

  const kin200 = await getKinDefinition(200);
  if (kin200) {
    console.log('\n📚 Kin 200 的 Oracle 关系（从知识库）:');
    console.log(`  - Guide (指引位): Kin ${kin200.oracle_guide}`);
    console.log(`  - Challenge (挑战位): Kin ${kin200.oracle_challenge}`);
    console.log(`  - Support (支持位): Kin ${kin200.oracle_support}`);
    console.log(`  - Hidden (隐藏位): Kin ${kin200.oracle_hidden}`);

    // 测试每个关系
    if (kin200.oracle_guide) {
      const guideResult = await analyzeQuantumResonance(200, kin200.oracle_guide);
      console.log(`\n🔮 Guide 关系测试: ${guideResult.type === 'guide' ? '✅' : '❌'} ${guideResult.label}`);
    }

    if (kin200.oracle_challenge) {
      const challengeResult = await analyzeQuantumResonance(200, kin200.oracle_challenge);
      console.log(`🔮 Challenge 关系测试: ${challengeResult.type === 'challenge' ? '✅' : '❌'} ${challengeResult.label}`);
    }

    if (kin200.oracle_support) {
      const supportResult = await analyzeQuantumResonance(200, kin200.oracle_support);
      console.log(`🔮 Support 关系测试: ${supportResult.type === 'support' ? '✅' : '❌'} ${supportResult.label}`);
    }

    if (kin200.oracle_hidden) {
      const hiddenResult = await analyzeQuantumResonance(200, kin200.oracle_hidden);
      console.log(`🔮 Hidden 关系测试: ${hiddenResult.type === 'hidden' ? '✅' : '❌'} ${hiddenResult.label}`);
    }
  }

  console.log('\n\n✨ 测试完成！');
  process.exit(0);
}

testQuantumResonanceEngine().catch(console.error);
