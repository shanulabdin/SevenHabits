import { colors } from "@/constants/colors";
import React, { useMemo } from "react";
import { View } from "react-native";

type Props = {
  history: Record<string, boolean>;
  endDateKey: string;     // usually todayKey
  weeks?: number;         // default 14 -> 98 days (like your screenshot vibe)
  size?: number;          // square size
  gap?: number;           // spacing
};

function dateKeyToDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysToKey(dateKey: string, deltaDays: number) {
  const dt = dateKeyToDate(dateKey);
  dt.setDate(dt.getDate() + deltaDays);
  return getDateKey(dt);
}

export default function ContributionGrid({
  history,
  endDateKey,
  weeks = 20,
  size = 16,
  gap = 3,
}: Props) {
  const totalDays = weeks * 7;

  const columns = useMemo(() => {
    const firstKey = addDaysToKey(endDateKey, -(totalDays - 1));

    // Build week-columns (GitHub style): each column has 7 squares (Sun..Sat)
    const cols: string[][] = [];
    for (let w = 0; w < weeks; w++) {
      const col: string[] = [];
      for (let dow = 0; dow < 7; dow++) {
        const idx = w * 7 + dow;
        col.push(addDaysToKey(firstKey, idx));
      }
      cols.push(col);
    }
    return cols;
  }, [endDateKey, weeks, totalDays]);

  return (
    <View className="flex-row" style={{ gap }}>
      {columns.map((col, i) => (
        <View key={i} style={{ gap }}>
          {col.map((dateKey) => {
            const done = history[dateKey] === true;

            return (
              <View
                key={dateKey}
                style={{
                  width: size,
                  height: size,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 3,
                  backgroundColor: done ? colors.orange : colors.dark,
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
