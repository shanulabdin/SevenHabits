// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import WidgetHabitCard from "@/components/WidgetHabitCard";
import { useThemeColors } from "@/constants/theme";
import { useHabits } from "@/src/context/HabitsProvider";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getDateKey } from '@/utils/date';
import { getHabitStreak } from "@/utils/streaks";
import { Ionicons } from "@expo/vector-icons";


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

        {/* show streak widget */}
        {firstHabit && (
          <View
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.title, { fontFamily: "Poppins_500Medium", }]}>
              Streak
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.text }]} />

            <View style={[styles.streak]}>
              <Text
                style={[
                  styles.streakText, {
                    color: colors.text
                  }
                ]}
              >
                {streakCount}
              </Text>

              <Ionicons
                name="flame"
                color={streakCount === 0 ? colors.accent : colors.orange}
                size={40}
                style={{
                  transform: [{ translateY: 1 }]
                }}
              />
            </View>
            <Text style={[styles.habitTitle, {
              color: colors.muted,
            }]}>
              {firstHabit.title}
            </Text>
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

    justifyContent: "center",
    alignItems: "center",
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