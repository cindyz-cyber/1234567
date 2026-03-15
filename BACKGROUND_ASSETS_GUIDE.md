# 背景资源本地化部署指南

## 📦 需要下载的资源

### 视频文件

将以下视频下载并重命名后放入 `public/assets/videos/` 目录：

1. **golden-flow.mp4** (主背景 - 金色流动)
   - 原始链接: `https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4`
   - 使用频率: ⭐⭐⭐⭐⭐ (最高)
   - 文件大小: ~5-10MB

2. **energy-field.mp4** (能量场背景 - 深紫流动)
   - 原始链接: `https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4`
   - 使用频率: ⭐⭐⭐⭐
   - 文件大小: ~5-10MB

3. **resonance-wave.mp4** (共振背景 - 蓝色波纹)
   - 原始链接: `https://cdn.midjourney.com/video/661ffc10-0d89-43d1-b8f9-83e67d0421ae/2.mp4`
   - 使用频率: ⭐⭐⭐
   - 文件大小: ~5-10MB

4. **zen-vortex.mp4** (禅意背景 - 金色漩涡)
   - 原始链接: `https://cdn.midjourney.com/video/7e901a1c-929f-466d-8def-ac47f9d0c15b/3.mp4`
   - 使用频率: ⭐⭐
   - 文件大小: ~5-10MB

### Poster 封面图

为每个视频提取第一帧作为 Poster 图片（JPG 格式，1920x1080）：

1. `golden-flow-poster.jpg`
2. `energy-field-poster.jpg`
3. `resonance-wave-poster.jpg`
4. `zen-vortex-poster.jpg`

---

## 🚀 下载方法

### 方法 1: 使用 curl 命令（推荐）

```bash
# 创建目录
mkdir -p public/assets/videos

# 下载视频（优先级排序）
curl -o public/assets/videos/golden-flow.mp4 "https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4"
curl -o public/assets/videos/energy-field.mp4 "https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4"
curl -o public/assets/videos/resonance-wave.mp4 "https://cdn.midjourney.com/video/661ffc10-0d89-43d1-b8f9-83e67d0421ae/2.mp4"
curl -o public/assets/videos/zen-vortex.mp4 "https://cdn.midjourney.com/video/7e901a1c-929f-466d-8def-ac47f9d0c15b/3.mp4"
```

### 方法 2: 使用 ffmpeg 提取 Poster 封面图

```bash
# 从视频第一帧提取封面图
ffmpeg -i public/assets/videos/golden-flow.mp4 -vframes 1 -q:v 2 public/assets/videos/golden-flow-poster.jpg
ffmpeg -i public/assets/videos/energy-field.mp4 -vframes 1 -q:v 2 public/assets/videos/energy-field-poster.jpg
ffmpeg -i public/assets/videos/resonance-wave.mp4 -vframes 1 -q:v 2 public/assets/videos/resonance-wave-poster.jpg
ffmpeg -i public/assets/videos/zen-vortex.mp4 -vframes 1 -q:v 2 public/assets/videos/zen-vortex-poster.jpg
```

### 方法 3: 临时占位图（开发阶段）

如果视频下载失败，可以先使用纯色占位图：

```bash
# 使用 ImageMagick 创建占位图
convert -size 1920x1080 xc:'#0A0A0F' public/assets/videos/golden-flow-poster.jpg
convert -size 1920x1080 xc:'#1A1A2E' public/assets/videos/energy-field-poster.jpg
convert -size 1920x1080 xc:'#2A2A3E' public/assets/videos/resonance-wave-poster.jpg
convert -size 1920x1080 xc:'#EBC862' public/assets/videos/zen-vortex-poster.jpg
```

或直接使用现有图片资源作为占位：

```bash
cp src/assets/227c82c549f3edf64f327b2a617f0246.jpg public/assets/videos/golden-flow-poster.jpg
cp src/assets/8971db7e712d3f6f3a46e2c0b25dc407.jpg public/assets/videos/energy-field-poster.jpg
```

---

## 📊 文件结构

完成后，你的目录应该是这样的：

