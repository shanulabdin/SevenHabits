'use no memo';

import { ColorProp, FlexWidget, OverlapWidget, SvgWidget, TextWidget, type FlexWidgetProps } from "react-native-android-widget";

type Props = {
  title: string;
  percent: number;
  bg: ColorProp;
  text: ColorProp;
  muted: ColorProp;
};

export function ScoreWidget({ title, percent, bg, text, muted }: Props) {
  const container: FlexWidgetProps["style"] = {
    width: "match_parent",
    height: "match_parent",
    padding: 10,
    borderRadius: 10,
    backgroundColor: bg,
    justifyContent: "center",
    alignItems: "center"
  };

  const RINGS = {
    0: require("@/assets/rings/ring-0.svg"),
    10: require("@/assets/rings/ring-1.svg"),
    20: require("@/assets/rings/ring-2.svg"),
    30: require("@/assets/rings/ring-3.svg"),
    40: require("@/assets/rings/ring-4.svg"),
    50: require("@/assets/rings/ring-5.svg"),
    60: require("@/assets/rings/ring-6.svg"),
    70: require("@/assets/rings/ring-7.svg"),
    80: require("@/assets/rings/ring-8.svg"),
    90: require("@/assets/rings/ring-9.svg"),
    100: require("@/assets/rings/ring-10.svg"),
  } as const;


  function ringFor(percent: number) {
    const clamped = Math.max(0, Math.min(100, percent));
    const bucket = Math.floor(clamped / 10) * 10;
    return RINGS[bucket as keyof typeof RINGS];
  }

  return (
    <FlexWidget clickAction="OPEN_APP" style={container}>
      <OverlapWidget
        style={{
          width: 170,
          height: 170,
          marginBottom: 40,
        }}
      >
        {/* Ring */}
        <SvgWidget
          svg={ringFor(percent)}
          style={{ width: 170, height: 170 }}
        />

        {/* Center text on top */}
        <TextWidget
          text={`${percent}%`}
          style={{
            width: "match_parent",
            fontSize: 24,
            fontFamily: "Poppins",
            fontWeight: "700",
            color: text,
            textAlign: "center",
            // Move the text down into the true center (tweak if needed)
            marginTop: 64,
          }}
        />
        <TextWidget
          text={title}
          style={{
            width: "match_parent",
            fontSize: 14,
            fontFamily: "Poppins",
            fontWeight: "500",
            color: muted,
            textAlign: "center",
            marginTop: 145,
          }}
        />
      </OverlapWidget>
    </FlexWidget>
  );
}
