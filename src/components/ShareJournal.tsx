import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';
import NamingRitual from './NamingRitual';
import HomePage from './HomePage';
import DynamicStepBackground from './DynamicStepBackground';
import { playBackgroundMusicLoop, playShareBackgroundMusic, isVideoUrl } from '../utils/audioManager';
import { shareBackgroundPreloader } from '../utils/shareBackgroundPreloader';

// 🚀 代码分割：懒加载非首屏组件
const EmotionScan = lazy(() => import('./EmotionScan'));
const InnerWhisperJournal = lazy(() => import('./InnerWhisperJournal'));
const HigherSelfDialogue = lazy(() => import('./HigherSelfDialogue'));
const GoldenTransition = lazy(() => import('./GoldenTransition'));
const BookOfAnswers = lazy(() => import('./BookOfAnswers'));

type JournalStep = 'blocked' | 'naming' | 'home' | 'emotion' | 'journal' | 'dialogue' | 'transition' | 'answer' | 'card';

interface H5ShareConfig {
  is_active: boolean;
  daily_token: string;
  scene_token: string;
  scene_name: string;
  description: string;
  bg_video_url: string;
  bg_music_url: string;
  card_bg_image_url: string;
  bg_home_url: string;
  bg_naming_url: string;
  bg_emotion_url: string;
  bg_journal_url: string;
  bg_transition_url: string;
  bg_answer_book_url: string;
  card_inner_bg_url: string;
}

interface JournalState {
  userName: string;
  birthDate: Date | null;
  selectedEmotions: string[];
  journalContent: string;
  higherSelfMessage: string;
  higherSelfAdvice: string; // 🔥 真正的高我建议内容
  kinData: any;
}

// 🔥 前端硬开关（Emergency Kill-Switch）
// 当需要紧急关停时，将此值改为 true 即可实现全网瞬间失效
// 优先级：最高 - 无需数据库连接，前端部署包直接拦截所有用户
const IS_LINK_DEPRECATED = true;

