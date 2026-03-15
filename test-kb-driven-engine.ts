/**
 * 测试知识库驱动引擎
 * 验证三层填充逻辑和 Kin 66 自我纠错
 */

import 'dotenv/config';
import { generateKnowledgeBaseDrivenReport, validateKin66Report } from './src/utils/knowledgeBaseDrivenReportEngine';

async function testKin66() {
  console.log('\n========================================');
  console.log('测试 Kin 66 - 白世界桥（跨越者模式）');
  console.log('========================================\n');

  try {
    const report = await generateKnowledgeBaseDrivenReport(66);

    console.log('✅ 报告生成成功\n');

    console.log('【第一层：画像头部】');
    console.log(`模式: ${report.profile.mode}`);
    console.log(`视角: ${report.profile.perspective}`);
    console.log(`本质: ${report.profile.essence}\n`);

    console.log('【第二层：能量中心】');
    report.energyCenters.forEach(center => {
      console.log(`${center.name}: ${center.score}%`);
      console.log(`  描述: ${center.description}`);
      console.log(`  推理: ${center.reasoning}\n`);
    });

    console.log('【第三层：波符底色】');
    console.log(`波符: ${report.wavespellName}`);
    console.log(`生命底色: ${report.wavespellInfluence}\n`);

    console.log('【自我纠错断言】');
    await validateKin66Report(report);
    console.log('✅ Kin 66 验证通过\n');

    // 检查禁止词
    const allText = JSON.stringify(report);
    if (allText.includes('恒星') || allText.includes('照亮')) {
      console.error('❌ 错误：检测到禁止词"恒星"或"照亮"');
    } else {
      console.log('✅ 禁止词检查通过：无"恒星"或"照亮"');
    }

    if (allText.includes('跨越者模式')) {
      console.log('✅ 运作模式正确：跨越者模式');
    } else {
      console.error('❌ 错误：未找到"跨越者模式"');
    }

    if (allText.includes('断舍离')) {
      console.log('✅ 关键词正确：断舍离');
    } else {
      console.error('❌ 错误：未找到"断舍离"');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

async function testKin222() {
  console.log('\n========================================');
  console.log('测试 Kin 222 - 白风波符验证');
  console.log('========================================\n');

  try {
    const report = await generateKnowledgeBaseDrivenReport(222);

    console.log('✅ 报告生成成功\n');
    console.log(`Kin: ${report.kin}`);
    console.log(`图腾: ${report.totemName}`);
    console.log(`调性: ${report.toneName}`);
    console.log(`波符: ${report.wavespellName}`);
    console.log(`生命底色: ${report.wavespellInfluence}`);

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

async function testKin243() {
  console.log('\n========================================');
  console.log('测试 Kin 243 - 蓝鹰波符验证');
  console.log('========================================\n');

  try {
    const report = await generateKnowledgeBaseDrivenReport(243);

    console.log('✅ 报告生成成功\n');
    console.log(`Kin: ${report.kin}`);
    console.log(`图腾: ${report.totemName}`);
    console.log(`调性: ${report.toneName}`);
    console.log(`波符: ${report.wavespellName}`);
    console.log(`生命底色: ${report.wavespellInfluence}`);

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行所有测试
async function runAllTests() {
  await testKin66();
  await testKin222();
  await testKin243();
}

runAllTests();
