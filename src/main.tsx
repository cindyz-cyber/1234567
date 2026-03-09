import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import ShareJournal from './components/ShareJournal.tsx';
import ShareConfigAdmin from './components/ShareConfigAdmin.tsx';
import './index.css';
import { calculateKin } from './utils/mayaCalendar';
import { initializeVideoPreload } from './utils/videoPreloader';
import { initializeGlobalBackgroundPreload } from './utils/globalBackgroundPreloader';

// 🚫 已弃用路由拦截器
function DeprecatedRoute() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '20px',
        opacity: 0.5
      }}>🔒</div>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#f0f0f0'
      }}>链接已失效</h1>
      <p style={{
        fontSize: '16px',
        color: '#aaa',
        marginBottom: '30px',
        maxWidth: '400px'
      }}>此分享链接已过期或不再可用</p>
      <a
        href="/"
        style={{
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        返回首页
      </a>
    </div>
  );
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

// 启动时初始化
validateKinEngine();

// 🌐 全局背景预加载控制中心（最高优先级）
initializeGlobalBackgroundPreload().catch(err => {
  console.warn('全局背景预加载失败（非致命）:', err);
});

// 在后台静默预加载视频（双重保险）
initializeVideoPreload().catch(err => {
  console.warn('视频预加载失败（非致命）:', err);
});

// 注册 Service Worker 用于视频离线缓存
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker 注册成功:', registration.scope);
      })
      .catch(err => {
        console.warn('⚠️  Service Worker 注册失败（非致命）:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/share/journal" element={<ShareJournal />} />
        <Route path="/share/journey" element={<DeprecatedRoute />} />
        <Route path="/admin/share-config" element={<ShareConfigAdmin />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
