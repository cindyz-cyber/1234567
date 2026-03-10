# 🚨 KILL SWITCH 部署指南

## 版本信息

- **版本号**: v-kill-share-journey-2026-03-10
- **部署时间**: 2026-03-10
- **目的**: 物理阻断所有 `/share/journey` 旧路径访问

---

## 三层拦截机制

### 1️⃣ 路由层拦截 (main.tsx)

```typescript
// main.tsx 中已配置路由黑名单
<Route path="/share/*" element={<DeprecatedRoute />} />
<Route path="/admin/share-config" element={<DeprecatedRoute />} />
```

**生效条件**: 新部署版本
**拦截效果**: 显示"链接已失效"页面

---

### 2️⃣ 应用层拦截 (App.tsx)

```typescript
// App.tsx 中的全局拦截器
const BLOCKED_PATHS = ['/share/journey', '/share/journal', '/admin/share-config'];
const isBlockedPath = BLOCKED_PATHS.some(blocked => currentPath.includes(blocked));

// 强制渲染 BlockedPage 组件
if (isBlockedPath) {
  return <BlockedPage />;
}
```

**生效条件**: 任何访问 App 组件的请求
**拦截效果**:
- 停止所有数据库请求
- 阻止初始化逻辑
- 显示专业拦截页面

---

### 3️⃣ Service Worker 拦截 (sw.js)

```javascript
// sw.js 中的物理拦截
const BLOCKED_PATHS = ['/share/journey', '/share/journal', '/admin/share-config'];

// 返回 410 Gone 状态码
event.respondWith(
  new Response(JSON.stringify({ error: 'DEPRECATED_PATH_BLOCKED' }), {
    status: 410,
    statusText: 'Gone'
  })
);
```

**生效条件**: 浏览器缓存的旧版本
**拦截效果**:
- 清理所有僵尸缓存
- 直接返回 410 Gone 响应
- 不从缓存提取任何旧数据

---

## 部署步骤

### 步骤 1: 下载构建包

下载文件: `dist-kill-switch-2026-03-10.tar.gz`

### 步骤 2: 解压

```bash
tar -xzf dist-kill-switch-2026-03-10.tar.gz
```

### 步骤 3: 上传到 Netlify

**方式 A - 拖拽上传 (推荐)**:
1. 访问 Netlify Dashboard
2. 选择 Sites
3. 拖拽 `dist` 文件夹到部署区域

**方式 B - CLI 上传**:
```bash
netlify deploy --prod --dir=dist
```

### 步骤 4: 验证部署

访问以下旧路径，确认被拦截:

```
https://your-domain.com/share/journey
https://your-domain.com/share/journal
https://your-domain.com/admin/share-config
```

**预期结果**:
- 显示黑色背景拦截页面
- 提示"此链接已永久失效"
- 控制台输出 `🚨 [SW KILL SWITCH] 拦截已废弃路径`

---

## 测试清单

### ✅ 必须验证的场景

1. **新用户访问旧链接**
   - [ ] 访问 `/share/journey?token=xxx`
   - [ ] 确认显示拦截页面

2. **老用户浏览器缓存**
   - [ ] 清除浏览器缓存前访问
   - [ ] Service Worker 应返回 410 Gone
   - [ ] 控制台显示拦截日志

3. **直接 URL 访问**
   - [ ] 在浏览器输入完整旧路径
   - [ ] 确认路由层拦截生效

4. **旧 Netlify 预览链接**
   - [ ] 访问之前的 Preview Deploy URL
   - [ ] 确认 Service Worker 拦截

---

## 旧链接处理方案

### 已废弃路径列表

```
/share/journey
/share/journal
/admin/share-config
```

### 新路径迁移

| 旧路径 | 新路径 | 说明 |
|--------|--------|------|
| `/share/journey?token=xxx` | `/flow/{scene}?token=xxx` | 使用新 Flow 系统 |
| `/admin/share-config` | `/admin/flow-config` | 使用新后台管理 |

---

## 紧急回滚

如果需要紧急回滚:

1. 恢复之前的部署版本
2. 或修改 `sw.js` 中的 `BLOCKED_PATHS = []`
3. 重新构建并部署

---

## 技术细节

### Service Worker 版本管理

当前版本: `v-kill-share-journey-2026-03-10`

更新 Service Worker 版本会:
- 自动清理所有旧缓存
- 强制用户下载新版本资源
- 立即激活新拦截逻辑

### 拦截日志

在浏览器控制台查看拦截日志:

```javascript
// Service Worker 拦截
🚨 [SW KILL SWITCH] 拦截已废弃路径: /share/journey

// App.tsx 拦截
🚨 [App] 检测到黑名单路径，停止初始化: /share/journey
🚨 [App.loadProfile] 黑名单路径，拒绝执行数据库请求
🚨 [App] 渲染拦截页面: /share/journey
```

---

## 常见问题

### Q: 为什么需要三层拦截？

**A**: 多层防御确保无论用户从哪个入口进入，都能被拦截:
- 路由层：拦截新部署版本的请求
- 应用层：拦截任何意外进入 App 的请求
- SW 层：拦截浏览器缓存的旧版本

### Q: 旧 Netlify 预览链接还能访问吗？

**A**: 不能。Service Worker 会在所有版本中拦截黑名单路径，即使是旧的 Preview Deploy 也会被阻断。

### Q: 如何确认 Service Worker 已更新？

**A**:
1. 打开浏览器 DevTools
2. Application > Service Workers
3. 查看版本号是否为 `v-kill-share-journey-2026-03-10`

---

## 部署后验证脚本

在浏览器控制台执行:

```javascript
// 检查 Service Worker 版本
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Active SW:', reg.active?.scriptURL);
});

// 测试拦截路径
const testPaths = [
  '/share/journey',
  '/share/journal',
  '/admin/share-config'
];

testPaths.forEach(path => {
  fetch(path).then(res => {
    console.log(`${path}: ${res.status} ${res.statusText}`);
  });
});
```

**预期输出**:
```
/share/journey: 410 Gone
/share/journal: 410 Gone
/admin/share-config: 410 Gone
```

---

## 联系信息

如有问题，请联系技术团队。

---

## 更新记录

- **2026-03-10**: 首次部署 KILL SWITCH 版本
- 三层拦截机制全部启用
- Service Worker 版本升级至 v-kill-share-journey-2026-03-10
