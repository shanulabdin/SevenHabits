import { useThemeColors } from "@/constants/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";


// Inside your style:
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
  textSize = 15,
  trackColor,
  progressColor,
  textColor,
  labelColor,
}: DayRingProps) {
  const { colors } = useThemeColors();

  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Use the measured width if available, otherwise fallback to the size prop
  const currentSize = containerWidth > 0 ? containerWidth : size;

  // Theme defaults (can be overridden by props)
  const _track = trackColor ?? colors.accentMuted;
  const _progress = progressColor ?? colors.orange;
  const _text = textColor ?? colors.text;
  const _label = labelColor ?? (selected ? colors.orange : colors.text);

  const r = (currentSize - strokeWidth) / 2;
  const cx = currentSize / 2;
  const cy = currentSize / 2;

  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);

  // Don’t use Pressable if not needed
  const Wrapper: any = onPress ? Pressable : View;
  const wrapperProps = onPress ? { onPress } : {};

  return (
    <Wrapper
      onLayout={onLayout}
      style={[styles.wrapper, { flex: 1, maxWidth: 60 }]}
      {...wrapperProps}
    >
      <View style={[styles.ringBox, { width: currentSize, height: currentSize }]}>

        {currentSize > 0 && (
          <Svg width={currentSize} height={currentSize}>
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
        )}

        {/* Center number */}
        <View style={styles.center}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: textSize,
              lineHeight: textSize + 5,
              color: _text,
            }}
            allowFontScaling={false}
            numberOfLines={1}
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
              fontFamily: "Poppins_500Medium",
              fontSize: textSize,
              color: _label,
              opacity: selected ? 1 : 0.8,
            },
          ]}
          numberOfLines={1}
          allowFontScaling={false}
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
