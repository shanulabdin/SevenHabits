import { ThemeProvider, useThemeColors } from "@/constants/theme";
import {
  DarkTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { View } from "react-native";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";

function AppShell() {
  const { colors, isLoaded: themeLoaded } = useThemeColors();

  // ⛔ wait until BOTH theme + fonts are ready
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

  return (
    <NavThemeProvider value={navTheme}>
      <View style={{ flex: 1, backgroundColor: colors.card }}>
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
  // ✅ FONT LOADING (this was missing before)
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // ⛔ do NOT render app until fonts are ready
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#151515" }} />;
  }

  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
