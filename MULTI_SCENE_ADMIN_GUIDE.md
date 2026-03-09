# 多场景配置管理指南

## 功能概览

后台已完整支持多场景独立管理，每个场景都有专属的配置、音频和访问链接。

---

## 访问后台

**地址**: `/admin/share-config`
**密码**: `plantlogic2026`

---

## 核心功能

### 1. 新增场景配置

#### 操作步骤

1. 登录后台后，在左侧场景列表区域点击 **"新建"** 按钮
2. 进入创建模式，右侧显示空白表单

#### 必填字段

| 字段 | 说明 | 示例 | 限制 |
|------|------|------|------|
| **场景标识 (scene_token)** | URL 参数使用的唯一标识 | `meditation01` | 创建后不可修改 |
| **场景名称 (scene_name)** | 管理后台显示的名称 | `冥想疗愈场景` | 可随时修改 |

#### 可选字段

- **场景描述**: 用途说明
- **访问令牌 (daily_token)**: 默认为 `zen2026`，可自定义
- **启用状态**: 默认启用，可切换

---

### 2. 独立绑定音频

每个场景都有独立的音频配置，互不影响。

#### 上传新音频

1. 在 **"背景音乐 URL"** 区域，点击 **"选择文件"** 按钮
2. 选择您的 192kbps MP3 音频文件（最大 100MB）
3. 系统自动显示上传进度（0-100%）
4. 上传成功后，URL 自动填充到表单

**特性**:
- ✅ 支持最大 100MB 文件
- ✅ 推荐使用 192kbps 高品质音频
- ✅ 自动存储到 `audio-files/background-music/` 目录
- ✅ 自动生成公开访问 URL
- ✅ 不会覆盖其他场景的音频

#### 手动输入音频 URL

如果您已有音频 URL，也可以直接输入：

```
https://your-cdn.com/meditation-music.mp3
```

---

### 3. 自动生成专属链接

#### 链接格式

系统采用查询参数格式：

```
{域名}/share/journal?scene={场景标识}&token={访问令牌}
```

#### 示例

**场景 1: zen2026**
```
https://your-domain.com/share/journal?scene=default&token=zen2026
```

**场景 2: meditation01**
```
https://your-domain.com/share/journal?scene=meditation01&token=zen2026
```

**场景 3: healing**
```
https://your-domain.com/share/journal?scene=healing&token=custom123
```

#### 链接显示位置

保存场景后，有两个地方显示链接：

1. **编辑区右上角**: "复制链接" 按钮
2. **页面底部**: 蓝色背景的链接预览区

---

## 完整操作示例

### 示例：创建 meditation01 场景

#### 第一步：点击新建

在左侧场景列表区域，点击 **"新建"** 按钮。

#### 第二步：填写基础信息

```
场景标识: meditation01
场景名称: 冥想疗愈场景
场景描述: 用于深度冥想引导的专属场景
访问令牌: zen2026
启用状态: ✅ 已启用
```

#### 第三步：上传音频

1. 在 **"背景音乐 URL"** 区域点击 **"选择文件"**
2. 选择您的 `meditation-192kbps.mp3` 文件
3. 等待上传完成（显示绿色成功提示）
4. URL 自动填充为：
   ```
   https://{项目ID}.supabase.co/storage/v1/object/public/audio-files/background-music/bg-music-1234567890.mp3
   ```

#### 第四步：配置其他资源（可选）

```
背景视频 URL: https://your-cdn.com/meditation-bg.mp4
卡片背景图 URL: /0_0_640_N.webp
卡片内部背景 URL: /0_0_640_N.webp
```

#### 第五步：保存并获取链接

1. 点击 **"创建场景"** 按钮
2. 系统显示 **"新场景创建成功"** 提示
3. 页面底部自动显示专属链接：
   ```
   https://your-domain.com/share/journal?scene=meditation01&token=zen2026
   ```
4. 点击右上角 **"复制链接"** 按钮，链接已复制到剪贴板

---

## 场景管理功能

### 查看所有场景

左侧场景列表显示所有已创建的场景：

- **场景名称**: 显示名称
- **场景标识**: scene_token（灰色字体）
- **状态指示器**:
  - 🟢 绿色圆点 = 已启用
  - 🔴 红色圆点 = 已禁用

### 编辑场景

1. 在左侧列表点击要编辑的场景
2. 右侧显示该场景的完整配置
3. 修改需要的字段
4. 点击 **"保存配置"** 按钮

**注意**: 场景标识（scene_token）创建后不可修改

### 删除场景

1. 在左侧列表选择要删除的场景
2. 点击右上角 **"删除"** 按钮（红色）
3. 确认删除操作

**限制**: 默认场景（scene_token='default'）不可删除

### 启用/禁用场景

1. 选择要操作的场景
2. 切换 **"启用此场景"** 复选框
3. 点击 **"保存配置"**

禁用后，该场景的链接将无法访问。

---

## 多场景独立性保证

### 音频隔离

- ✅ 每个场景的音频文件独立存储
- ✅ 上传新音频不会覆盖其他场景
- ✅ 删除场景不会影响其他场景的音频

### 配置隔离

- ✅ 每个场景有独立的数据库记录
- ✅ 场景标识（scene_token）唯一约束
- ✅ 修改一个场景不影响其他场景

### 链接独立

- ✅ 每个场景有专属访问链接
- ✅ 通过 URL 参数区分场景
- ✅ 支持自定义访问令牌

---

## 场景对比示例

### 场景 A: zen2026 (默认场景)

```yaml
场景标识: default
场景名称: 默认场景
访问链接: /share/journal?scene=default&token=zen2026
背景音乐: zen-ambient-192kbps.mp3 (30分钟，43MB)
背景视频: cosmos-stars.mp4
用途: 通用禅意引流
```

