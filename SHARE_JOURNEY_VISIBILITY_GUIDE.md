# 引流页场景控制完整指南

## 核心改进总结

已完成前后端完全打通的场景控制系统，实现以下功能：

### 1. 多路径访问支持

**路径参数方式**（推荐）
```
https://your-domain.com/share/journeyzen2026
```

**查询参数方式**（兼容旧链接）
```
https://your-domain.com/share/journal?scene=journeyzen2026
```

### 2. 移除 Token 校验

**旧方式**：需要同时提供 scene 和 token
```
https://your-domain.com/share/journal?scene=journeyzen2026&token=abc123
```

**新方式**：仅需场景标识
```
https://your-domain.com/share/journeyzen2026
```

### 3. 实时开关生效

- 禁用缓存，每次访问都从数据库实时读取
- 后台修改 `is_active` 开关后，前台刷新立即生效
- 无需等待缓存过期或清除浏览器缓存

---

## 使用指南

### 创建新场景

1. 访问后台 `https://your-domain.com/admin/share-config`
2. 点击「新增场景」按钮
3. 填写场景信息
4. 分享链接：`https://your-domain.com/share/场景标识`

### 隐藏/显示场景

- 点击眼睛图标
- 绿色 👁️ = 显示中（点击隐藏）
- 红色 👁️‍🗨️ = 已隐藏（点击显示）

---

## 技术特性总结

✅ 多路径支持：路径参数 + 查询参数双模式
✅ 简化访问：移除 token 校验，仅需场景标识
✅ 实时生效：禁用缓存，后台修改立即生效
✅ 智能导航：自动跳过隐藏页面
✅ 友好提示：清晰的关闭提示 + 快速重试按钮
✅ 双层控制：场景级 + 子页面级独立控制
✅ 调试便利：详细的控制台日志输出
✅ 向后兼容：旧链接继续有效
