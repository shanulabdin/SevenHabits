import { colors } from "@/constants/colors";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type DayRingProps = {
  dayNumber: string;   // "11"
  dayLabel: string;    // "Sun"
  percent: number;     // 0-100
  selected?: boolean;
  onPress?: () => void;
  size?: number;
  strokeWidth?: number;
  textSize?: number;
};

export default function DayRing({
  dayNumber,
  dayLabel,
  percent,
  selected,
  onPress,
  size = 50,
  strokeWidth = 5,
  textSize = 12

}: DayRingProps) {

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <Pressable className="items-center" onPress={onPress}>
      <View
        className={`relative ${selected ? "opacity-100" : "opacity-60"}`}
        style={{ width: size, height: size }}
      >
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
            style={{ fontFamily: "Poppins_600SemiBold", fontSize: textSize, lineHeight: textSize + 5 }}
            className="text-colors-text text-base"
          >
            {dayNumber}
          </Text>
        </View>
      </View>

      {/* Weekday label */}
      <Text
        style={{ fontFamily: "Poppins_600SemiBold", fontSize: textSize }}
        className={`  mt-1 ${selected ? "text-colors-orange" : "text-colors-text/80"}`}
      >
        {dayLabel}
      </Text>
    </Pressable>
  );
}
