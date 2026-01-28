'use no memo';

import {
  ColorProp,
  FlexWidget,
  SvgWidget,
  TextWidget,
  type FlexWidgetProps,
} from "react-native-android-widget";

type Props = {
  title: string;
  streak: number;
  bg: ColorProp;
  text: ColorProp;
  muted: ColorProp;
};

export function StreakOnlyWidget({ title, streak, bg, text, muted }: Props) {
  const containerStyle: FlexWidgetProps["style"] = {
    width: "match_parent",
    height: "match_parent",
    padding: 16,
    borderRadius: 18,
    backgroundColor: bg,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <FlexWidget clickAction="OPEN_APP" style={containerStyle}>
      {/* 🔥 + streak */}
      <FlexWidget
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TextWidget
          text={`${streak}`}
          style={{
            fontSize: 35,
            fontFamily: "Poppins",
            fontWeight: "700",
            color: text,
          }}
        />
        <SvgWidget
          svg={require("@/src/widgets/flame-1.svg")}
          style={{ width: 40, height: 40, marginLeft: 4, marginTop: 2, }}
        />
      </FlexWidget>

      {/* Habit title */}
      <TextWidget
        text={title}
        style={{
          fontSize: 14,
          fontFamily: "Poppins",
          fontWeight: "500",
          color: muted,
        }}
      />
    </FlexWidget>
  );
}
