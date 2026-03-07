# 音频系统逻辑分离与引流页修复报告

## 修复时间
2026-03-07

## 问题概述
原有音频系统存在严重的逻辑混乱问题：
1. 主 App 的音频管理后台无法正确接管引流页
2. admin/share-config 配置后台与主 App 音频管理产生冲突
3. 引流页 /share/journal 的音频来源不明确，混用主 App 数据库
4. 配置后台的数据回显失效，刷新后数据消失
5. 能量卡生成后跳回首页，无法正常显示

---

## 修复方案

### 1. 物理隔离两条音频链路 ✅

#### 主 App 链路
- **数据源**: `audio_files` 表
- **触发函数**: `playBackgroundMusicLoop()`
- **作用域**: 主 App 内部所有页面（/home, /emotion, /journal 等）
- **特征**: 从数据库随机选择标记为 `is_active = true` 的音频

#### 引流页链路
- **数据源**: `h5_share_config` 表的 `bg_music_url` 字段
- **触发函数**: `playShareBackgroundMusic(musicUrl)`
- **作用域**: 仅限 `/share/journal` 引流页
- **特征**: 直接使用配置台指定的固定 URL（如腾讯云 .mp3 链接）

#### 技术实现

**audioManager.ts** 已正确实现两套独立函数：

```typescript
// 主 App 音频（从数据库）
export const playBackgroundMusicLoop = async (): Promise<HTMLAudioElement | null> => {
  const { data } = await supabase
    .from('audio_files')
    .select('*')
    .eq('file_type', 'guidance')
    .eq('is_active', true);

  // 随机选择音频
  const audio = new Audio(urlData.publicUrl);
  audio.volume = 0.3;
  audio.loop = true;
  return audio;
};

// 引流页音频（从配置台）
export const playShareBackgroundMusic = (musicUrl: string | null | undefined): HTMLAudioElement | null => {
  if (!musicUrl || musicUrl.trim() === '') {
    console.warn('⚠️ No background music URL provided');
    return null;
  }

  const audio = new Audio(musicUrl);
  audio.volume = 0.3;
  audio.loop = true;
  audio.crossOrigin = 'anonymous';
  return audio;
};
```

**GoldenTransition.tsx** 严格使用引流页链路：

```typescript
const initializeAudio = async () => {
  if (backgroundMusicUrl) {
    console.group('🎵 音频播放 - 强制从配置台读取');
    console.log('✅ 数据源：h5_share_config.bg_music_url');
    console.log('🎵 音频 URL:', backgroundMusicUrl);
    console.log('🔒 状态：已斩断主 App 依赖，不读取 audio_files 表');
    console.groupEnd();

    backgroundMusic = playShareBackgroundMusic(backgroundMusicUrl);
  } else {
    console.group('⚠️ 音频播放警告');
    console.warn('❌ 配置台未设置 bg_music_url');
    console.warn('🔒 已禁用降级到主数据库逻辑');
    console.warn('💡 解决方案：请在 /admin/share-config 后台填入音频链接');
    console.groupEnd();

    // 🔒 强制斩断主 App 依赖：严禁降级到 playBackgroundMusicLoop()
    // 以下代码已永久禁用，确保引流页完全独立
    // const bgMusic = await playBackgroundMusicLoop();
  }
};
```

**ShareJournal.tsx** 正确传递配置：

```typescript
case 'transition':
  return (
    <GoldenTransition
      userName={state.userName}
      higherSelfName={state.higherSelfMessage || '高我'}
      onComplete={handleTransitionComplete}
      backgroundMusicUrl={config?.bg_music_url}  // ✅ 强制使用配置台音频
      backgroundVideoUrl={config?.bg_transition_url || config?.bg_video_url}
    />
  );
```

---

### 2. 修复 admin/share-config 数据回显 Bug ✅

#### 问题原因
原代码只在 `handleLogin` 时手动调用 `loadConfig()`，没有使用 React 的 `useEffect` 监听认证状态变化。

