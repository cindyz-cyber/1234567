// 调试日期计算

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function calculateDaysExcludingLeapDays(date1: Date, date2: Date): number {
  let startDate = new Date(date1);
  let endDate = new Date(date2);
  let isNegative = false;

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

    if (!(month === 1 && day === 29 && isLeapYear(year))) {
      days++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return isNegative ? -days : days;
}

// 测试
const anchor = new Date('1983-09-30');
const test = new Date('2000-11-03');

console.log('起始日期:', anchor.toISOString());
console.log('目标日期:', test.toISOString());

const days = calculateDaysExcludingLeapDays(anchor, test);
console.log('有效天数:', days);

const kin = ((200 + days - 1) % 260 + 260) % 260 + 1;
console.log('计算Kin:', kin);
console.log('期望Kin: 199');

// 列出闰年
const leapYears: number[] = [];
for (let y = 1983; y <= 2000; y++) {
  if (isLeapYear(y)) leapYears.push(y);
}
console.log('期间闰年:', leapYears);
console.log('闰年数量:', leapYears.length);

// 简单天数
const simpleDays = Math.floor((test.getTime() - anchor.getTime()) / 86400000);
console.log('简单天数:', simpleDays);
console.log('剔除闰日后:', simpleDays - leapYears.length);
