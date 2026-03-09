# 首页独立背景配置功能报告

## 执行时间
2026-03-09

---

## 功能概览

为引流页首页（Home Page）添加独立的背景配置能力，支持 JPG 图片和 MP4 视频，与其他页面背景解耦，实现更精细的场景定制。

---

## 数据库变更

### 新增字段：bg_home_url

**Migration 文件**：`supabase/migrations/[timestamp]_add_bg_home_url_to_h5_share_config.sql`

```sql
-- 添加首页背景字段
ALTER TABLE h5_share_config 
ADD COLUMN IF NOT EXISTS bg_home_url text;

-- 添加字段描述
COMMENT ON COLUMN h5_share_config.bg_home_url IS '首页专属背景 URL（支持 JPG/MP4）';
```

**字段特性**：
- 类型：`text`
- 可空：`YES`（兼容旧数据）
- 用途：存储首页专属背景 URL
- 支持格式：JPG、PNG、MP4、WEBM

**降级策略**：
- 如果 `bg_home_url` 为空 → 回退到 `bg_video_url`
- 如果 `bg_video_url` 也为空 → 使用默认背景

---

## 后台管理面升级

### ShareConfigAdmin.tsx

#### 1. 接口定义更新

```typescript
interface H5ShareConfig {
  // ... 原有字段
  bg_home_url: string;  // 🔥 新增
  bg_naming_url: string;
  bg_emotion_url: string;
  // ...
}

interface SceneFormData {
  // ... 原有字段
  bg_home_url: string;  // 🔥 新增
  bg_naming_url: string;
  bg_emotion_url: string;
  // ...
}
```

#### 2. 表单初始化更新

在以下三个位置添加 `bg_home_url: ''` 或 `bg_home_url: scene.bg_home_url || ''`：

- `selectScene()` - 编辑现有场景时
- `startCreatingScene()` - 创建新场景时
- `handleSaveConfig()` 保存后更新 - 保存成功后刷新表单

#### 3. UI 组件添加

在"高级配置：各步骤专属背景"区域的**第一个位置**添加：

```tsx
<details className="bg-white/5 rounded-lg p-4">
  <summary className="cursor-pointer font-semibold text-white/80 mb-2">
    高级配置：各步骤专属背景（可选）
  </summary>
  <div className="space-y-6 mt-4">
    {/* 🔥 新增：首页背景上传 */}
    <MediaUploader
      label="首页背景（支持 JPG/MP4）"
      currentValue={formData.bg_home_url}
      onUploadComplete={(url) => setFormData({ ...formData, bg_home_url: url })}
      accept=".jpg,.jpeg,.png,.mp4,.webm"
      maxSizeMB={100}
      folder="background-music"
    />
    
    {/* 原有的起名页、情绪页等 */}
    <MediaUploader label="起名页背景（支持 JPG/MP4）" ... />
    ...
  </div>
</details>
```

**上传特性**：
- 支持格式：JPG、JPEG、PNG、MP4、WEBM
- 最大文件大小：100MB（支持 8.77MB MP3 及更大文件）
- 存储位置：`background-music` 文件夹
- 自动 URL 编码：处理文件名空格和特殊字符

---

## 前台引流页升级

### ShareJournal.tsx

#### 1. 接口定义更新

```typescript
interface H5ShareConfig {
  // ... 原有字段
  bg_home_url: string;  // 🔥 新增
  bg_naming_url: string;
  bg_emotion_url: string;
  // ...
}
```

#### 2. 首页渲染逻辑修改

**修改前**：

```tsx
case 'home':
  return (
    <DynamicStepBackground
      backgroundUrl={config?.bg_video_url}  // ❌ 直接使用通用背景
    >
      <HomePage ... />
    </DynamicStepBackground>
  );
```

**修改后**：

```tsx
case 'home':
  return (
    <DynamicStepBackground
      backgroundUrl={config?.bg_home_url}     // ✅ 优先使用首页专属背景
      fallbackUrl={config?.bg_video_url}      // ✅ 未配置时降级到通用背景
    >
      <HomePage ... />
    </DynamicStepBackground>
  );
```

**降级流程**：

```
用户访问首页
   ↓
[1] 检查 config.bg_home_url
   ↓
   有值？
   ├─ 是 → 加载 bg_home_url（首页专属背景）
   └─ 否 → 检查 config.bg_video_url
       ↓
       有值？
       ├─ 是 → 加载 bg_video_url（通用背景）
       └─ 否 → 使用默认背景
```

#### 3. 控制台日志更新