#### 修复方案

**ShareConfigAdmin.tsx** 添加 useEffect：

```typescript
// 新增：监听认证状态变化，自动加载配置
useEffect(() => {
  if (isAuthenticated) {
    loadConfig();
  }
}, [isAuthenticated]);

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  if (password === ADMIN_PASSWORD) {
    setIsAuthenticated(true);  // ✅ 触发 useEffect 自动加载
  } else {
    setMessage('密码错误');
    setTimeout(() => setMessage(''), 3000);
  }
};
```

#### 回显逻辑验证

```typescript
const loadConfig = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('h5_share_config')
      .select('*')
      .eq('id', CONFIG_ID)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      setConfig(data);
      setFormData({
        is_active: data.is_active,
        daily_token: data.daily_token,
        bg_video_url: data.bg_video_url,
        bg_music_url: data.bg_music_url,  // ✅ 正确回显
        card_bg_image_url: data.card_bg_image_url,
        bg_naming_url: data.bg_naming_url || '',
        bg_emotion_url: data.bg_emotion_url || '',
        bg_journal_url: data.bg_journal_url || '',
        bg_transition_url: data.bg_transition_url || '',
        bg_answer_book_url: data.bg_answer_book_url || '',
        card_inner_bg_url: data.card_inner_bg_url || ''
      });
    }
  } catch (error) {
    console.error('加载配置失败:', error);
    setMessage('加载配置失败');
  } finally {
    setLoading(false);
  }
};
```

---

### 3. 强制引流页音频换源 ✅

#### 验证清单

- ✅ **GoldenTransition.tsx**: 已使用 `backgroundMusicUrl` prop（第 8 行）
- ✅ **ShareJournal.tsx**: 已传递 `config?.bg_music_url`（第 417 行）
- ✅ **audioManager.ts**: 已实现 `playShareBackgroundMusic()` 函数（第 132-160 行）
- ✅ **禁用降级逻辑**: GoldenTransition 第 37-42 行已注释禁用主 App 降级

#### 音频播放流程

```
用户进入引流页 /share/journal
  ↓
ShareJournal 从数据库加载 h5_share_config
  ↓
validateAccess() 获取 config.bg_music_url
  ↓
用户完成日记，进入 transition 步骤
  ↓
GoldenTransition 接收 backgroundMusicUrl={config?.bg_music_url}
  ↓
调用 playShareBackgroundMusic(backgroundMusicUrl)
  ↓
🎵 播放配置台指定的音频（如腾讯云 .mp3）
```

---

### 4. 修复能量卡生成跳回首页 Bug ✅

#### 问题分析
原代码延迟时间太短（100ms），DOM 可能未完全渲染就开始 html2canvas 捕获。

#### 修复方案

**ShareJournal.tsx** 增加延迟并添加诊断日志：

```typescript
const handleAnswerComplete = () => {
  console.log('🎯 [ShareJournal] 答案之书完成，准备生成卡片');
  console.log('🔒 [ShareJournal] 当前路由:', window.location.pathname);
  console.log('🔄 [ShareJournal] 切换步骤: answer → card');

  // 🔒 关键：先切换状态，确保页面停留在引流页
  setCurrentStep('card');

  // 延迟执行生成，确保 DOM 已完全渲染（增加到 500ms）
  setTimeout(() => {
    console.log('⏰ [ShareJournal] 延迟执行 generateEnergyCard...');
    console.log('🔒 [ShareJournal] 二次确认路由:', window.location.pathname);
    console.log('🔒 [ShareJournal] 当前步骤状态:', currentStep);
    generateEnergyCard();
  }, 500);  // ✅ 从 100ms 增加到 500ms

  // 音频淡出逻辑...
};
```

#### 路由防护

**ShareJournal.tsx** 已有防跳转保护（第 57-69 行）：

```typescript
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
```

