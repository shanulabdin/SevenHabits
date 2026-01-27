import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

let enabled = true;

export const setHapticsEnabled = (v: boolean) => {
  enabled = v;
};

const safe = <T>(fn: () => Promise<T>) => {
  if (Platform.OS === "web") return;
  if (!enabled) return;
  fn().catch(() => {});
};

export const hapticSelect = () => safe(() => Haptics.selectionAsync());

export const hapticLight = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

export const hapticMedium = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

export const hapticHeavy = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));

export const hapticSuccess = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

export const hapticWarning = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));

export const hapticError = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