export default function ShareJournal() {
  // 🚨 物理级拦截器 - URL 检测（最高优先级）
  // 任何包含旧 token 的 URL 直接拦截，零容忍
  const isBlockedUrl = window.location.href.includes('zen2026');

  const [currentStep, setCurrentStep] = useState<JournalStep>(isBlockedUrl ? 'blocked' : 'naming');
  const [config, setConfig] = useState<H5ShareConfig | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [state, setState] = useState<JournalState>({
    userName: '',
    birthDate: null,
    selectedEmotions: [],
    journalContent: '',
    higherSelfMessage: '',
    higherSelfAdvice: '',
    kinData: null
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [preloadedAudio, setPreloadedAudio] = useState<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 🔍 调试：监听 backgroundMusic 状态变化
  useEffect(() => {
    console.group('🔍 [ShareJournal] backgroundMusic 状态变化');
    console.log('🎵 backgroundMusic:', backgroundMusic ? '已设置' : 'null');
    if (backgroundMusic) {
      console.log('📊 音频源:', backgroundMusic.src);
      console.log('📊 播放状态:', backgroundMusic.paused ? '暂停' : '播放中');
      console.log('📊 当前时间:', backgroundMusic.currentTime);
      console.log('📊 音量:', backgroundMusic.volume);
    }
    console.groupEnd();
  }, [backgroundMusic]);

  // 🔍 调试：监听 preloadedAudio 状态变化
  useEffect(() => {
    console.group('🔍 [ShareJournal] preloadedAudio 状态变化');
    console.log('🎵 preloadedAudio:', preloadedAudio ? '已设置' : 'null');
    if (preloadedAudio) {
      console.log('📊 音频源:', preloadedAudio.src);
      console.log('📊 播放状态:', preloadedAudio.paused ? '暂停' : '播放中');
      console.log('📊 当前时间:', preloadedAudio.currentTime);
      console.log('📊 音量:', preloadedAudio.volume);
    }
    console.groupEnd();
  }, [preloadedAudio]);

  // 🔒 防护：拦截任何路由跳转尝试
  useEffect(() => {
    const preventNavigation = (e: BeforeUnloadEvent) => {
      if (currentStep === 'card' && generatedImage) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', preventNavigation);
    return () => window.removeEventListener('beforeunload', preventNavigation);
  }, [currentStep, generatedImage]);

  useEffect(() => {
    // 🚨 物理级拦截器 1: URL 检测（优先级 1）
    if (isBlockedUrl) {
      console.error('🚫 [URL BLOCKED] 检测到旧 token: zen2026，立即拦截');
      console.error('🛑 停止所有初始化，进入失效状态');
      setCurrentStep('blocked');
      setIsValidating(false);
      return;
    }

    // 🚨 物理级拦截器 2: 全局硬开关（优先级 2）
    if (IS_LINK_DEPRECATED) {
      console.error('🚫 [IS_LINK_DEPRECATED = true] 前端硬开关已激活，全网失效');
      console.error('💡 即使数据库连接正常，该部署包也会直接拦截所有用户');
      console.error('🛑 停止所有后续初始化（音频、视频预加载）');

      // 🛑 立即阻止所有媒体资源加载
      console.warn('🚨 中断所有预加载任务');

      // 清理可能已创建的音频实例
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.src = '';
        backgroundMusic.load();
      }
      if (preloadedAudio) {
        preloadedAudio.pause();
        preloadedAudio.src = '';
        preloadedAudio.load();
      }

      setCurrentStep('blocked');
      setIsValidating(false);
      return;
    }

    validateAccess();
  }, [isBlockedUrl]);

  // 🔥 监听 blocked 状态，自动清理所有音频资源
  useEffect(() => {
    if (currentStep === 'blocked') {
      console.group('🛑 [blocked] 进入失效状态，清理所有音频资源');

      if (backgroundMusic) {
        console.log('🧹 停止并清理 backgroundMusic');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic.volume = 0;
        console.log('✅ backgroundMusic 已静音并归零');
      }

      if (preloadedAudio) {
        console.log('🧹 停止并清理 preloadedAudio');
        preloadedAudio.pause();
        preloadedAudio.currentTime = 0;
        preloadedAudio.volume = 0;
        console.log('✅ preloadedAudio 已静音并归零');
      }

      console.log('✅ 所有音频资源已清理完毕');
      console.groupEnd();
    }
  }, [currentStep, backgroundMusic, preloadedAudio]);

  useEffect(() => {
    return () => {
      if (backgroundMusic) {
        console.log('🧹 [ShareJournal] 组件卸载，强制清理长音频资源');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic.src = '';
        backgroundMusic.load();
        console.log('✅ [ShareJournal] 背景音频资源已完全释放');
      }

      if (preloadedAudio) {
        console.log('🧹 [ShareJournal] 清理预加载音频资源');
        preloadedAudio.pause();
        preloadedAudio.src = '';
        preloadedAudio.load();
        console.log('✅ [ShareJournal] 预加载音频资源已完全释放');
      }
    };
  }, [backgroundMusic, preloadedAudio]);

  const validateAccess = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawSceneToken = urlParams.get('scene');

      // 🔥 强制处理 URL 参数空格
      const sceneToken = rawSceneToken ? rawSceneToken.trim() : null;

      console.group('🎬 场景匹配验证 - 强制参数优先级');
      console.log('📡 原始参数:', rawSceneToken);
      console.log('🧹 处理后参数:', sceneToken);
      console.log('💡 URL 格式要求: ?scene=xxx&token=yyy');
      console.log('🚫 严禁回退到 default 场景');
      console.groupEnd();

      if (!sceneToken) {
        console.group('❌ scene 参数缺失 - 强制拦截');
        console.error('🚫 URL 缺少必需的 scene 参数');
        console.error('💡 正确 URL 格式: ?scene=xxx&token=yyy');
        console.error('🚫 严禁回退到默认场景');
        console.error('🛑 强制进入 blocked 状态');
        console.groupEnd();
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      // 🔥 强制精准匹配场景，取消默认降级
      console.log('🔍 开始查询数据库，scene_token =', sceneToken);
      const { data, error } = await supabase
        .from('h5_share_config')
        .select('*')
        .eq('scene_token', sceneToken)
        .maybeSingle();

      if (error) {
        console.group('❌ 数据库查询失败 - 强制拦截');
        console.error('🚫 数据库错误:', error.message);
        console.error('🔍 查询的 scene_token:', sceneToken);
        console.error('💡 请检查后台是否已配置该场景');
        console.error('🚫 严禁回退到 default 场景');
        console.error('🛑 强制进入 blocked 状态');
        console.groupEnd();
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      if (!data) {
        console.group('❌ 场景不存在 - 强制拦截');
        console.error('🚫 数据库返回: null（场景未配置）');
        console.error('🔍 查询的 scene_token:', sceneToken);
        console.error('💡 请到后台 /admin/share-config 创建该场景配置');
        console.error('🚫 严禁回退到 default 场景');
        console.error('🛑 强制进入 blocked 状态');
        console.groupEnd();
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      console.log('✅ 场景配置查询成功:', data.scene_token);
      console.log('🎯 场景名称:', data.scene_name);
      console.log('🔍 is_active 状态:', data.is_active);

      // 🔥 最高优先级：is_active 状态检查（必须在任何初始化之前）
      // 强制拦截：获取配置后的第一动作是检查激活状态
      if (data.is_active === false) {
        console.group('🚫 [is_active = false] 场景已停用 - 强制拦截');
        console.error('🛑 场景标识 (scene_token):', data.scene_token);
        console.error('🛑 场景名称 (scene_name):', data.scene_name);
        console.error('🛑 停用时间:', new Date().toISOString());
        console.error('🚫 立即终止所有后续初始化流程：');
        console.error('   ❌ 音频预加载');
        console.error('   ❌ 视频预加载');
        console.error('   ❌ 背景资源预加载');
        console.error('   ❌ 配置对象设置');
        console.error('💡 用户将看到失效页面，无法访问任何内容');
        console.groupEnd();
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      console.log('✅ is_active 验证通过，场景已激活，继续初始化...');

      console.group('🚀 H5 场景配置已加载');
      console.log('✅ 数据源：h5_share_config 表（场景化配置）');
      console.log('🎭 场景标识 (scene_token):', data.scene_token);
      console.log('📝 场景名称 (scene_name):', data.scene_name);
      console.log('📄 场景描述:', data.description || '无');
      console.log('');
      console.log('📊 完整配置对象:', data);
      console.log('');
      console.log('🎵 背景音乐 URL (bg_music_url):', data.bg_music_url || '⏩ 将尝试主 App 资源');
      console.log('🎬 通用背景视频 URL (bg_video_url):', data.bg_video_url || '⏩ 使用默认视频');
      console.log('🖼️ 卡片内部背景 URL (card_inner_bg_url):', data.card_inner_bg_url || '❌ 未配置');
      console.log('');
      console.log('📄 各步骤专属背景（引流后台专属）:');
      console.log('  - 首页 (bg_home_url):', data.bg_home_url || '→ 回退到 bg_video_url');
      console.log('  - 起名页 (bg_naming_url):', data.bg_naming_url || '→ 回退到 bg_video_url');
      console.log('  - 情绪页 (bg_emotion_url):', data.bg_emotion_url || '→ 回退到 bg_video_url');
      console.log('  - 日记页 (bg_journal_url):', data.bg_journal_url || '→ 回退到 bg_video_url');
      console.log('  - 过渡页 (bg_transition_url):', data.bg_transition_url || '→ 回退到 bg_video_url');
      console.log('  - 答案之书 (bg_answer_book_url):', data.bg_answer_book_url || '→ 回退到 bg_video_url');
      console.log('');
      console.log('🎵 音频加载策略（场景配置绝对优先）:');
      console.log('  🔥 唯一数据源: h5_share_config.bg_music_url');
      console.log('  🚫 已禁用主 App 音频降级 (audio_files 表)');
      console.log('  🚫 已禁用本地静态资源降级');
      if (data.bg_music_url) {
        console.log('  ✅ 当前场景已配置专属音频，将直接加载');
      } else {
        console.error('  ❌ 当前场景未配置音频，将在无背景音乐的情况下运行');
      }
      console.groupEnd();

      setConfig(data);

      const urlToken = urlParams.get('token');

      console.log('🔑 Token from URL query:', urlToken);
      console.log('🔑 Required token (daily_token):', data.daily_token);

      if (!urlToken || urlToken !== data.daily_token) {
        console.warn('⚠️ Token validation failed');
        console.warn('💡 正确格式: ?scene=xxx&token=yyy');
        setCurrentStep('blocked');
        setIsValidating(false);
        return;
      }

      console.log('✅ Token validated successfully');
      console.log('🎵 开始预加载场景资源...');

      // 🚀 元数据优先策略：首屏仅获取音频时长信息，严禁下载完整文件
      if (data.bg_music_url) {
        console.group('🚀 元数据优先加载策略（首屏性能优化）');
        console.log('📡 媒体 URL:', data.bg_music_url);
        console.log('⚡ 策略: preload="metadata" - 仅获取时长信息，不下载音频数据');
        console.log('🚫 已禁用主 App 音频降级');

        // 检测是否为 MP4 视频
        if (isVideoUrl(data.bg_music_url)) {
          console.log('🎬 检测到 MP4 视频文件');
          console.log('📊 将作为背景视频使用（静音播放）');
          console.log('💡 视频将由 GoldenTransition 中的 <video> 标签处理');
        } else {
          console.log('🎵 检测到音频文件（MP3）');
          console.log('💡 策略: 创建 Audio 对象，preload="none"，等待用户交互后再加载');

          // 🚀 性能优化：仅创建空的 Audio 对象，不触发任何网络请求
          const audio = new Audio();
          audio.preload = 'none'; // 🔥 关键：首屏完全不加载音频数据
          audio.src = data.bg_music_url; // 仅设置 URL，不触发加载
          audio.volume = 0.3;
          audio.loop = true;
          audio.crossOrigin = 'anonymous';

          console.log('✅ 音频对象已创建（零网络开销）');
          console.log('📊 preload="none" - 等待 GoldenTransition 页面才开始加载');
          console.log('💾 节省首屏带宽：0 MB（vs 传统方式的 30-100 MB）');

          setBackgroundMusic(audio);
          setPreloadedAudio(audio);

          console.log('🎯 音频将在 GoldenTransition 页面调用 load() 方法后开始流式加载');
        }

        console.groupEnd();
      } else {
        console.warn('⚠️ 当前场景未配置 bg_music_url');
        console.warn('💡 将在无背景音乐的情况下运行');
        console.warn('🚫 已禁用主 App 音频降级');
      }

      await shareBackgroundPreloader.preloadAllAssets(data);

      setIsValidating(false);
    } catch (error) {
      console.error('❌ Validation error:', error);
      setCurrentStep('blocked');
      setIsValidating(false);
    }
  };

  const updateState = (updates: Partial<JournalState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNamingComplete = async (higherSelfName: string, userName: string) => {
    updateState({ userName, higherSelfMessage: higherSelfName });

    console.group('🎵 起名环节完成 - 检查音频预热状态');
    console.log('🔍 当前 backgroundMusic:', backgroundMusic ? '已有实例' : 'null');
    console.log('🔍 当前 preloadedAudio:', preloadedAudio ? '已有实例' : 'null');

    // 🔥 关键修复：检查是否已经在 validateAccess 中预加载了音频
    if (backgroundMusic || preloadedAudio) {
      console.log('✅ 音频已在 validateAccess 中预加载完成，无需重复创建');
      console.log('💡 直接使用现有实例，避免创建重复的 Audio 对象');
      console.groupEnd();
      setCurrentStep('home');
      return;
    }

    console.log('⚠️ 未检测到预加载音频，尝试降级加载');
    console.log('💡 策略: 在用户浏览首页时，后台静默预加载音频');
    console.log('🎯 目标: 到达呼吸环节时，音频已缓冲完毕，即点即响');

    try {
      if (config?.bg_music_url) {
        console.log('📡 开始预加载音频 (192kbps 高品质长音频优化):', config.bg_music_url);

        // 检测是否为视频格式，视频格式不需要预加载 Audio 对象
        if (isVideoUrl(config.bg_music_url)) {
          console.log('🎬 检测到 MP4 视频格式，跳过 Audio 对象创建');
          console.log('💡 视频将在 GoldenTransition 中直接播放');
          console.groupEnd();
          setCurrentStep('home');
          return;
        }

        const audio = new Audio();
        audio.src = config.bg_music_url;

        // 🚀 强制使用 metadata 模式，启用 Range Requests（HTTP 206 Partial Content）
        // 对于 192kbps 的大文件，只预加载元数据，避免下载整个文件
        audio.preload = 'metadata';
        audio.volume = 0;
        audio.crossOrigin = 'anonymous';

        console.log('✅ Range Requests 已启用: preload="metadata"');
        console.log('💡 优势: 100MB 音频仅下载元数据，秒开播放');

        audio.addEventListener('canplay', () => {
          console.log('✅ 音频元数据加载完成，可以开始播放（流式模式）');
        });

        audio.addEventListener('error', (e) => {
          console.warn('⚠️ 音频预加载失败:', e);
        });

        audio.load();

        // 🔥 同时设置两个状态，保持一致性
        console.log('🔄 同步设置 backgroundMusic 和 preloadedAudio');
        setBackgroundMusic(audio);
        setPreloadedAudio(audio);
        console.log('🚀 预加载任务已启动（仅加载元数据，支持流式播放）');
      } else {
        console.log('⏩ bg_music_url 未配置，将使用主 App 资源');
      }
    } catch (err) {
      console.error('❌ 预加载异常:', err);
    }

    console.groupEnd();
    setCurrentStep('home');
  };

  const handleHomeStart = async () => {
    console.log('🎯 User started journey from home page');
    console.log('🎵 音频将在 GoldenTransition 阶段加载（三级优先级策略）');
    setCurrentStep('emotion');
  };

  const handleEmotionComplete = (emotions: string[], bodyStates: string[]) => {
    updateState({ selectedEmotions: emotions });
    setCurrentStep('journal');
  };

  const handleJournalComplete = async (content: string) => {
    updateState({ journalContent: content });

    try {
      await supabase?.from('journal_entries')?.insert({
        journal_content: content,
        source: 'web_share',
        emotions: state.selectedEmotions,
        body_states: []
      });
    } catch (err) {
      console.warn('Database save failed (non-critical):', err);
    }

    setCurrentStep('transition');
  };

  const handleTransitionComplete = (transitionMusic: HTMLAudioElement | null) => {
    console.group('🔄 [ShareJournal] handleTransitionComplete 调用');
    console.log('📥 接收到的 transitionMusic:', transitionMusic ? '有效' : 'null');

    if (transitionMusic) {
      console.log('✅ Background music received from GoldenTransition, continuing playback');
      console.log('🎵 Music playing:', !transitionMusic.paused);
      console.log('🎵 Music volume:', transitionMusic.volume);
      console.log('🎵 Music source:', transitionMusic.src);
      console.log('🎵 Music currentTime:', transitionMusic.currentTime);

      // 🔥 修复 3: 立即调用 setBackgroundMusic，确保生命周期完整
      console.log('🔄 立即更新 backgroundMusic 状态，确保后续步骤持续有效');
      setBackgroundMusic(transitionMusic);

      // 验证状态将被更新
      console.log('✅ backgroundMusic 将在下次渲染中生效');
      console.log('🎯 后续 dialogue 和 answer 步骤将继续使用此实例');
    } else {
      console.warn('⚠️ No background music from GoldenTransition');
      console.warn('💡 将使用现有的 backgroundMusic 状态（若有）');
    }

    console.log('🔄 切换到 dialogue 步骤');
    console.groupEnd();

    setCurrentStep('dialogue');
  };

  const handleDialogueComplete = (advice: string, audio: HTMLAudioElement | null) => {
    console.group('📝 [ShareJournal] 高我建议已完成');
    console.log('✅ 建议内容:', advice);
    console.log('📊 建议长度:', advice.length, '字符');
    console.log('🔍 建议是否为空:', advice.trim() === '');
    console.groupEnd();

    // 🔥 防御性检查：确保建议不为空
    if (!advice || advice.trim() === '') {
      console.error('❌ [ShareJournal] 致命错误：高我建议为空！');
      alert('高我建议生成失败，请重新输入');
      return;
    }

    // 🔥 正确存储高我建议到 higherSelfAdvice 字段
    updateState({ higherSelfAdvice: advice });

    // 验证存储
    console.log('🔍 [ShareJournal] 验证存储: state.higherSelfAdvice 即将更新为:', advice);

    setCurrentStep('answer');
  };

  const handleAnswerComplete = () => {
    console.group('🎯 [ShareJournal] 答案之书完成 - 自动跳转拦截验证');
    console.log('📍 触发函数: handleAnswerComplete');
    console.log('🔒 当前路由:', window.location.pathname);
    console.log('🚫 自动跳转检测: 无任何 navigate() 或 Maps() 调用');
    console.log('🔒 路由保持: /share/journal（不变）');
    console.log('🔄 状态切换: answer → card');
    console.groupEnd();

    // 🔒 关键：先切换状态，确保页面停留在引流页
    setCurrentStep('card');

    // 延迟执行生成，确保 DOM 已完全渲染（增加到 500ms）
    setTimeout(() => {
      console.log('⏰ [ShareJournal] 延迟执行 generateEnergyCard...');
      console.log('🔒 [ShareJournal] 二次确认路由:', window.location.pathname);
      console.log('🔒 [ShareJournal] 当前步骤状态:', currentStep);
      generateEnergyCard();
    }, 500);

    // 🎵 音频继续播放，不淡出，不暂停
    // 用户需要全程听到30分钟长音频，直到彻底关闭浏览器
    console.group('🎵 [ShareJournal] 背景音频验证');
    console.log('🎵 策略: 继续播放，不淡出，不暂停');
    console.log('🔒 来源: h5_share_config.bg_music_url');
    console.log('📊 状态: 用户可以边听30分钟音频边生成海报');
    console.log('💾 清理: 只在组件卸载时释放资源');
    console.groupEnd();
  };

  const generateEnergyCard = async () => {
    console.group('🎴 海报生成启动 - 背景图实时抓取验证');
    console.log('📍 执行函数: generateEnergyCard');
    console.log('🔒 当前步骤:', currentStep);
    console.log('🔒 当前路由:', window.location.pathname);
    console.log('🚫 自动跳转拦截: 已启用，直到用户手动操作');
    console.log('');
    console.log('🖼️ 背景图优先级链（实时从配置台抓取）:');
    console.log('  1️⃣ card_inner_bg_url:', config?.card_inner_bg_url || '❌ 未配置');
    console.log('  2️⃣ card_bg_image_url (已废弃):', config?.card_bg_image_url || '❌ 未配置');
    console.log('  3️⃣ 本地降级:', '/0_0_640_N.webp');
    console.log('');

    // 🛡️ 强制保底逻辑：如果有后台链接用后台的，没有就用本地默认的
    const finalBgUrl = config?.card_inner_bg_url || config?.card_bg_image_url || '/0_0_640_N.webp';
    console.log('✅ 最终使用背景图:', finalBgUrl);
    console.log('🚀 图片来源:', finalBgUrl.includes('supabase') ? 'Supabase Storage（中国区加速）' : '本地静态资源');
    console.log('🔒 确认: 背景图从 h5_share_config 表实时读取，不使用缓存');
    console.groupEnd();

    setIsGenerating(true);

    try {
      // 🔥 强制预加载背景图并处理跨域问题
      console.log('🔄 [generateEnergyCard] 预加载背景图...');
      await new Promise<void>((resolve, reject) => {
        const img = new Image();

        // 🚨 必须添加 crossOrigin 处理，防止跨域导致截图失败
        if (finalBgUrl.startsWith('http')) {
          img.crossOrigin = 'anonymous';
          console.log('🔐 [generateEnergyCard] 启用跨域模式 (crossOrigin=anonymous)');
        }

        img.onload = () => {
          console.log('✅ [generateEnergyCard] 背景图预加载成功');
          console.log('📐 [generateEnergyCard] 图片尺寸:', img.width, 'x', img.height);
          resolve();
        };

        img.onerror = (err) => {
          console.error('❌ [generateEnergyCard] 背景图加载失败，使用本地降级');
          console.error('❌ 错误详情:', err);
          // 即使失败也继续，html2canvas 会使用本地降级
          resolve();
        };

        img.src = finalBgUrl;
        console.log('🔗 [generateEnergyCard] 开始加载:', finalBgUrl);
      });

      // 等待 DOM 稳定
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!cardRef.current) {
        console.error('❌ [generateEnergyCard] cardRef.current 不存在');
        console.error('❌ [generateEnergyCard] 这不应该发生！DOM 元素应该已经渲染');
        setIsGenerating(false);
        return;
      }

      console.log('📸 [generateEnergyCard] cardRef.current 存在，准备捕获...');
      console.log('📐 [generateEnergyCard] DOM 尺寸:', {
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: true,
        width: 750,
        height: 1334
      });

      console.log('✅ [generateEnergyCard] html2canvas 捕获成功');
      console.log('📊 [generateEnergyCard] Canvas 尺寸:', {
        width: canvas.width,
        height: canvas.height
      });

      const imageUrl = canvas.toDataURL('image/png', 1.0);
      console.log('✅ [generateEnergyCard] 图片 Data URL 生成成功，长度:', imageUrl.length);

      setGeneratedImage(imageUrl);
      setIsGenerating(false);

      console.log('✅ [generateEnergyCard] 状态更新完成，应显示全屏卡片');
    } catch (err) {
      console.error('❌ [generateEnergyCard] 卡片生成失败:', err);
      console.error('❌ [generateEnergyCard] 错误堆栈:', err instanceof Error ? err.stack : '无堆栈信息');
      setIsGenerating(false);
      alert('海报生成失败，请重试或联系管理员');
    }
  };

  const renderStep = () => {
    console.log('🎬 [ShareJournal] renderStep 被调用, currentStep:', currentStep);

    if (isValidating) {
      return (
        <div className="validation-screen">
          <div className="validation-spinner" />
          <p className="validation-text">验证访问权限...</p>
        </div>
      );
    }

    if (currentStep === 'blocked') {
      // 🔥 资源彻底释放：进入 blocked 状态时立即停止并清理所有音频/视频
      console.group('🛑 [blocked] 资源清理 - 停止所有媒体播放');

      if (backgroundMusic) {
        console.log('🧹 停止并释放 backgroundMusic');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic.volume = 0;
        backgroundMusic.src = '';
        console.log('✅ backgroundMusic 已完全释放');
      }

      if (preloadedAudio) {
        console.log('🧹 停止并释放 preloadedAudio');
        preloadedAudio.pause();
        preloadedAudio.currentTime = 0;
        preloadedAudio.volume = 0;
        preloadedAudio.src = '';
        console.log('✅ preloadedAudio 已完全释放');
      }

      console.log('✅ 所有媒体资源已彻底释放');
      console.groupEnd();

      return (
        <div className="blocked-screen">
          <div className="zen-container">
            <div className="zen-icon">🌿</div>
            <h1 className="zen-title">链接已随时间流转而失效</h1>
            <p className="zen-message">
              请关注"植本逻辑"<br />
              获取最新能量场入口
            </p>
            <div className="zen-footer">
              <div className="zen-sparkle">✨</div>
              <p className="zen-brand">植本逻辑</p>
              <p className="zen-tagline">觉察 · 疗愈 · 成长</p>
            </div>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 'naming':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_naming_url}
            fallbackUrl={config?.bg_video_url}
          >
            <NamingRitual
              onComplete={handleNamingComplete}
            />
          </DynamicStepBackground>
        );

      case 'home':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_home_url}
            fallbackUrl={config?.bg_video_url}
          >
            <HomePage
              userName={state.userName}
              higherSelfName={state.higherSelfMessage}
              onStartJourney={handleHomeStart}
            />
          </DynamicStepBackground>
        );

      case 'emotion':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_emotion_url}
            fallbackUrl={config?.bg_video_url}
          >
            <Suspense fallback={<div className="loading-screen">加载中...</div>}>
              <EmotionScan
                onNext={handleEmotionComplete}
              />
            </Suspense>
          </DynamicStepBackground>
        );

      case 'journal':
        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_journal_url}
            fallbackUrl={config?.bg_video_url}
          >
            <Suspense fallback={<div className="loading-screen">加载中...</div>}>
              <InnerWhisperJournal
                emotions={state.selectedEmotions}
                onNext={handleJournalComplete}
              />
            </Suspense>
          </DynamicStepBackground>
        );

      case 'dialogue':
        console.group('💬 [ShareJournal] 渲染 HigherSelfDialogue');
        console.log('🎵 backgroundMusic 状态:', backgroundMusic ? '已加载' : 'null');
        console.log('🎵 preloadedAudio 状态:', preloadedAudio ? '已加载' : 'null');
        if (backgroundMusic) {
          console.log('📊 backgroundMusic.src:', backgroundMusic.src);
          console.log('📊 backgroundMusic.paused:', backgroundMusic.paused);
        }
        console.groupEnd();

        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_video_url}
          >
            <Suspense fallback={<div className="loading-screen">加载中...</div>}>
              <HigherSelfDialogue
                userName={state.userName}
                higherSelfName={state.higherSelfMessage || '高我'}
                journalContent={state.journalContent}
                backgroundMusic={backgroundMusic}
                onComplete={handleDialogueComplete}
              />
            </Suspense>
          </DynamicStepBackground>
        );

      case 'transition':
        console.group('🎬 [ShareJournal] 渲染 GoldenTransition');
        console.log('🎵 backgroundMusic 状态:', backgroundMusic ? '已加载' : 'null');
        console.log('🎵 preloadedAudio 状态:', preloadedAudio ? '已加载' : 'null');
        console.log('📡 bg_music_url:', config?.bg_music_url);
        console.log('🎬 是否为视频:', config?.bg_music_url ? isVideoUrl(config.bg_music_url) : false);

        // 🔥 修复 1: 优先尝试 backgroundMusic，若为 null 则用 preloadedAudio 兜底
        const audioToPass = backgroundMusic || preloadedAudio;
        console.log('✅ 最终传递的音频对象:', audioToPass ? '有效' : '无');

        // 🔥 修复 2: 检测是否为 MP4 视频，传递标识给 GoldenTransition
        const isMusicVideo = config?.bg_music_url ? isVideoUrl(config.bg_music_url) : false;
        console.log('🎯 isMusicVideo 标识:', isMusicVideo);
        if (isMusicVideo) {
          console.log('💡 GoldenTransition 将取消视频静音，播放视频中的音乐');
        }
        console.groupEnd();

        return (
          <Suspense fallback={<div className="loading-screen">加载中...</div>}>
            <GoldenTransition
              userName={state.userName}
              higherSelfName={state.higherSelfMessage || '高我'}
              onComplete={handleTransitionComplete}
              backgroundMusicUrl={config?.bg_music_url}
              backgroundVideoUrl={config?.bg_transition_url || config?.bg_video_url}
              globalAudio={audioToPass}
              isMusicVideo={isMusicVideo}
            />
          </Suspense>
        );

      case 'answer':
        console.group('📖 [ShareJournal] 渲染答案之书');
        console.log('✅ 传递给 BookOfAnswers 的 higherSelfAdvice:', state.higherSelfAdvice);
        console.log('📊 长度:', state.higherSelfAdvice?.length || 0);
        console.log('🔍 是否为空:', !state.higherSelfAdvice || state.higherSelfAdvice.trim() === '');
        console.groupEnd();

        return (
          <DynamicStepBackground
            backgroundUrl={config?.bg_answer_book_url}
            fallbackUrl={config?.bg_video_url}
          >
            <Suspense fallback={<div className="loading-screen">加载中...</div>}>
              <BookOfAnswers
                backgroundAudio={backgroundMusic}
                onComplete={handleAnswerComplete}
                isGenerating={isGenerating}
                userName={state.userName}
                kinData={state.kinData}
                higherSelfAdvice={state.higherSelfAdvice}
              />
            </Suspense>
          </DynamicStepBackground>
        );

      case 'card':
        console.log('✅ [ShareJournal] 渲染卡片步骤, isGenerating:', isGenerating, 'generatedImage:', !!generatedImage);
        return (
          <div className="energy-card-display">
            {isGenerating && (
              <div className="generating-overlay">
                <div className="generating-spinner" />
                <p className="generating-text">正在生成你的专属能量卡...</p>
              </div>
            )}

            {generatedImage && (
              <>
                <div className="fullscreen-card-overlay" style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 99999,
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  backdropFilter: 'blur(20px)'
                }}>
                  <div className="fullscreen-hint" style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    zIndex: 100000,
                    padding: '16px 24px',
                    background: 'rgba(200, 220, 255, 0.15)',
                    backdropFilter: 'blur(40px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(200, 220, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(200, 220, 255, 0.2)'
                  }}>
                    <span className="pulse-dot-large" style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'rgba(200, 220, 255, 0.9)',
                      display: 'inline-block',
                      marginRight: '8px',
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    <p className="fullscreen-hint-text" style={{
                      color: 'rgba(200, 220, 255, 0.95)',
                      fontSize: '15px',
                      fontWeight: '400',
                      letterSpacing: '0.1em',
                      margin: 0,
                      textShadow: '0 0 20px rgba(200, 220, 255, 0.5)'
                    }}>✨ 你的专属能量卡已生成，请长按发送给微信好友</p>
                  </div>

                  <img
                    src={generatedImage}
                    alt="专属能量卡"
                    className="fullscreen-card-image"
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '75vh',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 8px 40px rgba(0, 0, 0, 0.7), 0 0 60px rgba(200, 220, 255, 0.15)',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'default'
                    }}
                  />

                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '16px',
                    zIndex: 100000
                  }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.group('🔒 [ShareJournal] 用户点击关闭海报');
                        console.log('🚫 拦截: 不跳转到首页');
                        console.log('🔄 动作: 关闭海报，返回答案之书结果页');
                        console.log('🔒 路由: 保持在 /share/journal');
                        console.groupEnd();
                        setGeneratedImage(null);
                        setCurrentStep('answer');
                      }}
                      style={{
                        padding: '14px 32px',
                        fontSize: '15px',
                        fontWeight: '300',
                        letterSpacing: '0.2em',
                        background: 'rgba(200, 220, 255, 0.08)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid rgba(200, 220, 255, 0.25)',
                        borderRadius: '8px',
                        color: 'rgba(200, 220, 255, 0.9)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(200, 220, 255, 0.1)'
                      }}
                    >
                      关闭
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.group('🔄 [ShareJournal] 用户点击重新开始');
                        console.log('🚫 拦截: 不跳转到首页');
                        console.log('🔄 动作: 重置所有状态，返回起名页');
                        console.log('🔒 路由: 保持在 /share/journal');
                        console.groupEnd();
                        setCurrentStep('naming');
                        setState({
                          userName: '',
                          birthDate: null,
                          selectedEmotions: [],
                          journalContent: '',
                          higherSelfMessage: '',
                          kinData: null
                        });
                        setGeneratedImage(null);
                      }}
                      style={{
                        padding: '14px 32px',
                        fontSize: '15px',
                        fontWeight: '300',
                        letterSpacing: '0.2em',
                        background: 'rgba(200, 220, 255, 0.12)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid rgba(200, 220, 255, 0.3)',
                        borderRadius: '8px',
                        color: 'rgba(200, 220, 255, 0.95)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(200, 220, 255, 0.15)'
                      }}
                    >
                      开启新的觉察之旅
                    </button>
                  </div>
                </div>
              </>
            )}

            {!isGenerating && !generatedImage && (
              <div className="generating-overlay">
                <div className="generating-spinner" />
                <p className="generating-text">准备生成卡片...</p>
              </div>
            )}

            <div
              ref={cardRef}
              className="energy-card-canvas"
              style={{
                position: 'fixed',
                top: '-9999px',
                left: '-9999px',
                width: '750px',
                height: '1334px',
                backgroundImage: `url(${config?.card_inner_bg_url || config?.card_bg_image_url || '/0_0_640_N.webp'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '80px 60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
              }}
            >
              <div>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '60px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
                  paddingBottom: '40px'
                }}>
                  <h1 style={{
                    fontSize: '56px',
                    color: '#FAFAFA',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    marginBottom: '20px',
                    textShadow: '0px 2px 6px rgba(0, 0, 0, 0.4), 0px 0px 20px rgba(255, 255, 255, 0.3)'
                  }}>
                    觉察时刻
                  </h1>
                  <p style={{
                    fontSize: '24px',
                    color: '#FAFAFA',
                    letterSpacing: '0.2em',
                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.35)'
                  }}>
                    {state.userName} 的内在之声
                  </p>
                </div>

                <div style={{
                  marginBottom: '50px',
                  padding: '40px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    color: '#2d5016',
                    marginBottom: '24px',
                    letterSpacing: '0.15em',
                    opacity: 0.9,
                    fontWeight: 500
                  }}>
                    我的觉察
                  </h3>
                  <p style={{
                    fontSize: '26px',
                    color: '#1a1a1a',
                    lineHeight: '1.8',
                    letterSpacing: '0.05em'
                  }}>
                    {state.journalContent.substring(0, 120)}
                    {state.journalContent.length > 120 ? '...' : ''}
                  </p>
                </div>

                <div style={{
                  padding: '40px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '24px',
                  border: '2px solid rgba(45, 80, 22, 0.3)',
                  boxShadow: '0 4px 24px rgba(45, 80, 22, 0.2)'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    color: '#2d5016',
                    marginBottom: '24px',
                    letterSpacing: '0.15em',
                    textAlign: 'center',
                    fontWeight: 500
                  }}>
                    高我的指引
                  </h3>
                  <p style={{
                    fontSize: '30px',
                    color: '#1a1a1a',
                    lineHeight: '1.9',
                    textAlign: 'center',
                    letterSpacing: '0.08em',
                    fontWeight: 400
                  }}>
                    {state.higherSelfMessage || '你的内在智慧正在被唤醒'}
                  </p>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                paddingTop: '40px',
                borderTop: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 30px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(45, 80, 22, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontSize: '48px',
                    color: '#2d5016'
                  }}>
                    ✨
                  </div>
                </div>
                <p style={{
                  fontSize: '32px',
                  color: '#FAFAFA',
                  letterSpacing: '0.25em',
                  fontWeight: 300,
                  marginBottom: '12px',
                  textShadow: '0px 2px 6px rgba(0, 0, 0, 0.4)'
                }}>
                  植本逻辑
                </p>
                <p style={{
                  fontSize: '20px',
                  color: '#FAFAFA',
                  letterSpacing: '0.2em',
                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.35)'
                }}>
                  觉察 · 疗愈 · 成长
                </p>
              </div>
            </div>

            <style>{`
              .energy-card-display {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
              }

              .generating-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
              }

              .generating-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(247, 231, 206, 0.2);
                border-top-color: #F7E7CE;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 24px;
              }

              @keyframes spin {
                to { transform: rotate(360deg); }
              }

              .generating-text {
                font-size: 18px;
                color: #F7E7CE;
                letter-spacing: 0.15em;
              }

              /* 全屏覆盖层样式 */
              .fullscreen-card-overlay {
                position: fixed;
                inset: 0;
                z-index: 10000;
                background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                overflow-y: auto;
              }

              .fullscreen-hint {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin-bottom: 24px;
                padding: 20px 32px;
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.15) 0%, rgba(235, 200, 98, 0.15) 100%);
                border: 1px solid rgba(247, 231, 206, 0.4);
                border-radius: 16px;
                backdrop-filter: blur(20px);
                animation: fadeInDown 0.6s ease-out;
              }

              @keyframes fadeInDown {
                from {
                  opacity: 0;
                  transform: translateY(-30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .pulse-dot-large {
                width: 14px;
                height: 14px;
                background: #EBC862;
                border-radius: 50%;
                animation: pulseLarge 2s ease-in-out infinite;
                box-shadow: 0 0 20px rgba(235, 200, 98, 0.6);
              }

              @keyframes pulseLarge {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                  box-shadow: 0 0 20px rgba(235, 200, 98, 0.6);
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.3);
                  box-shadow: 0 0 30px rgba(235, 200, 98, 0.8);
                }
              }

              .fullscreen-hint-text {
                font-size: 17px;
                color: #F7E7CE;
                letter-spacing: 0.15em;
                font-weight: 400;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
              }

              .fullscreen-card-image {
                width: 100%;
                max-width: 420px;
                height: auto;
                border-radius: 20px;
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
                margin-bottom: 40px;
                animation: scaleIn 0.8s ease-out 0.3s both;
                cursor: pointer;
                -webkit-user-select: none;
                user-select: none;
                -webkit-touch-callout: default;
              }

              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              .fullscreen-restart-button {
                padding: 18px 48px;
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.2) 0%, rgba(235, 200, 98, 0.2) 100%);
                border: 1.5px solid rgba(247, 231, 206, 0.4);
                border-radius: 14px;
                color: #F7E7CE;
                font-size: 17px;
                letter-spacing: 0.25em;
                cursor: pointer;
                transition: all 0.4s ease;
                backdrop-filter: blur(20px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                animation: fadeInUp 0.8s ease-out 0.6s both;
              }

              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .fullscreen-restart-button:hover {
                background: linear-gradient(135deg, rgba(247, 231, 206, 0.3) 0%, rgba(235, 200, 98, 0.3) 100%);
                border-color: rgba(247, 231, 206, 0.6);
                box-shadow: 0 6px 30px rgba(247, 231, 206, 0.4);
                transform: translateY(-3px);
              }

              .fullscreen-restart-button:active {
                transform: translateY(-1px);
              }

              /* 支持移动端长按保存图片 */
              @media (max-width: 768px) {
                .fullscreen-card-image {
                  max-width: 90%;
                }
              }
            `}</style>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="share-journal-flow">
      {renderStep()}

      <style>{`
        .share-journal-flow {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .validation-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
        }

        .validation-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(247, 231, 206, 0.2);
          border-top-color: #F7E7CE;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .validation-text {
          font-size: 16px;
          color: #F7E7CE;
          letter-spacing: 0.15em;
        }

        .blocked-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
        }

        .zen-container {
          text-align: center;
          max-width: 500px;
          padding: 60px 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(247, 231, 206, 0.2);
        }

        .zen-icon {
          font-size: 80px;
          margin-bottom: 30px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .zen-title {
          font-size: 28px;
          color: #F7E7CE;
          font-weight: 300;
          letter-spacing: 0.15em;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .zen-message {
          font-size: 18px;
          color: rgba(247, 231, 206, 0.8);
          letter-spacing: 0.1em;
          line-height: 1.8;
          margin-bottom: 50px;
        }

        .zen-footer {
          padding-top: 40px;
          border-top: 1px solid rgba(247, 231, 206, 0.2);
        }

        .zen-sparkle {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .zen-brand {
          font-size: 24px;
          color: #F7E7CE;
          letter-spacing: 0.25em;
          font-weight: 300;
          margin-bottom: 8px;
        }

        .zen-tagline {
          font-size: 14px;
          color: rgba(247, 231, 206, 0.6);
          letter-spacing: 0.2em;
        }
      `}</style>
    </div>
  );
}
