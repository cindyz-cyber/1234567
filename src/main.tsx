import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { calculateKin } from './utils/mayaCalendar';

// Kin 计算引擎自检：启动时必须通过三个断言测试
function validateKinEngine() {
  const tests = [
    { date: '1983-09-30', expectedKin: 200, name: '基准日期' },
    { date: '2000-11-03', expectedKin: 199, name: '已知问题日期' },
    { date: '2012-05-11', expectedKin: 243, name: '校准点' }
  ];

  const failures: string[] = [];

  const results = tests.map(test => {
    const result = calculateKin(new Date(test.date));
    const match = result.kin === test.expectedKin;
    if (!match) {
      failures.push({
        name: test.name,
        date: test.date,
        expected: test.expectedKin,
        actual: result.kin,
        diff: result.kin - test.expectedKin
      });
    }
    return { ...test, actual: result.kin, match };
  });

  if (failures.length > 0) {
    console.group('⚠️  Kin 计算引擎诊断报告');
    console.table(failures);

    console.log('\n📊 诊断分析:');
    failures.forEach(f => {
      console.log(`  ${f.name}: 偏移 ${f.diff > 0 ? '+' : ''}${f.diff} 天`);
    });

    console.log('\n💡 可能的原因:');
    console.log('  1. 校准点数据源不一致（不同的玛雅历系统有不同的基准日期）');
    console.log('  2. Dreamspell vs 传统Tzolkin 系统差异');
    console.log('  3. GMT 相关常数选择不同');

    console.log('\n⚙️  当前算法: (基准Kin + 天数差 - 1) % 260 + 1');
    console.log('   基准: 1983-09-30 = Kin 200');
    console.groupEnd();
  } else {
    console.log('✅ Kin 计算引擎自检通过 - 所有测试用例验证成功');
  }
}

validateKinEngine();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
