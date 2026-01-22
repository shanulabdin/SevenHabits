import Heading from "@/components/Heading";
import { colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import DayRing from "@/components/DayRing";
import type { Habit } from "@/types/habit";
import { getDateKey, getLastNDays } from "@/utils/date";

const STORAGE_KEY = "@sevenhabits/habits_v1";

export default function Stats() {
  const router = useRouter();
  function onBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)"); // fallback only if needed
  }

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      setHabits(parsed as Habit[]);
    })();
  }, []);

  const [selectedDays, setSelectedDays] = useState(10);

  const overallPercentage = useMemo(() => {
    if (!habits.length) return 0;

    const last100Days = getLastNDays(selectedDays);
    const dateKeys = last100Days.map(d => getDateKey(d));

    let totalPossible = habits.length * dateKeys.length;
    let totalDone = 0;

    for (const habit of habits) {
      for (const key of dateKeys) {
        if (habit.history?.[key] === true) totalDone += 1;
      }
    }

    if (totalPossible === 0) return 0;
    return Math.round((totalDone / totalPossible) * 100);
  }, [habits, selectedDays]);

  const perHabitStats = useMemo(() => {
    const lastDays = getLastNDays(selectedDays);
    const dateKeys = lastDays.map(d => getDateKey(d));

    return habits.map(h => {
      let done = 0;

      for (const key of dateKeys) {
        if (h.history?.[key] === true) done += 1;
      }

      const possible = dateKeys.length; // 1 habit per day
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.dark,
        padding: 12, paddingTop: 80,
        width: "100%",
      }} >
      <Heading
        title="Overall Stats"
        iconTitle="Back"
        icon="arrow-back"
        onIconPress={() => onBack()}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          gap: 8,
        }}
      >
        {[7, 30, 100, 365].map(d => (
          <Pressable
            key={d}
            onPress={() => setSelectedDays(d)}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: colors.background,
              alignItems: "center",
            }}
            className="
              bg-colors-background 
              rounded-tr-xl
              rounded-bl-xl
              border-black border-[1px]
              color-colors-orange
            "
          >
            <Text
              style={{
                color: selectedDays === d ? colors.orange : colors.text,
                fontFamily: "Poppins_600SemiBold",
                fontSize: 12,
              }}
            >
              {d}
            </Text>
          </Pressable>
        ))}
      </View>

      <View
        style={{
          width: 260,
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: 20,
          paddingVertical: 10,
          paddingHorizontal: 20,
          padding: 16,
          borderBottomWidth: 0,
        }}
        className="
          bg-colors-background
          rounded-tr-3xl
          border-black border-[1px]
        "
      >
        <Text style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 20,
          fontWeight: "bold",
          color: colors.text,
        }} >
          Weekly
        </Text>
      </View>

      <View
        style={{
          width: 260,
          aspectRatio: 1,          // ✅ height = width
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",

          // shadow
          // shadowColor: "black",
          // shadowOpacity: 0.25,
          // shadowRadius: 8,
          // elevation: 6, // Android

        }}
        className="
          bg-colors-background
          rounded-bl-3xl
          border-black border-[1px]
          "
      >
        <DayRing
          dayNumber={`${overallPercentage}%`}   // center text
          dayLabel={``}  // label under ring
          percent={overallPercentage}          // arc percent
          size={200}
          strokeWidth={20}
          textSize={40}
          selected

        />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
        {perHabitStats.map(h => (
          <View
            key={h.id}
            style={{ width: "48%" }} // 2 columns
            className="bg-colors-background border-black border-[1px] rounded-tr-3xl rounded-bl-3xl p-3"
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-colors-text text-base mb-2"
              numberOfLines={1}
            >
              {h.title}
            </Text>

            <View style={{ alignItems: "center" }}>
              <DayRing
                dayNumber={`${h.percent}%`}
                percent={h.percent}
                size={110}
                strokeWidth={10}
                textSize={20}
                selected
              />
            </View>

            <Text className="text-colors-text/80 text-xs mt-2" style={{ textAlign: "center" }}>
              {h.done}/{h.possible} days
            </Text>
          </View>
        ))}
      </View>

    </View >
  );
}
