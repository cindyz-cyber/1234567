import { Navigate } from 'react-router-dom';
import NamingRitual from './NamingRitual';
import { flowPath, useFlowMode } from '../hooks/useFlowMode';

/**
 * 默认：起名引导页。
 * 冥想：仅用原生 `window.location.search.includes('meditation')` 作为第一道门岗，不经由复杂 State。
 */
export default function MarketingFlowEntry() {
  const { flowBase } = useFlowMode();

  if (typeof window !== 'undefined' && window.location.search.includes('mode=meditation')) {
    const search = window.location.search || '?mode=meditation';
    return (
      <Navigate to={`${flowPath(flowBase, '/transition')}${search}`} replace />
    );
  }

  return <NamingRitual />;
}
