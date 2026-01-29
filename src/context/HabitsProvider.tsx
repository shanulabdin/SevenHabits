import type { Habit } from "@/types/habit"; // <-- adjust path
import { getDateKey, getLastNDays } from "@/utils/date"; // <-- adjust path to where your getDateKey is
import { getHabitStreakWithGrace } from "@/utils/streaks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { requestWidgetUpdate } from "react-native-android-widget";
import { GridWidget } from "../widgets/GridWidget";
import { PercentWidget } from "../widgets/PercentWidget";
import { StreakOnlyWidget } from "../widgets/StreakOnlyWidget";

const STORAGE_KEY = "@forge/habits_v1";

type HabitsContextValue = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  resetAllData: () => Promise<void>;
  setShowGridForAll: (value: boolean) => void;
  setShowStreakForAll: (value: boolean) => void;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

function generateFakeHistory(days: number): Record<string, boolean> {
  const history: Record<string, boolean> = {};
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
    history[key] = Math.random() > 0.25; // ~75% filled
  }

  return history;
}

function buildDefaultHabits(todayKey: string): Habit[] {
  return [
    { id: "1", title: "Example", history: generateFakeHistory(150), showGrid: true, showStreak: true },
    { id: "2", title: "Long Press to edit", history: { [todayKey]: false }, showGrid: false, showStreak: true },
  ];
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const todayKey = useMemo(() => getDateKey(new Date()), []);

  // 1) STATE (moved from index)
  const [habits, setHabits] = useState<Habit[]>(() => buildDefaultHabits(todayKey));

  // Push real data to the "StreakOnly" widget whenever habits change
  useEffect(() => {
    if (!habits || habits.length === 0) return;

    const first = habits[0];
    const streak = getHabitStreakWithGrace(first, todayKey, todayKey);

    const LIGHT = {
      bg: "#FFFFFF" as const,
      text: "#111111" as const,
      muted: "#11111199" as const,
    };

    const DARK = {
      bg: "#151515" as const,
      text: "#FFFFFF" as const,
      muted: "#FFFFFFB3" as const,
    };

    requestWidgetUpdate({
      widgetName: "StreakOnly",
      renderWidget: () => ({
        light: (
          <StreakOnlyWidget
            title={first.title || "Forge"}
            streak={typeof streak === "number" ? streak : 0}
            {...LIGHT}
          />
        ),
        dark: (
          <StreakOnlyWidget
            title={first.title || "Forge"}
            streak={typeof streak === "number" ? streak : 0}
            {...DARK}
          />
        ),
      }),
      widgetNotFound: () => {
        // No widget placed on home screen yet — ignore
      },
    });
  }, [habits, todayKey]);

  // Update Overall % widget (last 10 days)
  useEffect(() => {
    if (!habits || habits.length === 0) return;

    const TEN_DAYS = 10;
    const lastDays = getLastNDays(TEN_DAYS);
    const dateKeys = lastDays.map((d) => getDateKey(d));

    const first = habits[0];

    const possible = dateKeys.length;
    let done = 0;

    for (const key of dateKeys) {
      if (first.history?.[key] === true) done += 1;
    }

    const percent = possible ? Math.round((done / possible) * 100) : 0;

    const LIGHT = {
      bg: "#FFFFFF" as const,
      text: "#111111" as const,
      muted: "#11111199" as const,
    };

    const DARK = {
      bg: "#151515" as const,
      text: "#FFFFFF" as const,
      muted: "#FFFFFFB3" as const,
    };


    requestWidgetUpdate({
      widgetName: "PercentCard",
      renderWidget: () => ({
        light: (
          <PercentWidget
            title={`${first.title}`}
            percent={percent}
            subtitle={`${done}/${possible}`}
            {...LIGHT}
          />
        ),
        dark: (
          <PercentWidget
            title={`${first.title}`}
            percent={percent}
            subtitle={`${done}/${possible}`}
            {...DARK}
          />
        ),
      }),
      widgetNotFound: () => { },
    });

  }, [habits]);

  // Grid Widget
  useEffect(() => {
    if (!habits || habits.length === 0) return;

    const first = habits[0];
    const todayKey = getDateKey(new Date());

    const LIGHT = {
      bg: "#FFFFFF",
      orange: "#FF6D1F",
      muted: "#a1a1a14d",
      border: "#00000033",
    } as const;

    const DARK = {
      bg: "#151515",
      orange: "#FF6D1F",
      muted: "#a1a1a14d",
      border: "#FFFFFF33",
    } as const;

    requestWidgetUpdate({
      widgetName: "GridWidget",
      renderWidget: () => ({
        light: (
          <GridWidget
            history={first.history ?? {}}
            endDateKey={todayKey}
            {...LIGHT}
          />
        ),
        dark: (
          <GridWidget
            history={first.history ?? {}}
            endDateKey={todayKey}
            {...DARK}
          />
        ),
      }),
      widgetNotFound: () => { },
    });
  }, [habits]);


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
