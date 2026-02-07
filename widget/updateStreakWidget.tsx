// import { getHabitStreakWithGrace } from "@/utils/streaks";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { requestWidgetUpdate } from "react-native-android-widget";
// import { StreakWidget } from "./StreakWidget";

// const STREAK_KEY = "@forge/widget_streak";
// const TITLE_KEY = "@forge/widget_title";

// export async function updateStreakWidget(todayKey: string) {
//   const raw = await AsyncStorage.getItem(STORAGE_KEY);
//   if (!raw) return;

//   const habits = JSON.parse(raw);
//   if (!habits.length) return;

//   const first = habits[0];

//   const streak = getHabitStreakWithGrace(
//     first,
//     todayKey,
//     todayKey
//   );
  
//   console.log(first.title, streak)
//   await requestWidgetUpdate({
//     widgetName: "Streak",
//     renderWidget: () => ({
//       light: (
//         <StreakWidget
//           title={first.title || "Forge"}
//           streak={streak}
//           bg="#FFFFFF"
//           text="#111111"
//           muted="#11111199"
//         />
//       ),
//       dark: (
//         <StreakWidget
//           title={first.title || "Forge"}
//           streak={streak}
//           bg="#000000"
//           text="#FFFFFF"
//           muted="#FFFFFFB3"
//         />
//       ),
//     }),
//   });
// }