### 场景 B: meditation01

```yaml
场景标识: meditation01
场景名称: 冥想疗愈场景
访问链接: /share/journal?scene=meditation01&token=zen2026
背景音乐: meditation-guide-192kbps.mp3 (15分钟，21MB)
背景视频: meditation-nature.mp4
用途: 深度冥想引导
```

### 场景 C: healing

```yaml
场景标识: healing
场景名称: 能量疗愈场景
访问链接: /share/journal?scene=healing&token=custom123
背景音乐: healing-frequency-192kbps.mp3 (60分钟，86MB)
背景视频: golden-energy.mp4
用途: 能量疗愈工作坊
```

---

## 技术特性

### 192kbps 高品质音频支持

- **最大文件**: 100MB
- **推荐格式**: MP3
- **比特率**: 192kbps（高保真）
- **播放方式**: 流式播放（无需等待完整下载）
- **播放延迟**: 1-2 秒（即使是 60 分钟大文件）

### HTTP Range Requests

系统自动启用流式播放技术：

```
请求头: Range: bytes=0-xxx
响应码: 206 Partial Content
优势: 边缓冲边播放，秒开体验
```

### 微信端优化

- ✅ 使用 Supabase 认证域名
- ✅ 避免微信安全拦截
- ✅ 支持自动循环播放
- ✅ 内存自动清理

---

## 常见问题

### Q1: 为什么链接格式是 `?scene=xxx` 而不是 `/xxx`？

A: 使用查询参数格式有以下优势：
- ✅ 单页面架构，无需额外路由配置
- ✅ 更灵活的参数组合
- ✅ 更好的缓存策略
- ✅ 更简单的数据库查询逻辑

### Q2: 可以修改场景标识吗？

A: 不可以。场景标识创建后不可修改，这是为了：
- 保证链接的稳定性
- 避免数据库唯一性冲突
- 防止误操作导致链接失效

如果需要更改标识，请创建新场景并删除旧场景。

### Q3: 上传音频后多久可以使用？

A: 立即可用。上传成功后：
1. URL 自动填充到表单
2. 点击"创建场景"或"保存配置"
3. 链接立即生效，音频可播放

### Q4: 音频文件存储在哪里？

A: Supabase Storage 的 `audio-files` bucket：
```
audio-files/
└── background-music/
    ├── bg-music-1234567890.mp3  (zen2026)
    ├── bg-music-2345678901.mp3  (meditation01)
    └── bg-music-3456789012.mp3  (healing)
```

每个文件都有唯一的时间戳命名，避免冲突。

### Q5: 可以同时使用相同的音频吗？

A: 可以。多个场景可以使用相同的音频 URL：
- 上传一次音频
- 复制 URL
- 粘贴到多个场景的配置中

### Q6: 如何确保音频不被覆盖？

A: 系统有多重保护：
1. 每次上传生成唯一文件名（含时间戳）
2. 不同场景的配置独立存储在数据库
3. 删除场景不会删除音频文件（其他场景可能在使用）

---

## 快捷操作

### 快速复制链接

1. **方法一**: 点击右上角 **"复制链接"** 按钮
2. **方法二**: 从页面底部的链接预览区手动复制

### 批量创建场景

如需创建多个场景，重复以下步骤：

```
点击"新建" → 填写信息 → 上传音频 → 保存 → 复制链接
```

### 测试场景

保存后，在新标签页打开链接测试：

```
https://your-domain.com/share/journal?scene=meditation01&token=zen2026
```

检查：
- ✅ 页面是否正常加载
- ✅ 背景音乐是否正确播放
- ✅ 背景视频/图片是否正确显示

---

## 数据库结构

### h5_share_config 表

```sql
CREATE TABLE h5_share_config (
  id uuid PRIMARY KEY,
  scene_token text UNIQUE NOT NULL,        -- 场景唯一标识
  scene_name text NOT NULL,                -- 场景显示名称
  description text,                        -- 场景描述
  is_active boolean DEFAULT true,          -- 启用状态
  daily_token text NOT NULL,               -- 访问令牌
  bg_video_url text,                       -- 背景视频
  bg_music_url text,                       -- 背景音乐
  card_bg_image_url text,                  -- 卡片背景图
  card_inner_bg_url text,                  -- 卡片内部背景
  bg_naming_url text,                      -- 起名页背景
  bg_emotion_url text,                     -- 情绪页背景
  bg_journal_url text,                     -- 日记页背景
  bg_transition_url text,                  -- 过渡页背景
  bg_answer_book_url text,                 -- 答案之书背景
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_h5_share_config_scene_token
  ON h5_share_config(scene_token);
```

---

## 权限说明

### 公开读取

任何人都可以查询场景配置（用于前端页面加载）

### 认证写入

只有通过密码验证的管理员可以：
- ✅ 创建新场景
- ✅ 修改场景配置
- ✅ 删除场景（除默认场景外）

---

## 最佳实践

### 场景命名建议

- ✅ 使用有意义的英文标识：`meditation01`, `healing`, `energy`
- ✅ 避免中文或特殊字符
- ✅ 使用小写字母和数字
- ✅ 简短且易记

### 音频文件建议

- ✅ 使用 192kbps MP3 格式
- ✅ 时长 5-60 分钟为佳
- ✅ 文件大小控制在 100MB 以内
- ✅ 使用循环播放设计（无明显首尾断层）

### 令牌管理建议

- ✅ 定期更换访问令牌
- ✅ 不同场景可使用不同令牌
- ✅ 避免使用过于简单的令牌（如 `123`）

---

**更新时间**: 2026-03-09
**状态**: ✅ 生产就绪
**版本**: 2.0
