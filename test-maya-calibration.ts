// 玛雅历算法校准测试脚本

// 判断是否为闰年
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 计算两个日期之间的天数差，完全剔除所有2月29日
function calculateDaysExcludingLeapDays(date1: Date, date2: Date): number {
  let startDate = new Date(date1);
  let endDate = new Date(date2);
  let isNegative = false;

  // 确保 startDate <= endDate
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
    isNegative = true;
  }

  let days = 0;
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    // 跳过2月29日
    if (!(month === 1 && day === 29 && isLeapYear(year))) {
      days++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return isNegative ? -days : days;
}

// 测试用例
const testCases = [
  { date: new Date('1983-09-30'), expectedKin: 200, description: '绝对基准: 1983-09-30 = Kin 200' },
  { date: new Date('1963-09-30'), expectedKin: 180, description: '自检用例1: 1963-09-30 = Kin 180' },
  { date: new Date('1994-07-16'), expectedKin: 239, description: '自检用例2: 1994-07-16 = Kin 239' },
  { date: new Date('2000-11-03'), expectedKin: 199, description: '自检用例3: 2000-11-03 = Kin 199' },
  { date: new Date('2023-02-10'), expectedKin: 8, description: '自检用例4: 2023-02-10 = Kin 8' }
];

const anchorDate = new Date('1983-09-30');
const anchorKin = 200;

console.log('==========================================');
console.log('玛雅历算法校准测试');
console.log('==========================================\n');

let allPassed = true;

for (const testCase of testCases) {
  const effectiveDays = calculateDaysExcludingLeapDays(anchorDate, testCase.date);
  const calculatedKin = ((anchorKin + effectiveDays - 1) % 260 + 260) % 260 + 1;
  const passed = calculatedKin === testCase.expectedKin;

  if (!passed) allPassed = false;

  console.log(`${passed ? '✅' : '❌'} ${testCase.description}`);
  console.log(`   有效天数: ${effectiveDays}`);
  console.log(`   计算值: Kin ${calculatedKin}`);
  console.log(`   期望值: Kin ${testCase.expectedKin}`);

  if (!passed) {
    console.log(`   ⚠️  偏差: ${calculatedKin - testCase.expectedKin}`);
  }

  console.log('');
}

console.log('==========================================');
if (allPassed) {
  console.log('✅ 所有测试通过！算法校准成功！');
} else {
  console.log('❌ 部分测试失败，需要调整算法');
}
console.log('==========================================');
