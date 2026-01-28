"use no memo";
import {
  FlexWidget,
  SvgWidget,
  TextWidget,
  type ColorProp,
} from "react-native-android-widget";
import { gridSvg } from "./gridSvg";

type Props = {
  title: string;
  history: Record<string, boolean>;
  endDateKey: string;
  weeks?: number;
  size?: number;
  gap?: number;
  bg: ColorProp;
  text: ColorProp;
  muted: ColorProp;
  empty: string;  // hex string
  filled: string; // hex string
};

export function ContributionGridWidget({
  title,
  history,
  endDateKey,
  weeks = 20,
  size = 10,
  gap = 3,
  bg,
  text,
  muted,
  empty,
  filled,
}: Props) {
  const svg = gridSvg({ history, endDateKey, weeks, size, gap, filled, empty });

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
        text={`${weeks * 7} days`}
        style={{
          width: "match_parent",
          marginTop: 2,
          fontSize: 12,
          fontFamily: "Poppins",
          fontWeight: "500",
          color: muted,
        }}
      />

      {/* spacer */}
      <FlexWidget style={{ height: 10 }} />

      <SvgWidget svg={svg} style={{ width: "match_parent" }} />
    </FlexWidget>
  );
}
