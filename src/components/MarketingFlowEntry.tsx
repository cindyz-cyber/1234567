import { Navigate, useLocation } from 'react-router-dom';
import NamingRitual from './NamingRitual';
import { flowPath, useFlowMode } from '../hooks/useFlowMode';
import { useUrlMode } from '../context/urlModeContext';
import { isMeditationModeFromSearch } from '../utils/urlModeBootstrap';

/**
 * 默认：起名引导页。
 * `?mode=meditation`：跳过起名，直接进入 Golden Transition（冥想版入口）。
 * 同时使用 window 与 React Router 的 search，避免线上单源不同步。
 */
export default function MarketingFlowEntry() {
  const location = useLocation();
  const { flowBase } = useFlowMode();
  const { modeFromWindow, searchFromWindow } = useUrlMode();

  const rrMode = new URLSearchParams(location.search).get('mode');
  const liveWinMode =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('mode')
      : null;

  /** 原生 window 优先（第一道门岗），再合并 Router / Context */
  const isMeditation =
    isMeditationModeFromSearch() ||
    modeFromWindow === 'meditation' ||
    rrMode === 'meditation' ||
    liveWinMode === 'meditation';

  if (isMeditation) {
    const search =
      (typeof window !== 'undefined' && window.location.search) ||
      searchFromWindow ||
      location.search ||
      '?mode=meditation';
    return <Navigate to={`${flowPath(flowBase, '/transition')}${search}`} replace />;
  }

  return <NamingRitual />;
}
