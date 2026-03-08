# 192kbps 高品质长音频测试指南

## 快速验证清单

### 1. 上传测试（AdminPanel）
1. 访问 `/admin` 页面
2. 上传一个 50-100MB 的 192kbps MP3 文件
3. 观察控制台日志，应显示：
   ```
   🚀 启用分片上传模式 (Chunk Size: 5MB)
   ```
4. 等待上传完成，记录文件的 Supabase Storage URL

### 2. 配置测试（ShareConfigAdmin）
1. 访问 `/admin/share-config` 页面
2. 将上传的音频 URL 粘贴到 "背景音乐URL" 字段
3. 保存配置
4. 确认控制台显示：
   ```
   🌿 配置已同步至云端，前台已实时生效
   ```

### 3. 播放测试（引流页）
1. 访问 `/share?token=xxx` 页面
2. 完成起名流程，进入 GoldenTransition 环节
3. 打开浏览器开发者工具 → Network 标签
4. 观察音频请求，应该看到：
   - **Request Headers**: `Range: bytes=0-xxxxx`
   - **Response Status**: `206 Partial Content`
   - **Response Headers**: `Content-Range: bytes 0-xxxxx/total`
5. 观察控制台日志，应显示：
   ```
   🚀 192kbps 高品质长音频流式播放配置
   📡 Range Requests: ✅ 强制启用（HTTP 206 Partial Content）
   💡 优势: 30分钟 192kbps 大文件无需等待完整下载，秒开播放
   ```

### 4. 性能验证
**预期结果**：
- 音频在 1-2 秒内开始播放（而非等待完整下载）
- Network 标签显示初始下载量远小于文件总大小
- 拖动进度条时，只下载目标位置的数据

**失败标志**：
- 音频需要等待很长时间才开始播放
- Network 显示下载了整个文件
- Response Status 是 `200 OK` 而非 `206 Partial Content`

### 5. 微信兼容性测试
1. 在微信内置浏览器中打开应用
2. 播放大音频文件
3. 确认没有出现微信安全拦截页面
4. 音频能正常播放

---

## 故障排查

### 问题：音频下载整个文件，未使用 Range Requests
**检查**：
1. 确认 `audio.preload` 设置为 `'metadata'` 而非 `'auto'`
2. 检查 Supabase Storage 是否支持 Range Requests（默认支持）
3. 查看浏览器兼容性（所有现代浏览器都支持）

### 问题：微信中无法播放
**检查**：
1. 确认 `audio.crossOrigin = 'anonymous'` 已设置
2. 确认音频 URL 使用的是 Supabase 官方域名
3. 在微信公众平台后台配置 JS 接口安全域名

### 问题：上传失败
**检查**：
1. 文件大小是否超过 100MB
2. 网络连接是否稳定
3. Supabase Storage 配额是否足够

---

## 技术细节

### Range Requests 工作原理
```
浏览器请求：
GET /audio-files/guidance/music.mp3
Range: bytes=0-1048575

服务器响应：
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1048575/104857600
Content-Length: 1048576
```

### 内存占用对比
| 模式 | preload='auto' | preload='metadata' |
|------|----------------|-------------------|
| 初始下载 | 100MB (整个文件) | ~100KB (元数据) |
| 播放启动 | 30-60秒 | 1-2秒 |
| 内存占用 | 100MB+ | 5-10MB (滚动缓冲) |

---

## 总结

所有音频播放路径已优化：
- ✅ AdminPanel: 支持 100MB 上传
- ✅ ShareJournal: 预加载使用 `metadata` 模式
- ✅ GoldenTransition: 播放使用 `metadata` 模式
- ✅ audioManager: 统一的 Range Requests 策略

无论音频来自哪里（`bg_music_url` 或 `audio_files` 表），都享有相同的优化。
