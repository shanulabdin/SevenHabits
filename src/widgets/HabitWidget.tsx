'use no memo';
import {
  FlexWidget,
  TextWidget,
  type FlexWidgetProps,
} from "react-native-android-widget";

type HabitWidgetProps = {
  title: string;          // e.g. "Code"
  streak: number;         // e.g. 12
  percent7d?: number;     // e.g. 64 (optional for v1 wiring)
};

export function HabitWidget({ title, streak, percent7d }: HabitWidgetProps) {
  const containerStyle: FlexWidgetProps["style"] = {
    width: "match_parent",
    height: "match_parent",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#0B1220",
    justifyContent: "space-between",
  };

  return (
    <FlexWidget style={containerStyle}>
      {/* Top row: Title + Streak */}
      <FlexWidget >
        <TextWidget
          text={title}
          style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}
        />
        <TextWidget
          text={`🔥 ${streak}`}
          style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}
        />
      </FlexWidget>

      {/* Middle: Percentage card style */}
      {typeof percent7d === "number" ? (
        <FlexWidget
          style={{
            padding: 12,
            borderRadius: 14,
            backgroundColor: "#111B2E",
          }}
        >
          <TextWidget
            text={`${percent7d}%`}
            style={{ fontSize: 26, fontWeight: "800", color: "#FFFFFF" }}
          />
          <TextWidget
            text="last 7 days"
            style={{ fontSize: 12, color: "#A7B0C0" }}
          />
        </FlexWidget>
      ) : (
        <FlexWidget />
      )}

      {/* Footer */}
      <TextWidget
        text="Tap to open"
        style={{ fontSize: 12, color: "#A7B0C0" }}
      />
    </FlexWidget>
  );
}
