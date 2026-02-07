import ContributionGrid from "@/components/ContributionGrid";
import { useThemeColors } from "@/constants/theme";
import { ScrollView, StyleSheet, View } from "react-native";

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
        <View style={[styles.gridWrap, { borderColor: colors.border }]}>
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
    marginBottom: 20,
    width: 358,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,

    justifyContent: "center",
    alignItems: "center",
  },
  gridWrap: {
    alignItems: "center",
  },
});
