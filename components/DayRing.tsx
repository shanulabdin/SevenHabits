import { colors } from "@/constants/colors";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type DayRingProps = {
  dayNumber: string;   // "11"
  dayLabel: string;    // "Sun"
  percent: number;     // 0-100
};

export default function DayRing({ dayNumber, dayLabel, percent }: DayRingProps) {
  const size = 54;          // ring outer size
  const strokeWidth = 6;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <View className="items-center">
      <View className="relative" style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Track (gray ring) */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="#2b2b2b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress (orange arc) */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={colors.orange}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            rotation={-90}
            origin={`${cx}, ${cy}`}
          />
        </Svg>

        {/* Center number */}
        <View className="absolute inset-0 items-center justify-center">
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className="text-colors-text text-base"
          >
            {dayNumber}
          </Text>
        </View>
      </View>

      {/* Weekday label */}
      <Text
        style={{ fontFamily: "Poppins_600SemiBold" }}
        className="text-colors-text/80 text-xs mt-1"
      >
        {dayLabel}
      </Text>
    </View>
  );
}
