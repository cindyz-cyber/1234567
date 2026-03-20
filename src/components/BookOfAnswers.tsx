import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { stopAllAudio } from '../utils/audioManager';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';

interface BookOfAnswersProps {
  onComplete?: () => void;
  backgroundAudio?: HTMLAudioElement | null;
  onBack?: () => void;
  isGenerating?: boolean;
  userName?: string;
  kinData?: any;
  higherSelfAdvice?: string; // 🔥 必填：真实的高我建议（或从 location.state 获取）
}

// 🔥 智慧文库：50+ 条植本逻辑深度文案
interface WisdomEntry {
  text: string;
  weight: number; // 权重：1=常见，3=稀有，5=极稀有
}

const WISDOMS: WisdomEntry[] = [
  // === 行动类 (Action-oriented) ===
  { text: '在下一个满月前，完成那件拖延已久的事', weight: 1 },
  { text: '去见一个许久未见的老友，答案在对话中', weight: 1 },
  { text: '身体在呼唤你，去跑步或跳舞吧', weight: 1 },
  { text: '写一封信给三年后的自己', weight: 2 },
  { text: '今天就开始，不必等到完美的时机', weight: 1 },
  { text: '向那个人道歉，时机已经成熟', weight: 2 },
  { text: '删掉三个不再使用的 App，腾出空间', weight: 1 },
  { text: '在日出前醒来，观察光的到来', weight: 3 },
  { text: '为陌生人做一件善事，不留名字', weight: 2 },
  { text: '整理你的书架，答案藏在某本书里', weight: 1 },

  // === 觉察类 (Self-awareness) ===
  { text: '你现在的困惑，源于对完美的过度执着', weight: 1 },
  { text: '试着呼吸，在呼气中放下那份掌控欲', weight: 1 },
  { text: '你并非卡住了，只是在积蓄能量', weight: 2 },
  { text: '停止证明自己，开始表达自己', weight: 2 },
  { text: '你害怕的不是失败，而是失去控制', weight: 3 },
  { text: '那个让你不舒服的人，映照着你内心的阴影', weight: 2 },
  { text: '你的疲惫来自抗拒，而非行动本身', weight: 2 },
  { text: '允许自己不知道答案', weight: 1 },
  { text: '你的愤怒是未被看见的悲伤', weight: 3 },
  { text: '放下对未来的焦虑，回到此刻的呼吸', weight: 1 },
  { text: '你不需要更多，你需要的是减法', weight: 2 },
  { text: '内疚是你对过去的执念，放手吧', weight: 2 },

  // === 场域类 (Context & Environment) ===
  { text: '向自然借力，在绿意中你会听见指引', weight: 1 },
  { text: '换个视角，你眼中的阻碍其实是护城河', weight: 2 },
  { text: '离开熟悉的环境，去一个从未去过的地方', weight: 1 },
  { text: '这个问题的答案，在水边', weight: 3 },
  { text: '你需要的不是建议，而是独处的时间', weight: 1 },
  { text: '回到童年常去的地方，找回遗失的碎片', weight: 3 },
  { text: '换一条回家的路，新的路径带来新的思考', weight: 2 },
  { text: '在人群中独处，在独处时连接自己', weight: 2 },
  { text: '清理你的空间，能量会随之流动', weight: 1 },

  // === 关系类 (Relationships) ===
  { text: '你在等待的人，也在等待你的主动', weight: 2 },
  { text: '说出那句话，即使声音会颤抖', weight: 2 },
  { text: '真正的连接，始于脆弱的袒露', weight: 2 },
  { text: '有些关系已经完成了它的使命', weight: 3 },
  { text: '你无法拯救任何人，除非他们想被拯救', weight: 3 },
  { text: '爱意需要表达，不要让遗憾积累', weight: 1 },
  { text: '设立边界不是冷漠，是对彼此的尊重', weight: 2 },
  { text: '那个人的离开，是为更好的相遇腾出空间', weight: 2 },

  // === 直觉与智慧类 (Intuition & Wisdom) ===
  { text: '你的第一反应往往是对的', weight: 1 },
  { text: '身体的信号比大脑更诚实', weight: 2 },
  { text: '梦境在告诉你某些事，记录下来', weight: 3 },
  { text: '巧合是宇宙的语言', weight: 3 },
  { text: '你一直知道答案，只是不敢相信', weight: 2 },
  { text: '停止分析，听听心的声音', weight: 1 },
  { text: '那个反复出现的念头，值得你认真对待', weight: 2 },
  { text: '直觉在耳语，理性在咆哮，选择前者', weight: 3 },

  // === 时间与耐心类 (Time & Patience) ===
  { text: '种子已经种下，现在需要的是耐心', weight: 1 },
  { text: '时机未到，不是你不够好', weight: 1 },
  { text: '慢下来，快不是答案', weight: 1 },
  { text: '这段等待是必要的准备', weight: 2 },
  { text: '信任过程，即使看不见结果', weight: 2 },

  // === 极稀有金句 (Ultra-rare) ===
  { text: '你以为的终点，其实是起点', weight: 5 },
  { text: '在黑暗中行走的人，身上自带光', weight: 5 },
  { text: '放下你的"为什么"，接受"就是这样"', weight: 5 },
  { text: '你的伤口，将成为光照进来的地方', weight: 5 },
  { text: '当你不再寻找，答案会自己到来', weight: 5 },
  { text: '觉醒的痛苦，好过沉睡的安逸', weight: 5 },
];

