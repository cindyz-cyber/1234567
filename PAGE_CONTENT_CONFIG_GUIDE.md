# 页面文案配置系统使用指南

## 功能概述

页面文案配置系统允许你通过后台管理界面动态修改引流页面的所有文字内容，无需修改代码即可实现文案的个性化定制。

---

## 核心特性

- **数据驱动**：所有文案存储在数据库，支持实时更新
- **多场景支持**：不同场景可以配置不同的文案内容
- **后台可视化编辑**：简洁的管理界面，实时预览字符数
- **自动降级**：未配置时自动使用默认文案
- **性能优化**：内存缓存机制（5分钟），减少数据库查询

---

## 数据库结构

### `page_content_config` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| scene_token | text | 场景标识（关联 h5_share_config） |
| page_name | text | 页面名称（home, naming, emotion, journal, answer, card） |
| content_key | text | 内容键名（welcome_text, subtitle, button_text 等） |
| content_value | text | 实际显示的文字内容 |
| description | text | 配置项说明 |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

### 唯一约束

每个场景的每个页面的每个内容键只能有一条记录：
```
UNIQUE (scene_token, page_name, content_key)
```

---

## 使用流程

### 1. 访问后台管理

访问管理后台页面：
```
http://你的域名/admin
```

点击右上角「页面文案配置」按钮。

### 2. 选择场景

在顶部输入框中输入场景标识（scene_token），例如：
- `default` - 默认场景
- `1234test` - 自定义场景

### 3. 编辑文案

系统会按页面分组显示所有可配置的文案项：

#### 首页 (home)
- `welcome_text` - 首页欢迎语
- `subtitle` - 首页副标题
- `start_button` - 开始按钮文字

#### 起名页 (naming)
- `title` - 起名页标题
- `name_label` - 姓名输入框标签
- `birthdate_label` - 生日选择标签
- `next_button` - 下一步按钮文字

#### 情绪扫描 (emotion)
- `title` - 情绪扫描页标题
- `subtitle` - 情绪扫描页副标题
- `next_button` - 继续按钮文字

#### 日记页 (journal)
- `title` - 日记页标题
- `placeholder` - 文本框占位符
- `voice_hint` - 语音输入提示
- `voice_listening` - 聆听中提示
- `submit_button` - 提交按钮文字

#### 答案之书 (answer)
- `title` - 答案之书标题
- `subtitle` - 答案之书副标题
- `generate_button` - 生成按钮文字

#### 能量卡片 (card)
- `title` - 卡片标题
- `journal_section_title` - 日记部分标题
- `advice_section_title` - 建议部分标题
- `footer_brand` - 底部品牌名
- `footer_tagline` - 底部标语
- `share_hint` - 分享提示
- `close_button` - 关闭按钮
- `restart_button` - 重新开始按钮

### 4. 保存修改

编辑完成后，点击右上角「保存所有修改」按钮。

系统会显示成功提示：
```
✅ 成功保存 XX 条文案配置
```

### 5. 验证效果

访问引流页面链接：
```
https://你的域名/share/journal?scene=你的场景标识&token=访问令牌
```

你修改的文案会立即生效！

---

## 默认文案配置

系统已预置 `default` 场景的所有默认文案，你可以：

1. **直接使用默认配置**：创建新场景时，先使用默认场景的配置
2. **修改默认配置**：在后台编辑 `default` 场景的文案
3. **复制到新场景**：在数据库中复制记录并修改 `scene_token`

---

## 技术实现

### 前端加载流程

```typescript
// 1. ShareJournal 组件初始化时加载所有页面文案
const pages = ['home', 'naming', 'emotion', 'journal', 'answer', 'card'];
for (const pageName of pages) {
  contents[pageName] = await getPageContent(sceneToken, pageName);
}

// 2. 将文案传递给子组件
<InnerWhisperJournal content={pageContents.journal} />

// 3. 子组件使用文案
<h1>{content.title || '内在的低语'}</h1>
```

### 缓存机制

```typescript
// 缓存时长：5分钟
const CACHE_DURATION = 5 * 60 * 1000;

// 首次加载从数据库读取
// 5分钟内重复访问使用内存缓存
// 5分钟后自动刷新
```

### 降级策略

未配置时自动使用内置默认值：
```typescript
function getDefaultContent(pageName: string) {
  const defaults = {
    journal: {
      title: '内在的低语',
      placeholder: '在此记录你内心深处的声音...',
      // ...
    }
  };
  return defaults[pageName] || {};
}
```

