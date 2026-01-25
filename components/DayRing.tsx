import { useThemeColors } from "@/constants/theme"; // ✅ your theme hook
import { Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type DayRingProps = {
  dayNumber: string;   // "11"
  dayLabel?: string;   // "Sun"
  percent: number;     // 0-100
  selected?: boolean;
  onPress?: () => void;

  size?: number;
  strokeWidth?: number;
  textSize?: number;

  // Optional overrides
  trackColor?: string;     // ring background/track
  progressColor?: string;  // arc color
  textColor?: string;      // center number color
  labelColor?: string;     // label color
};

export default function DayRing({
  dayNumber,
  dayLabel,
  percent,
  selected,
  onPress,
  size = 50,
  strokeWidth = 5,
  textSize = 12,

  trackColor,
  progressColor,
  textColor,
  labelColor,
}: DayRingProps) {
  const { colors } = useThemeColors(); // ✅ dynamic palette

  // ✅ Theme defaults (can be overridden by props)
  const _track = trackColor ?? colors.background;     // subtle track
  const _progress = progressColor ?? colors.orange;   // your accent
  const _text = textColor ?? colors.text;
  const _label = labelColor ?? (selected ? colors.orange : colors.text);

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);

  // ✅ Don’t use Pressable if not needed (prevents Android scroll issues)
  const Wrapper: any = onPress ? Pressable : View;
  const wrapperProps = onPress ? { onPress } : {};

  return (
    <Wrapper className="items-center" {...wrapperProps}>
      <View className="relative opacity-100" style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Track */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={_track}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={_progress}
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
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: textSize,
              lineHeight: textSize + 5,
              color: _text, // ✅ theme-aware
            }}
          >
            {dayNumber}
          </Text>
        </View>
      </View>

      {/* Label (renders only when exists, so takes zero space) */}
      {dayLabel ? (
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            color: _label, // ✅ theme-aware
            opacity: selected ? 1 : 0.8,
          }}
          className="text-xs mt-1"
          numberOfLines={1}
        >
          {dayLabel}
        </Text>
      ) : null}
    </Wrapper>
  );
}
