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

  tests.forEach(test => {
    const result = calculateKin(new Date(test.date));
    if (result.kin !== test.expectedKin) {
      failures.push(
        `${test.name} (${test.date}): 期望 Kin ${test.expectedKin}, 实际得到 Kin ${result.kin}`
      );
    }
  });

  if (failures.length > 0) {
    console.error('❌ Kin 计算引擎自检失败:');
    failures.forEach(msg => console.error(`  - ${msg}`));
    throw new Error('Kin 计算引擎校准失败，请检查 mayaCalendar.ts 中的 calculateKin 函数');
  }

  console.log('✅ Kin 计算引擎自检通过 - 所有测试用例验证成功');
}

validateKinEngine();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