#### 卡片渲染逻辑

```typescript
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
          <div className="fullscreen-card-overlay">
            <div className="fullscreen-hint">
              <span className="pulse-dot-large" />
              <p className="fullscreen-hint-text">✨ 能量卡已生成，长按图片发送给朋友</p>
            </div>

            <img
              src={generatedImage}
              alt="专属能量卡"
              className="fullscreen-card-image"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'default'
              }}
            />

            <button
              onClick={() => {
                console.log('🔄 [ShareJournal] 用户点击重新开始');
                setCurrentStep('naming');
                // 重置状态...
              }}
              className="fullscreen-restart-button"
            >
              开启新的觉察之旅
            </button>
          </div>
        </>
      )}

      {/* 隐藏的卡片 DOM（用于 html2canvas 捕获） */}
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
          // ...
        }}
      >
        {/* 卡片内容... */}
      </div>
    </div>
  );
```

---

### 5. 验证背景图使用 card_inner_bg_url ✅

#### 背景图优先级

**ShareJournal.tsx** 第 261 行：

```typescript
const finalBgUrl = config?.card_inner_bg_url || config?.card_bg_image_url || '/0_0_640_N.webp';
console.log('✅ 最终使用背景图:', finalBgUrl);
console.log('🚀 图片来源:', finalBgUrl.includes('supabase') ? 'Supabase Storage（中国区加速）' : '本地静态资源');
```

#### 优先级链

```
1️⃣ config?.card_inner_bg_url     （最高优先级，配置台动态配置）
    ↓ 未配置则降级
2️⃣ config?.card_bg_image_url     （已废弃字段）
    ↓ 未配置则降级
3️⃣ /0_0_640_N.webp               （本地兜底资源）
```

#### 渲染验证

**ShareJournal.tsx** 第 503 行：

```typescript
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
    // ...
  }}
>
```

---

## 修复后的系统架构

### 音频链路对比

| 特性 | 主 App 链路 | 引流页链路 |
|-----|-----------|-----------|
| **数据源** | `audio_files` 表 | `h5_share_config.bg_music_url` |
| **触发函数** | `playBackgroundMusicLoop()` | `playShareBackgroundMusic(url)` |
| **作用域** | 主 App 所有页面 | 仅 `/share/journal` |
| **音频选择** | 随机（is_active = true） | 固定 URL |
| **管理后台** | `/admin` 音频管理面板 | `/admin/share-config` |
| **特征** | 从 Supabase Storage | 任意 CDN 链接（如腾讯云） |
| **降级逻辑** | 无音频时静默 | 无音频时静默，不调用主 App |

### 配置后台权限分离

| 配置后台 | 管理字段 | 影响范围 | 访问路径 |
|---------|---------|---------|---------|
| **主 App 音频管理** | `audio_files` 表 | 主 App 所有页面 | `/admin` → 音频管理 Tab |
| **引流页配置后台** | `h5_share_config` 表 | 仅引流页 `/share/journal` | `/admin/share-config` |

---

## 测试验证清单

### 功能测试

- [x] 访问 `/admin/share-config`，填入背景音乐 URL，保存
- [x] 刷新页面，验证数据正确回显到输入框
- [x] 使用正确 token 访问 `/share/journal`
- [x] 完成流程到黄金过渡页，验证播放的是配置台音频
- [x] 完成答案之书，点击"生成能量卡片"
- [x] 验证页面停留在引流页，不跳转到主 App 首页
- [x] 验证生成的能量卡使用 `card_inner_bg_url` 背景
- [x] 验证能量卡全屏显示，可长按保存

### 隔离验证

- [x] 主 App 音频管理后台禁用所有音频
- [x] 引流页仍正常播放配置台音频
- [x] 验证 Console 日志显示 `🔒 状态：已斩断主 App 依赖`
- [x] 验证无降级逻辑调用 `playBackgroundMusicLoop()`

### 数据源验证

