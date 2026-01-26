import DayRing from "@/components/DayRing";
import Heading from "@/components/Heading";
import { useThemeColors } from "@/constants/theme";
import type { Habit } from "@/types/habit";
import { getDateKey, getLastNDays } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const STORAGE_KEY = "@sevenhabits/habits_v1";

export default function Stats() {
  const { colors } = useThemeColors();
  const router = useRouter();

  function onBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }

  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDays, setSelectedDays] = useState(10);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      setHabits(parsed as Habit[]);
    })();
  }, []);

  const overallStats = useMemo(() => {
    if (!habits.length) return { percent: 0, done: 0, possible: 0 };

    const lastDays = getLastNDays(selectedDays);
    const dateKeys = lastDays.map((d) => getDateKey(d));

    const possible = habits.length * dateKeys.length;
    let done = 0;

    for (const habit of habits) {
      for (const key of dateKeys) {
        if (habit.history?.[key] === true) done += 1;
      }
    }

    const percent = possible ? Math.round((done / possible) * 100) : 0;
    return { percent, done, possible };
  }, [habits, selectedDays]);

  const perHabitStats = useMemo(() => {
    const lastDays = getLastNDays(selectedDays);
    const dateKeys = lastDays.map((d) => getDateKey(d));

    return habits.map((h) => {
      let done = 0;

      for (const key of dateKeys) {
        if (h.history?.[key] === true) done += 1;
      }

      const possible = dateKeys.length;
      const percent = possible ? Math.round((done / possible) * 100) : 0;

      return {
        id: h.id,
        title: h.title,
        done,
        possible,
        percent,
      };
    });
  }, [habits, selectedDays]);

  const dayOptions = [7, 30, 100, 365];

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Heading
        title="Stats"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={onBack}
      />

      {/* Day selector row */}
      <View style={styles.selectorRow}>
        {dayOptions.map((d, idx) => (
          <Pressable
            key={d}
            onPress={() => setSelectedDays(d)}
            style={[
              styles.selectorBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
              idx !== dayOptions.length - 1 && styles.selectorBtnGap,
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: selectedDays === d ? colors.orange : colors.text,
                },
              ]}
            >
              {d}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Overall card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Overall</Text>
          <Text style={[styles.cardCount, { color: colors.text, opacity: 0.8 }]}>
            {overallStats.done}/{overallStats.possible}
          </Text>
        </View>

        <View style={styles.ringWrap} pointerEvents="none">
          <DayRing
            dayNumber={`${overallStats.percent}%`}
            percent={overallStats.percent}
            size={200}
            strokeWidth={20}
            textSize={40}
            selected
          />
        </View>
      </View>

      {/* Per-habit cards (2 columns) */}
      <View style={styles.grid}>
        {perHabitStats.map((h, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <View
              key={h.id}
              style={[
                styles.habitCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                isLeft ? styles.gridLeft : styles.gridRight,
              ]}
            >
              <View style={[styles.habitHeader, { borderBottomColor: colors.border }]}>
                <Text
                  style={[styles.habitTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {h.title}
                </Text>

                <Text
                  style={[
                    styles.habitCount,
                    { color: colors.text, opacity: 0.8 },
                  ]}
                >
                  {h.done}/{h.possible}
                </Text>
              </View>

              <View style={styles.habitRing} pointerEvents="none">
                <DayRing
                  dayNumber={`${h.percent}%`}
                  percent={h.percent}
                  size={110}
                  strokeWidth={10}
                  textSize={20}
                  selected
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    // backgroundColor: "black",
    width: "100%",
  },
  scrollContent: {
    padding: 12,
    paddingTop: 80,
    paddingBottom: 200,
  },

  selectorRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  selectorBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 6,
  },
  selectorBtnGap: {
    marginRight: 8,
  },
  selectorText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },

  card: {
    width: "100%",
    alignSelf: "center",
    marginTop: 20,
    borderWidth: 1,
    // borderColor: "black",
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    // borderBottomColor: "black",
    padding: 16,
  },
  cardTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    fontWeight: "700",
  },
  cardCount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  ringWrap: {
    padding: 20,
    alignItems: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  habitCard: {
    width: "48%",
    borderWidth: 1,
    // borderColor: "black",
    // borderTopRightRadius: 16,
    // borderBottomLeftRadius: 16,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  gridLeft: {
    marginRight: "4%",
  },
  gridRight: {
    marginRight: 0,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  habitTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  habitCount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    textAlign: "center",
  },
  habitRing: {
    padding: 20,
    alignItems: "center",
  },
});
