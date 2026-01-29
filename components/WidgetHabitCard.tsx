import ContributionGrid from "@/components/ContributionGrid";
import { useThemeColors } from "@/constants/theme";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  title: string;
  streak: number;
  history: Record<string, boolean>;
  todayKey: string;

  showGrid?: boolean;
  showStreak?: boolean;

  weeks?: number;
  size?: number;
  gap?: number;
};

export default function WidgetHabitCard({
  history,
  todayKey,
  showGrid = true,
  weeks = 14,  // smaller than HabitCard
  size = 20,   // smaller squares
  gap = 4,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginHorizontal: 8,

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
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
    marginBottom: 10,
  },
});
