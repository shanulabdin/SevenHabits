import { ThemeProvider, useThemeColors } from "@/constants/theme";
import {
  DarkTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { HabitsProvider } from "@/src/context/HabitsProvider";
import { SettingsProvider } from "@/src/context/SettingsProvider";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Platform } from 'react-native';
import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

function AppShell() {
  const { colors, isLoaded: themeLoaded } = useThemeColors();

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

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'android') {
      const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
      if (!apiKey) {
        console.warn('RevenueCat Android API key is not set');
        return;
      }
      Purchases.configure({ apiKey });
    }
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#151515" }} />;
  }

  return (
    <SettingsProvider>
      <HabitsProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </HabitsProvider>
    </SettingsProvider>
  );
}
