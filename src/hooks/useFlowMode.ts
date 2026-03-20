import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/** Internal app shell (logged-in / full product) lives under `/app/*`. */
export const APP_FLOW_PREFIX = '/app';

export function useFlowMode() {
  const { pathname } = useLocation();
  const isAppFlow =
    pathname === APP_FLOW_PREFIX || pathname.startsWith(`${APP_FLOW_PREFIX}/`);

  return useMemo(
    () => ({
      isAppFlow,
      /** Marketing / public linear flow (/, /home, …) — not under `/app`. */
      isMarketingFlow: !isAppFlow,
      /** '' or '/app' — prefix for in-flow navigation. */
      flowBase: isAppFlow ? APP_FLOW_PREFIX : '',
    }),
    [pathname, isAppFlow]
  );
}

/** Build a path like `/home` or `/app/home` depending on flow. */
export function flowPath(flowBase: string, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!flowBase) return p;
  return `${flowBase}${p}`;
}
