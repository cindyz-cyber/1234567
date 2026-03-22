/**
 * 启动与首屏渲染前的「第一道门岗」：只认原生 window.location，避免仅依赖会延迟触发的 effect。
 */
export function getModeFromWindowSearch(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('mode');
}

export function isMeditationModeFromSearch(): boolean {
  return getModeFromWindowSearch() === 'meditation';
}
