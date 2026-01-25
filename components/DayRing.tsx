import { useThemeColors } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type DayRingProps = {
  dayNumber: string; // "11"
  dayLabel?: string; // "Sun"
  percent: number; // 0-100
  selected?: boolean;
  onPress?: () => void;

  size?: number;
  strokeWidth?: number;
  textSize?: number;

  // Optional overrides
  trackColor?: string;
  progressColor?: string;
  textColor?: string;
  labelColor?: string;
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
  const { colors } = useThemeColors();

  // Theme defaults (can be overridden by props)
  const _track = trackColor ?? colors.background;
  const _progress = progressColor ?? colors.accent;
  const _text = textColor ?? colors.text;
  const _label = labelColor ?? (selected ? colors.accent : colors.text);

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);

  // Don’t use Pressable if not needed
  const Wrapper: any = onPress ? Pressable : View;
  const wrapperProps = onPress ? { onPress } : {};

  return (
    <Wrapper style={styles.wrapper} {...wrapperProps}>
      <View style={[styles.ringBox, { width: size, height: size }]}>
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
        <View style={styles.center}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: textSize,
              lineHeight: textSize + 5,
              color: _text,
            }}
          >
            {dayNumber}
          </Text>
        </View>
      </View>

      {/* Label */}
      {dayLabel ? (
        <Text
          style={[
            styles.label,
            {
              fontFamily: "Poppins_600SemiBold",
              color: _label,
              opacity: selected ? 1 : 0.8,
            },
          ]}
          numberOfLines={1}
        >
          {dayLabel}
        </Text>
      ) : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  ringBox: {
    position: "relative",
    opacity: 1,
  },
  center: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
  },
});
