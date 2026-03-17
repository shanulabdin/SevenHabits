import type { Habit } from "@/types/habit";
import { getDateKey } from "@/utils/date";
import { generateFakeHistory } from "@/utils/history";
import { cancelHabitReminders, scheduleHabitReminders } from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "@forge/habits_v1";

type HabitsContextValue = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  resetAllData: () => Promise<void>;
  setShowGridForAll: (value: boolean) => void;
  setShowStreakForAll: (value: boolean) => void;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

const fakeHistory = generateFakeHistory(365);

function buildDefaultHabits(todayKey: string): Habit[] {
  return [
    { id: "1", title: "Example", history: fakeHistory, showGrid: true, showStreak: true },
    { id: "2", title: "Long Press to edit", history: { [todayKey]: false }, showGrid: false, showStreak: true },
  ];
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const todayKey = useMemo(() => getDateKey(new Date()), []);

  // 1) STATE (moved from index)
  const [habits, setHabits] = useState<Habit[]>(() => buildDefaultHabits(todayKey));

  // Show grid and streak
  const setShowGridForAll = (value: boolean) => {
    setHabits(prev => prev.map(h => ({ ...h, showGrid: value })));
  };

  const setShowStreakForAll = (value: boolean) => {
    setHabits(prev => prev.map(h => ({ ...h, showStreak: value })));
  };
  // 2) LOAD once (moved from index)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;

        const cleaned = parsed
          .map((h: any): Habit | null => {
            if (!h?.id || !h?.title) return null;

            if (!h.history && typeof h.checked === "boolean") {
              const habit: Habit = {
                id: String(h.id),
                title: String(h.title),
                history: { [todayKey]: !!h.checked },
                showStreak: typeof h.showStreak === "boolean" ? h.showStreak : false,
              };
              return habit;
            }

            if (h.history && typeof h.history === "object") {
              const habit: Habit = {
                id: String(h.id),
                title: String(h.title),
                history: h.history as Record<string, boolean>,
                showGrid: typeof h.showGrid === "boolean" ? h.showGrid : true,
                showStreak: typeof h.showStreak === "boolean" ? h.showStreak : false,
                reminder: h.reminder ?? null,
              };
              return habit;
            }

            return null;
          })
          .filter((h): h is Habit => h !== null);


        if (cleaned.length) setHabits(cleaned);
      } catch { }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-schedule all notifications on app start (they may be cleared after reboot)
  const hasScheduledRef = useRef(false);
  useEffect(() => {
    if (hasScheduledRef.current) return;
    // Wait until habits are loaded from storage (not defaults)
    if (habits.length === 0) return;

    hasScheduledRef.current = true;
    (async () => {
      for (const habit of habits) {
        if (habit.reminder && habit.reminder.days.length > 0) {
          await scheduleHabitReminders(habit.id, habit.title, habit.reminder);
        }
      }
    })();
  }, [habits]);

  // 3) SAVE on change (moved from index)
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      } catch { }
    })();
  }, [habits]);

  // 4) RESET (moved from index)
  async function resetAllData() {
    try {
      // Cancel all habit reminders
      for (const habit of habits) {
        await cancelHabitReminders(habit.id);
      }
      await AsyncStorage.removeItem(STORAGE_KEY);

      // Choose ONE:
      setHabits([]); // wipe completely
      // setHabits(buildDefaultHabits(getDateKey(new Date()))); // reset to defaults
    } catch { }
  }

  const value: HabitsContextValue = {
    habits, setHabits, resetAllData,
    setShowGridForAll,
    setShowStreakForAll,
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used inside HabitsProvider");
  return ctx;
}
