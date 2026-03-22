import { lazy, Suspense } from 'react';
import MeditationPureView from './components/meditation/MeditationPureView';

/** 默认漏斗与 runEntryPreload 拆到独立 chunk，冥想 URL 绝不加载、不执行 GlobalBackgroundPreloader */
const DefaultView = lazy(() => import('./components/meditation/DefaultView'));

export default function App() {
  if (window.location.search.includes('mode=meditation')) {
    return <MeditationPureView />;
  }

  return (
    <Suspense fallback={null}>
      <DefaultView />
    </Suspense>
  );
}