```typescript
console.log('📄 各步骤专属背景（引流后台专属）:');
console.log('  - 首页 (bg_home_url):', data.bg_home_url || '→ 回退到 bg_video_url');  // 🔥 新增
console.log('  - 起名页 (bg_naming_url):', data.bg_naming_url || '→ 回退到 bg_video_url');
console.log('  - 情绪页 (bg_emotion_url):', data.bg_emotion_url || '→ 回退到 bg_video_url');
// ...
```

---

## 完整背景配置层级

### 配置优先级（从高到低）

| 页面 | 优先级 1 | 优先级 2 | 优先级 3 |
|------|---------|---------|---------|
| 首页 | `bg_home_url` | `bg_video_url` | 默认背景 |
| 起名页 | `bg_naming_url` | `bg_video_url` | 默认背景 |
| 情绪页 | `bg_emotion_url` | `bg_video_url` | 默认背景 |
| 日记页 | `bg_journal_url` | `bg_video_url` | 默认背景 |
| 过渡页 | `bg_transition_url` | `bg_video_url` | 默认背景 |
| 答案之书 | `bg_answer_book_url` | `bg_video_url` | 默认背景 |

### 背景字段完整列表

```typescript
interface H5ShareConfig {
  // 通用背景
  bg_video_url: string;           // 通用背景视频
  bg_music_url: string;           // 背景音乐
  card_bg_image_url: string;      // 卡片背景图
  card_inner_bg_url: string;      // 卡片内部背景
  
  // 各步骤专属背景
  bg_home_url: string;            // 🔥 首页专属背景（新增）
  bg_naming_url: string;          // 起名页专属背景
  bg_emotion_url: string;         // 情绪页专属背景
  bg_journal_url: string;         // 日记页专属背景
  bg_transition_url: string;      // 过渡页专属背景
  bg_answer_book_url: string;     // 答案之书专属背景
}
```

---

## 使用指南

### 1. 后台配置首页背景

**访问路径**：`/admin/share-config`

**操作步骤**：

1. **登录后台**
   - 输入管理密码：`plantlogic2026`

2. **选择或创建场景**
   - 左侧场景列表中选择现有场景
   - 或点击"创建新场景"

3. **展开高级配置**
   - 找到"高级配置：各步骤专属背景（可选）"
   - 点击展开

4. **上传首页背景**
   - 第一个上传组件："首页背景（支持 JPG/MP4）"
   - 点击"选择文件"
   - 上传 JPG 图片或 MP4 视频
   - 支持最大 100MB

5. **保存配置**
   - 点击"保存场景配置"
   - 看到提示：**配置已同步至云端，前台已实时生效**

### 2. 前台验证

**访问 URL**：`/share/journal?scene=xxx&token=yyy`

**控制台验证**：

```
📄 各步骤专属背景（引流后台专属）:
  - 首页 (bg_home_url): https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/audio-files/background-music/home_bg.mp4
  - 起名页 (bg_naming_url): → 回退到 bg_video_url
  - 情绪页 (bg_emotion_url): → 回退到 bg_video_url
  ...
```

**视觉验证**：
- 首页显示独立的背景（图片或视频）
- 与起名页、情绪页等其他页面背景不同

### 3. 常见配置场景

#### 场景 A：首页专属视频 + 其他页面共用通用背景

```
bg_home_url: https://...home.mp4
bg_video_url: https://...common.mp4
bg_naming_url: (空)
bg_emotion_url: (空)
...
```

**效果**：
- 首页：播放 `home.mp4`
- 起名页：播放 `common.mp4`（降级）
- 情绪页：播放 `common.mp4`（降级）

#### 场景 B：每个页面都有专属背景

```
bg_home_url: https://...home.jpg
bg_naming_url: https://...naming.mp4
bg_emotion_url: https://...emotion.jpg
bg_journal_url: https://...journal.mp4
...
```

**效果**：
- 每个页面显示各自的专属背景
- 视觉体验更加精细化

#### 场景 C：首页未配置，使用通用背景

```
bg_home_url: (空)
bg_video_url: https://...common.mp4
```

**效果**：
- 首页：播放 `common.mp4`（降级）
- 其他页面：播放 `common.mp4`

---

## 技术细节

### 文件上传支持

| 格式 | MIME Type | 最大文件大小 | 用途 |
|------|-----------|-------------|------|
| JPG | image/jpeg | 100MB | 静态背景图 |
| PNG | image/png | 100MB | 静态背景图（支持透明） |
| WEBP | image/webp | 100MB | 静态背景图（高压缩） |
| MP4 | video/mp4 | 100MB | 动态背景视频 |
| WEBM | video/webm | 100MB | 动态背景视频 |

