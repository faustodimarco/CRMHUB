import { format, parse, isAfter, startOfMonth } from 'date-fns';

export const filterFutureEntries = (entries: any[]) => {
  const currentMonth = startOfMonth(new Date());
  
  return entries.filter(entry => {
    const entryDate = parse(entry.month, 'yyyy-MM', new Date());
    return !isAfter(entryDate, currentMonth);
  });
};