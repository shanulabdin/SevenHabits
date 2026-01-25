import { ThemeProvider, useThemeColors } from "@/constants/theme";
import { DarkTheme, ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { View } from "react-native";

function AppShell() {
  const { colors, isLoaded } = useThemeColors();

  if (!isLoaded) return <View style={{ flex: 1, backgroundColor: "#151515" }} />;

  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.card,
      card: colors.card,
      text: colors.text,
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
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
