export function getMonthInfo(dateStr: string) {
  const [monthStr, dayStr, yearStr] = dateStr.split(" ");
  const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth(); // get the month index (0-based)
  const amount = new Date(parseInt(yearStr), month + 1, 0).getDate(); // get the last day of the month
  const firstDay = 1; // first day is always 1
  const start = `${monthStr} ${firstDay}, ${yearStr}`;
  const end = `${monthStr} ${amount}, ${yearStr}`;
  // return [firstDayStr, lastDayStr, lastDay];
  return {start: start, end: end};
}