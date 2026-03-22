import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import ShareJournal from './components/ShareJournal.tsx';
import ShareConfigAdmin from './components/ShareConfigAdmin.tsx';
import PageContentAdmin from './components/PageContentAdmin.tsx';
import './index.css';
import { calculateKin } from './utils/mayaCalendar';
import { purgeServiceWorkersForMeditationEntry } from './main/meditationSwPurge';

const isMeditation = window.location.search.includes('mode=meditation');

/** 非冥想模式：在 window load 后注册 `/sw.js` */
function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker 注册成功:', registration.scope);
      })
      .catch((err) => {
        console.warn('⚠️  Service Worker 注册失败（非致命）:', err);
      });
  });
}

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

async function bootstrap() {
  const willReload = await purgeServiceWorkersForMeditationEntry();
  if (willReload) return;

  if (isMeditation) {
    try {
      const { cancelAllBackgroundPreloads } = await import('./utils/globalBackgroundPreloader');
      cancelAllBackgroundPreloads();
    } catch (e) {
      console.warn('[Meditation] GlobalBackgroundPreloader 注销失败（非致命）:', e);
    }
    console.log('冥想模式启动：跳过 Service Worker 和全局预加载');
  } else {
    validateKinEngine();
    registerServiceWorker();
  }

  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/share/journal" element={<ShareJournal />} />
          <Route path="/share/:sceneId" element={<ShareJournal />} />
          <Route path="/admin/share-config" element={<ShareConfigAdmin />} />
          <Route path="/admin/page-content" element={<PageContentAdmin />} />
          <Route path="/*" element={<App isMeditation={isMeditation} />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

void bootstrap();
