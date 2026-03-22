/**
 * 冥想版引流分支：通过 URL `?mode=meditation` 激活；路由间用 state.meditationMode 持久化（避免丢 query）。
 */
export function isMeditationModeFromSearch(search: string): boolean {
  if (!search) return false;
  return new URLSearchParams(search).get('mode') === 'meditation';
}

export function resolveMeditationActive(options: {
  search: string;
  /** 上一步 navigate 传入的标记 */
  stateMeditation?: boolean;
  /** ShareJournal 等父组件显式传入 */
  propMeditation?: boolean;
}): boolean {
  return (
    isMeditationModeFromSearch(options.search) ||
    options.stateMeditation === true ||
    options.propMeditation === true
  );
}
