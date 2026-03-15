import { supabase } from '../lib/supabase';

export type PageName = 'naming' | 'home' | 'emotion' | 'journal' | 'dialogue' | 'transition' | 'answer' | 'card';

interface PageVisibilityConfig {
  [pageName: string]: boolean;
}

/**
 * 加载指定场景的所有页面可见性配置
 */
export async function loadPageVisibility(sceneToken: string): Promise<PageVisibilityConfig> {
  try {
    const { data, error } = await supabase
      .from('page_visibility_config')
      .select('page_name, is_visible')
      .eq('scene_token', sceneToken);

    if (error) {
      console.error('❌ 加载页面可见性配置失败:', error);
      return {};
    }

    const config: PageVisibilityConfig = {};
    data?.forEach(item => {
      config[item.page_name] = item.is_visible;
    });

    console.log('✅ 页面可见性配置已加载:', config);
    return config;
  } catch (error) {
    console.error('❌ 加载页面可见性配置异常:', error);
    return {};
  }
}

/**
 * 检查指定页面是否可见
 */
export function isPageVisible(pageName: PageName, visibilityConfig: PageVisibilityConfig): boolean {
  // 默认所有页面都可见
  return visibilityConfig[pageName] ?? true;
}

/**
 * 获取下一个可见的页面
 */
export function getNextVisiblePage(
  currentPage: PageName,
  visibilityConfig: PageVisibilityConfig
): PageName | null {
  const pageFlow: PageName[] = ['naming', 'home', 'emotion', 'journal', 'transition', 'dialogue', 'answer', 'card'];

  const currentIndex = pageFlow.indexOf(currentPage);
  if (currentIndex === -1) return null;

  // 从当前页面的下一个页面开始查找
  for (let i = currentIndex + 1; i < pageFlow.length; i++) {
    const nextPage = pageFlow[i];
    if (isPageVisible(nextPage, visibilityConfig)) {
      return nextPage;
    }
  }

  return null;
}

/**
 * 获取流程中的第一个可见页面
 */
export function getFirstVisiblePage(visibilityConfig: PageVisibilityConfig): PageName {
  const pageFlow: PageName[] = ['naming', 'home', 'emotion', 'journal', 'transition', 'dialogue', 'answer', 'card'];

  for (const page of pageFlow) {
    if (isPageVisible(page, visibilityConfig)) {
      return page;
    }
  }

  // 默认返回 naming
  return 'naming';
}
