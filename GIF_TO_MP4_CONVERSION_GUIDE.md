# GIF 转换为高画质 MP4 指南

## 当前状态
✅ 已将起名页背景从 GIF 替换为 MP4 视频格式（使用 `energy-field.mp4`）

## 如何将您的 GIF 转换为高画质 MP4

### 方法 1：在线转换（最简单）

1. **CloudConvert**（推荐）
   - 访问：https://cloudconvert.com/gif-to-mp4
   - 上传您的 GIF：`u8192925825_A_hyper-realistic_deep_space_cosmic_background_li_b84b7c1b-df4c-415a-915f-eb3a46e28f88_1.gif`
   - 设置选项：
     - 质量：100%（最高）
     - 编码：H.264
     - 码率：8-10 Mbps（高画质）
   - 下载转换后的 MP4

2. **EZGIF**
   - 访问：https://ezgif.com/gif-to-mp4
   - 上传 GIF
   - 选择输出质量：High
   - 下载 MP4

### 方法 2：FFmpeg 命令行（最高质量）

如果您安装了 FFmpeg：

```bash
ffmpeg -i input.gif \
  -movflags faststart \
  -pix_fmt yuv420p \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -b:v 8M \
  output.mp4
```

参数说明：
- `-crf 18`：质量参数（0-51，数值越小质量越高，18 为高画质）
- `-b:v 8M`：码率 8 Mbps（确保高清晰度）
- `-preset slow`：慢速编码（质量优先）

### 方法 3：Adobe Media Encoder / HandBrake

- 导入 GIF
- 选择 H.264 编码
- 设置码率：8-10 Mbps
- 导出为 MP4

## 转换完成后的部署步骤

1. **重命名文件**（可选）
   ```
   cosmic-space.mp4
   ```

2. **上传到项目**
   ```
   /public/assets/videos/cosmic-space.mp4
   ```

3. **生成海报图（可选）**
   从视频中提取一帧作为海报：
   ```bash
   ffmpeg -i cosmic-space.mp4 -ss 00:00:01 -vframes 1 cosmic-space-poster.jpg
   ```

4. **更新代码**
   修改 `src/components/NamingRitual.tsx`：
   ```tsx
   <video
     autoPlay
     loop
     muted
     playsInline
     poster="/assets/videos/cosmic-space-poster.jpg"
     className="absolute inset-0 w-full h-full object-cover"
     style={{
       WebkitTransform: 'translateZ(0)',
       transform: 'translateZ(0)',
       backfaceVisibility: 'hidden',
       WebkitBackfaceVisibility: 'hidden',
       willChange: 'transform',
       filter: 'contrast(1.25) brightness(1.35) saturate(1.3)',
       opacity: 1,
       animation: 'cosmicFadeIn 1.5s ease-out'
     }}
   >
     <source src="/assets/videos/cosmic-space.mp4" type="video/mp4" />
   </video>
   ```

## 视频优化建议

### 文件大小控制
- **目标大小**：5-10 MB（移动端友好）
- **如果文件过大**：
  - 降低码率：6-8 Mbps
  - 缩短视频长度：10-15 秒循环
  - 适当降低分辨率：1920x1080 或 1280x720

### 移动端优化
- 确保包含 `muted` 属性（移动端自动播放必需）
- 使用 `playsInline` 防止全屏播放
- 添加 `poster` 海报图（加载前显示）
- 使用硬件加速（已在代码中配置）

## 当前使用的视频
- **文件**：`/assets/videos/energy-field.mp4`
- **大小**：9.7 MB
- **效果**：深空宇宙能量场动画

如果您转换好了自己的 GIF 为 MP4，只需替换视频路径即可。
