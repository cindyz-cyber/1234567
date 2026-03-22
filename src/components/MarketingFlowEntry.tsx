import { Navigate, useLocation } from 'react-router-dom';
import NamingRitual from './NamingRitual';
import { flowPath, useFlowMode } from '../hooks/useFlowMode';

/**
 * 默认：起名引导页。
 * `?mode=meditation`：跳过起名，直接进入 Golden Transition（冥想版入口）。
 */
export default function MarketingFlowEntry() {
  const location = useLocation();
  const { flowBase } = useFlowMode();
  const params = new URLSearchParams(location.search);
  const isMeditation = params.get('mode') === 'meditation';

  if (isMeditation) {
    const search = location.search || '?mode=meditation';
    return <Navigate to={`${flowPath(flowBase, '/transition')}${search}`} replace />;
  }

  return <NamingRitual />;
}
