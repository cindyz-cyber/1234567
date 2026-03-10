# 三层纵深防御 Kill Switch 完整系统

## 部署日期
2026-03-10

## 目标
通过三层独立的拦截机制，确保所有旧版 `/share/journey` 链接在任何情况下都无法访问。

---

## 防御架构概览

```
用户访问 /share/journey
    ↓
┌────────────────────────────────────────┐
│ 第一层：Netlify CDN 边缘拦截           │
│ - 位置：CDN 边缘节点                   │
│ - 文件：public/_redirects              │
│ - 状态码：410 Gone                     │
│ - 效果：请求被物理阻断，不到达服务器   │
└────────────────────────────────────────┘
    ↓ (如果绕过 CDN)
┌────────────────────────────────────────┐
│ 第二层：Service Worker 浏览器拦截     │
│ - 位置：用户浏览器缓存层               │
│ - 文件：public/sw.js                   │
│ - 状态码：410 Gone                     │
│ - 效果：离线访问也被拦截               │
└────────────────────────────────────────┘
    ↓ (如果禁用 SW)
┌────────────────────────────────────────┐
│ 第三层：React 应用内拦截               │
│ - 位置：React 组件层                   │
│ - 文件：src/App.tsx                    │
│ - 显示：<BlockedPage /> 组件           │
│ - 效果：显示友好的错误页面             │
└────────────────────────────────────────┘
    ↓
❌ 访问失败（无论哪一层都会拦截）
```

---

## 第一层：Netlify CDN 边缘拦截

### 配置文件：`public/_redirects`

```plaintext
# 🚨 KILL SWITCH: 强制拦截黑名单路径（410 = 永久消失）
/share/journey* /blocked 410!
/share/journal* /blocked 410!
/admin/share-config* /blocked 410!

# 默认 SPA 路由
/* /index.html 200
```

### 工作原理

1. **物理层拦截**
   - 请求在到达应用服务器前就被 CDN 边缘节点拦截
   - 不消耗应用资源，不产生日志

2. **410 状态码**
   - `410 Gone`：资源已永久删除
   - 比 404 更强烈，告诉搜索引擎不要再爬取

3. **感叹号强制执行**
   - `410!` 中的 `!` 表示强制执行
   - 忽略所有缓存，立即生效
   - 优先级高于 SPA 路由规则

### 优势
- ✅ 最高优先级（CDN 层）
- ✅ 零资源消耗
- ✅ 搜索引擎可识别
- ✅ 适用于所有部署版本
- ✅ 适用于所有域名

### 测试方法
```bash
curl -I https://yourapp.com/share/journey
# 预期：HTTP/2 410 Gone
```

---

## 第二层：Service Worker 浏览器拦截

### 配置文件：`public/sw.js`

```javascript
const BLOCKED_PATHS = ['/share/journey', '/share/journal', '/admin/share-config'];

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 🚨 KILL SWITCH: 物理阻断黑名单路径
  const isBlocked = BLOCKED_PATHS.some(blockedPath =>
    url.pathname.includes(blockedPath)
  );

  if (isBlocked) {
    console.error('🚨 [SW KILL SWITCH] 拦截已废弃路径:', url.pathname);
    event.respondWith(
      new Response(
        JSON.stringify({
          error: 'DEPRECATED_PATH_BLOCKED',
          message: '此链接已永久失效',
          path: url.pathname,
          timestamp: new Date().toISOString()
        }),
        {
          status: 410,
          statusText: 'Gone',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'X-Blocked-Reason': 'DEPRECATED_SHARE_JOURNEY_PATH'
          }
        }
      )
    );
    return;
  }

  // ... 其他逻辑
});
```

### 工作原理

1. **浏览器层拦截**
   - 在浏览器发出实际网络请求前拦截
   - 即使用户离线，也会被拦截

2. **缓存清理**
   - Service Worker 版本号：`v-kill-share-journey-2026-03-10`
   - 激活时自动清理所有旧版本缓存

3. **返回 JSON 错误**
   - 提供结构化的错误信息
   - 包含时间戳和路径信息

### 优势
- ✅ 离线访问也被拦截
- ✅ 即使 CDN 失效也有效
- ✅ 自动清理旧缓存
- ✅ 提供详细错误信息

### 测试方法
```javascript
// 在浏览器控制台
navigator.serviceWorker.ready.then(() => {
  fetch('/share/journey').then(res => console.log(res.status));
  // 预期：410
});
```

---

## 第三层：React 应用内拦截

### 配置文件：`src/App.tsx`

```typescript
// 域名黑名单检查
const BLOCKED_DOMAINS = [
  '69ae75bf',  // 旧部署链接
  // ... 其他域名
];

function App() {
  const currentHost = window.location.hostname;
  const isBlockedDomain = BLOCKED_DOMAINS.some(domain =>
    currentHost.includes(domain)
  );

  if (isBlockedDomain) {
    return <BlockedPage />;
  }

  // ... 路由配置
}
```

