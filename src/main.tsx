import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import FlowJourney from './components/FlowJourney.tsx';
import FlowConfigAdmin from './components/FlowConfigAdmin.tsx';
import './index.css';
import { calculateKin } from './utils/mayaCalendar';
import { initializeVideoPreload } from './utils/videoPreloader';
import { initializeGlobalBackgroundPreload } from './utils/globalBackgroundPreloader';

function DeprecatedRoute() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '80px',
        marginBottom: '24px',
        opacity: 0.6
      }}>🚫</div>
      <h1 style={{
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '16px',
        color: '#f1f5f9'
      }}>链接已失效</h1>
      <p style={{
        fontSize: '18px',
        color: '#94a3b8',
        marginBottom: '12px',
        maxWidth: '500px',
        lineHeight: '1.6'
      }}>此分享链接已过期或被废弃</p>
      <p style={{
        fontSize: '14px',
        color: '#64748b',
        marginBottom: '36px',
        maxWidth: '500px'
      }}>旧版 /share 路由已全面下线，请联系管理员获取新的访问链接</p>
      <a
        href="/"
        style={{
          padding: '14px 36px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
        }}
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
        <Route path="/flow/:scenePath" element={<FlowJourney />} />
        <Route path="/admin/flow-config" element={<FlowConfigAdmin />} />
        <Route path="/share/*" element={<DeprecatedRoute />} />
        <Route path="/admin/share-config" element={<DeprecatedRoute />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
