import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "dark" | "light";

const THEME_KEY = "@sevenhabits/theme_v1";

const DARK = {
  dark: "#0B0B0B",
  background: "#141414",
  text: "#EDEDED",
  orange: "#F59E0B",
};

const LIGHT = {
  dark: "#F6F6F6",
  background: "#FFFFFF",
  text: "#111111",
  orange: "#F59E0B",
};

type ThemeCtx = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  colors: typeof DARK;
  isLoaded: boolean;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") setThemeState(saved);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const setTheme = async (t: ThemeMode) => {
    setThemeState(t);
    await AsyncStorage.setItem(THEME_KEY, t);
  };

  const palette = useMemo(() => (theme === "dark" ? DARK : LIGHT), [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, colors: palette, isLoaded }),
    [theme, palette, isLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeColors() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeColors must be used inside ThemeProvider");
  return ctx;
}
