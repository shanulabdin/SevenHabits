// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import WidgetHabitCard from "@/components/WidgetHabitCard";
import { useThemeColors } from "@/constants/theme";
import { useHabits } from "@/src/context/HabitsProvider";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WidgetPercentCard from "@/components/WidgetPercentCard";
import { getDateKey } from '@/utils/date';
import { getHabitStreak } from "@/utils/streaks";

export default function WidgetsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const { habits } = useHabits();
  const firstHabit = habits[0];

  const todayKey = getDateKey();

  const streakCount = firstHabit ? getHabitStreak(firstHabit, todayKey) : 0;


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.scrollContent, { flex: 1, backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Heading
          title="Widgets"
          iconTitle="Back"
          icon="arrow-back"
          onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
        />

        {firstHabit && (
          <View style={{ marginVertical: 16 }}>
            <WidgetHabitCard
              title={firstHabit.title}
              streak={streakCount}
              history={firstHabit.history}
              todayKey={todayKey}
              showStreak={true}
            />
          </View>
        )}


        {firstHabit && (
          <View>
            <WidgetPercentCard
              title={`${firstHabit.title}`}
              percent={20}
              ringSize={140}
              strokeWidth={14}
              textSize={26}
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 10,
    backgroundColor: "transparent",

    // iOS
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android
    elevation: 6,
  },
  scrollContent: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 24
  },

  title: {
    flex: 1,
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "80%",
    marginBottom: 10,
  },
  streak: {
    flexDirection: "row",
    alignItems: "baseline",
    opacity: 0.8,
  },

  streakText: {
    fontSize: 35,
    marginRight: 2,
  },
  habitTitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  }
});