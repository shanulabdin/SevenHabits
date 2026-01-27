import { ThemeProvider, useThemeColors } from "@/constants/theme";
import {
  DarkTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { setHapticsEnabled } from "@/utils/haptics";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useEffect } from "react";

function AppShell() {
  const { colors, isLoaded: themeLoaded } = useThemeColors();

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("hapticsEnabled");
      const saved = raw ? JSON.parse(raw) : true;

      setHapticsEnabled(saved);
    })();
  }, []);

  if (!themeLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#151515" }} />;
  }

  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.card,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };



  const isDark = colors.text === "#FFFFFF";
  return (
    <NavThemeProvider value={navTheme}>
      <View style={{ flex: 1, backgroundColor: colors.card }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.card },
            animation: "slide_from_right",
          }}
        />
      </View>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#151515" }} />;
  }

  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
