# 线上页面未拦截问题诊断报告

## 问题描述
线上 URL: `https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journal?scene=zen&token=zen2026`

**预期行为**: 显示"链接已失效"页面
**实际行为**: 页面仍然可以打开（只显示标题）

---

## 根本原因分析

### 1️⃣ 线上代码版本过旧

**证据**:
- 本地代码已设置 `IS_LINK_DEPRECATED = true` (ShareJournal.tsx:50)
- 线上页面没有立即拦截，说明部署的代码不包含最新的拦截逻辑

**结论**: 线上 Netlify 部署的代码版本早于最新的拦截功能实施

### 2️⃣ 数据库配置缺失

**查询结果**:
```sql
SELECT scene_token, scene_name, is_active, daily_token FROM h5_share_config;
```

**返回数据**:
| scene_token | scene_name | is_active | daily_token |
|------------|-----------|-----------|-------------|
| default    | 默认场景   | true      | 123456      |
| 1234test   | test      | true      | test        |

**问题**:
- 线上访问的是 `scene=zen`，但数据库中没有 `scene_token='zen'` 的配置
- 根据最新的拦截逻辑，缺失的场景应该触发"场景不存在"拦截

**结论**: 如果线上代码已更新，数据库拦截也会生效

---

## 修复方案

### 方案 A：立即拦截（推荐）- 重新部署最新代码

**步骤**:
1. 确认本地代码 `IS_LINK_DEPRECATED = true`
2. 执行构建
   ```bash
   npm run build
   ```
3. 部署到 Netlify
   - 将 `dist/` 目录上传到 Netlify
   - 或者触发 Netlify 自动构建

**效果**:
- ✅ 前端硬开关立即生效
- ✅ 所有访问立即显示失效页面
- ✅ 无需修改数据库

**时间**: 5-10 分钟（构建 + 部署）

---

### 方案 B：通过数据库拦截（仅在代码已部署时有效）

**前提**: 线上代码必须包含 `is_active` 拦截逻辑

**步骤 1**: 创建 `scene=zen` 的配置（设为停用状态）

```sql
INSERT INTO h5_share_config (
  scene_token,
  scene_name,
  description,
  is_active,
  daily_token,
  bg_video_url,
  bg_music_url,
  card_bg_image_url
) VALUES (
  'zen',
  '禅意疗愈',
  '已停用的引流场景',
  false,  -- 关键：设置为停用状态
  'zen2026',
  '',
  '',
  '/0_0_640_N.webp'
)
ON CONFLICT (scene_token)
DO UPDATE SET is_active = false;
```

**效果**:
- ⚠️ 仅在线上代码已包含 `is_active` 拦截逻辑时有效
- ✅ 无需重新部署前端
- ❌ 如果线上代码版本过旧，可能无效

---

### 方案 C：通过后台管理界面（最优雅）

**前提**:
1. 线上代码已包含最新拦截逻辑
2. 线上可以访问 `/admin/share-config`

**步骤**:
1. 访问 `https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/admin/share-config`
2. 输入密码: `plantlogic2026`
3. 点击"新建"按钮
4. 填写配置:
   - 场景标识: `zen`
   - 场景名称: `禅意疗愈`
   - 访问令牌: `zen2026`
   - **关闭 is_active Toggle 开关**（变灰色）
5. 点击"保存配置"

**效果**:
- ✅ 实时生效（1-2 秒）
- ✅ 可视化操作
- ✅ 可随时恢复
- ❌ 依赖线上代码版本

---

## 立即执行方案

### 🚨 紧急推荐：方案 A + 方案 B 双保险

#### 第一步：重新部署最新代码（必须）

```bash
# 1. 确认前端硬开关已激活
grep "IS_LINK_DEPRECATED = true" src/components/ShareJournal.tsx

# 2. 构建生产包
npm run build

# 3. 检查构建结果
ls -lh dist/

# 4. 部署到 Netlify
# - 方式 1: 手动上传 dist/ 目录
# - 方式 2: git push 触发自动构建
# - 方式 3: Netlify CLI 部署

# 5. 验证部署
# 访问线上链接，应立即显示失效页面
```

#### 第二步：创建数据库配置（双保险）

