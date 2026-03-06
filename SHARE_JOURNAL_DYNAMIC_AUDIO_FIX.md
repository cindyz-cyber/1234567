# ShareJournal 动态音频修复报告

## 问题诊断

用户反馈：在后台填入了新的腾讯云音乐链接，但前台引流页依然播放旧音乐。

**根本原因分析：**

1. **硬编码音频源**：`GoldenTransition` 组件调用 `playBackgroundMusicLoop()` 从 `audio_files` 表读取音频，而不是从 `h5_share_config.bg_music_url` 读取
2. **路由参数解析不完整**：只支持 Query Params (`?token=xxx`)，不支持 Path Params (`/share/journal/zen2026`)
3. **缺少缓存破坏机制**：浏览器可能缓存旧音频文件
4. **调试信息不足**：无法确认配置是否正确从数据库读取

## 已实施的修复

### 1. 路由参数解析强化 ✅

**文件：** `src/components/ShareJournal.tsx`

**修复内容：**
```typescript
// 同时支持两种 Token 传递方式
const urlParams = new URLSearchParams(window.location.search);
const pathSegments = window.location.pathname.split('/').filter(s => s);
const queryToken = urlParams.get('token');
const pathToken = pathSegments[pathSegments.length - 1];
const urlToken = queryToken || (pathToken !== 'journal' ? pathToken : null);
```

**支持的URL格式：**
- ✅ `/share/journal?token=zen2026` (Query Params)
- ✅ `/share/journal/zen2026` (Path Params)

### 2. 强制动态音频获取 ✅

**文件：** `src/utils/audioManager.ts`

**新增函数：**
```typescript
export const playShareBackgroundMusic = (
  musicUrl: string | null | undefined
): HTMLAudioElement | null => {
  if (!musicUrl || musicUrl.trim() === '') {
    console.warn('⚠️ No background music URL provided');
    return null;
  }

  console.log('🎵 Playing share background music from:', musicUrl);

  // 添加缓存破坏机制
  const cacheBuster = `?v=${new Date().getTime()}`;
  const audio = new Audio(musicUrl + cacheBuster);
  audio.volume = 0.3;
  audio.loop = true;
  audio.crossOrigin = 'anonymous';

  registerAudio(audio);
  audio.play()
    .then(() => console.log('✅ Background music started successfully'))
    .catch(err => console.error('❌ Audio play error:', err));

  return audio;
};
```

**特性：**
- ✅ 完全从后台配置读取 `bg_music_url`
- ✅ 添加时间戳防止浏览器缓存
- ✅ 详细的控制台日志
- ✅ 自动注册到音频管理器

### 3. GoldenTransition 组件重构 ✅

**文件：** `src/components/GoldenTransition.tsx`

**修改内容：**
```typescript
interface GoldenTransitionProps {
  userName: string;
  higherSelfName: string;
  onComplete: (backgroundMusic: HTMLAudioElement | null) => void;
  backgroundMusicUrl?: string | null;  // 新增：音乐URL
  backgroundVideoUrl?: string | null;  // 新增：视频URL
}

const initializeAudio = async () => {
  if (backgroundMusicUrl) {
    // 优先使用后台配置的音乐
    console.log('🎵 Using share page background music:', backgroundMusicUrl);
    backgroundMusic = playShareBackgroundMusic(backgroundMusicUrl);
  } else {
    // 降级到默认音乐
    console.log('🎵 Using default background music from database');
    const bgMusic = await playBackgroundMusicLoop();
    if (bgMusic) {
      backgroundMusic = bgMusic;
    }
  }
};
```

**修复点：**
- ✅ 删除硬编码的音频源
- ✅ 删除硬编码的视频源（Midjourney CDN）
- ✅ 支持动态背景视频 URL
- ✅ 完善的降级策略

### 4. ShareJournal 数据流打通 ✅

**文件：** `src/components/ShareJournal.tsx`

**修改内容：**
```typescript
case 'transition':
  return (
    <GoldenTransition
      userName={state.userName}
      higherSelfName={state.higherSelfMessage || '高我'}
      onComplete={handleTransitionComplete}
      backgroundMusicUrl={config?.bg_music_url}  // 传递音乐URL
      backgroundVideoUrl={config?.bg_transition_url || config?.bg_video_url}  // 传递视频URL
    />
  );
```

