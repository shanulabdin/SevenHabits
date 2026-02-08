import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type ThemePref = "system" | "dark" | "light";
type ThemeMode = "dark" | "light";

const THEME_KEY = "@forge/theme_v1";

const LIGHT = {
  background: "#FFFFFF",
  surface: "#F6F6F6",
  card: "#ffffffff",
  text: "#000000",

  border: "rgba(0, 0, 0, 0.1)",

  orange: "#FF6D1F",

  accent: "#000000ff",
  accentMuted: "#00000026",

  muted: "#11111199",
};

const DARK = {
  background: "#000000ff",
  surface: "#000000ff",
  card: "#111111ff",
  text: "#FFFFFF",

  border: "#5a5a5a4d",

  orange: "#FF6D1F",

  accent: "#ffffffff",
  accentMuted: "#ffffff26",

  muted: "#FFFFFFB3",
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
    if (themePref === "system") {
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
    () => ({ themePref, theme, setTheme, colors: palette, isLoaded }),
    [themePref, theme, palette, isLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeColors() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeColors must be used inside ThemeProvider");
  return ctx;
}
