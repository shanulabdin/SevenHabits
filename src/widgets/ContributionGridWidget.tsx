"use no memo";
import { FlexWidget, SvgWidget, type ColorProp } from "react-native-android-widget";
import { gridSvg } from "./gridSvg";

type Props = {
  title: string;
  history: Record<string, boolean>;
  endDateKey: string;
  weeks?: number;
  size?: number;
  gap?: number;
  bg: ColorProp;
  empty: string;
  filled: string;
};

export function ContributionGridWidget({
  history,
  endDateKey,
  weeks = 10,
  size = 10,
  gap = 3,
  bg,
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
        borderRadius: 14,
        backgroundColor: bg,
      }}
    >
      <SvgWidget
        svg={svg}
        style={{
          width: "match_parent",
          height: "match_parent",
        }}
      />
    </FlexWidget>
  );
}