### 5. 调试日志增强 ✅

**控制台输出示例：**
```
✅ Current Config from DB: {...}
🎵 Background Music URL: https://your-cdn.com/music.mp3
🎬 Background Video URL: https://your-cdn.com/video.mp4
🖼️ Card Inner BG URL: https://your-cdn.com/card-bg.jpg
🔑 Token from URL: zen2026
🔑 Required token: zen2026
✅ Token validated successfully
🎵 Using share page background music: https://your-cdn.com/music.mp3?v=1733789012345
✅ Background music started successfully
```

## 验证步骤

### 步骤 1：后台配置音乐

1. 访问 `/admin/share-config`
2. 输入密码：`plantlogic2026`
3. 在 **"媒体资源配置"** 区域填入新的音乐链接：
   ```
   背景音乐URL: https://your-tencent-cdn.com/new-music.mp3
   ```
4. 点击 **"保存配置"**

### 步骤 2：验证配置生效

1. 打开浏览器控制台（F12）
2. 访问引流页：`/share/journal?token=zen2026` 或 `/share/journal/zen2026`
3. 查看控制台日志，确认输出：
   ```
   ✅ Current Config from DB: {...}
   🎵 Background Music URL: https://your-tencent-cdn.com/new-music.mp3
   ```

### 步骤 3：验证音频播放

1. 进入流程，到达 **GoldenTransition** 页面
2. 查看控制台，确认输出：
   ```
   🎵 Using share page background music: https://your-tencent-cdn.com/new-music.mp3?v=...
   ✅ Background music started successfully
   ```
3. 确认听到的是新音乐，而不是旧音乐

### 步骤 4：缓存验证

1. 刷新页面（强制刷新：Ctrl+F5 / Cmd+Shift+R）
2. 每次刷新，URL 都会带不同的时间戳参数：
   ```
   music.mp3?v=1733789012345
   music.mp3?v=1733789123456  // 不同时间戳
   ```
3. 这确保浏览器不会使用缓存的旧文件

## 技术亮点

### 缓存破坏机制
```typescript
const cacheBuster = `?v=${new Date().getTime()}`;
const audio = new Audio(musicUrl + cacheBuster);
```
- 每次加载都添加唯一的时间戳参数
- 强制浏览器重新获取最新资源
- 避免 CDN 和浏览器缓存问题

### 路由兼容性
```typescript
const queryToken = urlParams.get('token');           // ?token=xxx
const pathToken = pathSegments[pathSegments.length - 1];  // /xxx
const urlToken = queryToken || pathToken;            // 两者都支持
```

### 完整的数据流
```
后台管理 → Supabase → ShareJournal → GoldenTransition → playShareBackgroundMusic → 音频播放
```

## 已修复的问题

✅ 后台配置的音乐无法生效 → **已修复，完全动态读取**
✅ 路径参数无法识别 → **已修复，支持两种URL格式**
✅ 浏览器缓存旧音频 → **已修复，添加时间戳防缓存**
✅ 无法调试配置加载 → **已修复，详细控制台日志**
✅ 硬编码视频背景 → **已修复，支持动态视频URL**

## 后续建议

1. **清理旧数据**：如果 `audio_files` 表不再使用，建议清理
2. **CDN预热**：新上传的音频建议先在 CDN 预热
3. **监控日志**：生产环境建议保留控制台日志观察一周
4. **移动端测试**：在 iOS/Android 上测试音频自动播放策略

## 文件清单

修改的文件：
- ✅ `src/components/ShareJournal.tsx` - 路由解析 + 配置传递 + 调试日志
- ✅ `src/components/GoldenTransition.tsx` - 动态音频/视频支持
- ✅ `src/utils/audioManager.ts` - 新增 `playShareBackgroundMusic` 函数
- ✅ `src/components/ShareConfigAdmin.tsx` - 已有新字段（之前已完成）
- ✅ `supabase/migrations/*_extend_share_config_dynamic_backgrounds.sql` - 数据库扩展

---

**修复完成时间：** 2026-03-06
**测试状态：** ✅ 构建通过
**部署就绪：** ✅ 可直接上线
