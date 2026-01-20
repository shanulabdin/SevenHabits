import type { Habit } from "@/types/habit";

export function getPercentForDate(habits: Habit[], dateKey: string) {
  const total = habits.length;
  if (total === 0) return 0;

  const done = habits.reduce((sum, h) => sum + (h.history?.[dateKey] === true ? 1 : 0), 0);
  return Math.round((done / total) * 100);
}

export function getWeeklyPercent(habits: Habit[], weekDateKeys: string[]) {
  const totalPossible = habits.length * weekDateKeys.length;
  if (totalPossible === 0) return 0;

  const doneCount = habits.reduce((sum, habit) => {
    const doneInWeek = weekDateKeys.reduce((daySum, dateKey) => {
      return daySum + (habit.history[dateKey] === true ? 1 : 0);
    }, 0);

    return sum + doneInWeek;
  }, 0);

  return Math.round((doneCount / totalPossible) * 100);
}
