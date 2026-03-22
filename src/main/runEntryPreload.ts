/**
 * 仅用于默认营销漏斗：在 DefaultView 挂载后调用。
 * 若 URL 为冥想模式，严禁启动 GlobalBackgroundPreloader / videoPreloader（含 zen_vortex）。
 */
export async function runEntryPreload(): Promise<void> {
  if (typeof window === 'undefined') return;

  if (window.location.search.includes('mode=meditation')) {
    console.log(
      '[Preload] 跳过 GlobalBackgroundPreloader / videoPreloader（冥想模式，禁用 zen_vortex 等默认视频）'
    );
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
