import ContributionGrid from "@/components/ContributionGrid";
import { useThemeColors } from "@/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  streak: number;
  history: Record<string, boolean>;
  todayKey: string;

  showStreak?: boolean;

  weeks?: number;
  size?: number;
  gap?: number;
};

export default function WidgetHabitCard({
  history,
  todayKey,
  weeks = 14,  // smaller than HabitCard
  size = 20,   // smaller squares
  gap = 4,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <ScrollView>
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={styles.title}>
          Grid View
        </Text>

        <View style={[styles.divider, { backgroundColor: colors.text }]} />

        <View style={[styles.gridWrap, { borderColor: colors.borderMuted }]}>
          <ContributionGrid
            history={history}
            endDateKey={todayKey}
            weeks={weeks}
            size={size}
            gap={gap}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginHorizontal: 8,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,

    justifyContent: "center",
    alignItems: "center",
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
    height: StyleSheet.hairlineWidth,
    width: "80%",
    marginBottom: 10,
  },
});
