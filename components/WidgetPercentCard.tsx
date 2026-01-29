import DayRing from "@/components/DayRing";
import { useThemeColors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  percent: number;

  // Optional sizing overrides
  ringSize?: number;
  strokeWidth?: number;
  textSize?: number;

  // Optional style override
  style?: any;
};

export default function WidgetPercentCard({
  title,
  percent,
  ringSize = 170,
  strokeWidth = 20,
  textSize = 32,
  style,
}: Props) {
  const { colors } = useThemeColors();

  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View style={styles.shadowWrapper}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
          style,
        ]}
      >
        <View style={styles.ringWrap} pointerEvents="none">
          <DayRing
            dayNumber={`${clamped}%`}
            percent={clamped}
            size={ringSize}
            strokeWidth={20}
            textSize={textSize}
            trackColor={colors.accentMuted}
            progressColor={colors.orange}
            textColor={colors.text}
          />
        </View>

        <Text
          style={[styles.title, { color: colors.muted }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 14,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },

    // Android shadow
    elevation: 2,

    marginHorizontal: 8,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
});
