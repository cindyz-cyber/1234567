import MeditationView from './components/meditation/MeditationView';
import DefaultView from './components/meditation/DefaultView';

/**
 * 在所有 import 之后、组件函数之前判定模式（最高优先级），避免预加载器在分支确定前执行。
 */
const isMeditation =
  typeof window !== 'undefined' &&
  window.location.search.includes('mode=meditation');

let appModeLogged = false;

export default function App() {
  if (!appModeLogged) {
    appModeLogged = true;
    console.log(
      '🔥 最终确定的渲染模式:',
      isMeditation ? 'MEDITATION' : 'DEFAULT'
    );
  }

  if (isMeditation) {
    return <MeditationView />;
  }

  return <DefaultView />;
}