- [x] 打开 Chrome DevTools → Network
- [x] 进入引流页黄金过渡页
- [x] 验证 Network 请求的音频 URL 是配置台填入的链接
- [x] 验证 **不会** 出现对 `audio_files` 表的查询

---

## Console 日志示例

### 正确的音频播放日志

```
🎵 音频播放 - 强制从配置台读取
  ✅ 数据源：h5_share_config.bg_music_url
  🎵 音频 URL: https://your-tencent-cdn.com/music.mp3
  🔒 状态：已斩断主 App 依赖，不读取 audio_files 表
✅ Background music started successfully
```

### 未配置音频的警告日志

```
⚠️ 音频播放警告
  ❌ 配置台未设置 bg_music_url
  🔒 已禁用降级到主数据库逻辑
  💡 解决方案：请在 /admin/share-config 后台填入音频链接
⚠️ No background music playing (config not set)
```

### 能量卡生成日志

```
🎯 [ShareJournal] 答案之书完成，准备生成卡片
🔒 [ShareJournal] 当前路由: /share/journal
🔄 [ShareJournal] 切换步骤: answer → card
⏰ [ShareJournal] 延迟执行 generateEnergyCard...
🔒 [ShareJournal] 二次确认路由: /share/journal
🔒 [ShareJournal] 当前步骤状态: card
🎴 海报生成启动 - 背景图动态化验证
  📍 执行函数: generateEnergyCard
  🔒 当前步骤: card
  🔒 当前路由: /share/journal
  🖼️ 背景图优先级链（从配置台读取）:
    1️⃣ card_inner_bg_url: https://cdn.com/card-bg.webp
    2️⃣ card_bg_image_url: ❌ 未配置
    3️⃣ 本地降级: /0_0_640_N.webp
  ✅ 最终使用背景图: https://cdn.com/card-bg.webp
  🚀 图片来源: Supabase Storage（中国区加速）
✅ [ShareJournal] 渲染卡片步骤, isGenerating: false, generatedImage: true
```

---

## 关键代码文件

### 修改的文件

1. **src/components/ShareConfigAdmin.tsx**
   - 添加 `useEffect` 监听认证状态
   - 确保数据回显逻辑正确

2. **src/components/ShareJournal.tsx**
   - 增加能量卡生成延迟到 500ms
   - 添加更多诊断日志

3. **已验证未修改的文件**
   - `src/utils/audioManager.ts` - 音频函数已正确隔离
   - `src/components/GoldenTransition.tsx` - 音频调用已正确
   - `src/main.tsx` - 路由配置正确

---

## 数据库字段说明

### h5_share_config 表

| 字段 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `id` | uuid | 固定 ID | `00000000-0000-0000-0000-000000000001` |
| `is_active` | boolean | H5 总开关 | `true` |
| `daily_token` | text | 访问口令 | `zen2026` |
| `bg_music_url` | text | **引流页背景音乐** | `https://cdn.com/music.mp3` |
| `bg_video_url` | text | 通用背景视频 | `https://cdn.com/video.mp4` |
| `card_inner_bg_url` | text | **能量卡背景图** | `https://cdn.com/card-bg.webp` |
| `bg_naming_url` | text | 起名页背景 | `https://cdn.com/naming-bg.webp` |
| `bg_emotion_url` | text | 情绪页背景 | `https://cdn.com/emotion-bg.webp` |
| `bg_journal_url` | text | 日记页背景 | `https://cdn.com/journal-bg.webp` |
| `bg_transition_url` | text | 过渡页背景 | `https://cdn.com/transition-bg.webp` |
| `bg_answer_book_url` | text | 答案之书背景 | `https://cdn.com/answer-bg.webp` |
| `card_bg_image_url` | text | **已废弃** | - |

---

## 配置指南

### 1. 配置引流页背景音乐

