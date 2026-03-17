import type { Reminder } from "@/types/habit";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ── Configure how notifications appear when app is in foreground ──
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Request permission (call once on app start) ──
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Habit Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ── Schedule weekly repeating notifications for one habit ──
export async function scheduleHabitReminders(
  habitId: string,
  habitTitle: string,
  reminder: Reminder
) {
  // Cancel any existing notifications for this habit first
  await cancelHabitReminders(habitId);

  const [hourStr, minuteStr] = reminder.time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Schedule one notification per selected day of the week
  for (const weekday of reminder.days) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚡ Time to Forge",
        body: `Don't forget: ${habitTitle}`,
        data: { habitId },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday, // 1=Sun, 2=Mon, …, 7=Sat
        hour,
        minute,
        channelId: "reminders",
      },
      identifier: `${habitId}_day${weekday}`, // unique per habit+day
    });
  }
}

// ── Cancel all scheduled notifications for a habit ──
export async function cancelHabitReminders(habitId: string) {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of all) {
    if (notif.identifier.startsWith(`${habitId}_day`)) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

// ── Day helpers ──
export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

// Expo weekday: 1=Sun, 2=Mon, ..., 7=Sat
export function dayIndexToExpoWeekday(index: number): number {
  return index + 1; // 0→1 (Sun), 1→2 (Mon), …, 6→7 (Sat)
}

export function expoWeekdayToDayIndex(weekday: number): number {
  return weekday - 1;
}
