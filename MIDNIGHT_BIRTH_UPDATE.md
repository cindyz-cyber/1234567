# 子时出生功能更新说明

## 更新内容

### 1. 子时出生分类
原来的单一"子时出生"选项已更新为两个独立选项：

- **前子时（23:00-00:00）**：当天日期 + 次日（当天+1）日期的两个Kin互相影响
- **后子时（00:00-01:00）**：当天日期 + 前日（当天-1）日期的两个Kin互相影响

### 2. 家庭成员信息扩展
- 原："添加父母信息（可选）"
- 新："添加父母和孩子信息（可选）"
- 新增了"孩子的出生日期"输入选项

### 3. 术语统一
所有"降临时刻"已统一改为"出生日期"：
- 我的降临时刻 → 我的出生日期
- 父亲的降临时刻 → 父亲的出生日期
- 母亲的降临时刻 → 母亲的出生日期
- 新增：孩子的出生日期

### 4. 页面流程优化
- 填写信息阶段：用户在同一页面完成所有信息填写
  - 日期选择器采用内联展开式设计，不跳转页面
  - 可以同时看到所有已填写的家庭成员信息
  - 手风琴式交互，流畅自然

- 生成报告阶段：
  - 点击"生成能量画像"按钮后，整个页面切换到报告视图
  - 显示完整的能量画像报告
  - 报告包含核心计算维度、能量雷达图、深度画像等

## 技术实现

### 数据结构更新

```typescript
// KinData接口
export interface KinData {
  kin: number;
  seal: number;
  tone: number;
  sealName: string;
  toneName: string;
  wavespell: number;
  wavespellName: string;
  hiddenPower: number;
  hiddenPowerName: string;
  toneType: string;
  midnightType?: 'early' | 'late' | null;  // 新增
  secondaryKin?: number;
}
```

### 子时算法

```typescript
export function calculateKin(
  birthDate: Date,
  midnightType: 'early' | 'late' | null = null
): KinData {
  // ...基础计算...

  if (midnightType) {
    let secondaryDate = new Date(birthDate);

    if (midnightType === 'early') {
      // 前子时：当天 + 次日
      secondaryDate.setDate(secondaryDate.getDate() + 1);
    } else {
      // 后子时：当天 + 前日
      secondaryDate.setDate(secondaryDate.getDate() - 1);
    }

    // 计算第二个Kin值
    result.secondaryKin = calculateSecondaryKin(secondaryDate);
  }

  return result;
}
```

### UI组件更新

**ImmersiveDatePicker组件**
- 内联展开设计，不使用全屏模态框
- 手风琴式动画，平滑过渡
- 前子时和后子时双选项设计
- 禅宗美学：金色强调色、极简布局、呼吸式动画

**EnergyPerson组件**
- 增加childData状态管理
- 双阶段视图：填写信息 → 查看报告
- 使用showReport状态控制页面切换

## 用户体验改进

1. **信息可见性**
   - 所有日期选择器可同时展开
   - 已选择的信息始终可见
   - 不会因为操作而丢失其他信息的视野

2. **交互流畅性**
   - 点击卡片标题展开/收起
   - 滚轮选择器，直观易用
   - "锁定时刻"按钮确认选择

3. **视觉设计**
   - 禅宗风格：简洁、宁静、聚焦
   - 金色（#EBC862）作为强调色
   - 渐变遮罩突出重点
   - 充足的留白和间距

## 测试建议

1. 测试前子时逻辑：选择某日期+前子时，验证是否计算了当天和次日的Kin
2. 测试后子时逻辑：选择某日期+后子时，验证是否计算了当天和前日的Kin
3. 测试孩子信息：添加孩子出生日期，验证家族能量场计算
4. 测试页面流程：填写信息→生成报告→分享，验证完整流程
5. 测试多个日期选择器同时展开的情况
