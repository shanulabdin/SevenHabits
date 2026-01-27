import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

let enabled = true;

export const setHapticsEnabled = (value: boolean) => {
  enabled = value;
};

export const getHapticsEnabled = () => enabled;

const safe = <T>(promise: Promise<T>) => {
  if (!enabled) return;
  if (Platform.OS === "web") return;
  promise.catch(() => {});
};

/* ======================
   BASIC INTERACTIONS
====================== */

export const hapticSelect = () => safe(Haptics.selectionAsync());

export const hapticLight = () =>
  safe(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

export const hapticMedium = () =>
  safe(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

export const hapticHeavy = () =>
  safe(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));

/* ======================
   NOTIFICATIONS
====================== */

export const hapticSuccess = () =>
  safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

export const hapticWarning = () =>
  safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));

export const hapticError = () =>
  safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
