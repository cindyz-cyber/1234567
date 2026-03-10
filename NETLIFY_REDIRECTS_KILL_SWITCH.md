# Netlify 物理重定向 Kill Switch 部署指南

## 部署日期
2026-03-10

## 目标
通过 Netlify `_redirects` 文件实现物理层面拦截，彻底阻断所有旧版链接访问。

---

## 核心机制

### 1. Netlify _redirects 文件

位置：`/public/_redirects`（构建后自动复制到 `/dist/_redirects`）

内容：
```
# 🚨 KILL SWITCH: 强制拦截黑名单路径（410 = 永久消失）
/share/journey* /blocked 410!
/share/journal* /blocked 410!
/admin/share-config* /blocked 410!

# 默认 SPA 路由
/* /index.html 200
```

---

## 重定向规则详解

### 410 状态码
- **410 Gone**: 表示资源已永久删除
- 比 404 更强烈，告诉搜索引擎和浏览器不要再尝试访问
- 无法通过刷新或缓存恢复

### 感叹号 (!) 的作用
- **强制执行**: 忽略所有缓存，直接执行重定向
- **覆盖 SPA 路由**: 优先级高于 `/* /index.html 200`
- **立即生效**: 无需等待 CDN 缓存过期

### 通配符 (*) 的作用
- `/share/journey*` 会匹配：
  - `/share/journey`
  - `/share/journey/123`
  - `/share/journey?token=abc`
  - `/share/journey#section`

---

## 拦截效果

### 被拦截的 URL

1. **旧版引流链接**
   ```
   https://69ae75bf...--yourapp.netlify.app/share/journey
   → 410 Gone (永久失效)
   ```

2. **所有部署版本**
   ```
   https://deploy-preview-123--yourapp.netlify.app/share/journey
   → 410 Gone (永久失效)
   ```

3. **生产环境**
   ```
   https://main--yourapp.netlify.app/share/journey
   → 410 Gone (永久失效)
   ```

4. **自定义域名**
   ```
   https://yourapp.com/share/journey
   → 410 Gone (永久失效)
   ```

### 正常访问的 URL

```
https://yourapp.com/
https://yourapp.com/profile
https://yourapp.com/admin
https://yourapp.com/flow/journey  (新路径)
```

---

## 双层防护机制

### 第一层：Netlify 物理拦截（本次更新）
- **优先级**: 最高（CDN 边缘层）
- **触发时机**: 请求到达服务器前
- **状态码**: 410 Gone
- **优势**:
  - 无需加载 JavaScript
  - 节省带宽和计算资源
  - 搜索引擎可识别

### 第二层：React 应用内拦截（之前已实现）
- **优先级**: 次高（应用层）
- **触发时机**: React 组件渲染前
- **显示**: `<BlockedPage />` 组件
- **优势**:
  - 可自定义用户体验
  - 提供详细错误信息
  - 支持复杂逻辑判断

---

## 部署流程

### Step 1: 验证本地构建

```bash
npm run build
```

检查 `dist/_redirects` 文件是否存在且内容正确。

### Step 2: 提交到 Git

```bash
git add public/_redirects
git commit -m "feat: 添加 Netlify 物理重定向拦截规则"
git push origin main
```

### Step 3: 触发 Netlify 部署

1. 推送后 Netlify 自动检测变更
2. 开始新的构建流程
3. 部署完成后，`_redirects` 规则立即生效

### Step 4: 验证拦截效果

#### 测试旧链接
```bash
curl -I https://69ae75bf...--yourapp.netlify.app/share/journey
```

预期响应：
```
HTTP/2 410 Gone
```

#### 测试新链接
```bash
curl -I https://yourapp.com/flow/journey
```

预期响应：
```
HTTP/2 200 OK
```

---

## 紧急情况处理

### 情况 1: 误拦截正常路径

**症状**: 某个合法路径返回 410

