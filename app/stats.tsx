import Heading from "@/components/Heading";
import { colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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

  const overallStats = useMemo(() => {
    if (!habits.length) return { percent: 0, done: 0, possible: 0 };

    const lastDays = getLastNDays(selectedDays);
    const dateKeys = lastDays.map(d => getDateKey(d));

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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.dark, width: "100%" }}
      contentContainerStyle={{ padding: 12, paddingTop: 80, paddingBottom: 200 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <Heading
        title="Stats"
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
              backgroundColor: colors.dark,
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
          width: "100%",
          alignSelf: "center",
          marginTop: 20,
          backgroundColor: colors.dark,
        }} // 2 columns
        className="
          bg-colors-background 
          border-black border-[1px]
          rounded-tr-2xl rounded-bl-2xl 
          "
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
          className="
            border-b-[1px]
            border-black
            rounded-tr-2xl
            p-4
          "
        >
          <Text style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
            fontWeight: "bold",
            color: colors.text,
          }} >
            Overall
          </Text>

          <Text
            className="text-colors-text/80 text-base"
            style={{ fontFamily: "Poppins_600SemiBold" }}
          >
            {overallStats.done}/{overallStats.possible}
          </Text>
        </View>

        <View style={{ padding: 20, }} pointerEvents="none">
          <DayRing
            dayNumber={`${overallStats.percent}%`}   // center text
            dayLabel={``}  // label under ring
            percent={overallStats.percent}          // arc percent
            size={200}
            strokeWidth={20}
            textSize={40}
            selected
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 20, }}>
        {perHabitStats.map(h => (

          <View
            key={h.id}
            style={{ width: "48%" }} // 2 columns
            className="
              bg-colors-dark 
              border-black border-[1px]
              rounded-tr-2xl rounded-bl-2xl 
              "
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              className="
                border-b-[1px]
                border-black
                rounded-tr-2xl
                pt-2
                pb-2
                pr-4
                pl-4
              "
            >
              <Text style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 15,
                fontWeight: "bold",
                color: colors.text,
              }} >
                {h.title}
              </Text>
              <Text
                className="text-colors-text/80 text-xs "
                style={{ textAlign: "center", fontFamily: "Poppins_600SemiBold" }}>
                {h.done}/{h.possible}
              </Text>
            </View>

            <View style={{ padding: 20, }} pointerEvents="none">
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
        ))}
      </View>

    </ScrollView >
  );
}