---

## 常见问题

### Q1: 修改后不生效？

**原因**：缓存未过期

**解决方案**：
1. 等待5分钟让缓存自动过期
2. 或刷新页面清除浏览器缓存
3. 或在代码中调用 `clearContentCache(sceneToken)`

### Q2: 如何为新场景配置文案？

**方法1**：通过后台界面
1. 在「场景标识」输入框中输入新的 scene_token
2. 如果未找到配置，系统会显示默认值
3. 修改文案后点击保存

**方法2**：通过数据库
```sql
-- 复制 default 场景的配置到新场景
INSERT INTO page_content_config (scene_token, page_name, content_key, content_value, description)
SELECT '新场景标识', page_name, content_key, content_value, description
FROM page_content_config
WHERE scene_token = 'default'
ON CONFLICT (scene_token, page_name, content_key)
DO UPDATE SET
  content_value = EXCLUDED.content_value;
```

### Q3: 如何批量修改文案？

使用 SQL 直接更新：
```sql
UPDATE page_content_config
SET content_value = '新的文字'
WHERE scene_token = 'default'
  AND content_key = 'footer_brand';
```

### Q4: 如何恢复默认文案？

**方法1**：在后台重新输入默认值

**方法2**：删除记录让系统使用内置默认值
```sql
DELETE FROM page_content_config
WHERE scene_token = 'your_scene'
  AND page_name = 'journal'
  AND content_key = 'title';
```

### Q5: 支持多语言吗？

目前不直接支持，但可以通过创建不同的场景来实现：
- `default-zh` - 中文
- `default-en` - 英文
- `default-ja` - 日文

---

## 最佳实践

### 1. 文案命名规范

- 使用下划线命名法：`welcome_text`, `submit_button`
- 保持一致性：所有按钮都用 `_button` 后缀
- 描述性强：一眼就能看出用途

### 2. 文案长度控制

- 标题：建议 2-8 个字
- 按钮：建议 2-6 个字
- 副标题：建议 8-20 个字
- 提示文字：建议 10-30 个字

### 3. 场景管理

建议为不同的营销活动创建独立场景：
- `202603-spring` - 春季活动
- `vip-only` - VIP 专属
- `partner-abc` - 合作伙伴 ABC

### 4. 测试流程

修改文案后的测试步骤：
1. ✅ 在后台保存
2. ✅ 清除浏览器缓存
3. ✅ 访问引流页面
4. ✅ 检查所有文案是否正确
5. ✅ 测试不同设备（手机、平板、电脑）

---

## API 文档

### `getPageContent(sceneToken, pageName)`

获取指定场景和页面的文案配置。

**参数**：
- `sceneToken: string` - 场景标识
- `pageName: string` - 页面名称

**返回值**：
```typescript
{
  welcome_text: '亲爱的师兄们，大家好',
  subtitle: '欢迎来到觉察之旅',
  start_button: '开始今日觉察之旅'
}
```

**示例**：
```typescript
const journalContent = await getPageContent('default', 'journal');
console.log(journalContent.title); // '内在的低语'
```

### `clearContentCache(sceneToken?)`

清除文案缓存。

**参数**：
- `sceneToken?: string` - 可选，指定场景。不传则清除所有缓存

**示例**：
```typescript
// 清除指定场景缓存
clearContentCache('default');

// 清除所有缓存
clearContentCache();
```

---

## 相关文件

- `supabase/migrations/20260310000001_create_page_content_config.sql` - 数据库迁移
- `src/components/PageContentAdmin.tsx` - 后台管理界面
- `src/components/AdminPanel.tsx` - 管理后台路由
- `src/utils/pageContentService.ts` - 文案加载服务
- `src/components/ShareJournal.tsx` - 引流页面主组件
- `src/components/InnerWhisperJournal.tsx` - 日记页组件（示例）

---

## 更新日志

### v1.0.0 (2026-03-10)

- ✅ 创建 `page_content_config` 数据库表
- ✅ 实现后台文案配置管理界面
- ✅ 前端页面支持从数据库加载文案
- ✅ 添加缓存机制优化性能
- ✅ 支持多场景配置
- ✅ 预置默认文案

---

## 技术支持

如有问题，请提供以下信息：

1. 场景标识 (scene_token)
2. 页面名称 (page_name)
3. 具体的配置键 (content_key)
4. 浏览器控制台截图
5. 预期效果 vs 实际效果

---

**功能完成时间**: 2026-03-10
**版本**: v1.0.0
