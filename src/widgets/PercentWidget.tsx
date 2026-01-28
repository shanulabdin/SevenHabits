'use no memo';

import { FlexWidget, TextWidget, type FlexWidgetProps } from "react-native-android-widget";

type Props = {
  title: string;     // "Overall"
  percent: number;   // 0..100
  subtitle?: string; // "32/50" optional
};

export function PercentWidget({ title, percent, subtitle }: Props) {
  const container: FlexWidgetProps["style"] = {
    width: "match_parent",
    height: "match_parent",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#151515",
    justifyContent: "space-between",
  };

  return (
    <FlexWidget style={container}>
      <TextWidget
        text={title}
        style={{
          fontSize: 14,
          fontFamily: "Poppins",
          fontWeight: "600",
          color: "#ffffffb3",
        }}
      />

      <FlexWidget style={{ alignItems: "center", justifyContent: "center" }}>
        <TextWidget
          text={`${percent}%`}
          style={{
            fontSize: 40,
            fontFamily: "Poppins",
            fontWeight: "700",
            color: "#FFFFFF",
          }}
        />
        {subtitle ? (
          <TextWidget
            text={subtitle}
            style={{
              fontSize: 12,
              fontFamily: "Poppins",
              fontWeight: "500",
              color: "#ffffff80",
            }}
          />
        ) : null}
      </FlexWidget>

      <TextWidget
        text="Tap to open"
        style={{
          fontSize: 12,
          fontFamily: "Poppins",
          fontWeight: "500",
          color: "#ffffff66",
        }}
      />
    </FlexWidget>
  );
}