export default function BookOfAnswers({ onComplete, backgroundAudio, onBack, isGenerating = false, userName: propUserName, kinData: propKinData, higherSelfAdvice: propHigherSelfAdvice }: BookOfAnswersProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as {
    userName?: string;
    higherSelfName?: string;
    journalContent?: string;
    higherSelfAdvice?: string;
    kinData?: any;
  } | null;
  const userName = propUserName ?? routeState?.userName ?? '';
  const kinData = propKinData ?? routeState?.kinData ?? null;
  const higherSelfAdvice = propHigherSelfAdvice ?? routeState?.higherSelfAdvice ?? '';
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [generatingPoster, setGeneratingPoster] = useState(false);
  const [cardBgUrl, setCardBgUrl] = useState<string>('');
  const [selectedWisdom, setSelectedWisdom] = useState<string>(''); // 🔥 翻牌时的随机文案
  const posterCardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoBgUrl] = useState('https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/kh6mvlniog-1772856285046.mp4');

  // 🔥 验证传入的高我建议
  useEffect(() => {
    console.group('📖 [BookOfAnswers] 组件初始化');
    console.log('✅ 用户名:', userName || '(未设置)');
    console.log('📝 高我建议:', higherSelfAdvice || '❌ 未传递');
    console.log('📊 建议长度:', higherSelfAdvice?.length || 0, '字符');
    console.log('🎯 Kin 数据:', kinData ? '已加载' : '未加载');
    console.groupEnd();

    if (!higherSelfAdvice || higherSelfAdvice.trim() === '') {
      console.error('❌ [BookOfAnswers] 致命错误：higherSelfAdvice 为空！');
      console.error('💡 这意味着数据流中断，请检查 ShareJournal 是否正确传递 state.higherSelfAdvice');
    }
  }, [higherSelfAdvice, userName, kinData]);

  // 🔥 加载海报背景配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('h5_share_config')
          .select('card_inner_bg_url')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .maybeSingle();

        if (error) {
          console.error('❌ [BookOfAnswers] 配置加载失败:', error);
          setCardBgUrl('/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png');
          return;
        }

        let finalBgUrl = data?.card_inner_bg_url || '/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png';

        // 🔥 为外部 URL 添加时间戳防缓存
        if (finalBgUrl.startsWith('http://') || finalBgUrl.startsWith('https://')) {
          const separator = finalBgUrl.includes('?') ? '&' : '?';
          finalBgUrl = `${finalBgUrl}${separator}t=${Date.now()}`;
          console.log('✅ [BookOfAnswers] 海报背景已添加防缓存时间戳:', finalBgUrl);
        } else {
          console.log('✅ [BookOfAnswers] 海报背景加载成功（本地资源）:', finalBgUrl);
        }

        setCardBgUrl(finalBgUrl);
      } catch (err) {
        console.error('❌ [BookOfAnswers] 配置加载异常:', err);
        setCardBgUrl('/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png');
      }
    };

    loadConfig();
  }, []);

  // 🔥 移除自动清理逻辑：避免 React 严格模式双重挂载导致音乐被误杀
  // 音频清理应在用户点击"关闭"或"重新开始"按钮时手动调用
  // useEffect(() => {
  //   return () => {
  //     stopAllAudio();
  //   };
  // }, []);

  // 🔥 带权重的随机选择算法
  const selectWeightedWisdom = (): string => {
    // 计算总权重（权重越高=越稀有=概率越低，因此需要反转）
    const totalWeight = WISDOMS.reduce((sum, w) => sum + (1 / w.weight), 0);
    let random = Math.random() * totalWeight;

    for (const wisdom of WISDOMS) {
      const adjustedWeight = 1 / wisdom.weight;
      random -= adjustedWeight;
      if (random <= 0) {
        return wisdom.text;
      }
    }

    // 兜底：返回第一条
    return WISDOMS[0].text;
  };

  const handleCardClick = (index: number) => {
    if (flippedCard === null) {
      setFlippedCard(index);
      // 🔥 翻牌时选择一条随机文案
      const wisdom = selectWeightedWisdom();
      setSelectedWisdom(wisdom);

      console.group('🎴 [BookOfAnswers] 双轨逻辑验证');
      console.log('📱 翻牌卡片显示（随机文案）:', wisdom);
      console.log('📸 海报卡片显示（真实建议）:', higherSelfAdvice);
      console.log('✅ 确认：翻牌用趣味文案，海报用高我真实建议');
      console.groupEnd();
    }
  };

  const handleComplete = async (e?: React.MouseEvent) => {
    // 🚫 强制阻止任何默认行为和事件冒泡
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.group('🎯 [BookOfAnswers] 生成卡片按钮被点击 - 启动海报生成');
    console.log('🚫 事件拦截: preventDefault + stopPropagation');
    console.log('🔒 当前完整路径:', window.location.pathname + window.location.search);
    console.log('🔒 当前完整 URL:', window.location.href);
    console.log('🚫 路由锁定: 禁止任何跳转到 / 或主页的行为');
    console.log('🎴 海报背景 URL:', cardBgUrl);
    console.groupEnd();

    // 🔥 关键校验：海报内容数据检查
    console.group('🔍 [BookOfAnswers] 海报内容最终校验');
    console.log('📝 higherSelfAdvice (海报将显示的内容):', higherSelfAdvice);
    console.log('📊 内容长度:', higherSelfAdvice?.length || 0, '字符');
    console.log('🔍 是否为空:', !higherSelfAdvice || higherSelfAdvice.trim() === '');
    console.log('👤 用户名:', userName || '(未设置)');
    console.log('✅ 确认：海报将显示此文案（而非随机 wisdom）');
    console.groupEnd();

    // 🔥 防御性检查：确保海报内容不为空
    if (!higherSelfAdvice || higherSelfAdvice.trim() === '') {
      console.error('❌ [BookOfAnswers] 致命错误：海报内容为空，无法生成！');
      alert('海报内容为空，请返回重新生成高我建议');
      return;
    }

    // 🔥 第一步：先显示遮罩层和加载状态
    setShowPoster(true);
    setGeneratingPoster(true);

    try {
      // 🔥 第二步：等待 DOM 渲染
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!posterCardRef.current) {
        console.error('❌ [BookOfAnswers] posterCardRef 不存在');
        alert('海报生成失败：DOM 未准备好');
        setGeneratingPoster(false);
        setShowPoster(false);
        return;
      }

      console.log('📸 [BookOfAnswers] 开始捕获海报 DOM...');

      // 🔥 第三步：捕获视频帧并设置为背景
      if (videoRef.current && posterCardRef.current) {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1920;
        canvas.height = video.videoHeight || 1080;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const videoFrame = canvas.toDataURL('image/jpeg', 0.9);
          const posterDiv = posterCardRef.current.querySelector('div') as HTMLDivElement;
          if (posterDiv) {
            posterDiv.style.backgroundImage = `url(${videoFrame})`;
            console.log('✅ [BookOfAnswers] 视频帧捕获成功并设为背景');
          }
        }
      }

      // 等待背景更新
      await new Promise(resolve => setTimeout(resolve, 300));

      // 🔥 第四步：使用 html2canvas 生成海报
      const canvas = await html2canvas(posterCardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: true,
        width: 750,
        height: 1334
      });

      console.log('✅ [BookOfAnswers] html2canvas 捕获成功');

      const imageUrl = canvas.toDataURL('image/png', 1.0);
      console.log('✅ [BookOfAnswers] 海报生成成功，长度:', imageUrl.length);

      setPosterImage(imageUrl);
      setGeneratingPoster(false);

      console.log('✅ [BookOfAnswers] 海报遮罩层已显示');
    } catch (err) {
      console.error('❌ [BookOfAnswers] 海报生成失败:', err);
      alert('海报生成失败，请重试或联系管理员');
      setGeneratingPoster(false);
      setShowPoster(false);
    }

    // 🎵 保留音频播放，由父组件控制
    console.log('🎵 [BookOfAnswers] 保留音频播放，由父组件控制');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 book-of-answers-container">
      <div className="book-background-layer">
        <video
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          preload="auto"
          crossOrigin="anonymous"
          className="book-background-video"
          style={{
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
          }}
        >
          <source src="https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/0e1txddh4g17-1772692096278.mp4" type="video/mp4" />
        </video>
        <div className="book-background-overlay" />
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
          style={{
            backgroundColor: 'rgba(235, 200, 98, 0.1)',
            border: '1px solid rgba(235, 200, 98, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ChevronLeft size={24} color="#EBC862" />
        </button>
      )}
      <div className="w-full max-w-md flex flex-col" style={{ height: '100vh', justifyContent: 'space-between', paddingTop: '80px', paddingBottom: '40px', position: 'relative', zIndex: 10 }}>
        <div className="space-y-4 text-center">
          <h2 className="book-title">
            植本觉察
          </h2>
          <p className="book-subtitle">
            {flippedCard === null ? '选择一张卡片，接收指引' : '这是你的方向'}
          </p>
        </div>

        <div className="flex justify-center gap-4" style={{ marginTop: '40px' }}>
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              disabled={flippedCard !== null && flippedCard !== index}
              className={`card-container ${flippedCard === index ? 'flipped' : ''}`}
              style={{
                width: '90px',
                height: '140px',
                perspective: '1000px',
                opacity: flippedCard !== null && flippedCard !== index ? 0.3 : 1,
                transition: 'opacity 0.5s ease',
              }}
            >
              <div className="card">
                {/* Back */}
                <div
                  className="card-face card-back"
                  style={{
                    backgroundColor: 'rgba(2, 10, 9, 0.95)',
                    border: '1px solid #EBC862',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    className="card-back-image"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'url(/src/assets/Gemini_Generated_Image_yz2xltyz2xltyz2x.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: 0,
                      filter: 'brightness(0.85) contrast(1.15)',
                    }}
                  />
                  <div
                    className="golden-glow-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at center, transparent 25%, rgba(2, 10, 9, 0.4) 100%)',
                      zIndex: 1,
                      boxShadow: 'inset 0 0 40px rgba(235, 200, 98, 0.15), inset 0 0 60px rgba(235, 200, 98, 0.1)',
                    }}
                  />
                </div>

                {/* Front */}
                <div
                  className="card-face card-front"
                  style={{
                    background: 'rgba(5, 10, 20, 0.95)',
                    border: '0.5px solid rgba(200, 220, 255, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 16px',
                    boxShadow: '0 0 40px rgba(180, 200, 255, 0.3), 0 0 60px rgba(180, 200, 255, 0.2)',
                    position: 'relative',
                    backdropFilter: 'blur(40px)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '12px',
                      background: 'radial-gradient(circle at center, rgba(200, 220, 255, 0.08) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <p
                    className="wisdom-text"
                  >
                    {selectedWisdom || '静心，答案即将显现'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {flippedCard !== null && (
          <div className="text-center space-y-4" style={{ paddingBottom: '20px' }}>
            <p className="card-hint-text" style={{
              fontSize: '15px',
              marginBottom: '12px',
              textShadow: '0 0 25px rgba(200, 220, 255, 0.5)'
            }}>
              ✨ 接收完成，生成你的专属能量卡片
            </p>
            <button
              id="generate-poster-btn"
              onClick={(e) => handleComplete(e)}
              disabled={generatingPoster}
              className="complete-button"
              style={{
                padding: '14px 40px',
                fontSize: '16px',
                fontWeight: '400',
                background: generatingPoster
                  ? 'linear-gradient(135deg, rgba(200, 220, 255, 0.04) 0%, rgba(180, 200, 255, 0.06) 100%)'
                  : 'linear-gradient(135deg, rgba(200, 220, 255, 0.08) 0%, rgba(180, 200, 255, 0.12) 100%)',
                borderWidth: '1px',
                borderColor: generatingPoster ? 'rgba(200, 220, 255, 0.15)' : 'rgba(200, 220, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(200, 220, 255, 0.2), inset 0 1px 20px rgba(255, 255, 255, 0.1)',
                opacity: generatingPoster ? 0.6 : 1,
                cursor: generatingPoster ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {generatingPoster ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(200, 220, 255, 0.3)',
                    borderTopColor: 'rgba(200, 220, 255, 0.9)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  正在生成能量卡片...
                </span>
              ) : '生成能量卡片'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .book-of-answers-container {
          position: relative;
        }

        .book-title {
          color: rgba(200, 220, 255, 0.95);
          font-size: 28px;
          font-weight: 200;
          letter-spacing: 0.25em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 30px rgba(200, 220, 255, 0.4);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .book-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          font-weight: 200;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .complete-button {
          padding: 12px 36px;
          border-radius: 4px;
          font-weight: 200;
          font-size: 15px;
          letter-spacing: 0.2em;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px) saturate(120%);
          -webkit-backdrop-filter: blur(40px) saturate(120%);
          border: 0.5px solid rgba(200, 220, 255, 0.15);
          color: rgba(200, 220, 255, 0.9);
          font-family: 'Noto Serif SC', serif;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            inset 0 0 20px rgba(180, 200, 255, 0.03),
            0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .complete-button:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(200, 220, 255, 0.25);
          transform: scale(1.05);
          box-shadow:
            inset 0 0 30px rgba(180, 200, 255, 0.05),
            0 6px 30px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(200, 220, 255, 0.15);
        }

        .card-hint-text {
          color: rgba(200, 220, 255, 0.7);
          font-size: 14px;
          font-weight: 200;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 0 20px rgba(200, 220, 255, 0.3);
          animation: hintPulse 2s ease-in-out infinite;
        }

        @keyframes hintPulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .book-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          background-color: #000;
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
          -webkit-overflow-scrolling: touch;
        }

        .book-background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8) contrast(1.1);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .book-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
          pointer-events: none;
        }

        .card-container {
          cursor: pointer;
          perspective: 1200px;
        }

        .card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-container.flipped .card {
          transform: rotateY(180deg);
          transition: transform 1.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }

        .card-front {
          transform: rotateY(180deg);
        }

        .card-container:not(.flipped):hover .card {
          transform: translateY(-6px) scale(1.05);
        }

        .card-back-image {
          animation: goldenPulseGlow 3.42s ease-in-out infinite;
        }

        @keyframes goldenPulseGlow {
          0%, 100% {
            filter: brightness(0.85) contrast(1.15) drop-shadow(0 0 8px rgba(235, 200, 98, 0.2));
          }
          50% {
            filter: brightness(0.95) contrast(1.2) drop-shadow(0 0 16px rgba(235, 200, 98, 0.4));
          }
        }

        .golden-glow-overlay {
          animation: glowPulse 3.42s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: inset 0 0 40px rgba(235, 200, 98, 0.15), inset 0 0 60px rgba(235, 200, 98, 0.1);
          }
          50% {
            box-shadow: inset 0 0 50px rgba(235, 200, 98, 0.2), inset 0 0 70px rgba(235, 200, 98, 0.15);
          }
        }

        .wisdom-text {
          color: rgba(200, 220, 255, 0.95);
          font-size: 13px;
          font-weight: 300;
          line-height: 2;
          text-align: center;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
          text-shadow:
            0 2px 8px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(200, 220, 255, 0.4);
          position: relative;
          z-index: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          animation: wisdomGlow 3s ease-in-out infinite;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: normal;
          max-width: 100%;
          padding: 0 4px;
        }

        @keyframes wisdomGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(200, 220, 255, 0.5), 0 0 30px rgba(180, 200, 240, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(200, 220, 255, 0.7), 0 0 45px rgba(180, 200, 240, 0.4);
          }
        }

        .poster-card-hidden {
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: 750px;
          height: 1334px;
          z-index: -1;
          pointer-events: none;
        }

        .poster-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0, 0, 0, 0.98);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* 🔥 铺满全屏的图片，可直接长按 */
        .poster-image-fullscreen {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          pointer-events: auto;
        }

        /* 🌿 底部引导提示条 */
        .poster-guide-bar {
          position: fixed;
          bottom: 80px;
          left: 0;
          right: 0;
          z-index: 2;
          display: flex;
          justify-content: center;
          padding: 0 20px;
          pointer-events: none;
        }

        .poster-guide-text {
          background: rgba(235, 200, 98, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(235, 200, 98, 0.3);
          padding: 14px 24px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* 🔥 关闭按钮：底部中央，不遮挡图片核心区域 */
        .poster-close-button {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          padding: 12px 40px;
          font-size: 16px;
          font-weight: 400;
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .poster-close-button:hover {
          transform: translateX(-50%) scale(1.05);
          background: rgba(0, 0, 0, 0.8);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
        }

        .poster-close-button:active {
          transform: translateX(-50%) scale(0.95);
        }

        .poster-generating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          color: rgba(200, 220, 255, 0.95);
        }

        .poster-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(200, 220, 255, 0.2);
          border-top-color: rgba(200, 220, 255, 0.9);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* 🎬 隐藏的视频元素（用于捕获视频帧） */}
      <video
        ref={videoRef}
        src={videoBgUrl}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />

      {/* 🔥 隐藏的海报卡片（用于 html2canvas 捕获） */}
      <div ref={posterCardRef} className="poster-card-hidden">
        <div
          style={{
            width: '750px',
            height: '1334px',
            background: '#000000',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 100%)',
            zIndex: 1
          }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
            <h1 style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '56px',
              fontWeight: '300',
              letterSpacing: '0.6em',
              marginBottom: '40px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
              color: '#F7E7CE',
              paddingLeft: '0.6em'
            }}>
              植本觉察
            </h1>

            <div style={{
              backgroundImage: 'url(/0_0_640_N.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '60px 50px',
              borderRadius: '24px',
              border: '2px solid rgba(235, 200, 98, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(235, 200, 98, 0.1)',
              marginBottom: '60px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.75)',
                zIndex: 1
              }} />
              <p style={{
                fontSize: '42px',
                fontWeight: '300',
                lineHeight: '1.8',
                letterSpacing: '0.15em',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Noto Serif SC', serif",
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                position: 'relative',
                zIndex: 2,
                color: '#2c3e50'
              }}>
                {/* 🔥 海报卡片：必须显示真实的高我建议，而非随机文案 */}
                {higherSelfAdvice}
              </p>
            </div>

            <p style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '28px',
              fontWeight: '200',
              letterSpacing: '0.15em',
              opacity: 0.85,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              color: '#F7E7CE',
              marginTop: '20px'
            }}>
              长按分享觉察智慧
            </p>

          </div>
        </div>
      </div>

      {/* 🔥 海报遮罩层（微信长按分享优化） */}
      {showPoster && (
        <div className="poster-overlay">
          {generatingPoster ? (
            <div className="poster-generating">
              <div className="poster-spinner" />
              <p style={{ fontSize: '18px', letterSpacing: '0.1em' }}>正在生成海报...</p>
            </div>
          ) : posterImage ? (
            <>
              {/* 🔥 核心图片：铺满屏幕，可直接长按 */}
              <img
                src={posterImage}
                alt="能量卡片"
                className="poster-image-fullscreen"
                style={{
                  width: '100vw',
                  height: '100vh',
                  objectFit: 'contain',
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  touchAction: 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              />


              {/* 🔥 关闭按钮：移到底部中央，不遮挡图片核心区域 */}
              <button
                className="poster-close-button"
                onClick={() => {
                  setShowPoster(false);
                  setPosterImage(null);
                  if (onComplete) {
                    onComplete();
                  } else {
                    navigate('/share', { state: routeState });
                  }
                }}
              >
                关闭
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