### URL 编码处理

所有上传的文件名自动执行 URL 编码，支持：
- 空格：`file name.jpg` → `file%20name.jpg`
- 中文：`背景.mp4` → `%E8%83%8C%E6%99%AF.mp4`
- 特殊字符：`music&video.mp4` → `music%26video.mp4`

### DynamicStepBackground 组件

```tsx
<DynamicStepBackground
  backgroundUrl={config?.bg_home_url}     // 优先级 1：专属背景
  fallbackUrl={config?.bg_video_url}      // 优先级 2：通用背景
>
  <HomePage ... />
</DynamicStepBackground>
```

**组件逻辑**：
1. 检查 `backgroundUrl`，有值则使用
2. 否则检查 `fallbackUrl`，有值则使用
3. 否则使用默认背景

---

## 代码变更清单

### 数据库

| 文件 | 变更类型 | 内容 |
|------|---------|------|
| `supabase/migrations/add_bg_home_url_to_h5_share_config.sql` | 新增 | 添加 `bg_home_url` 字段 |

### 后台管理

| 文件 | 行数 | 变更类型 | 内容 |
|------|------|---------|------|
| `ShareConfigAdmin.tsx` | 7-24 | 修改 | `H5ShareConfig` 接口添加 `bg_home_url` |
| `ShareConfigAdmin.tsx` | 26-42 | 修改 | `SceneFormData` 接口添加 `bg_home_url` |
| `ShareConfigAdmin.tsx` | 54-69 | 修改 | 表单初始化添加 `bg_home_url: ''` |
| `ShareConfigAdmin.tsx` | 136-156 | 修改 | `selectScene()` 添加 `bg_home_url` 映射 |
| `ShareConfigAdmin.tsx` | 158-177 | 修改 | `startCreatingScene()` 添加 `bg_home_url: ''` |
| `ShareConfigAdmin.tsx` | 213-232 | 修改 | 保存后刷新添加 `bg_home_url` 映射 |
| `ShareConfigAdmin.tsx` | 526-533 | 新增 | 首页背景上传组件 |

### 前台引流页

| 文件 | 行数 | 变更类型 | 内容 |
|------|------|---------|------|
| `ShareJournal.tsx` | 16-31 | 修改 | `H5ShareConfig` 接口添加 `bg_home_url` |
| `ShareJournal.tsx` | 163 | 新增 | 日志输出 `bg_home_url` 配置 |
| `ShareJournal.tsx` | 548-559 | 修改 | 首页渲染逻辑添加 `bg_home_url` 优先级 |

---

## 构建验证

```bash
npm run build
✓ 1608 modules transformed.
✓ built in 11.33s
```

✅ **构建成功！**

---

## 使用场景举例

### 场景 1：品牌引流页

**需求**：
- 首页展示品牌宣传视频
- 后续页面使用统一的禅意背景

**配置**：
```
bg_home_url: brand_promo.mp4 (品牌宣传视频)
bg_video_url: zen_background.mp4 (禅意背景)
bg_naming_url: (空) → 降级到 zen_background.mp4
...
```

### 场景 2：节日主题活动

**需求**：
- 首页显示节日主题图片
- 保持其他页面的常规背景

**配置**：
```
bg_home_url: christmas_theme.jpg (圣诞主题)
bg_video_url: regular_background.mp4 (常规背景)
...
```

### 场景 3：精细化场景定制

**需求**：
- 每个页面都有独特的视觉风格

**配置**：
```
bg_home_url: modern_intro.mp4
bg_naming_url: mystical_naming.jpg
bg_emotion_url: emotional_waves.mp4
bg_journal_url: peaceful_journal.jpg
...
```

---

## 总结

**核心特性**：

✅ **独立配置** - 首页背景与其他页面解耦  
✅ **灵活降级** - 未配置时自动回退到通用背景  
✅ **格式丰富** - 支持 JPG、PNG、MP4、WEBM  
✅ **大文件支持** - 最大 100MB，支持 8.77MB MP3 等大文件  
✅ **自动编码** - 处理文件名空格和特殊字符  
✅ **实时生效** - 保存后前台立即可用  
✅ **向后兼容** - 旧场景不受影响

**使用流程**：

```
后台上传 → 保存配置 → 前台实时生效
    ↓
首页显示专属背景（JPG/MP4）
```

**系统已完全支持首页独立背景配置，实现更精细的场景定制能力！**