**解决方案**:
1. 检查 `_redirects` 中的通配符规则
2. 调整规则顺序（更具体的规则放在前面）
3. 重新部署

### 情况 2: 拦截未生效

**症状**: 旧链接仍然可以访问

**可能原因**:
- CDN 缓存未刷新
- `_redirects` 文件未被复制到 dist

**解决方案**:
```bash
# 清除 Netlify 缓存
netlify deploy --prod --clear-cache

# 或通过 Netlify Dashboard 手动清除缓存
```

### 情况 3: 需要临时放行

**场景**: 紧急需要访问旧路径

**临时方案**:
1. 注释掉 `_redirects` 中对应规则
2. 推送并等待部署
3. 访问完成后恢复规则

---

## 监控与维护

### 推荐监控指标

1. **410 错误数量**
   - 统计每天有多少用户访问旧链接
   - 判断旧链接是否还在传播

2. **拦截路径分布**
   - 分析哪些旧路径访问最多
   - 决定是否需要添加更多重定向

3. **用户反馈**
   - 收集用户关于"链接失效"的反馈
   - 确保正常路径未被误伤

### 定期检查清单

- [ ] 每周检查 Netlify 部署日志
- [ ] 每月审查 `_redirects` 规则
- [ ] 每季度评估是否可以移除部分规则
- [ ] 新功能上线前测试重定向冲突

---

## 最佳实践

### 1. 规则顺序很重要
```
# ✅ 正确：具体规则在前
/share/journey/special /special-handler 200
/share/journey* /blocked 410!

# ❌ 错误：通配符规则在前会吞掉所有请求
/share/journey* /blocked 410!
/share/journey/special /special-handler 200
```

### 2. 使用语义化状态码
- `410 Gone`: 永久删除的资源
- `404 Not Found`: 不存在的资源
- `301 Moved Permanently`: 永久迁移
- `302 Found`: 临时重定向

### 3. 添加注释
```
# 用途：拦截 2026-03-10 之前的旧引流系统
/share/journey* /blocked 410!

# 用途：重定向到新的 Flow 系统
/old-flow/* /flow/:splat 301
```

### 4. 测试边界情况
```bash
# 测试带参数的 URL
curl -I "https://yourapp.com/share/journey?token=123"

# 测试带 hash 的 URL
curl -I "https://yourapp.com/share/journey#section"

# 测试子路径
curl -I "https://yourapp.com/share/journey/nested/path"
```

---

## 回滚方案

如果需要紧急回滚：

### 方案 1: 注释规则
```
# 🚨 KILL SWITCH: 强制拦截黑名单路径（410 = 永久消失）
# /share/journey* /blocked 410!  # 临时禁用
# /share/journal* /blocked 410!  # 临时禁用
```

### 方案 2: 完全删除
```bash
git revert <commit-hash>
git push origin main
```

### 方案 3: Netlify 控制台回滚
1. 进入 Netlify Dashboard
2. 找到项目的 Deploys 页面
3. 选择之前的成功部署
4. 点击 "Publish deploy"

---

## 相关文档

- [KILL_SWITCH_DEPLOYMENT_GUIDE.md](./KILL_SWITCH_DEPLOYMENT_GUIDE.md) - React 层拦截
- [DOMAIN_KILL_SWITCH_UPGRADE.md](./DOMAIN_KILL_SWITCH_UPGRADE.md) - 域名拦截
- [Netlify Redirects 官方文档](https://docs.netlify.com/routing/redirects/)

---

## 总结

通过 Netlify `_redirects` 文件，我们实现了：

✅ **CDN 边缘拦截** - 在请求到达应用前就阻断
✅ **410 永久失效** - 告知搜索引擎和用户资源已删除
✅ **强制执行** - 感叹号确保忽略缓存
✅ **全局生效** - 所有部署版本和域名统一拦截
✅ **双层防护** - 与 React 层拦截形成纵深防御

部署后，所有 `/share/journey*` 旧链接将返回 410 状态码，用户无法访问。
