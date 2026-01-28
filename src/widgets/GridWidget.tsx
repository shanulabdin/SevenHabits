'use no memo';

import { ColorProp, FlexWidget, type FlexWidgetProps } from "react-native-android-widget";

type Props = {
  title?: string; // optional (if you want later)
  history: Record<string, boolean>;
  endDateKey: string; // usually todayKey
  weeks?: number;     // fixed in v1
  size?: number;      // box size in dp
  gap?: number;       // spacing in dp
  bg: ColorProp;
  orange: ColorProp;
  muted: ColorProp;      // empty cell fill
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

function buildColumns(endDateKey: string, weeks: number) {
  const totalDays = weeks * 7;
  const firstKey = addDaysToKey(endDateKey, -(totalDays - 1));

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
}

export function GridWidget({
  history,
  endDateKey,
  weeks = 12,   // good fit for 4x2
  size = 10,    // adjust if needed
  gap = 2,
  bg,
  orange,
  muted,
}: Props) {
  const columns = buildColumns(endDateKey, weeks);

  const Root: FlexWidgetProps = {
    clickAction: "OPEN_APP", // tap opens app
    style: {
      width: "match_parent",
      height: "match_parent",
      padding: 12,
      backgroundColor: bg,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
  };

  return (
    <FlexWidget {...Root}>
      {columns.map((col, i) => (
        <FlexWidget
          key={`col-${i}`}
          style={{
            flexDirection: "column",
            marginRight: i === columns.length - 1 ? 0 : gap,
          }}
        >
          {col.map((dateKey, j) => {
            const done = history[dateKey] === true;

            return (
              <FlexWidget
                key={dateKey}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: done ? orange : muted,
                  borderRadius: 3,
                  borderWidth: done ? 0 : 1,
                  marginBottom: j === col.length - 1 ? 0 : gap,
                }}
              />
            );
          })}
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}
