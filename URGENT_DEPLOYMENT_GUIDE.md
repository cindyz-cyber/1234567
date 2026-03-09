# 🚨 紧急部署指南 - 拦截失效链接

## 当前状态

### ✅ 已完成
1. **前端硬开关**: `IS_LINK_DEPRECATED = true` （已激活）
2. **数据库配置**: `scene=zen` 已设置为 `is_active = false`
3. **构建测试**: 通过（无错误）

### ❌ 待完成
- **线上部署**: Netlify 需要部署最新代码

---

## 问题分析

### 线上 URL
```
https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journal?scene=zen&token=zen2026
```

### 问题
页面还能打开（只显示标题），没有显示失效页面

### 原因
线上 Netlify 部署的代码版本过旧，不包含最新的三层拦截机制

---

## 双重保险已设置

### 🛡️ 第一重：前端硬开关（需要重新部署）
```typescript
// src/components/ShareJournal.tsx:50
const IS_LINK_DEPRECATED = true;
```

**特性**:
- ✅ 最高优先级
- ✅ 零依赖（无需数据库）
- ✅ 即时生效（部署后立即拦截所有用户）

### 🛡️ 第二重：数据库拦截（已生效）
```sql
-- 已在数据库创建 zen 场景配置
scene_token: zen
scene_name: 禅意疗愈（已停用）
is_active: false  ✅
daily_token: zen2026
```

**特性**:
- ✅ 实时生效（无需重新部署）
- ⚠️ 依赖线上代码包含 is_active 拦截逻辑

---

## 立即部署步骤

### 方式 1: Netlify 手动部署（推荐）

```bash
# 1. 确认本地已构建
npm run build

# 2. 登录 Netlify 网站
# https://app.netlify.com/

# 3. 找到项目: illustrious-concha-e6f2de

# 4. 点击 "Deploys" 标签

# 5. 拖拽 dist/ 文件夹到上传区域

# 6. 等待部署完成（约 1-2 分钟）

# 7. 访问线上链接验证
```

### 方式 2: Netlify CLI 部署

```bash
# 1. 安装 Netlify CLI（如果未安装）
npm install -g netlify-cli

# 2. 登录
netlify login

# 3. 构建
npm run build

# 4. 部署到生产环境
netlify deploy --prod --dir=dist

# 5. 确认部署
# 输入 'y' 确认

# 6. 等待部署完成
# 显示 "Deploy is live!" 即成功
```

### 方式 3: Git 触发自动构建

```bash
# 1. 提交代码
git add .
git commit -m "🚨 URGENT: Activate link deprecation kill-switch"

# 2. 推送到远程仓库
git push origin main

# 3. Netlify 会自动检测到更新并触发构建

# 4. 访问 Netlify 后台查看构建状态
# https://app.netlify.com/sites/illustrious-concha-e6f2de/deploys

# 5. 等待构建完成（约 2-5 分钟）
```

---

## 部署后验证清单

### ✅ 验证 1: 访问线上链接

```
URL: https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journal?scene=zen&token=zen2026
```

**预期结果**:
- 显示失效页面
- 文案: "链接已随时间流转而失效"
- 品牌引导: "请关注'植本逻辑'获取最新能量场入口"
- 无音频/视频播放

### ✅ 验证 2: 控制台日志

按 F12 打开开发者工具，查看 Console 标签

**预期日志**:
```
🚫 [IS_LINK_DEPRECATED = true] 前端硬开关已激活，全网失效
```

或者（如果前端硬开关设置为 false）:
```
🚫 [is_active = false] 场景已停用 - 强制拦截
🛑 场景标识: zen
🛑 场景名称: 禅意疗愈（已停用）
```

### ✅ 验证 3: 网络请求

在 Chrome DevTools > Network 标签

**预期**:
- ❌ 无音频文件加载（无 .mp3 请求）
- ❌ 无视频文件加载（无 .mp4 请求）
- ✅ 仅有基础的 HTML/CSS/JS 请求

### ✅ 验证 4: 测试其他无效链接

```bash
# 测试缺少 scene 参数
https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journal?token=zen2026

# 测试不存在的场景
https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journal?scene=不存在&token=test
```

**预期**: 所有链接都应显示失效页面

---

## 部署完成后的效果