```sql
-- 即使前端硬开关被关闭，数据库拦截也会生效
INSERT INTO h5_share_config (
  scene_token,
  scene_name,
  description,
  is_active,
  daily_token,
  bg_video_url,
  bg_music_url,
  card_bg_image_url,
  bg_home_url,
  bg_naming_url,
  bg_emotion_url,
  bg_journal_url,
  bg_transition_url,
  bg_answer_book_url,
  card_inner_bg_url
) VALUES (
  'zen',
  '禅意疗愈（已停用）',
  '此场景已永久停用',
  false,
  'zen2026',
  '',
  '',
  '/0_0_640_N.webp',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
)
ON CONFLICT (scene_token)
DO UPDATE SET
  is_active = false,
  scene_name = '禅意疗愈（已停用）',
  description = '此场景已永久停用';
```

---

## 验证清单

部署完成后，执行以下验证：

### ✅ 验证 1: 访问线上链接
```
URL: https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journal?scene=zen&token=zen2026

预期结果:
- 显示失效页面
- 内容："链接已随时间流转而失效"
- 品牌引导："请关注'植本逻辑'获取最新能量场入口"
```

### ✅ 验证 2: 控制台日志（F12）
```
预期日志:
🚫 [IS_LINK_DEPRECATED = true] 前端硬开关已激活，全网失效

或者（如果硬开关关闭）:
🚫 [is_active = false] 场景已停用 - 强制拦截
```

### ✅ 验证 3: 网络请求
```
打开 Chrome DevTools > Network 标签

预期:
- 不应该有音频文件加载请求
- 不应该有视频文件加载请求
- 仅有基础的 HTML/CSS/JS 请求
```

### ✅ 验证 4: 资源清理
```
预期:
- 无背景音乐播放
- 无视频播放
- 页面静默
```

---

## 后续监控

### 监控指标
1. **Netlify 构建日志**: 确认最新代码已成功部署
2. **访问日志**: 监控是否还有用户能访问该页面
3. **数据库查询**: 定期检查 `is_active` 字段状态

### 日志查询
```sql
-- 查看所有场景的激活状态
SELECT
  scene_token,
  scene_name,
  is_active,
  updated_at
FROM h5_share_config
ORDER BY updated_at DESC;
```

---

## 常见问题

### Q: 为什么线上代码没有更新？

**A**: 可能的原因：
1. Netlify 自动构建没有触发
2. 构建使用了缓存的旧代码
3. 部署配置指向了错误的分支
4. `.gitignore` 错误地忽略了某些文件

**解决方法**:
- 清除 Netlify 构建缓存
- 手动触发重新部署
- 检查 Git 提交记录

### Q: 部署后还是没有拦截？

**A**: 排查步骤：
1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 使用无痕模式访问
3. 检查 Netlify 部署日志
4. 查看控制台错误信息
5. 验证数据库连接是否正常

### Q: 可以临时恢复访问吗？

**A**: 可以，有两种方式：

**方式 1: 修改前端硬开关**
```typescript
// ShareJournal.tsx:50
const IS_LINK_DEPRECATED = false;  // 改为 false

// 重新构建并部署
npm run build
```

**方式 2: 修改数据库状态**
```sql
UPDATE h5_share_config
SET is_active = true
WHERE scene_token = 'zen';
```

---

## 总结

**当前状态**: ❌ 线上代码未更新，拦截机制未生效

**推荐方案**: 立即重新部署最新代码 + 创建数据库配置（双保险）

**预计时间**: 5-10 分钟

**生效时间**: 部署后立即生效（< 1 秒）

---

## 执行命令速查

```bash
# 1. 确认硬开关状态
grep "IS_LINK_DEPRECATED" src/components/ShareJournal.tsx

# 2. 构建
npm run build

# 3. 验证构建
ls -lh dist/

# 4. 部署（根据实际情况选择）
# Netlify CLI:
netlify deploy --prod

# 或者通过 Git:
git add .
git commit -m "Deploy emergency kill-switch"
git push origin main
```

```sql
-- 5. 创建数据库配置（双保险）
INSERT INTO h5_share_config (scene_token, scene_name, is_active, daily_token, card_bg_image_url)
VALUES ('zen', '禅意疗愈（已停用）', false, 'zen2026', '/0_0_640_N.webp')
ON CONFLICT (scene_token) DO UPDATE SET is_active = false;
```

---

## 文档版本
v1.0 - 2026-03-09
