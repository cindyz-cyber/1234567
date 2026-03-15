# 自动跳过起名页功能说明

## 功能概述

当引流页的 `naming` 页面在后台被设置为隐藏时，用户访问时将自动跳过起名页，直接进入第一个可见的页面（通常是首页 home）。

## 实现原理

1. **页面可见性检测**
   - 在 `validateAccess` 函数加载页面可见性配置后
   - 检查 `naming` 页面的 `is_visible` 状态

2. **智能跳转**
   - 如果 `naming` 页面被隐藏（`is_visible = false`）
   - 调用 `getNextVisiblePage('naming', visibility)` 获取下一个可见页面
   - 自动设置 `currentStep` 为该页面

3. **日志输出**
   ```
   🚀 [ShareJournal] naming 页面已隐藏，自动跳转到: home
   ```

## 使用方法

### 方式 1：通过页面内容配置界面

1. 访问后台：`https://your-domain.com/admin/page-content`
2. 输入场景标识：`default`（或其他场景标识）
3. 点击「加载配置」
4. 找到「起名页 (naming)」
5. 点击「显示中」按钮，切换为「已隐藏」状态
6. 页面会自动保存

### 方式 2：直接修改数据库

```sql
-- 隐藏 default 场景的 naming 页面
UPDATE page_visibility_config 
SET is_visible = false 
WHERE scene_token = 'default' 
  AND page_name = 'naming';

-- 显示 default 场景的 naming 页面
UPDATE page_visibility_config 
SET is_visible = true 
WHERE scene_token = 'default' 
  AND page_name = 'naming';
```

## 验证效果

### 测试步骤

1. **隐藏 naming 页面**
   ```sql
   UPDATE page_visibility_config 
   SET is_visible = false 
   WHERE scene_token = 'default' AND page_name = 'naming';
   ```

2. **访问引流页**
   ```
   https://your-domain.com/share/journal?scene=default&token=123456
   ```

3. **预期结果**
   - 页面加载完成后，直接显示首页（home）
   - 不会显示起名页（naming）
   - 控制台输出：
     ```
     ✅ [ShareJournal] 页面可见性配置加载完成
     📊 [ShareJournal] 可见性配置: { naming: false, home: true, ... }
     🚀 [ShareJournal] naming 页面已隐藏，自动跳转到: home
     ```

4. **恢复 naming 页面**
   ```sql
   UPDATE page_visibility_config 
   SET is_visible = true 
   WHERE scene_token = 'default' AND page_name = 'naming';
   ```

5. **再次访问引流页**
   - 应该正常显示起名页

## 页面流程说明

### 当 naming 页面显示时（默认）

```
naming → home → emotion → journal → dialogue → transition → answer → card
```

### 当 naming 页面隐藏时

```
home → emotion → journal → dialogue → transition → answer → card
(自动跳过 naming)
```

### 当多个页面隐藏时

系统会智能跳过所有隐藏的页面，例如：
- 隐藏 naming + emotion：`home → journal → dialogue → ...`
- 隐藏 naming + home：`emotion → journal → dialogue → ...`

## 数据库状态检查

### 查看当前配置

```sql
SELECT scene_token, page_name, is_visible 
FROM page_visibility_config 
WHERE scene_token = 'default' 
ORDER BY page_name;
```

### 当前 default 场景配置

| page_name | is_visible |
|-----------|------------|
| naming    | false      |
| home      | true       |
| emotion   | false      |
| journal   | true       |
| dialogue  | true       |
| transition| true       |
| answer    | true       |
| card      | true       |

根据上述配置，访问 default 场景时：
- 自动跳过 naming 页面
- 直接进入 home 页面
- emotion 页面也会被跳过

## 注意事项

1. **场景级配置**
   - 每个场景（scene_token）都可以独立配置页面可见性
   - default 场景的配置不会影响其他场景

2. **实时生效**
   - 修改数据库后，用户刷新页面即可看到效果
   - 无需清除缓存

3. **至少一个可见页面**
   - 建议至少保持一个页面可见
   - 如果所有页面都被隐藏，系统会保持在 naming 状态

4. **用户体验**
   - 隐藏页面是完全透明的，用户不会看到任何跳过提示
   - 流程会自动衔接到下一个可见页面

## 技术实现

**文件**：`src/components/ShareJournal.tsx`

**关键代码**：
```typescript
// 👁️ 加载页面可见性配置
const visibility = await loadPageVisibility(sceneToken);
setPageVisibility(visibility);

// 🔥 智能初始页面：如果 naming 页面被隐藏，自动跳转到第一个可见页面
if (visibility['naming'] === false) {
  const firstVisiblePage = getNextVisiblePage('naming', visibility);
  if (firstVisiblePage) {
    console.log('🚀 [ShareJournal] naming 页面已隐藏，自动跳转到:', firstVisiblePage);
    setCurrentStep(firstVisiblePage as JournalStep);
  }
}
```

## 部署状态

功能已完成并构建成功，推送到 GitHub 后会自动部署到 Netlify。
