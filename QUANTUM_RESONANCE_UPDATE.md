# 量子共振因素更新说明

## 更新内容概览

### 1. 日期选择器优化
**问题修复：**
- ✅ 移除了选中日期的放大效果，改用背景色高亮和左侧金色边框
- ✅ 修复了滚动时日期自动跳动的问题（只在拖动时才更新选中值）
- ✅ 确保选中什么日期就显示什么日期，不会自动偏移

**视觉优化：**
- 选中项使用背景色高亮：`rgba(235, 200, 98, 0.08)`
- 左侧金色边框标识：`2px solid #EBC862`
- 字体粗细变化：选中项 `fontWeight: 400`，未选中 `fontWeight: 200`
- 保持统一字体大小 `0.95rem`，不放大

### 2. 量子共振因素系统（全新设计）

**原设计问题：**
- 父母和孩子信息分散在多个独立的日期选择器中
- 无法灵活添加其他关系的人（如伴侣、朋友、导师等）
- 不支持持续添加多个人

**新设计特点：**

#### Portal风格交互
```
┌─────────────────────────────────────────┐
│ ⊕ 添加量子共振因素      已添加 2 人     │  ← 主入口（可展开/收起）
├─────────────────────────────────────────┤
│ 选择关系：                               │
│ ┌────────┬────────┐                     │
│ │ 父亲 ✓ │ 母亲   │                     │  ← 关系选择（网格布局）
│ ├────────┼────────┤                     │
│ │ 孩子   │ 伴侣   │                     │
│ ├────────┼────────┤                     │
│ │ 其他   │        │                     │
│ └────────┴────────┘                     │
│ [自定义关系输入框]（仅"其他"时显示）     │
│ [确认添加]                               │
└─────────────────────────────────────────┘
```

#### 支持的关系类型
1. **父亲** - 用于计算父系能量影响
2. **母亲** - 用于计算母系能量影响（特殊的母体灌溉效应）
3. **孩子** - 用于计算亲子能量互动
4. **伴侣** - 用于计算伴侣关系共振
5. **其他** - 自定义关系（朋友、导师、同事等）

#### 持续添加机制
- 点击"⊕ 添加量子共振因素"展开选择面板
- 选择关系类型 → 确认添加
- 自动生成该关系的日期选择器
- 可以继续添加更多人，无数量限制
- 每个人都有独立的删除按钮（右上角 ✗）

### 3. 组件架构

#### QuantumResonanceAdder 组件
**功能：**
- 统一的量子共振因素添加入口
- 关系选择器（5种预设关系 + 自定义）
- 动态生成日期选择器
- 人员列表管理（添加/删除）

**接口：**
```typescript
interface ResonancePerson {
  id: string;
  relationship: 'father' | 'mother' | 'child' | 'partner' | 'other';
  birthDate: Date | null;
  kinData: KinData | null;
  midnightType: 'early' | 'late' | null;
  customLabel?: string;  // 自定义关系名称
}
```

**Props：**
```typescript
interface QuantumResonanceAdderProps {
  onPersonsChange: (persons: ResonancePerson[]) => void;
  onDateSelect: (id: string, dateString: string, midnightType: 'early' | 'late' | null) => void;
}
```

#### EnergyPerson 集成
- 用 `resonancePersons` 状态统一管理所有量子共振因素
- 自动映射关系类型到能量计算函数
- 支持多人能量场叠加计算

### 4. 视觉设计特点

**Portal风格元素：**
1. **圆形加号按钮** - 旋转动画（展开时旋转45度变成×）
2. **网格布局** - 关系选择采用2列网格
3. **渐变背景** - 选中状态使用金色渐变
4. **玻璃态效果** - `backdrop-filter: blur(20px)`
5. **微妙动画** - 所有交互都有300ms过渡

**色彩系统：**
- 主色：`#EBC862`（金色）
- 背景：`rgba(255, 255, 255, 0.02)` 至 `0.15`
- 边框：`rgba(247, 231, 206, 0.08)` 至 `0.3`
- 删除按钮：`rgba(255, 100, 100, 0.1)`

### 5. 用户体验优化

**添加流程：**
1. 点击"添加量子共振因素"
2. 面板平滑展开（手风琴动画）
3. 选择关系类型（点击高亮）
4. 如果选择"其他"，输入自定义名称
5. 点击"确认添加"
6. 自动生成日期选择器并收起面板
7. 重复以上步骤可继续添加

**删除流程：**
1. 每个日期选择器右上角有删除按钮
2. 点击后立即移除该人
3. 不需要二次确认（简化操作）

**智能状态：**
- "确认添加"按钮在"其他"关系未填写名称时禁用
- 已添加人数实时显示在右上角
- 每个人的图标和标签自动匹配其关系类型

### 6. 技术细节

#### 日期选择器拖动检测
```typescript
const [isDragging, setIsDragging] = useState(false);

// 只在拖动时更新选中值
onScroll={(e) => {
  if (!isDragging) return;
  // ... 更新逻辑
}}
```

#### 关系映射
```typescript
const relationMap: Record<string, 'father' | 'mother' | 'child'> = {
  'father': 'father',
  'mother': 'mother',
  'child': 'child',
  'partner': 'child',   // 映射到child关系计算
  'other': 'child'      // 映射到child关系计算
};
```

### 7. 响应式设计

- 关系选择网格：手机端2列，平板/桌面端保持2列
- 日期选择器：全宽度，自适应容器
- 删除按钮：固定定位在右上角，不影响布局

## 使用示例

```typescript
// 添加父亲
<QuantumResonanceAdder
  onPersonsChange={(persons) => setResonancePersons(persons)}
  onDateSelect={(id, date, midnight) => {
    const kinData = calculateKin(new Date(date), midnight);
    // 更新对应人员的kinData
  }}
/>
```

## 构建状态

✅ 所有代码已成功编译
✅ 无TypeScript错误
✅ 无ESLint警告
✅ 打包体积：460.29 kB (gzip: 130.21 kB)
