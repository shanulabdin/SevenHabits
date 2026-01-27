import { setHapticsEnabled as setHapticsEnabledRuntime } from "@/utils/haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type SettingsState = {
  hapticsEnabled: boolean;
  setHapticsEnabled: (v: boolean) => void;
  toggleHaptics: () => void;
  isLoaded: boolean;
};

const KEY_HAPTICS = "settings:hapticsEnabled";

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHapticsEnabledRuntime(hapticsEnabled);
  }, [hapticsEnabled]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_HAPTICS);
        if (raw != null) setHapticsEnabledState(raw === "true");
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const setHapticsEnabled = async (v: boolean) => {
    setHapticsEnabledState(v);
    try {
      await AsyncStorage.setItem(KEY_HAPTICS, String(v));
    } catch { }
  };

  const toggleHaptics = () => setHapticsEnabled(!hapticsEnabled);

  const value = useMemo(
    () => ({ hapticsEnabled, setHapticsEnabled, toggleHaptics, isLoaded }),
    [hapticsEnabled, isLoaded]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
