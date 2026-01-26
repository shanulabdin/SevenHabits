import type { Habit } from "@/types/habit"; // <-- adjust path
import { getDateKey } from "@/utils/date"; // <-- adjust path to where your getDateKey is
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "@forge/habits_v1";

type HabitsContextValue = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  resetAllData: () => Promise<void>;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

function buildDefaultHabits(todayKey: string): Habit[] {
  return [
    { id: "1", title: "Workout", history: { [todayKey]: false }, showGrid: false },
    { id: "2", title: "Meditate", history: { [todayKey]: false }, showGrid: false },
    { id: "3", title: "Sleep Early", history: { [todayKey]: false }, showGrid: false },
  ];
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const todayKey = useMemo(() => getDateKey(new Date()), []);

  // 1) STATE (moved from index)
  const [habits, setHabits] = useState<Habit[]>(() => buildDefaultHabits(todayKey));

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
                showGrid: typeof h.showGrid === "boolean" ? h.showGrid : true,
              };
              return habit;
            }

            if (h.history && typeof h.history === "object") {
              const habit: Habit = {
                id: String(h.id),
                title: String(h.title),
                history: h.history as Record<string, boolean>,
                showGrid: typeof h.showGrid === "boolean" ? h.showGrid : true,
              };
              return habit;
            }

            return null;
          })
          .filter((h): h is Habit => h !== null);


        if (cleaned.length) setHabits(cleaned);
      } catch (e) {
        console.log("Failed to load habits:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) SAVE on change (moved from index)
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      } catch (e) {
        console.log("Failed to save habits:", e);
      }
    })();
  }, [habits]);

  // 4) RESET (moved from index)
  async function resetAllData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);

      // Choose ONE:
      setHabits([]); // wipe completely
      // setHabits(buildDefaultHabits(getDateKey(new Date()))); // reset to defaults
    } catch (e) {
      console.log("Failed to reset storage:", e);
    }
  }

  const value: HabitsContextValue = { habits, setHabits, resetAllData };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used inside HabitsProvider");
  return ctx;
}
