# Kill Switch 紧急部署指南

## 问题诊断
用户反馈旧链接 `https://69ae75bf...netlify.app/share/journeyzen2026` 仍然可以访问。

## 根本原因
1. **路径匹配不够精确**：`/share/journey*` 无法匹配 `/share/journeyzen2026`
2. **通配符语法错误**：Netlify `_redirects` 中 `*` 只能用在路径末尾，不能用在中间

## 解决方案
将所有 `/share/*` 路径全部拦截，而不是只拦截特定的子路径。

---

## 三层防御更新

### 第一层：Netlify CDN 拦截

#### 更新前（错误）
```plaintext
/share/journey* /blocked 410!
/share/journal* /blocked 410!
```

#### 更新后（正确）
```plaintext
/share/* /blocked 410!
```

**效果**：
- ✅ `/share/journey` → 拦截
- ✅ `/share/journeyzen2026` → 拦截
- ✅ `/share/journal` → 拦截
- ✅ `/share/anything` → 拦截

---

## 部署步骤

### 步骤 1：验证文件更新
```bash
cat public/_redirects
# 预期：/share/* /blocked 410!

cat dist/_redirects
# 预期：/share/* /blocked 410!
```

### 步骤 2：推送到 GitHub
```bash
git add .
git commit -m "fix: 扩大 Kill Switch 拦截范围至所有 /share/* 路径"
git push origin main
```

### 步骤 3：等待 Netlify 自动部署（1-3 分钟）

### 步骤 4：清除浏览器缓存
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## 测试验证

```bash
# 测试旧链接
curl -I https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journeyzen2026

# 预期输出：
# HTTP/2 410 Gone
```

---

## 为什么原来的规则失效了？

### Netlify _redirects 语法说明

#### 错误示例 ❌
```plaintext
/share/journey* /blocked 410!
```

**问题**：
- `/share/journey*` 只匹配以 `/share/journey` 开头的路径
- 但 `/share/journeyzen2026` 中 `journey` 和 `zen` 之间没有分隔符
- 所以不会匹配

#### 正确示例 ✅
```plaintext
/share/* /blocked 410!
```

**效果**：匹配所有以 `/share/` 开头的路径

---

## 成功标志

```bash
$ curl -I https://69ae75bf...netlify.app/share/journeyzen2026
HTTP/2 410 Gone
```

部署成功！
