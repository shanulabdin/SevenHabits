'use no memo';

import { FlexWidget, TextWidget, type FlexWidgetProps } from "react-native-android-widget";

type Props = {
  title: string;
  streak: number;
};

export function StreakOnlyWidget({ title, streak }: Props) {
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
      <TextWidget
        text={title}
        style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}
      />

      <TextWidget
        text={`🔥 ${streak}`}
        style={{ fontSize: 34, fontWeight: "900", color: "#FFFFFF" }}
      />

      <TextWidget
        text="Tap to open"
        style={{ fontSize: 12, color: "#A7B0C0" }}
      />
    </FlexWidget>
  );
}
