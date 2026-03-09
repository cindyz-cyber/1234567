# 链接拦截验证指南

## 已修复的路由

### ✅ 新增路由拦截
- `/share/journey` → 现在也会经过 ShareJournal 组件拦截
- `/share/journal` → 原有拦截（已存在）

### 拦截机制状态

#### 🔴 第一重：前端硬开关（最高优先级）
```typescript
// src/components/ShareJournal.tsx:50
const IS_LINK_DEPRECATED = true; ✅ 已激活
```

**影响范围**：
- `/share/journey?*` - 全部拦截
- `/share/journal?*` - 全部拦截
- 无论数据库配置如何，都会被拦截

---

## 需要拦截的 URL

### 1️⃣ 原始问题 URL
```
https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journey?zen2026
```

**拦截原因**: 前端硬开关 = true + 缺少 scene 参数

### 2️⃣ 所有变体都会被拦截
```
/share/journey
/share/journey?token=anything
/share/journey?scene=zen&token=zen2026
```

---

## 部署步骤

```bash
# 1. 已完成构建
npm run build  ✅

# 2. 部署到 Netlify（选择一种方式）

# 方式 A: Git 推送
git add .
git commit -m "Block /share/journey route"
git push origin main

# 方式 B: Netlify 网站手动上传 dist/ 文件夹
```

---

## 验证清单

部署完成后：

1. **清除浏览器缓存**（Ctrl + Shift + Delete）
2. **访问测试 URL**
   ```
   https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journey?zen2026
   ```
3. **预期结果**：
   - ✅ 显示失效页面
   - ✅ 文案："链接已随时间流转而失效"
   - ✅ 无音频/视频播放

4. **检查控制台**（F12）
   ```
   预期日志: 🚫 [IS_LINK_DEPRECATED = true] 前端硬开关已激活，全网失效
   ```

---

## 路由配置

### main.tsx 已更新
```typescript
<Routes>
  <Route path="/share/journal" element={<ShareJournal />} />
  <Route path="/share/journey" element={<ShareJournal />} /> ✅ 新增
  <Route path="/*" element={<App />} />
</Routes>
```

两个路由共享同一套拦截逻辑。

---

## 数据库状态

```sql
SELECT scene_token, is_active FROM h5_share_config WHERE scene_token = 'zen';
```

结果：
- scene_token: zen
- is_active: false ✅（双重保险）

---

## 预计时间

- 部署：2-3 分钟
- CDN 刷新：1-2 分钟
- **总计：3-5 分钟**

---

v1.0 - 2026-03-09
