import ContributionGrid from "@/components/ContributionGrid";
import { useThemeColors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  streak: number;
  history: Record<string, boolean>;
  todayKey: string;
  onOpen: () => void;

  // optional toggles (so you can reuse it in different places)
  showGrid?: boolean;
  showStreak?: boolean;

  // compact controls
  weeks?: number;
  size?: number;
  gap?: number;
};

export default function WidgetHabitCard({
  title,
  streak,
  history,
  todayKey,
  onOpen,
  showGrid = true,
  showStreak = true,
  weeks = 12,  // smaller than HabitCard
  size = 10,   // smaller squares
  gap = 2,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={onOpen}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Header row */}
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {showStreak && (
          <View style={[styles.streak, { opacity: streak === 0 ? 0.35 : 1 }]}>
            <Text style={[styles.streakText, { color: colors.text }]}>
              {streak < 2 ? "" : streak}
            </Text>
            <Ionicons
              name="flame"
              size={16}
              color={streak === 0 ? colors.accent : colors.orange}
              style={{ transform: [{ translateY: 1 }] }}
            />
          </View>
        )}
      </View>

      {/* Grid */}
      {showGrid && (
        <View style={[styles.gridWrap, { borderColor: colors.borderMuted }]}>
          <ContributionGrid
            history={history}
            endDateKey={todayKey}
            weeks={weeks}
            size={size}
            gap={gap}
          />
        </View>
      )}

      {/* Hint */}
      <Text style={[styles.hint, { color: colors.text }]}>
        Tap to open
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  streak: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  streakText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    marginRight: 2,
    opacity: 0.8,
  },
  gridWrap: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  hint: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    opacity: 0.45,
    textAlign: "right",
  },
});
