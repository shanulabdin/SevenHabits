import { Habit } from "@/types/habit";
import { addDaysToKey } from "./date";

export function getHabitStreak(habit: Habit, upToDateKey: string) {
  let streak = 0;
  let cursor = upToDateKey;

  while (habit.history[cursor] === true) {
    streak += 1;
    cursor = addDaysToKey(cursor, -1); // go one day back
  }

  return streak;
}

export function getHabitStreakWithGrace(habit: Habit, dateKey: string, todayKey: string) {
  // If we're looking at TODAY, and the habit is not done yet,
  // show streak as of YESTERDAY (grace until the day ends).
  if (dateKey === todayKey && habit.history[todayKey] !== true) {
    const yesterdayKey = addDaysToKey(todayKey, -1);
    return getHabitStreak(habit, yesterdayKey);
  }

  // Otherwise: normal strict streak up to the selected day
  return getHabitStreak(habit, dateKey);
}