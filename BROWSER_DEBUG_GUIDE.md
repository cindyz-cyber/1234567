# 浏览器调试指南 - Kin 239 数据不更新问题

## 问题症状
刷新页面后，Kin 239 的分析报告仍显示旧数据

## 诊断步骤

### 第 1 步：打开浏览器开发者工具
1. 按 `F12` 或 `Cmd+Option+I` (Mac)
2. 切换到 **Console** 标签

### 第 2 步：检查加载的 JS 文件版本
1. 切换到 **Network** 标签
2. 刷新页面 (`Ctrl+R` 或 `Cmd+R`)
3. 查找 `index-*.js` 文件
4. 检查文件大小是否为 `492.64 kB`
5. 查看文件名哈希值，应该包含 `IpWLsNZP`

### 第 3 步：手动运行诊断代码
在 **Console** 中粘贴以下代码并按回车：

```javascript
// 测试1：直接查询数据库
(async () => {
  // 假设 supabase 已全局可用
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.57.4');

  const supabaseUrl = 'YOUR_SUPABASE_URL';  // 替换为实际值
  const supabaseKey = 'YOUR_SUPABASE_KEY';  // 替换为实际值

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('totems')
    .select('id, name_cn, heart_chakra, throat_chakra, pineal_gland')
    .eq('id', 19)
    .maybeSingle();

  console.log('🔍 数据库查询结果:', data);
  console.log('❤️ 心轮:', data?.heart_chakra, '(预期: 40)');
  console.log('🗣️ 喉轮:', data?.throat_chakra, '(预期: 82)');
  console.log('👁️ 松果体:', data?.pineal_gland, '(预期: 95)');

  if (data?.heart_chakra === 40) {
    console.log('✅ 数据库值正确！');
  } else {
    console.log('❌ 数据库值错误！');
  }
})();
```

### 第 4 步：检查报告生成逻辑
在已有的报告页面上，打开 Console，运行：

```javascript
// 查找报告数据
console.log('当前页面的报告数据:', window);

// 如果页面使用 React，可以尝试：
const root = document.querySelector('#root');
const reactRoot = root?._reactRootContainer?._internalRoot?.current;
console.log('React 状态:', reactRoot);
```

### 第 5 步：强制清除所有缓存

#### 方法 A：清除浏览器缓存
1. 打开开发者工具 (F12)
2. **右键点击刷新按钮**（浏览器地址栏旁边）
3. 选择 **"清空缓存并硬性重新加载"** (Empty Cache and Hard Reload)

#### 方法 B：应用程序存储
1. 开发者工具 → **Application** 标签
2. 左侧找到 **Storage** → 点击 **Clear site data**
3. 勾选所有选项
4. 点击 **Clear site data**

#### 方法 C：隐身模式测试
1. 打开隐身/无痕窗口
2. 访问应用
3. 查看 Kin 239 报告

### 第 6 步：检查 Service Worker
1. 开发者工具 → **Application** 标签
2. 左侧找到 **Service Workers**
3. 如果有激活的 Service Worker：
   - 点击 **Unregister**
   - 刷新页面

### 第 7 步：验证构建文件
在终端运行以下命令检查构建文件内容：

```bash
# 检查构建的 JS 文件中是否包含新代码
grep -r "heart_chakra" dist/assets/index-*.js
```

如果找到 `heart_chakra`，说明构建正确。

### 第 8 步：检查环境变量
确保 `.env` 文件中的 Supabase 连接信息正确：

```bash
cat .env | grep SUPABASE
```

应该显示：
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 常见问题排查

### Q: 刷新后仍显示旧数据
**A:** 浏览器缓存问题。使用 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac) 硬刷新。

### Q: Console 显示错误
**A:** 复制完整错误信息，检查是否为：
- 网络错误：检查数据库连接
- 类型错误：可能是代码未正确构建
- 未找到字段：数据库表结构问题

### Q: 数据库值正确，但页面显示错误
**A:** 可能的原因：
1. 前端代码未正确构建 → 重新运行 `npm run build`
2. 调性修正函数未更新 → 检查源码文件
3. React 状态缓存 → 强制重新加载组件

### Q: 不同浏览器显示不同结果
**A:** 缓存问题。每个浏览器单独清除缓存。

## 预期正确结果

**Kin 239（蓝风暴 + 超频）**：
- ❤️ 心轮：**40%** (隔离保护型)
- 🗣️ 喉轮：**82%** (定频模式)
- 👁️ 松果体：**98%** (全景感知型)

## 如果所有步骤都完成但仍有问题

请提供以下信息：
1. 浏览器类型和版本
2. Console 中的任何错误信息
3. Network 标签中 `index-*.js` 的文件名和大小
4. 数据库查询的实际返回值
5. 页面显示的实际数值

---

**最后更新**：2026-03-02
**相关文件**：
- `src/utils/knowledgeBaseDrivenReportEngine.ts` (143行)
- `supabase/migrations/update_blue_storm_heart_chakra_to_match_gemini.sql`
