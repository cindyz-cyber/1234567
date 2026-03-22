/**
 * 启动与首屏渲染前的「第一道门岗」：只认原生 window.location，避免仅依赖会延迟触发的 effect。
 */
export function getModeFromWindowSearch(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('mode');
}

/**
 * 与产品约定一致：URL 中含 `meditation` 即视为冥想模式（含 `?mode=meditation`）。
 */
export function isMeditationUrlNativeIncludes(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('meditation');
}

export function isMeditationModeFromSearch(): boolean {
  return isMeditationUrlNativeIncludes();
}
