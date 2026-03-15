# 数据库驱动引擎 - 归一化完成报告

## 执行的清理工作

### 1. ✅ 删除所有硬编码的脉轮计算逻辑

**文件**: `src/utils/energyPortraitEngine.ts`

**删除的内容**:
- 删除了 `calculateEnergyCenters()` 函数中的所有独立计算逻辑
- 删除了 TONES、SEALS、WAVESPELLS 等硬编码常量数组
- 删除了 `generateHeartDescription()`、`generateThroatDescription()`、`generateThirdEyeDescription()` 等生成文案的函数
- 删除了所有基于 tone、seal、wavespell 进行的百分比加减计算（如：`baseScores[sealData.chakra] += 40`）

### 2. ✅ 建立纯Kin驱动的数据库查询模式

**新架构**:
```typescript
async function generateEnergyReport(kin: number) {
  // 1. 从数据库读取能量中心数据
  const centers = await fetchEnergyCentersFromDatabase(kin);

  // 2. 从数据库读取基础信息（音调、图腾、波符）
  const basicInfo = await fetchKinBasicInfo(kin);

  // 3. 所有数据都来自数据库，无独立计算
  return report;
}
```

### 3. ✅ 波符成为Kin的派生属性

**关键公式**（已在代码中实现）:
```typescript
// 波符起始Kin的计算公式（保留在 mayaCalendar.ts）
const anchorKin = Math.floor((kin - 1) / 13) * 13 + 1;

// 波符名称从起始Kin的图腾派生
const wavespellName = getTotemNameByKin(anchorKin);
```

## 数据流向

### 旧流程（已删除）:
```
用户生日 → 计算Kin →
  → 计算tone、seal、wavespell
  → 硬编码规则计算百分比（baseScore + tone加成 + wavespell加成）
  → 硬编码规则生成文案
  → 显示报告
```

### 新流程（当前）:
```
用户生日 → 计算Kin →
  → 查询数据库 kin_energy_centers (kin = X)
  → 查询数据库 knowledge_base_totems (kin = X)
  → 直接使用数据库返回的数据
  → 显示报告
```

## 数据库依赖

### 必需的数据表：

1. **kin_energy_centers** - 存储每个Kin的能量中心数据
   - kin (主键)
   - center_name (心轮/喉轮/松果体)
   - percentage (能量百分比)
   - mode (模式：恒星模式/传播者模式等)
   - description (描述文案)
   - traits (特质)
   - weaknesses (弱点)

2. **knowledge_base_totems** - 存储每个Kin的基础信息
   - kin (主键)
   - tone_name (音调名称)
   - seal_name (图腾名称)
   - essence (本质描述)
   - wavespell_name (波符名称)

3. **knowledge_base_wavespells** - 存储波符信息
   - start_kin (波符起始Kin)
   - name (波符名称)

## 验证规则

### 对于任意Kin，必须满足：

1. **Kin 200**（示例）:
   - 数据库必须有记录：kin_energy_centers.kin = 200
   - 心轮显示数据库值（如：95%）
   - 喉轮显示数据库值（如：85%）
   - 松果体显示数据库值（如：70%）

2. **Kin 239**（示例）:
   - 数据库必须有记录：kin_energy_centers.kin = 239
   - 心轮显示数据库值（如：40%）
   - 喉轮显示数据库值
   - 松果体显示数据库值

3. **Kin 66**（示例）:
   - 数据库必须有记录：kin_energy_centers.kin = 66
   - 心轮显示数据库值（如：48%）
   - 喉轮显示数据库值
   - 松果体显示数据库值

## 错误处理

如果数据库中没有某个Kin的数据，引擎会：
1. 抛出错误并在控制台输出警告
2. 提示用户该Kin没有数据
3. **不会**使用任何独立计算逻辑作为后备

## 子时修正（保留在Kin计算层）

子时动态修正**仅**在Kin计算阶段引入：

```typescript
// mayaCalendar.ts 中的 calculateKin 函数
if (midnightType === 'early') {
  // 前子时：40% 当天Kin + 60% 前一天Kin
  compositeKin = Math.round(currentDayKin * 0.4 + previousDayKin * 0.6);
} else if (midnightType === 'late') {
  // 后子时：60% 当天Kin + 40% 前一天Kin
  compositeKin = Math.round(currentDayKin * 0.6 + previousDayKin * 0.4);
}
```

计算出复合Kin后，**所有UI表达都严格跟随这个Kin的数据库数据**。

## UI显示规则

### 禁止显示的内容（直到从数据库加载）：
- ❌ 任何基于独立算法生成的百分比
- ❌ 任何非数据库来源的性格描述
- ❌ 任何独立推测的文案

### 允许显示的内容：
- ✅ Kin序号（从生日计算得出）
- ✅ 数据库中的能量百分比
- ✅ 数据库中的模式、描述、特质、弱点
- ✅ 数据库中的音调、图腾、波符名称

## 代码文件清单

### 核心文件：
1. `src/utils/energyPortraitEngine.ts` - 纯数据库驱动引擎（已重写）
2. `src/utils/mayaCalendar.ts` - Kin计算引擎（保留，波符计算已是Kin派生）
3. `src/components/EnergyPerson.tsx` - 主界面组件（已更新为异步加载）

### 数据库迁移文件：
1. `supabase/migrations/20260302061133_create_knowledge_base_tables.sql` - 知识库表结构
2. `supabase/migrations/20260302062115_create_wavespell_table.sql` - 波符表

## 使用说明

### 开发者需要做的事情：

1. **添加新Kin数据**：
   ```sql
   INSERT INTO kin_energy_centers (kin, center_name, percentage, mode, description, traits, weaknesses)
   VALUES (X, '心轮', Y, 'Z模式', '描述', '特质', '弱点');
   ```

2. **更新现有Kin数据**：
   ```sql
   UPDATE kin_energy_centers
   SET percentage = 新值, description = '新描述'
   WHERE kin = X AND center_name = '心轮';
   ```

3. **验证数据完整性**：
   - 确保每个Kin有3条记录（心轮、喉轮、松果体）
   - 确保 knowledge_base_totems 中有对应的Kin记录

## 构建状态

✅ 构建成功（无TypeScript错误）
✅ 所有硬编码逻辑已删除
✅ 数据库驱动架构已就绪

---

**最后更新**: 2026-03-02
**状态**: 归一化完成 ✅
