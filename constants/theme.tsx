import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "dark" | "light";

const THEME_KEY = "@sevenhabits/theme_v1";

const DARK = {
  background: "#0B0B0B",
  surface: "#141414",
  card: "#151515",
  text: "#FFFFFF",
  mutedText: "rgba(255,255,255,0.7)",
  border: "#000000",
  accent: "#FF6D1F",
};

const LIGHT = {
  background: "#FFFFFF",
  surface: "#F6F6F6",
  card: "#FAFAFA",
  text: "#000000",
  mutedText: "rgba(0,0,0,0.7)",
  border: "#E5E5E5",
  accent: "#FF6D1F",
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
