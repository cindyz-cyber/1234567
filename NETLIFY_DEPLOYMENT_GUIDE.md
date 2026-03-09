# Netlify 部署指南

## 问题确认

当前线上版本 ❌ **没有 URL 拦截器**
- 线上文件: `index-BvnMhPmJ.js` (旧版本)
- 本地文件: `index-AYIvBDON.js` (新版本，包含拦截器)

访问 `https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journeyzen2026` 仍然正常加载，**拦截器未生效**。

---

## 部署方式 1: Netlify 仪表板（最简单）

### 步骤：

1. **访问 Netlify 仪表板**
   https://app.netlify.com/sites/illustrious-concha-e6f2de/deploys

2. **拖拽部署**
   - 将本地 `dist/` 文件夹直接拖拽到 "Need to update your site? Drag and drop your site output folder here"
   - 或者点击 "Deploy manually"

3. **等待部署完成** (约 30 秒)

4. **验证部署**
   - 访问: https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journeyzen2026
   - 应该立即显示 "链接已失效" 页面

---

## 部署方式 2: Netlify CLI（需要授权）

### 前置条件：

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录 Netlify
netlify login
```

### 部署命令：

```bash
# 部署到生产环境
netlify deploy --prod --dir=dist
```

---

## 部署方式 3: Git 自动部署（推荐长期使用）

如果项目已连接到 Git 仓库：

```bash
# 1. 提交最新代码
git add .
git commit -m "feat: 添加 URL 拦截器，禁用旧分享链接"

# 2. 推送到远程仓库
git push origin main

# 3. Netlify 会自动检测并部署
```

---

## 验证拦截器生效

部署后，访问以下 URL 应该立即显示 "链接已失效" 页面：

- ❌ https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/journeyzen2026
- ❌ https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/share/zen2026
- ❌ 任何包含 "zen2026" 的 URL

浏览器控制台会显示：
```
🚫 [URL BLOCKED] 检测到旧 token: zen2026，立即拦截
🛑 停止所有初始化，进入失效状态
```

---

## 快速验证线上代码版本

```bash
# 检查线上 JS 文件名
curl -s "https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/" | grep -o 'index-[^.]*\.js'

# 检查拦截器代码是否存在（应该出现 3+ 次）
curl -s "https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/assets/$(curl -s 'https://69ae75bf829d1011d7f6d0ed--illustrious-concha-e6f2de.netlify.app/' | grep -o 'index-[^.]*\.js' | head -1)" | grep -c "zen2026"
```

**期望结果：**
- 旧版本（当前）: 出现 1 次
- 新版本（部署后）: 出现 4 次

---

## 当前构建信息

```
本地构建文件: dist/assets/index-AYIvBDON.js
文件大小: 745.07 kB (gzip: 215.87 kB)
zen2026 出现次数: 4 次
拦截器状态: ✅ 已打包
```

---

## 紧急回滚

如果需要恢复旧版本：

1. 在 Netlify 仪表板找到之前的部署
2. 点击 "Publish deploy" 回滚

---

## 联系方式

如需帮助，请提供：
- Netlify 部署日志
- 浏览器控制台截图
- 访问的完整 URL
