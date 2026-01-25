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

  inverseBackground: "#FFFFFF", // 👈 opposite
  inverseSurface: "#F2F2F2",
  inverseText: "#000000",

  border: "rgba(161, 161, 161, 0.5)",
  borderMuted: "rgba(161, 161, 161, 0)",

  accent: "#FF6D1F",
  accentMuted: "rgba(255, 109, 31, 0.1)",
};

const LIGHT = {
  background: "#FFFFFF",
  surface: "#F6F6F6",
  card: "#FAFAFA",
  text: "#000000",
  mutedText: "rgba(0,0,0,0.7)",

  inverseBackground: "#0B0B0B", // 👈 opposite
  inverseSurface: "#151515",
  inverseText: "#FFFFFF",

  border: "rgba(0, 0, 0, 0.5)",
  borderMuted: "rgba(0, 0, 0, 0.25)",

  accent: "#FF6D1F",
  accentMuted: "rgba(255, 109, 31, 0.1)",
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