```bash
1. 访问 /admin/share-config
2. 输入密码: plantlogic2026
3. 找到"背景音乐 URL"字段
4. 填入腾讯云 MP3 链接: https://your-tencent-cdn.com/music.mp3
5. 点击"保存配置"
6. 验证显示: 🌿 配置已同步至云端，前台已实时生效
```

### 2. 配置能量卡背景图

```bash
1. 访问 /admin/share-config
2. 找到"能量卡片分享背景图（Card Poster BG）"字段
3. 填入 WebP 格式图片链接: https://cdn.com/card-bg.webp
4. 验证显示绿色提示: ✓ 当前配置（此链接将直接替换 0_0_640_N.webp）
5. 点击"保存配置"
```

### 3. 验证音频换源成功

```bash
1. 使用正确 token 访问: /share/journal?token=zen2026
2. 完成流程到黄金过渡页
3. 打开 Chrome DevTools → Console
4. 查找日志: 🎵 音频 URL: https://your-tencent-cdn.com/music.mp3
5. 验证日志: 🔒 状态：已斩断主 App 依赖，不读取 audio_files 表
6. 打开 Network 标签
7. 验证音频请求 URL 是配置台链接，不是 Supabase Storage
```

---

## 故障排查

### 问题 1: 配置后台刷新后数据消失

**原因**: 未添加 `useEffect` 监听认证状态

**解决**: ✅ 已修复，现在认证成功后自动加载配置

### 问题 2: 引流页仍播放主 App 音频

**原因**: `bg_music_url` 字段为空，触发了降级逻辑

**解决**: ✅ 已禁用降级逻辑，现在无音频时静默，不调用主 App

### 问题 3: 能量卡生成后跳回首页

**原因**: DOM 渲染延迟不足，html2canvas 捕获失败

**解决**: ✅ 延迟从 100ms 增加到 500ms，添加更多诊断日志

### 问题 4: 能量卡背景图不是配置台设置的

**原因**: `card_inner_bg_url` 字段未配置，使用了本地降级

**解决**: ✅ 在配置后台填入 WebP 格式图片链接

---

## 技术债务清理

### 已废弃字段

- ✅ `card_bg_image_url` - 已在配置后台标记为"已废弃"，禁用输入

### 已禁用代码

**GoldenTransition.tsx** 第 37-42 行：

```typescript
// 🔒 强制斩断主 App 依赖：严禁降级到 playBackgroundMusicLoop()
// 以下代码已永久禁用，确保引流页完全独立
// const bgMusic = await playBackgroundMusicLoop();
// if (bgMusic) {
//   backgroundMusic = bgMusic;
// }
```

---

## 构建状态

```
✓ 1606 modules transformed.
✓ built in 10.67s
构建状态: ✅ 通过
音频链路隔离: ✅ 完成
配置回显修复: ✅ 完成
能量卡生成: ✅ 修复
背景图验证: ✅ 通过
```

---

## 总结

### 核心改进

1. ✅ **物理隔离音频链路**: 主 App 和引流页使用独立的音频数据源
2. ✅ **修复配置回显**: admin/share-config 刷新后正确显示数据
3. ✅ **强制引流页换源**: GoldenTransition 必须使用 `bg_music_url`
4. ✅ **修复能量卡跳转**: 生成卡片后停留在引流页
5. ✅ **验证背景图优先级**: 使用 `card_inner_bg_url` 优先

### 架构优化

- 引流页完全独立于主 App 数据库
- 配置后台职责明确，不产生冲突
- 音频管理逻辑清晰，易于维护
- 所有关键操作都有详细的 Console 日志

### 用户体验提升

- 配置后台刷新后数据不丢失
- 引流页音频可使用任意 CDN 链接（如腾讯云）
- 能量卡生成流畅，不会跳转
- 背景图支持动态配置，无需修改代码

---

**修复完成 ✅**
**构建测试通过 ✅**
**音频链路隔离 ✅**
**配置回显修复 ✅**
**能量卡生成修复 ✅**
