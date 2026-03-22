/**
 * 入口预加载：必须先读 window.location.search，再决定分支。
 * 冥想分支绝不静态/动态加载 videoPreloader（含 zen_vortex）或全局 BACKGROUND_ASSETS 注入链。
 */
export async function runEntryPreload(): Promise<void> {
  if (typeof window === 'undefined') return;

  const isMeditation = window.location.search.includes('meditation');

  if (isMeditation) {
    const { initializeMeditationAssetsPreload } = await import('../utils/meditationAssetsPreload');
    await initializeMeditationAssetsPreload();
    return;
  }

  const [{ initializeGlobalBackgroundPreload }, { initializeVideoPreload }] = await Promise.all([
    import('../utils/globalBackgroundPreloader'),
    import('../utils/videoPreloader'),
  ]);

  await Promise.all([
    initializeGlobalBackgroundPreload(),
    initializeVideoPreload(),
  ]);
}
