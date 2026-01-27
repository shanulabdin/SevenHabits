import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type ThemePref = "system" | "dark" | "light";
type ThemeMode = "dark" | "light";

const THEME_KEY = "@forge/theme_v1";

const DARK = {
  background: "#000000ff",
  surface: "#141414",
  card: "#151515",
  text: "#FFFFFF",
  mutedText: "rgba(255,255,255,0.7)",

  inverseBackground: "#FFFFFF", // 👈 opposite
  inverseSurface: "#F2F2F2",
  inverseText: "#000000",

  border: "rgba(161, 161, 161, 0.3)",
  borderMuted: "rgba(161, 161, 161, 0)",

  orange: "#FF6D1F",

  accent: "#ffffffff",
  accentMuted: "rgba(255, 255, 255, 0.1)",
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

  border: "rgba(0, 0, 0, 0.1)",
  borderMuted: "rgba(0, 0, 0, 0.25)",

  orange: "#FF6D1F",

  accent: "#000000ff",
  accentMuted: "rgba(0, 0, 0, 0.1)",
};


type ThemeCtx = {
  themePref: ThemePref;
  theme: ThemeMode;
  setTheme: (t: ThemePref) => void;
  colors: typeof DARK;
  isLoaded: boolean;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  const [themePref, setThemePref] = useState<ThemePref>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        
        if (saved === "system" || saved === "dark" || saved === "light") {
          setThemePref(saved);
        } else {
          setThemePref("system")
        }
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const theme: ThemeMode = useMemo(() => {
    if(themePref === "system"){
      return (systemScheme ?? "light") as ThemeMode;
    }
    return themePref;
  }, [themePref, systemScheme])

  const setTheme = async (t: ThemePref) => {
    setThemePref(t);
    await AsyncStorage.setItem(THEME_KEY, t);
  };

  const palette = useMemo(() => (theme === "dark" ? DARK : LIGHT), [theme]);

  const value = useMemo(
    () => ({themePref, theme, setTheme, colors: palette, isLoaded }),
    [themePref, theme, palette, isLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeColors() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeColors must be used inside ThemeProvider");
  return ctx;
}
