// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import WidgetHabitCard from "@/components/WidgetHabitCard";
import { useThemeColors } from "@/constants/theme";
import { useHabits } from "@/src/context/HabitsProvider";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getDateKey } from '@/utils/date';
import { getHabitStreak } from "@/utils/streaks";


export default function WidgetsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const { habits } = useHabits();
  const firstHabit = habits[0];

  const todayKey = getDateKey();

  const streakCount = getHabitStreak(firstHabit, todayKey);

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
              onOpen={() => router.push(`/settings/widgets`)} // choose your route
              showGrid={true}
              showStreak={true}
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
});