// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";

import Heading from "@/components/Heading";
// import type { Habit } from "@/types/habit";
// import { getDateKey } from "@/utils/date";
import { useRouter } from "expo-router";

// const STORAGE_KEY = "@sevenhabits/habits_v1";

// function lastNKeys(n: number, endKey = getDateKey()) {
//   const [y, m, d] = endKey.split("-").map(Number);
//   const end = new Date(y, m - 1, d);

//   const keys: string[] = [];
//   for (let i = 0; i < n; i++) {
//     const dt = new Date(end);
//     dt.setDate(dt.getDate() - i);
//     keys.push(getDateKey(dt));
//   }
//   return keys;
// }

export default function Stats() {
  // const [habits, setHabits] = useState<Habit[]>([]);

  // useEffect(() => {
  //   (async () => {
  //     const raw = await AsyncStorage.getItem(STORAGE_KEY);
  //     if (!raw) return;
  //     setHabits(JSON.parse(raw) as Habit[]);
  //   })();
  // }, []);

  // const keys = useMemo(() => lastNKeys(100), []);
  // const totalPossible = habits.length * keys.length;

  // const overallPercent = useMemo(() => {
  //   if (totalPossible === 0) return 0;

  //   let done = 0;
  //   for (const h of habits) {
  //     for (const k of keys) {
  //       if (h.history?.[k] === true) done++;
  //     }
  //   }
  //   return Math.round((done / totalPossible) * 100);
  // }, [habits, keys, totalPossible]);

  // const perHabit = useMemo(() => {
  //   return habits.map(h => {
  //     let done = 0;
  //     for (const k of keys) if (h.history?.[k] === true) done++;
  //     return { id: h.id, title: h.title, percent: Math.round((done / keys.length) * 100) };
  //   });
  // }, [habits, keys]);

  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-colors-dark  p-3 pt-20 w-full" >
      <Heading title="Overall Stats" iconTitle="Back" icon="arrow-back" onIconPress={() => router.back()} />

      {/* <View className="bg-colors-background border border-black rounded-2xl p-5 mt-4">
        <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-colors-orange text-4xl">
          {overallPercent}%
        </Text>
        <Text className="text-colors-text/60 mt-2">Overall completion (all habits)</Text>
      </View>

      <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-colors-text text-lg mt-8 mb-3">
        Per Habit
      </Text>

      <View className="bg-colors-background border border-black rounded-2xl p-4">
        {perHabit.map(h => (
          <View key={h.id} className="flex-row justify-between py-2">
            <Text className="text-colors-text max-w-[70%]" numberOfLines={1}>{h.title}</Text>
            <Text className="text-colors-text">{h.percent}%</Text>
          </View>
        ))}
      </View> */}
    </ScrollView>
  );
}
