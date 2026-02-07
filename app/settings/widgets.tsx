// app/settings/widgets.tsx
import Heading from "@/components/Heading";
import WidgetHabitCard from "@/components/WidgetHabitCard";
import { useThemeColors } from "@/constants/theme";
import { useHabits } from "@/src/context/HabitsProvider";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WidgetPercentCard from "@/components/WidgetPercentCard";
import { getDateKey, getLastNDays } from '@/utils/date';
import { getHabitStreak } from "@/utils/streaks";
import { StreakWidget } from "@/widget/StreakWidget";
import { WidgetPreview } from "react-native-android-widget";

export default function WidgetsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const { habits } = useHabits();
  const firstHabit = habits[0];

  const todayKey = getDateKey();

  const streakCount = firstHabit ? getHabitStreak(firstHabit, todayKey) : 0;


  const TEN_DAYS = 10;

  const firstHabit10Day = (() => {
    if (!firstHabit) return { percent: 0, done: 0, possible: TEN_DAYS };

    const keys = getLastNDays(TEN_DAYS).map((d) => getDateKey(d));
    let done = 0;

    for (const k of keys) {
      if (firstHabit.history?.[k] === true) done += 1;
    }

    const possible = keys.length;
    const percent = possible ? Math.round((done / possible) * 100) : 0;

    return { percent, done, possible };
  })();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.scrollContent,
          { alignItems: "center", justifyContent: "center", flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      >

        <View style={{ width: "100%", alignItems: "center", marginBottom: 30 }}>
          <Heading
            title="Widgets"
            iconTitle="Back"
            icon="arrow-back"
            onIconPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
          />
        </View>

        {firstHabit && (
          <View style={{ width: "100%", alignItems: "center", marginBottom: 10, }}>
            <Text style={[styles.widgetTitle, { color: colors.text }]}>Streak</Text>
            <WidgetPercentCard
              title={firstHabit.title}
              percent={firstHabit10Day.percent}
              ringSize={140}
              strokeWidth={14}
              textSize={26}
            />

            <Text style={[styles.desc, { color: colors.muted }]}>
              Last 10 days: {firstHabit10Day.done}/{firstHabit10Day.possible} completed.
            </Text>
          </View>
        )}

        {firstHabit && (
          <View
            style={[styles.widgetContainer, {
              borderColor: colors.border,
              backgroundColor: colors.background

            }]}
          >
            <WidgetPreview
              renderWidget={() => <StreakWidget title="Forge" streak={12} bg={"#FFFFFF"} text={"#111111"} muted={"#11111199"} />}
              width={200}
              height={200}
            />
          </View>
        )}

        {firstHabit && (
          <View style={{ width: "100%", alignItems: "center", marginVertical: 10, }}>
            <Text style={[styles.widgetTitle, { color: colors.text }]}>Grid View</Text>
            <WidgetHabitCard
              title={firstHabit.title}
              streak={streakCount}
              history={firstHabit.history}
              todayKey={todayKey}
              showStreak={true}
            />
            <Text style={[styles.desc, { color: colors.muted }]}>
              GitHub-style grid showing which days you completed the habit.
            </Text>
          </View>
        )}

        <View style={[styles.howToBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.howToTitle, { color: colors.text }]}>Add widgets to your home screen</Text>

          <Text style={[styles.howToText, { color: colors.muted }]}>
            1. Long press an empty spot on your home screen{"\n"}
          </Text>
          <Text style={[styles.howToText, { color: colors.muted }]}>
            2. Tap Widgets{"\n"}
          </Text>
          <Text style={[styles.howToText, { color: colors.muted }]}>
            3. Find Forge{"\n"}
          </Text>
          <Text style={[styles.howToText, { color: colors.muted }]}>
            4. Choose a widget and drag it onto your home screen{"\n"}
          </Text>
        </View>

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
    paddingBottom: 24,
  },
  widgetTitle: {
    fontSize: 20,
    opacity: 0.75,
    marginBottom: 5,
    marginHorizontal: 10,
    width: 200,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  desc: {
    fontSize: 13,
    opacity: 0.75,
    marginTop: -10,
    marginBottom: 14,
    marginHorizontal: 10,
    width: 250,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
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
  },
  widgetContainer: {
    elevation: 3,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  howToBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    paddingBottom: 5,
    marginTop: 8,
    marginBottom: 30,

    elevation: 2,

    width: 360,
  },
  howToTitle: {
    fontSize: 20,
    opacity: 0.75,
    marginBottom: 15,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  howToText: {
    fontSize: 13,
    opacity: 0.75,
    marginHorizontal: 10,
    fontFamily: "Poppins_500Medium",
  },
});