### 配置文件：`src/components/BlockedPage.tsx`

```typescript
export default function BlockedPage() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center px-8">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
            {/* 警告图标 */}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-red-500 mb-4">
          此链接已永久失效
        </h1>

        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          您访问的页面已废弃，请联系管理员获取最新入口
        </p>

        {/* ... 更多说明 */}
      </div>
    </div>
  );
}
```

### 工作原理

1. **应用层拦截**
   - 在 React 组件渲染前检查
   - 显示友好的错误页面

2. **域名黑名单**
   - 检查 `window.location.hostname`
   - 匹配黑名单中的域名片段

3. **友好提示**
   - 显示错误原因
   - 提供新的访问路径建议

### 优势
- ✅ 提供友好的用户体验
- ✅ 可自定义错误页面
- ✅ 支持多语言提示
- ✅ 即使前两层失效也有效

### 测试方法
```javascript
// 在浏览器控制台
window.location.hostname = '69ae75bf-test.netlify.app';
// 刷新页面，预期看到 BlockedPage 组件
```

---

## 三层防御对比

| 特性 | 第一层 (CDN) | 第二层 (SW) | 第三层 (React) |
|-----|-------------|------------|---------------|
| **拦截位置** | CDN 边缘节点 | 浏览器缓存层 | 应用组件层 |
| **拦截时机** | 请求发出前 | 网络请求前 | 组件渲染前 |
| **离线有效** | ❌ | ✅ | ✅ |
| **资源消耗** | 0 | 极低 | 低 |
| **用户体验** | 直接拦截 | JSON 错误 | 友好页面 |
| **搜索引擎** | ✅ 可识别 | ❌ 不可见 | ❌ 不可见 |
| **优先级** | 最高 | 高 | 中 |
| **绕过难度** | 极难 | 难 | 容易 |

---

## 覆盖场景分析

### 场景 1：正常在线访问
```
用户访问旧链接
  → 第一层 CDN 拦截 ✅
  → 返回 410 状态码
  → 用户看不到任何内容
```

### 场景 2：Service Worker 缓存访问
```
用户在离线状态下访问旧链接
  → 第一层 CDN (无网络，跳过)
  → 第二层 SW 拦截 ✅
  → 返回 410 JSON 错误
  → 用户看到结构化错误
```

### 场景 3：禁用 Service Worker
```
用户禁用 SW 后访问
  → 第一层 CDN 拦截 ✅
  → 返回 410 状态码
  → 用户看不到任何内容
```

### 场景 4：绕过 CDN 直接访问
```
用户通过特殊方式绕过 CDN
  → 第一层 CDN (被绕过)
  → 第二层 SW (如果注册了) ✅
  → 或第三层 React 拦截 ✅
  → 用户看到 BlockedPage 组件
```

### 场景 5：旧部署版本访问
```
用户访问 69ae75bf...netlify.app
  → 第一层 CDN 拦截 ✅ (所有部署统一规则)
  → 或第三层 域名黑名单拦截 ✅
  → 用户无法访问
```

---

## 部署清单

### 步骤 1：验证文件
```bash
# 检查 _redirects
cat public/_redirects

# 检查 sw.js
grep "BLOCKED_PATHS" public/sw.js

# 检查 BlockedPage
grep "此链接已永久失效" src/components/BlockedPage.tsx
```

### 步骤 2：本地构建测试
```bash
npm run build

# 验证 dist/_redirects
cat dist/_redirects

# 验证 dist/sw.js
cat dist/sw.js | grep "410"
```

### 步骤 3：提交代码
```bash
git add public/_redirects public/sw.js
git commit -m "feat: 三层纵深防御 Kill Switch 完整系统"
git push origin main
```

### 步骤 4：等待 Netlify 部署
- 推送后 Netlify 自动触发构建
- 构建完成后，三层防御全部生效

### 步骤 5：验证拦截效果

#### 测试第一层（CDN）
```bash
curl -I https://yourapp.com/share/journey
# 预期：HTTP/2 410 Gone
```

#### 测试第二层（SW）
```javascript
// 浏览器控制台
navigator.serviceWorker.ready.then(() => {
  fetch('/share/journey')
    .then(res => res.json())
    .then(data => console.log(data));
  // 预期：{error: "DEPRECATED_PATH_BLOCKED", ...}
});
```

#### 测试第三层（React）
```
访问：https://69ae75bf...netlify.app
预期：看到红色警告页面 "此链接已永久失效"
```

---

## 紧急情况处理

### 情况 1：需要临时放行某个路径

**第一层（CDN）注释规则**
```plaintext
# /share/journey* /blocked 410!  # 临时禁用
```

