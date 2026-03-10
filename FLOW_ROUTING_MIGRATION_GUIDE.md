# Flow 路由系统迁移指南

## 概述

已完成从旧的 `/share` 路由系统到新的 `/flow` 路由系统的完整迁移。

## 核心变化

### 1. 路由变更

**旧系统（已废弃）**
```
/share/journal?scene=journeyzen2026&token=zen2026
/admin/share-config
```

**新系统**
```
/flow/inner-peace?token=peace2026
/admin/flow-config
```

### 2. 数据库变更

创建了全新的 `flow_config` 表：

```sql
CREATE TABLE flow_config (
  id uuid PRIMARY KEY,
  scene_path text UNIQUE,          -- URL 路径（如 'inner-peace'）
  scene_name text,                 -- 显示名称
  access_token text UNIQUE,        -- 访问令牌（如 'peace2026'）
  description text,
  is_active boolean,

  -- 背景视频（仅支持 MP4）
  bg_home_url text,
  bg_step1_url text,
  bg_step2_url text,
  bg_step3_url text,
  bg_step4_url text,

  -- 音频配置
  audio_step1_url text,
  audio_step2_url text,
  audio_step3_url text,
  audio_step4_url text,

  created_at timestamptz,
  updated_at timestamptz
);
```

### 3. 组件变更

- **新增**: `FlowJourney.tsx` - 处理 `/flow/:scenePath` 路由
- **新增**: `FlowConfigAdmin.tsx` - 管理 Flow 配置的后台界面
- **更新**: `main.tsx` - 路由配置更新

## 旧链接失效机制

1. **所有 `/share/*` 路由返回 404 页面**
   - `/share/journal` → 404
   - `/share/journey` → 404
   - `/admin/share-config` → 404

2. **用户体验**
   - 显示明确的"链接已失效"提示
   - 说明旧版路由已全面下线
   - 提供返回首页的按钮

## 新系统优势

### 1. 更简洁的 URL 结构
```
旧: /share/journal?scene=journeyzen2026&token=zen2026
新: /flow/inner-peace?token=peace2026
```

### 2. Token 验证机制改进
- 每个场景有独立的 `access_token`
- 必须同时匹配 `scene_path` 和 `access_token`
- 无效 token 直接显示错误页面

### 3. 仅支持 MP4 视频
- 解决了旧系统的视频加载超时问题
- 更好的跨浏览器兼容性
- 更快的加载速度

### 4. 完整的数据隔离
- `flow_config` 表独立于旧的 `h5_share_config`
- 不影响旧数据，可随时回滚
- 渐进式迁移策略

## 使用指南

### 管理员操作

1. **访问管理后台**
   ```
   /admin/flow-config
   ```

2. **创建新场景**
   - 点击"新建场景"按钮
   - 填写必填字段：
     - 场景路径（如 `inner-peace`）
     - 场景名称（如 `内在宁静`）
     - 访问令牌（如 `peace2026`）
   - 配置背景视频和音频 URL
   - 点击保存

3. **生成分享链接**
   - 在配置列表中找到场景
   - 点击复制按钮复制链接
   - 链接格式：`https://yourdomain.com/flow/{scene_path}?token={access_token}`

4. **测试场景**
   - 点击"新窗口打开"按钮
   - 验证视频和音频是否正确加载

### 用户访问流程

1. 用户收到新的 Flow 链接
2. 访问链接（如 `/flow/inner-peace?token=peace2026`）
3. 系统验证：
   - `scene_path` 存在
   - `access_token` 匹配
   - `is_active` 为 true
4. 验证通过 → 展示场景首页
5. 验证失败 → 显示错误页面

## 数据迁移建议

如果需要将旧的 `h5_share_config` 数据迁移到新系统：

```sql
-- 示例：将旧配置转换为新配置
INSERT INTO flow_config (
  scene_path,
  scene_name,
  access_token,
  description,
  is_active,
  bg_home_url,
  audio_step1_url
)
SELECT
  scene_token AS scene_path,
  scene_name,
  daily_token AS access_token,
  description,
  is_active,
  bg_home_url,
  audio_url AS audio_step1_url
FROM h5_share_config
WHERE is_active = true
ON CONFLICT (scene_path) DO NOTHING;
```

## 安全考虑

1. **RLS 策略**
   - 匿名用户只能读取激活的配置
   - 只有管理员可以创建/更新/删除配置

2. **Token 机制**
   - `access_token` 必须唯一
   - 建议使用复杂的 token（如 `peace2026winter`）
   - 定期更换 token

3. **视频资源**
   - 建议使用 Supabase Storage 存储视频
   - 设置合适的 RLS 策略控制访问
   - 避免在 URL 中暴露敏感信息

## 示例配置

### 示例 1：内在宁静场景

```json
{
  "scene_path": "inner-peace",
  "scene_name": "内在宁静",
  "access_token": "peace2026",
  "description": "引导你进入内心深处的宁静空间",
  "is_active": true,
  "bg_home_url": "https://.../storage/v1/object/public/videos/peace-home.mp4",
  "bg_step1_url": "https://.../storage/v1/object/public/videos/peace-emotion.mp4",
  "audio_step1_url": "https://.../storage/v1/object/public/audio/peace-guidance.mp3"
}
```

### 示例 2：能量唤醒场景

```json
{
  "scene_path": "energy-awakening",
  "scene_name": "能量唤醒",
  "access_token": "energy2026",
  "description": "激活你的内在能量场",
  "is_active": true,
  "bg_home_url": "https://.../storage/v1/object/public/videos/energy-home.mp4",
  "audio_step1_url": "https://.../storage/v1/object/public/audio/energy-bgm.mp3"
}
```

## 故障排查

### 问题：访问链接显示"无效的访问链接"

**原因**：
- `scene_path` 不存在
- `access_token` 不匹配
- 配置被禁用（`is_active = false`）

**解决方案**：
1. 检查数据库中的配置
2. 确认 URL 参数正确
3. 确认配置已激活

### 问题：视频无法加载

**原因**：
- 视频 URL 不正确
- 视频格式不是 MP4
- 网络问题

**解决方案**：
1. 验证视频 URL 可访问
2. 确保使用 MP4 格式
3. 检查 CORS 配置

### 问题：旧链接仍然可以访问

**原因**：
- 浏览器缓存
- CDN 缓存

**解决方案**：
1. 清除浏览器缓存
2. 等待 CDN 缓存过期
3. 强制刷新（Ctrl + Shift + R）

## 部署清单

- [x] 创建 `flow_config` 数据库表
- [x] 创建 `FlowJourney.tsx` 组件
- [x] 创建 `FlowConfigAdmin.tsx` 管理界面
- [x] 更新路由配置（`main.tsx`）
- [x] 废弃旧的 `/share` 路由
- [x] 更新 404 页面提示
- [x] 运行构建验证

## 下一步

1. 创建示例 Flow 配置进行测试
2. 上传 MP4 格式的背景视频
3. 生成新的分享链接
4. 通知用户旧链接已失效
5. 监控新系统的使用情况

## 技术支持

如有问题，请检查：
- 浏览器控制台日志
- Supabase 数据库日志
- 网络请求详情

---

**重要提示**: 旧的 `/share` 路由已完全废弃，所有旧链接将显示 404 页面。请使用新的 `/flow` 路由系统。
