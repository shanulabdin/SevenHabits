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

export function StreakWidget({ title, streak, bg, text, muted }: Props) {
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
      <FlexWidget
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          marginLeft: 4,
        }}
      >
        <TextWidget
          text={`${streak}`}
          style={{
            fontSize: 35,
            fontFamily: "Poppins",
            fontWeight: "700",
            color: text,
            marginRight: 2,
          }}
        />
        <SvgWidget
          svg={require("@/assets/images/flame-1.svg")}
          style={{ width: 40, height: 40, marginLeft: 2, marginTop: 2, }}
        />
      </FlexWidget>

      <TextWidget
        text={title}
        maxLines={1}
        style={{
          fontSize: 14,
          fontFamily: "Poppins",
          fontWeight: "500",
          color: muted,
          textAlign: "center",
        }}
      />
    </FlexWidget>
  );
}
