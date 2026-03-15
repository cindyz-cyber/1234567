import { supabase } from '../lib/supabase';

interface PageContent {
  [key: string]: string;
}

interface ContentCache {
  [sceneToken: string]: {
    [pageName: string]: PageContent;
    _timestamp: number;
  };
}

// 缓存时间：5分钟
const CACHE_DURATION = 5 * 60 * 1000;

// 内存缓存
const contentCache: ContentCache = {};

/**
 * 从数据库获取页面文案内容
 * @param sceneToken 场景标识
 * @param pageName 页面名称 (home, naming, emotion, journal, answer, card)
 * @returns 文案内容对象 { welcome_text: '欢迎', subtitle: '副标题' }
 */
export async function getPageContent(
  sceneToken: string,
  pageName: string
): Promise<PageContent> {
  // 检查缓存
  const cached = contentCache[sceneToken];
  if (cached && cached[pageName] && (Date.now() - cached._timestamp) < CACHE_DURATION) {
    console.log(`✅ [PageContent] 使用缓存: ${sceneToken}/${pageName}`);
    return cached[pageName];
  }

  console.log(`📡 [PageContent] 从数据库加载: ${sceneToken}/${pageName}`);

  try {
    const { data, error } = await supabase
      .from('page_content_config')
      .select('content_key, content_value')
      .eq('scene_token', sceneToken)
      .eq('page_name', pageName);

    if (error) {
      console.error('❌ [PageContent] 加载失败:', error);
      return getDefaultContent(pageName);
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ [PageContent] 未找到配置: ${sceneToken}/${pageName}，使用默认值`);
      return getDefaultContent(pageName);
    }

    // 转换为键值对对象
    const content: PageContent = {};
    data.forEach(item => {
      content[item.content_key] = item.content_value;
    });

    // 更新缓存
    if (!contentCache[sceneToken]) {
      contentCache[sceneToken] = { _timestamp: Date.now() } as any;
    }
    contentCache[sceneToken][pageName] = content;
    contentCache[sceneToken]._timestamp = Date.now();

    console.log(`✅ [PageContent] 加载成功: ${Object.keys(content).length} 个配置项`);
    return content;
  } catch (err) {
    console.error('❌ [PageContent] 加载异常:', err);
    return getDefaultContent(pageName);
  }
}

/**
 * 清除缓存
 * @param sceneToken 可选，指定场景。不传则清除所有缓存
 */
export function clearContentCache(sceneToken?: string) {
  if (sceneToken) {
    delete contentCache[sceneToken];
    console.log(`🧹 [PageContent] 清除缓存: ${sceneToken}`);
  } else {
    Object.keys(contentCache).forEach(key => delete contentCache[key]);
    console.log('🧹 [PageContent] 清除所有缓存');
  }
}

/**
 * 获取默认文案（降级方案）
 */
function getDefaultContent(pageName: string): PageContent {
  const defaults: { [key: string]: PageContent } = {
    home: {
      welcome_text: '亲爱的师兄们，大家好',
      subtitle: '欢迎来到觉察之旅',
      start_button: '开始今日觉察之旅'
    },
    naming: {
      title: '起名仪式',
      name_label: '请输入您的姓名',
      birthdate_label: '请选择您的生日',
      next_button: '下一步'
    },
    emotion: {
      title: '觉察此刻的情绪',
      subtitle: '选择你现在的感受',
      next_button: '继续'
    },
    journal: {
      title: '内在的低语',
      placeholder: '在此记录你内心深处的声音...',
      voice_hint: '点击喇叭开始语音输入',
      voice_listening: '🎤 正在聆听...',
      submit_button: '完成书写'
    },
    answer: {
      title: '答案之书',
      subtitle: '你的高我为你准备了指引',
      generate_button: '生成专属能量卡'
    },
    card: {
      title: '觉察时刻',
      journal_section_title: '我的觉察',
      advice_section_title: '高我的指引',
      footer_brand: '植本逻辑',
      footer_tagline: '觉察 · 疗愈 · 成长',
      share_hint: '✨ 你的专属能量卡已生成，请长按发送给微信好友',
      close_button: '关闭',
      restart_button: '开启新的觉察之旅'
    }
  };

  return defaults[pageName] || {};
}
