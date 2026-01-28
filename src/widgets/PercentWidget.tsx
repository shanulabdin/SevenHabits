'use no memo';

import { FlexWidget, SvgWidget, TextWidget, type FlexWidgetProps } from "react-native-android-widget";

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
    justifyContent: "center",
    alignItems: "center"
  };

  const RINGS = {
    0: require("../../assets/rings/ring-0.svg"),
    10: require("../../assets/rings/ring-1.svg"),
    20: require("../../assets/rings/ring-2.svg"),
    30: require("../../assets/rings/ring-3.svg"),
    40: require("../../assets/rings/ring-4.svg"),
    50: require("../../assets/rings/ring-5.svg"),
    60: require("../../assets/rings/ring-6.svg"),
    70: require("../../assets/rings/ring-7.svg"),
    80: require("../../assets/rings/ring-8.svg"),
    90: require("../../assets/rings/ring-9.svg"),
    100: require("../../assets/rings/ring-10.svg"),
  } as const;


  function ringFor(percent: number) {
    const clamped = Math.max(0, Math.min(100, percent));
    const bucket = Math.floor(clamped / 10) * 10;
    return RINGS[bucket as keyof typeof RINGS];
  }


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
        <SvgWidget
          svg={ringFor(percent)}
          style={{ width: 120, height: 120 }}
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
    </FlexWidget>
  );
}