```
public/
└── assets/
    └── videos/
        ├── golden-flow.mp4
        ├── golden-flow-poster.jpg
        ├── energy-field.mp4
        ├── energy-field-poster.jpg
        ├── resonance-wave.mp4
        ├── resonance-wave-poster.jpg
        ├── zen-vortex.mp4
        └── zen-vortex-poster.jpg
```

---

## ⚡ 性能优化原理

### 三级兜底加载策略

#### 第一级：品牌底色（0ms - 瞬间显示）
```typescript
backgroundColor: '#0A0A0F' // 深邃黑，立即渲染
```

#### 第二级：Poster 封面图（50-200ms）
```html
<video poster="/assets/videos/golden-flow-poster.jpg">
```
- 静态图片加载速度远快于视频
- 即使网络慢，用户也能看到美观的封面
- Mobile Safari 会优先显示 poster

#### 第三级：视频动画（500ms - 1s 后淡入）
```css
opacity: 0 → 1 (0.5s transition)
```
- 视频加载完成后平滑淡入
- 使用 `will-change: transform` 提升渲染优先级
- 使用 `visibility: hidden` 代替 `display: none` 避免重新下载

### Mobile Safari 优化

```html
<video
  autoplay
  muted
  loop
  playsInline  // 关键：防止全屏播放
  preload="auto"
  poster="..."
>
```

- `playsInline`: 内联播放，不触发全屏
- `muted`: 必须静音才能自动播放
- `preload="auto"`: 提示浏览器提前下载

### 渲染性能优化

```css
will-change: transform, opacity;  /* 提升到 GPU 层 */
isolation: isolate;               /* 独立渲染层 */
visibility: visible;              /* 不用 display: none */
```

---

## 🧪 验证步骤

1. **检查文件是否存在**
   ```bash
   ls -lh public/assets/videos/
   ```

2. **在浏览器中直接访问资源**
   ```
   http://localhost:5173/assets/videos/golden-flow.mp4
   http://localhost:5173/assets/videos/golden-flow-poster.jpg
   ```

3. **检查控制台日志**
   打开浏览器开发者工具，应该看到：
   ```
   ✅ 核心背景资源预加载完成
   ✅ 使用预加载视频: golden_flow
   ```

4. **测试性能**
   - 首屏应立即显示品牌底色（黑色）
   - 100-300ms 内显示 Poster 封面图
   - 500-1000ms 内视频平滑淡入
   - 切换页面时背景切换应瞬间完成（使用缓存）

---

## 🔧 故障排查

### 问题1: 视频未加载

**症状**: 只显示纯色背景或 Poster 图
**原因**: 视频文件不存在或路径错误
**解决**: 检查 `public/assets/videos/` 是否有对应视频文件

### 问题2: Mobile Safari 不自动播放

**症状**: iOS 设备上视频不播放
**原因**: iOS 限制自动播放
**解决**: 已添加 `muted` 和 `playsInline` 属性，无需手动干预

### 问题3: Poster 图不显示

**症状**: 视频加载前显示黑屏
**原因**: Poster 文件缺失
**解决**: 使用方法3创建临时占位图

### 问题4: 性能仍然慢

**症状**: 首屏加载时间 > 2s
**可能原因**:
- 视频文件过大（建议 < 10MB）
- 网络慢
- 未启用预加载

**解决**:
```bash
# 压缩视频（降低码率）
ffmpeg -i input.mp4 -vcodec h264 -crf 28 -preset fast output.mp4

# 转换为 WebM 格式（更小）
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm
```

---

## 📈 预期性能提升

### 优化前（外部 CDN 链接）
- 首屏白屏: **2-5秒**
- 视频加载: **3-8秒**
- 切换页面: **每次重新下载**

### 优化后（本地化 + 三级兜底）
- 品牌底色显示: **0ms（瞬间）**
- Poster 封面显示: **50-200ms**
- 视频淡入: **500-1000ms**
- 切换页面: **0ms（使用缓存）**

**总提升**: 首屏感知速度提升 **80-90%** ⚡