### 前端硬开关 ON（当前状态）
```typescript
const IS_LINK_DEPRECATED = true;
```

**效果**:
- 🔒 所有访问立即拦截
- 🔒 包括数据库中 is_active = true 的场景
- 🔒 全网失效，无一例外

### 如果需要恢复访问

**选项 1: 关闭前端硬开关**
```typescript
// 修改 ShareJournal.tsx:50
const IS_LINK_DEPRECATED = false;

// 重新构建并部署
npm run build
```

**选项 2: 启用数据库配置**
```sql
UPDATE h5_share_config
SET is_active = true
WHERE scene_token = 'zen';
```

**注意**: 如果前端硬开关 = true，即使数据库 is_active = true 也无法访问

---

## 拦截优先级

```
用户访问链接
    ↓
前端硬开关 (IS_LINK_DEPRECATED = true) → 拦截 ✋
    ↓ (如果 false)
获取 URL 参数
    ↓
scene 参数存在？→ 否 → 拦截 ✋
    ↓ (是)
查询数据库
    ↓
查询成功？→ 否 → 拦截 ✋
    ↓ (是)
场景存在？→ 否 → 拦截 ✋
    ↓ (是)
is_active = true？→ 否 → 拦截 ✋
    ↓ (是)
正常访问 ✅
```

---

## 当前拦截状态总结

| 拦截层级 | 状态 | 部署情况 | 生效时间 |
|---------|------|---------|----------|
| 前端硬开关 | ✅ 已激活 | ⏳ 待部署 | 部署后立即生效 |
| is_active 状态 | ✅ false | ✅ 已生效 | 已实时生效 |
| 场景不存在拦截 | ✅ 已实施 | ⏳ 待部署 | 部署后立即生效 |

---

## 故障排查

### 问题: 部署后还是能访问

**排查步骤**:

1. **清除浏览器缓存**
   ```
   Chrome: Ctrl + Shift + Delete
   选择: 全部时间 + 所有数据
   ```

2. **使用无痕模式**
   ```
   Chrome: Ctrl + Shift + N
   ```

3. **检查 Netlify 部署状态**
   ```
   访问: https://app.netlify.com/sites/illustrious-concha-e6f2de/deploys
   确认最新部署状态为 "Published"
   ```

4. **检查部署时间戳**
   ```
   查看 Netlify 部署时间是否是最新的
   ```

5. **查看控制台错误**
   ```
   F12 > Console 标签
   查看是否有 JavaScript 错误
   ```

### 问题: Netlify 构建失败

**可能原因**:
- 依赖安装失败
- TypeScript 类型错误
- 环境变量缺失

**解决方法**:
```bash
# 本地测试构建
npm run build

# 查看构建日志
# 在 Netlify 后台查看详细错误信息
```

---

## 紧急联系方式

如果遇到问题，请检查以下资源：

1. **本地构建日志**
   ```bash
   npm run build > build.log 2>&1
   cat build.log
   ```

2. **Netlify 部署日志**
   ```
   https://app.netlify.com/sites/illustrious-concha-e6f2de/deploys
   点击最新部署 > 查看 "Deploy log"
   ```

3. **数据库状态**
   ```sql
   SELECT * FROM h5_share_config WHERE scene_token = 'zen';
   ```

---

## 快速命令速查

```bash
# 构建
npm run build

# Netlify CLI 部署
netlify deploy --prod --dir=dist

# Git 部署
git add . && git commit -m "Deploy" && git push

# 验证数据库
# (在 Supabase SQL Editor 执行)
SELECT scene_token, is_active FROM h5_share_config;
```

---

## 预期时间线

| 步骤 | 时间 |
|------|------|
| 构建 | 10-15 秒 |
| 上传到 Netlify | 30-60 秒 |
| Netlify 处理 | 30-60 秒 |
| CDN 缓存清除 | 1-2 分钟 |
| **总计** | **3-5 分钟** |

---

## 最终确认

部署完成后，请确认以下所有项目：

- [ ] 访问线上链接，显示失效页面
- [ ] 控制台日志正确输出拦截信息
- [ ] 无音频/视频加载
- [ ] 其他无效链接也被拦截
- [ ] 页面样式正常显示

**全部确认后，即可认为部署成功！**

---

## 文档版本
v1.0 - 2026-03-09
