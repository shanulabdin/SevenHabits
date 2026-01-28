import {
  FlexWidget,
  TextWidget,
  type ColorProp,
} from "react-native-android-widget";

type Props = {
  title: string;
  history: Record<string, boolean>;
  endDateKey: string; // usually todayKey
  weeks?: number;     // default 20 -> 140 days
  size?: number;      // square size
  gap?: number;       // spacing
  bg: ColorProp;
  text: ColorProp;
  muted: ColorProp;
  empty: ColorProp;   // color for not-done square
  filled: ColorProp;  // color for done square
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

export function ContributionGridWidget({
  title,
  history,
  endDateKey,
  weeks = 20,
  size = 12,
  gap = 3,
  bg,
  text,
  muted,
  empty,
  filled,
}: Props) {
  const cols = buildColumns(endDateKey, weeks);

  // optional: compute a quick stat for subtitle
  const total = weeks * 7;
  let done = 0;
  for (const col of cols) {
    for (const key of col) if (history[key] === true) done++;
  }

  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: "match_parent",
        padding: 14,
        borderRadius: 18,
        backgroundColor: bg,
        flexDirection: "column",
      }}
    >
      <TextWidget
        text={title}
        style={{
          width: "match_parent",
          fontSize: 14,
          fontFamily: "Poppins",
          fontWeight: "700",
          color: text,
        }}
      />
      <TextWidget
        text={`${done}/${total} days`}
        style={{
          width: "match_parent",
          marginTop: 2,
          fontSize: 12,
          fontFamily: "Poppins",
          fontWeight: "500",
          color: muted,
        }}
      />

      <FlexWidget style={{ height: 10 }} />

      {/* Grid */}
      <FlexWidget style={{ flexDirection: "row" }}>
        {cols.map((col, i) => (
          <FlexWidget
            key={`c-${i}`}
            style={{
              flexDirection: "column",
              marginRight: i === cols.length - 1 ? 0 : gap,
            }}
          >
            {col.map((dateKey, j) => {
              const isDone = history[dateKey] === true;
              return (
                <FlexWidget
                  key={dateKey}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: 3,
                    backgroundColor: isDone ? filled : empty,
                    marginBottom: j === col.length - 1 ? 0 : gap,
                  }}
                />
              );
            })}
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}