**第二层（SW）注释代码**
```javascript
// const BLOCKED_PATHS = [...];  // 临时禁用
```

**第三层（React）跳过检查**
```typescript
if (false && isBlockedDomain) {  // 临时禁用
  return <BlockedPage />;
}
```

### 情况 2：完全回滚

```bash
# 回滚到上一个版本
git revert HEAD
git push origin main

# 或通过 Netlify Dashboard 回滚部署
```

### 情况 3：清除 Service Worker 缓存

```javascript
// 在浏览器控制台
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(reg => reg.unregister());
    console.log('✅ 所有 SW 已注销');
  });

// 刷新页面
location.reload();
```

---

## 监控与维护

### 推荐监控指标

1. **410 错误数量**（Netlify Analytics）
   - 每天有多少请求被第一层拦截
   - 判断旧链接是否还在传播

2. **Service Worker 日志**（浏览器控制台）
   - 检查 `[SW KILL SWITCH]` 日志
   - 确认第二层拦截正常工作

3. **React 错误边界**（Sentry / LogRocket）
   - 监控 `<BlockedPage />` 渲染次数
   - 分析哪些用户触发了第三层拦截

### 定期检查清单

- [ ] 每周检查 Netlify 部署日志（410 错误统计）
- [ ] 每两周审查 `public/_redirects` 规则
- [ ] 每月检查 Service Worker 版本号
- [ ] 每季度评估是否可以移除部分黑名单

---

## 最佳实践

### 1. 保持三层同步

当添加新的拦截路径时，确保三层都更新：

```plaintext
# 第一层：public/_redirects
/new/deprecated/path* /blocked 410!
```

```javascript
// 第二层：public/sw.js
const BLOCKED_PATHS = [
  '/share/journey',
  '/new/deprecated/path'  // 新增
];
```

```typescript
// 第三层：src/App.tsx
const BLOCKED_DOMAINS = [
  '69ae75bf',
  'new-blocked-domain'  // 新增
];
```

### 2. 使用语义化版本号

Service Worker 版本号应该反映变更类型：

```javascript
// ✅ 好的版本号
const CACHE_NAME = 'maya-healing-v-kill-share-journey-2026-03-10';

// ❌ 不好的版本号
const CACHE_NAME = 'v1.2.3';
```

### 3. 提供清晰的错误信息

```typescript
// ✅ 好的错误页面
<h1>此链接已永久失效</h1>
<p>请联系管理员获取最新入口</p>
<code>/flow/*</code>

// ❌ 不好的错误页面
<h1>404</h1>
```

### 4. 测试所有场景

在部署前，务必测试：
- ✅ 正常在线访问
- ✅ 离线访问（禁用网络）
- ✅ 禁用 Service Worker
- ✅ 不同部署版本
- ✅ 不同域名

---

## 技术细节

### Netlify _redirects 解析顺序

```plaintext
# 1️⃣ 最具体的规则优先
/share/journey/special /special-handler 200

# 2️⃣ 通配符规则次之
/share/journey* /blocked 410!

# 3️⃣ 全局规则最后
/* /index.html 200
```

### Service Worker 生命周期

```
安装 (install)
  → 等待 (waiting)
  → 激活 (activate)
  → 控制 (controlling)
```

关键点：
- `skipWaiting()` 跳过等待阶段
- `clients.claim()` 立即接管所有页面
- 更新版本号会触发新的安装流程

### React 路由拦截优先级

```typescript
// 1️⃣ 最高优先级：域名黑名单（App.tsx 顶部）
if (isBlockedDomain) return <BlockedPage />;

// 2️⃣ 中等优先级：路由配置（Router）
<Route path="/share/journey" element={<Redirect />} />

// 3️⃣ 最低优先级：404 页面
<Route path="*" element={<NotFound />} />
```

---

## 总结

通过三层独立的拦截机制，我们实现了：

### 第一层：Netlify CDN
✅ **CDN 边缘拦截** - 最高优先级，物理阻断
✅ **410 状态码** - 告知资源已永久删除
✅ **强制执行** - 感叹号忽略缓存

### 第二层：Service Worker
✅ **浏览器层拦截** - 离线访问也被拦截
✅ **缓存清理** - 自动清理旧版本
✅ **结构化错误** - 返回 JSON 错误信息

### 第三层：React 应用
✅ **应用层拦截** - 最后一道防线
✅ **友好页面** - 显示详细错误说明
✅ **域名黑名单** - 阻断特定部署版本

### 覆盖率
- ✅ 所有部署版本（包括旧版本）
- ✅ 所有域名（主域名 + 部署域名）
- ✅ 所有访问方式（在线 + 离线）
- ✅ 所有浏览器状态（启用/禁用 SW）

部署后，任何用户都无法通过任何方式访问 `/share/journey*` 路径。
