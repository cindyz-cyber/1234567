# 域名 Kill Switch 升级报告

## 升级日期
2026-03-10

## 升级目标
在 App.tsx 顶部增加域名检查逻辑，拦截所有旧版 Netlify 预览链接和黑名单路径。

---

## 核心逻辑

### 1. 双重拦截机制

```typescript
// 获取域名和路径
const hostname = window.location.hostname;
const currentPath = window.location.pathname;

// 定义生产环境标识
const PRODUCTION_NETLIFY_PREFIX = 'main--';

// 检查旧版预览链接
const isOldNetlifyPreview = hostname.includes('netlify.app') &&
                            !hostname.startsWith(PRODUCTION_NETLIFY_PREFIX);

// 检查黑名单路径
const BLOCKED_PATHS = ['/share/journey', '/share/journal', '/admin/share-config'];
const isBlockedPath = BLOCKED_PATHS.some(blocked => currentPath.includes(blocked));

// 任一条件触发拦截
const shouldBlock = isOldNetlifyPreview || isBlockedPath;
```

---

## 拦截范围

### ✅ 会被拦截的访问

1. **旧版 Netlify 预览链接**
   - `https://deploy-preview-123--yourapp.netlify.app`
   - `https://branch-name--yourapp.netlify.app`
   - `https://6578912ab12345--yourapp.netlify.app`

2. **黑名单路径（任何域名）**
   - `/share/journey`
   - `/share/journal`
   - `/admin/share-config`

### ✅ 不会被拦截的访问

1. **生产环境**
   - `https://main--yourapp.netlify.app`（假设 main 是生产分支）
   - 自定义域名（不包含 netlify.app）

2. **正常路径**
   - `/`
   - `/profile`
   - 其他合法路径

---

## 拦截效果

当检测到违规访问时：

1. **日志输出**
```javascript
console.error('🚨 [KILL SWITCH] 检测到违规访问:', {
  hostname: 'deploy-preview-123--yourapp.netlify.app',
  currentPath: '/share/journey',
  isOldNetlifyPreview: true,
  isBlockedPath: true,
  reason: '旧版预览链接'
});
```

2. **阻止初始化**
   - 停止 `useEffect` 初始化
   - 拒绝数据库请求
   - 不加载用户资料

3. **显示拦截页面**
   - 强制渲染 `<BlockedPage />`
   - 显示 "此版本已停用"

---

## 配置说明

### 修改生产环境标识

如果您的生产环境 Netlify 链接不是 `main--` 开头，请修改：

```typescript
// 修改此处为您的生产环境前缀
const PRODUCTION_NETLIFY_PREFIX = 'production--'; // 或 'prod--' 等
```

### 添加更多黑名单路径

```typescript
const BLOCKED_PATHS = [
  '/share/journey',
  '/share/journal',
  '/admin/share-config',
  '/legacy-path',  // 新增
  '/old-feature'   // 新增
];
```

---

## 测试场景

### 场景 1: 旧预览链接
- 访问: `https://deploy-preview-456--yourapp.netlify.app`
- 结果: 立即显示 "此版本已停用"

### 场景 2: 黑名单路径
- 访问: `https://yourapp.com/share/journey`
- 结果: 立即显示 "此版本已停用"

### 场景 3: 生产环境
- 访问: `https://main--yourapp.netlify.app`
- 结果: 正常加载

### 场景 4: 自定义域名
- 访问: `https://yourapp.com`
- 结果: 正常加载（不包含 netlify.app）

---

## 安全保障

1. **零数据库交互**
   - 违规访问不会触发任何 Supabase 查询
   - 防止数据泄露和性能浪费

2. **最高优先级**
   - 在所有组件渲染前检查
   - 在 React 生命周期最早期拦截

3. **无法绕过**
   - 不依赖路由库
   - 直接使用 `window.location`
   - 无 localStorage 缓存漏洞

---

## 部署清单

- [x] 修改 `App.tsx` 添加域名检查
- [x] 通过 `npm run build` 验证
- [ ] 确认 `PRODUCTION_NETLIFY_PREFIX` 配置正确
- [ ] 部署到生产环境
- [ ] 测试旧预览链接是否被拦截
- [ ] 测试生产链接是否正常访问

---

## 回滚方案

如果需要紧急回滚，删除以下代码：

```typescript
// 删除域名检查部分（第 43-62 行）
const hostname = window.location.hostname;
const PRODUCTION_NETLIFY_PREFIX = 'main--';
const isOldNetlifyPreview = ...;
```

保留原有的路径检查即可。
